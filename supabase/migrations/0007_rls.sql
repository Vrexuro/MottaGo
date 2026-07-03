-- =============================================================================
-- Migration 0007 — Row Level Security Policies
-- =============================================================================
-- Dependencies : 0002_tables.sql (all 8 tables must exist)
--                0005_triggers.sql (fn_handle_new_user must exist so profiles
--                                   rows are created before any policy runs)
-- Enables      : RLS on all 8 tables
--                Helper functions get_my_store_id(), get_my_role()
-- =============================================================================
-- Schema notes (verified against 0002_tables.sql):
--   vendors.contact_email  — DOES NOT EXIST. Vendor pickup policy SKIPPED.
--                            See "VENDOR POLICY GAP" comment below.
--   notifications.recipient_id — DOES NOT EXIST. Policies use store_id instead.
--   profiles.store_id      — NULLABLE (vendor role users have store_id = NULL)
-- =============================================================================

-- ── Helper functions ──────────────────────────────────────────────────────────

-- Returns the store_id of the currently authenticated user.
-- NULL for vendor-role users (their profiles.store_id is NULL by design).
CREATE OR REPLACE FUNCTION get_my_store_id()
RETURNS INT LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT store_id FROM profiles WHERE id = auth.uid()
$$;

-- Returns the role of the currently authenticated user.
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

-- ── profiles ──────────────────────────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Each user can only read their own profile.
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Each user can only update their own profile.
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- ── stores ────────────────────────────────────────────────────────────────────

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Users can only see their own store.
CREATE POLICY "stores_select_own" ON stores
  FOR SELECT USING (id = get_my_store_id());

-- Only Manajer can update store settings (e.g. max_capacity, default_vendor_id).
CREATE POLICY "stores_update_manajer" ON stores
  FOR UPDATE USING (
    id = get_my_store_id() AND get_my_role() = 'manajer'
  );

-- ── vendors ───────────────────────────────────────────────────────────────────

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read active vendors (needed for pickup request form).
CREATE POLICY "vendors_select_authenticated" ON vendors
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only Manajer can insert or update vendor records.
CREATE POLICY "vendors_insert_manajer" ON vendors
  FOR INSERT WITH CHECK (get_my_role() = 'manajer');

CREATE POLICY "vendors_update_manajer" ON vendors
  FOR UPDATE USING (get_my_role() = 'manajer');

-- ── pickups ───────────────────────────────────────────────────────────────────

ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;

-- Utility and Manajer: see pickups for their own store.
CREATE POLICY "pickups_select_own_store" ON pickups
  FOR SELECT USING (
    store_id = get_my_store_id() AND
    get_my_role() IN ('utility', 'manajer')
  );

-- =============================================================================
-- VENDOR POLICY GAP — STOP CONDITION MET
-- =============================================================================
-- The prompt template assumes vendors.contact_email exists to resolve which
-- vendor record a vendor-role user represents. This column does not exist in
-- 0002_tables.sql. profiles table also has no vendor_id FK.
--
-- Without a link between auth.uid() and a vendors.id, a per-vendor pickup
-- filter cannot be written. Options (requires user decision):
--   A) Add contact_email to vendors table (new migration needed)
--   B) Add vendor_id FK to profiles table (new migration needed)
--   C) Give vendor role access to ALL pickups regardless of vendor_id
--      (over-permissive but unblocks MVP without schema change)
--
-- Awaiting user decision. Vendor SELECT on pickups is NOT enabled in M03.
-- =============================================================================

-- Utility and Manajer: create pickups for their own store.
CREATE POLICY "pickups_insert_utility" ON pickups
  FOR INSERT WITH CHECK (
    store_id = get_my_store_id() AND
    get_my_role() IN ('utility', 'manajer')
  );

-- Utility and Manajer: update pickup status (cancel, etc.).
CREATE POLICY "pickups_update_own_store" ON pickups
  FOR UPDATE USING (
    store_id = get_my_store_id() AND
    get_my_role() IN ('utility', 'manajer')
  );

-- ── waste_items ───────────────────────────────────────────────────────────────

ALTER TABLE waste_items ENABLE ROW LEVEL SECURITY;

-- Utility and Manajer: see waste items for their own store.
CREATE POLICY "waste_items_select_own_store" ON waste_items
  FOR SELECT USING (store_id = get_my_store_id());

-- Only Utility and Manajer can record waste items.
CREATE POLICY "waste_items_insert_utility" ON waste_items
  FOR INSERT WITH CHECK (
    store_id = get_my_store_id() AND
    get_my_role() IN ('utility', 'manajer')
  );

-- ── capacity_snapshots ────────────────────────────────────────────────────────

ALTER TABLE capacity_snapshots ENABLE ROW LEVEL SECURITY;

-- All store users can see capacity snapshots.
CREATE POLICY "capacity_snapshots_select_own_store" ON capacity_snapshots
  FOR SELECT USING (store_id = get_my_store_id());

-- Only Utility and Manajer can record capacity snapshots.
CREATE POLICY "capacity_snapshots_insert_utility" ON capacity_snapshots
  FOR INSERT WITH CHECK (
    store_id = get_my_store_id() AND
    get_my_role() IN ('utility', 'manajer')
  );

-- ── notifications ─────────────────────────────────────────────────────────────

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- NOTE: notifications table has no recipient_id column (verified in Discovery 6).
-- Notifications are store-scoped; all users of the same store can see them.
-- This deviates from the prompt template which assumed recipient_id = auth.uid().
-- See Decision Gate — Unexpected Finding for details.

-- All store users can see their store's notifications (30-second polling, DL-04).
CREATE POLICY "notifications_select_own_store" ON notifications
  FOR SELECT USING (store_id = get_my_store_id());

-- Any store user can mark notifications as read (updates is_read, read_by, read_at).
CREATE POLICY "notifications_update_own_store" ON notifications
  FOR UPDATE USING (store_id = get_my_store_id());

-- ── capacity_alerts ───────────────────────────────────────────────────────────

ALTER TABLE capacity_alerts ENABLE ROW LEVEL SECURITY;

-- All store users can see capacity alerts for their store.
CREATE POLICY "capacity_alerts_select_own_store" ON capacity_alerts
  FOR SELECT USING (store_id = get_my_store_id());
