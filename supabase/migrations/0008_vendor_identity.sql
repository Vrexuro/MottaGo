-- ============================================================
-- 0008_vendor_identity.sql — Vendor Identity Schema Patch
-- MottaGo | M03 Patch — Architecture Decision Option B
-- ============================================================
-- Context: M03 (0007_rls.sql) left vendor pickup SELECT policy
-- incomplete because profiles had no FK to vendors.
-- This migration adds the missing link and completes the policy.
-- Architecture Decision: profiles.vendor_id → vendors.id
-- Approved by: Project Leader, 2 Juli 2026
-- ============================================================

-- ── 1. Add vendor_id to profiles ──────────────────────────────
-- NULLABLE: only vendor-role users will have this set.
-- manajer and utility users keep vendor_id = NULL.
ALTER TABLE profiles
  ADD COLUMN vendor_id INTEGER REFERENCES vendors(id)
  ON DELETE SET NULL;

-- ── 2. Vendor pickup SELECT policy ────────────────────────────
-- A vendor user can see pickups assigned to their vendor.
-- Uses profiles.vendor_id to resolve vendor identity from auth.uid().
-- Simple, single-table lookup — no email matching.
CREATE POLICY "pickups_select_vendor" ON pickups
  FOR SELECT USING (
    get_my_role() = 'vendor'
    AND vendor_id = (
      SELECT vendor_id
      FROM profiles
      WHERE id = auth.uid()
    )
  );
