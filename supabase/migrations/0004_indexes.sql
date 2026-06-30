-- =============================================================================
-- Migration 0004 — Performance Indexes
-- =============================================================================
-- Dependencies : 0002_tables.sql        (tables must exist)
--                0003_constraints.sql   (run after constraints for consistency)
-- Creates      : 13 indexes across 6 tables
-- =============================================================================
-- Naming convention : idx_{table}_{columns_or_purpose}
-- Partial indexes   : WHERE clause documented per index
--
-- NOTE: The DL-03 partial UNIQUE index (uix_pickups_one_active_per_store) is
--       in 0003_constraints.sql because it enforces a business rule.
--       All indexes here are purely for query performance.
--
-- NOTE: idx_vendors_name_trgm requires the pg_trgm extension enabled in
--       0001_extensions.sql. It must run after that extension is active.
-- =============================================================================

BEGIN;

-- =============================================================================
-- GROUP 1 — profiles
-- =============================================================================
-- Used by: RLS policies (future sprint), Manajer user management
-- =============================================================================

-- Lookup all users assigned to a store (multi-user per store, RLS filter)
CREATE INDEX idx_profiles_store_id
    ON profiles (store_id);

-- Role-based filtering for access control and RLS policies
CREATE INDEX idx_profiles_role
    ON profiles (role);

-- =============================================================================
-- GROUP 2 — capacityService
-- =============================================================================
-- capacityService.getCurrentCapacity(storeId)
--   .from('capacity_snapshots')
--   .eq('store_id', storeId)
--   .order('created_at', { ascending: false })
--   .limit(1)
--
-- capacityService.getCapacityTrend(storeId, range)
--   .from('capacity_snapshots')
--   .eq('store_id', storeId)
--   .gte('created_at', since)
--   .order('created_at', { ascending: true })
-- =============================================================================

-- Covers both getCurrentCapacity (DESC LIMIT 1) and getCapacityTrend (range scan).
-- B-tree on (store_id, created_at DESC) supports both ascending and descending
-- traversal; PostgreSQL can read it backward for ASC queries.
CREATE INDEX idx_capacity_snapshots_store_created
    ON capacity_snapshots (store_id, created_at DESC);

-- =============================================================================
-- GROUP 3 — capacityService (alert history)
-- =============================================================================
-- capacityService.getCapacityAlertHistory(storeId)
--   .from('capacity_alerts')
--   .eq('store_id', storeId)
--   .order('created_at', { ascending: false })
-- =============================================================================

CREATE INDEX idx_capacity_alerts_store_created
    ON capacity_alerts (store_id, created_at DESC);

-- =============================================================================
-- GROUP 4 — wasteService
-- =============================================================================
-- wasteService.getWasteToday(storeId)
--   .from('waste_items')
--   .eq('store_id', storeId)
--   .gte('created_at', today)
--
-- wasteService.getWasteTrend(storeId, range)
--   .from('waste_items')
--   .eq('store_id', storeId)
--   .gte('created_at', since)
--   .order('created_at', { ascending: true })
--
-- wasteService.getWasteCategories(storeId, period)
--   .from('waste_items')
--   .eq('store_id', storeId)
--   .gte('created_at', period_start)
-- =============================================================================

-- Primary waste query index — covers getWasteToday, getWasteTrend, getWasteCategories.
-- All three share the same filter shape: store_id = X AND created_at >= T.
CREATE INDEX idx_waste_items_store_created
    ON waste_items (store_id, created_at DESC);

-- Secondary index for future per-type queries and DB-side aggregation.
-- Currently, getWasteCategories groups by waste_type client-side; when that
-- is moved to a PostgreSQL function (planned optimization), this index will
-- support GROUP BY waste_type within a store+date range efficiently.
CREATE INDEX idx_waste_items_store_type_created
    ON waste_items (store_id, waste_type, created_at);

