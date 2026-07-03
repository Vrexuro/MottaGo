-- ============================================================
-- 0010_vendor_whatsapp_and_pickup_amendments.sql
-- MottaGo | Sprint A — Batch A1
-- ============================================================
-- Changes in this migration:
--   1. vendors.whatsapp_number         — new NOT NULL TEXT column
--   2. store_vendor_assignments        — new table (vendor per category per store)
--   3. pickups.estimasi_kg             — DROP NOT NULL, relax CHECK to allow NULL
--   4. pickups.waste_category          — new nullable TEXT column + CHECK
--   5. pickups unique index            — replaced: per-store → per-store-per-category
--   6. pickups.scheduled_pickup_at     — new nullable TIMESTAMPTZ column
--   7. pickups.completed_at CHECK      — add temporal guard (completed_at >= requested_at)
-- ============================================================
-- DL-03 revision: one active pickup per store PER waste_category
--   (was: one per store). Enforced via new partial unique index.
-- DL-06 revision: vendor assignment is now per-store per-category
--   via store_vendor_assignments, not stores.default_vendor_id.
-- ============================================================

BEGIN;

-- ── 1. vendors.whatsapp_number ──────────────────────────────
-- Contact number for WhatsApp-based pickup coordination.
-- DEFAULT '' allows the column to be added without backfilling existing rows.
-- Placeholder values for seed data are applied immediately below.
ALTER TABLE vendors ADD COLUMN whatsapp_number TEXT NOT NULL DEFAULT '';

-- Backfill seed vendor placeholder numbers (set in 0006_seed.sql but deferred
-- because this column did not yet exist when 0006 ran).
UPDATE vendors SET whatsapp_number = '628111000001' WHERE id = 1;
UPDATE vendors SET whatsapp_number = '628111000002' WHERE id = 2;
UPDATE vendors SET whatsapp_number = '628111000003' WHERE id = 3;
-- Vendor 4 (inactive) intentionally retains '' — no WhatsApp contact needed.

-- ── 2. store_vendor_assignments ─────────────────────────────
-- Replaces stores.default_vendor_id (dropped in 0009).
-- Maps a specific vendor to each waste_category for a given store.
-- PK is (store_id, waste_category) — one vendor per category per store.
-- ON DELETE RESTRICT on both FKs: cannot delete a store or vendor that is
-- still referenced in an active assignment.
CREATE TABLE store_vendor_assignments (
    store_id       INTEGER  NOT NULL REFERENCES stores(id)  ON DELETE RESTRICT,
    vendor_id      INTEGER  NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    waste_category TEXT     NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (store_id, waste_category),
    CONSTRAINT chk_sva_waste_category
        CHECK (waste_category IN ('organik', 'anorganik', 'minyak'))
);

ALTER TABLE store_vendor_assignments ENABLE ROW LEVEL SECURITY;

-- Any authenticated user of the store can read their own assignments.
CREATE POLICY "sva_select_own_store"
    ON store_vendor_assignments
    FOR SELECT
    USING (store_id = get_my_store_id());

-- Only the Manajer can create, update, or delete assignments for their store.
CREATE POLICY "sva_all_manajer"
    ON store_vendor_assignments
    FOR ALL
    USING (store_id = get_my_store_id() AND get_my_role() = 'manajer');

-- ── 3. pickups.estimasi_kg — relax NOT NULL + CHECK ─────────
-- Manajer may not know the estimated weight at request time.
-- New CHECK: NULL is permitted; when set, must remain positive.
ALTER TABLE pickups ALTER COLUMN estimasi_kg DROP NOT NULL;
ALTER TABLE pickups DROP CONSTRAINT chk_pickups_estimasi_kg;
ALTER TABLE pickups ADD CONSTRAINT chk_pickups_estimasi_kg
    CHECK (estimasi_kg IS NULL OR estimasi_kg > 0);

-- ── 4. pickups.waste_category ───────────────────────────────
-- Records which waste category this pickup covers.
-- NULL allowed for legacy rows; new pickups should always supply a value.
ALTER TABLE pickups ADD COLUMN waste_category TEXT;
ALTER TABLE pickups ADD CONSTRAINT chk_pickups_waste_category
    CHECK (waste_category IS NULL OR waste_category IN ('organik', 'anorganik', 'minyak'));

-- ── 5. Replace partial unique index (DL-03 revision) ────────
-- Old: one active pickup per store (regardless of category).
-- New: one active pickup per store PER waste_category.
-- Note: rows with waste_category = NULL are treated as distinct by PostgreSQL
-- unique indexes (NULLs are not equal). For full DL-03 enforcement, application
-- code must prevent multiple NULL-category pickups on the same store.
DROP INDEX IF EXISTS uix_pickups_one_active_per_store;
CREATE UNIQUE INDEX uix_pickups_one_active_per_store_per_category
    ON pickups (store_id, waste_category)
    WHERE status IN ('waiting', 'in-transit');

-- ── CATATAN PENTING — NULL waste_category ───────────────────
-- Partial UNIQUE INDEX hanya berlaku jika waste_category IS NOT NULL.
-- PostgreSQL: NULL != NULL dalam UNIQUE constraint evaluation.
-- Akibatnya: dua pickup aktif dengan waste_category = NULL pada store
-- yang sama TIDAK akan ditolak oleh index ini.
--
-- Mitigasi wajib di application layer:
--   Form Pickup Request (dibangun di Batch A3) harus:
--   - Mewajibkan waste_category sebagai required field di form validation
--   - Mencegah submit jika waste_category NULL
--   - Ini adalah Acceptance Criteria resmi untuk Batch A3.
--
-- Tidak ada perubahan schema yang diperlukan — constraint cukup ketat
-- untuk arsitektur yang benar (pickup selalu punya waste_category).
-- ── ──────────────────────────────────────────────────────────

-- ── 6. pickups.scheduled_pickup_at ──────────────────────────
-- Optional: Manajer may record a scheduled datetime for the pickup.
ALTER TABLE pickups ADD COLUMN scheduled_pickup_at TIMESTAMPTZ;

-- ── 7. pickups.completed_at temporal guard ──────────────────
-- A completed pickup cannot have a completion time before the request time.
ALTER TABLE pickups ADD CONSTRAINT chk_pickups_completed_at
    CHECK (completed_at IS NULL OR completed_at >= requested_at);

COMMIT;
