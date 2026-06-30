-- =============================================================================
-- Migration 0003 — Foreign Keys, CHECK, UNIQUE, Partial UNIQUE
-- =============================================================================
-- Dependencies : 0002_tables.sql  (all tables and pickup_seq must exist)
-- Adds         : FK relationships, CHECK constraints, UNIQUE constraints,
--                partial UNIQUE index enforcing DL-03
-- =============================================================================
-- Constraint naming convention (all names are explicit — no PostgreSQL autogen):
--   fk_{table}_{purpose}          Foreign key
--   chk_{table}_{purpose}         CHECK constraint
--   uq_{table}_{column}           UNIQUE constraint
--   uix_{table}_{purpose}         Partial UNIQUE index (business constraint)
--
-- FK ON DELETE policy rationale:
--   RESTRICT    — used when deleting the parent would silently break business data
--                 (stores with active pickups/waste must not vanish)
--   SET NULL    — used for optional references; the row is preserved without the link
--                 (waste record stays if the user who recorded it is removed)
--   CASCADE     — used where child rows have no value without the parent
--                 (notifications are store-scoped; a deleted store owns no notifs)
-- =============================================================================

BEGIN;

-- =============================================================================
-- SECTION A — FOREIGN KEYS
-- =============================================================================
-- Applied in dependency order so each REFERENCES target already exists.
-- =============================================================================

-- ── A1. stores ────────────────────────────────────────────────────────────────
-- DL-06: each store may have a default vendor. If the vendor is later removed,
-- clear the reference rather than blocking the vendor delete.
ALTER TABLE stores
    ADD CONSTRAINT fk_stores_default_vendor
        FOREIGN KEY (default_vendor_id)
        REFERENCES vendors (id)
        ON DELETE SET NULL;

-- ── A2. profiles ──────────────────────────────────────────────────────────────
-- profiles.id mirrors auth.users.id 1:1 (Supabase standard pattern).
-- CASCADE: deleting the auth user deletes the application profile.
ALTER TABLE profiles
    ADD CONSTRAINT fk_profiles_auth_user
        FOREIGN KEY (id)
        REFERENCES auth.users (id)
        ON DELETE CASCADE;

-- profiles.store_id is NULLABLE (vendor accounts have no store).
-- RESTRICT: a store cannot be deleted while it has assigned users.
ALTER TABLE profiles
    ADD CONSTRAINT fk_profiles_store
        FOREIGN KEY (store_id)
        REFERENCES stores (id)
        ON DELETE RESTRICT;

-- ── A3. pickups ───────────────────────────────────────────────────────────────
-- RESTRICT on both: pickups reference store and vendor history;
-- neither parent should be deletable while pickup records exist.
ALTER TABLE pickups
    ADD CONSTRAINT fk_pickups_store
        FOREIGN KEY (store_id)
        REFERENCES stores (id)
        ON DELETE RESTRICT;

ALTER TABLE pickups
    ADD CONSTRAINT fk_pickups_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors (id)
        ON DELETE RESTRICT;

-- ── A4. waste_items ───────────────────────────────────────────────────────────
-- Store RESTRICT: waste history must not disappear with the store.
-- recorded_by SET NULL: if a Utility user is removed, keep the waste record
-- but clear the attribution (DL-07: Utility records without Pelayan confirmation).
ALTER TABLE waste_items
    ADD CONSTRAINT fk_waste_items_store
        FOREIGN KEY (store_id)
        REFERENCES stores (id)
        ON DELETE RESTRICT;

ALTER TABLE waste_items
    ADD CONSTRAINT fk_waste_items_recorded_by
        FOREIGN KEY (recorded_by)
        REFERENCES profiles (id)
        ON DELETE SET NULL;

-- ── A5. capacity_snapshots ────────────────────────────────────────────────────
-- RESTRICT: capacity history must not disappear with the store.
ALTER TABLE capacity_snapshots
    ADD CONSTRAINT fk_capacity_snapshots_store
        FOREIGN KEY (store_id)
        REFERENCES stores (id)
        ON DELETE RESTRICT;

-- ── A6. notifications ─────────────────────────────────────────────────────────
-- CASCADE on store: notifications are store-scoped and have no value without one.
-- SET NULL on read_by: the notification stays if the reader's profile is removed.
ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_store
        FOREIGN KEY (store_id)
        REFERENCES stores (id)
        ON DELETE CASCADE;

ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_read_by
        FOREIGN KEY (read_by)
        REFERENCES profiles (id)
        ON DELETE SET NULL;

-- ── A7. capacity_alerts ───────────────────────────────────────────────────────
-- RESTRICT on store: alert history must not disappear with the store.
-- SET NULL on snapshot_id: if a snapshot is purged, preserve the alert record
-- but sever the link to the (now-deleted) snapshot.
ALTER TABLE capacity_alerts
    ADD CONSTRAINT fk_capacity_alerts_store
        FOREIGN KEY (store_id)
        REFERENCES stores (id)
        ON DELETE RESTRICT;

