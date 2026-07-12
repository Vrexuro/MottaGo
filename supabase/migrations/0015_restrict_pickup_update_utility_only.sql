-- =============================================================================
-- Migration 0015 — Restrict Pickup Status Update: Utility Only (bukan Manajer)
-- =============================================================================
-- Sprint E+ · Role Scope Correction · MottaGo
-- =============================================================================
-- Problem : Policy "pickups_update_own_store" (0007_rls.sql) mengizinkan role
--           'utility' DAN 'manajer' untuk UPDATE status pickup (confirm →
--           in-transit, complete → completed, cancel → cancelled). Sesuai
--           keputusan produk terbaru, Manajer hanya memantau (read-only)
--           riwayat pickup — yang berhak mengubah status pickup (termasuk
--           menandai selesai) hanya Pegawai Utility.
--
-- Fix:
--   DROP policy UPDATE lama → CREATE policy baru yang hanya mengizinkan
--   role 'utility'.
--
-- Impact:
--   - Frontend: RiwayatPickupPage (Manajer) — kolom Aksi & tombol
--     confirm/complete/cancel dihapus, halaman jadi view-only.
--   - Frontend: Halaman baru UtilityRiwayatPickupPage (Utility) — mengambil
--     alih kemampuan confirm/complete/cancel.
--   - Manajer: SELECT pickups (pickups_select_own_store) TIDAK berubah —
--     tetap bisa melihat seluruh riwayat pickup store-nya.
--   - Utility: tidak ada perubahan hak, tetap bisa UPDATE pickups untuk
--     store-nya (sudah diizinkan sebelumnya).
--
-- Konsisten dengan 0014_restrict_pickup_insert_utility_only.sql (INSERT
-- sudah dibatasi ke utility saja pada migration sebelumnya).
--
-- No data changes. No schema changes. RLS policy change only.
-- =============================================================================
-- Dependencies : 0014_restrict_pickup_insert_utility_only.sql (semua prior migrations applied)
-- =============================================================================

BEGIN;

-- ── Step 1: Drop policy lama ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "pickups_update_own_store" ON pickups;

-- ── Step 2: Buat policy baru — hanya role 'utility' ─────────────────────────────
CREATE POLICY "pickups_update_own_store" ON pickups
  FOR UPDATE USING (
    store_id = get_my_store_id() AND
    get_my_role() = 'utility'
  );

COMMIT;