-- =============================================================================
-- GROUP 5 — pickupService
-- =============================================================================
-- pickupService.getActivePickups(storeId)
--   .from('pickups')
--   .eq('store_id', storeId)
--   .in('status', ['waiting', 'in-transit'])
--   .order('requested_at', { ascending: false })
--
-- pickupService.getPickupSummary(storeId) — COUNT waiting
--   .from('pickups').eq('store_id').eq('status', 'waiting')
--
-- pickupService.getPickupSummary(storeId) — COUNT in-transit
--   .from('pickups').eq('store_id').eq('status', 'in-transit')
-- =============================================================================

-- Covers getActivePickups (status IN filter) and first two COUNT queries in
-- getPickupSummary. DL-03 guarantees at most 1 active pickup per store, so
-- cardinality is always ≤ 1 — sort on requested_at is trivial.
CREATE INDEX idx_pickups_store_status
    ON pickups (store_id, status);

-- =============================================================================
-- pickupService.getPickupHistory(storeId)
--   .from('pickups')
--   .eq('store_id', storeId)
--   .eq('status', 'completed')
--   .order('completed_at', { ascending: false })
--   .limit(50)
-- =============================================================================

-- Partial index on completed pickups only — reduces index size vs a full index.
-- Covers getPickupHistory ORDER BY completed_at DESC LIMIT 50.
CREATE INDEX idx_pickups_store_completed
    ON pickups (store_id, completed_at DESC)
    WHERE status = 'completed';

-- =============================================================================
-- pickupService.getPickupSummary(storeId) — COUNT completed today
--   .from('pickups')
--   .eq('store_id', storeId)
--   .eq('status', 'completed')
--   .gte('completed_at', today)
-- =============================================================================

-- Separate partial index for the "completed today" COUNT in getPickupSummary.
-- ASC on completed_at to efficiently satisfy the >= today range scan.
CREATE INDEX idx_pickups_completed_today
    ON pickups (store_id, completed_at)
    WHERE status = 'completed';

-- =============================================================================
-- GROUP 6 — vendorService
-- =============================================================================
-- vendorService.getActiveVendors()
--   .from('vendors')
--   .eq('is_active', true)
--   .order('name', { ascending: true })
--
-- vendorService.searchVendors(keyword) — first pass (no keyword)
--   → calls getActiveVendors() as fallback
-- =============================================================================

-- Partial index on active vendors only. Covers getActiveVendors() and the
-- is_active = true filter in searchVendors. Reduces index size by excluding
-- inactive vendors (DL-05: inactive vendors can't be selected for new pickups).
CREATE INDEX idx_vendors_is_active
    ON vendors (is_active)
    WHERE is_active = true;

-- =============================================================================
-- vendorService.searchVendors(keyword)
--   .from('vendors')
--   .eq('is_active', true)
--   .ilike('name', '%keyword%')
--   .order('name', { ascending: true })
-- =============================================================================

-- GIN trigram index for ILIKE '%keyword%' search on vendor names.
-- Without this, '%keyword%' forces a sequential scan.
-- Requires pg_trgm extension (0001_extensions.sql).
-- gin_trgm_ops: splits text into trigrams; GIN lookup matches any containing trigram.
CREATE INDEX idx_vendors_name_trgm
    ON vendors USING GIN (name gin_trgm_ops);

-- =============================================================================
-- GROUP 7 — notifications (DL-04: 30-second polling)
-- =============================================================================
-- Client polls every 30 seconds:
--   SELECT * FROM notifications
--   WHERE store_id = X
--     AND created_at > last_polled_at
--   ORDER BY created_at DESC
-- =============================================================================

-- Primary polling index. The 30-second poll queries store_id + created_at range.
-- DESC ordering means the most recent notifications are returned first.
CREATE INDEX idx_notifications_store_created
    ON notifications (store_id, created_at DESC);

-- =============================================================================
-- NotificationBadge (AppHeader) — unread count
--   SELECT COUNT(*) FROM notifications
--   WHERE store_id = X AND is_read = false
-- =============================================================================

-- Partial index on unread notifications only.
-- As notifications are read, rows leave this partial index — keeps it small
-- relative to total notification volume.
CREATE INDEX idx_notifications_store_unread
    ON notifications (store_id, is_read)
    WHERE is_read = false;

COMMIT;
