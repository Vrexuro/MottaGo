-- =============================================================================
-- Migration 0014 — Restrict Pickup Creation: Utility Only (bukan Manajer)
-- =============================================================================
-- Sprint E+ · Role Scope Correction · MottaGo
-- =============================================================================
-- Problem : Policy "pickups_insert_utility" (0007_rls.sql) mengizinkan role
--           'utility' DAN 'manajer' untuk INSERT ke tabel pickups. Sesuai
--           keputusan produk terbaru, hanya Pegawai Utility yang berhak
--           membuat request pickup. Manajer hanya memantau/mengelola status
--           (confirm/complete/cancel via pickups_update_own_store — tidak
--           berubah di migration ini).
--
-- Fix:
--   DROP policy INSERT lama → CREATE policy baru yang hanya mengizinkan
--   role 'utility'.
--
-- Impact:
--   - Frontend: RequestPickupPage khusus Manajer dihapus (route, nav item,
--     quick action) — lihat commit terkait di frontend/src/router & pages.
--   - Utility: tidak ada perubahan, tetap bisa INSERT pickups untuk store-nya.
--   - Manajer: SELECT dan UPDATE pickups (pickups_select_own_store,
--     pickups_update_own_store) TIDAK berubah — manajer tetap bisa melihat
--     riwayat dan mengubah status pickup (confirm/complete/cancel).
--
-- No data changes. No schema changes. RLS policy change only.
-- =============================================================================
-- Dependencies : 0013_fix_profiles_rls.sql (semua prior migrations applied)
-- =============================================================================

BEGIN;

-- ── Step 1: Drop policy lama ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "pickups_insert_utility" ON pickups;

-- ── Step 2: Buat policy baru — hanya role 'utility' ─────────────────────────────
CREATE POLICY "pickups_insert_utility" ON pickups
  FOR INSERT WITH CHECK (
    store_id = get_my_store_id() AND
    get_my_role() = 'utility'
  );

COMMIT;