ALTER TABLE capacity_alerts
    ADD CONSTRAINT fk_capacity_alerts_snapshot
        FOREIGN KEY (snapshot_id)
        REFERENCES capacity_snapshots (id)
        ON DELETE SET NULL;

-- =============================================================================
-- SECTION B — CHECK CONSTRAINTS
-- =============================================================================

-- ── B1. profiles ──────────────────────────────────────────────────────────────
ALTER TABLE profiles
    ADD CONSTRAINT chk_profiles_role
        CHECK (role IN ('pelayan', 'utility', 'manajer', 'vendor'));

-- Conditional NOT NULL: store_id is required for store-bound roles.
-- vendor-role accounts legitimately have no store, so store_id stays NULL.
ALTER TABLE profiles
    ADD CONSTRAINT chk_profiles_store_id_role
        CHECK (
            role = 'vendor'
            OR store_id IS NOT NULL
        );

-- ── B2. stores ────────────────────────────────────────────────────────────────
-- NULL is valid (DL-01: Manajer configures max_capacity; starts unset).
ALTER TABLE stores
    ADD CONSTRAINT chk_stores_max_capacity
        CHECK (max_capacity IS NULL OR max_capacity > 0);

-- ── B3. pickups ───────────────────────────────────────────────────────────────
ALTER TABLE pickups
    ADD CONSTRAINT chk_pickups_status
        CHECK (status IN ('waiting', 'in-transit', 'completed', 'cancelled'));

ALTER TABLE pickups
    ADD CONSTRAINT chk_pickups_estimasi_kg
        CHECK (estimasi_kg > 0);

-- ── B4. waste_items ───────────────────────────────────────────────────────────
-- DL-02: waste_type drives the GENERATED unit column — list must match WasteType.
ALTER TABLE waste_items
    ADD CONSTRAINT chk_waste_items_waste_type
        CHECK (waste_type IN ('organic', 'liquid', 'recyclable', 'non-recyclable'));

ALTER TABLE waste_items
    ADD CONSTRAINT chk_waste_items_quantity
        CHECK (quantity > 0);

-- ── B5. capacity_snapshots ────────────────────────────────────────────────────
-- current_kg >= 0: store can theoretically reach 0 (empty).
ALTER TABLE capacity_snapshots
    ADD CONSTRAINT chk_capacity_snapshots_current_kg
        CHECK (current_kg >= 0);

-- max_kg > 0: capacity ceiling must be a positive number.
ALTER TABLE capacity_snapshots
    ADD CONSTRAINT chk_capacity_snapshots_max_kg
        CHECK (max_kg > 0);

-- source: records what initiated the snapshot.
ALTER TABLE capacity_snapshots
    ADD CONSTRAINT chk_capacity_snapshots_source
        CHECK (source IN ('manual', 'auto', 'pickup'));

-- ── B6. capacity_alerts ───────────────────────────────────────────────────────
-- status must match CapacityAlertStatus frontend type.
ALTER TABLE capacity_alerts
    ADD CONSTRAINT chk_capacity_alerts_status
        CHECK (status IN ('normal', 'perlu-perhatian', 'kritis'));

-- pct is a percentage: 0–100 inclusive.
ALTER TABLE capacity_alerts
    ADD CONSTRAINT chk_capacity_alerts_pct
        CHECK (pct >= 0 AND pct <= 100);

-- ── B7. notifications ─────────────────────────────────────────────────────────
-- type must match the three notification categories.
ALTER TABLE notifications
    ADD CONSTRAINT chk_notifications_type
        CHECK (type IN ('capacity_alert', 'pickup_status', 'system'));

-- severity is optional (NULL allowed); when set, must be one of three levels.
ALTER TABLE notifications
    ADD CONSTRAINT chk_notifications_severity
        CHECK (severity IS NULL OR severity IN ('info', 'warning', 'critical'));

-- =============================================================================
-- SECTION C — UNIQUE CONSTRAINTS
-- =============================================================================

-- ── C1. vendors ───────────────────────────────────────────────────────────────
-- Vendor names must be unique to prevent duplicate entries in the dropdown.
ALTER TABLE vendors
    ADD CONSTRAINT uq_vendors_name
        UNIQUE (name);

-- =============================================================================
-- SECTION D — PARTIAL UNIQUE INDEX (DL-03)
-- =============================================================================
-- DL-03: only one active pickup per store is permitted.
-- "Active" means status IN ('waiting', 'in-transit').
-- Implemented as a partial UNIQUE index — the only PostgreSQL-idiomatic way
-- to enforce conditional uniqueness. Placed here (not 0004_indexes.sql) because
-- it enforces a business constraint, not a performance concern.
-- =============================================================================
CREATE UNIQUE INDEX uix_pickups_one_active_per_store
    ON pickups (store_id)
    WHERE status IN ('waiting', 'in-transit');

COMMIT;
