-- =============================================================================
-- Migration 0013 — Fix profiles RLS: Manajer Dapat Melihat Semua User Store
-- =============================================================================
-- Sprint C · KI-07 Resolution · MottaGo
-- =============================================================================
-- Problem : RLS policy "profiles_select_own" (0007_rls.sql) hanya mengizinkan
--           SELECT ke baris milik auth.uid() saja.
--           Akibat: KelolaPenggunaPage hanya menampilkan 1 user (diri sendiri),
--           padahal Manajer perlu melihat semua user di store-nya.
--
-- Root cause (KI-07, ditemukan Sprint C Batch 2):
--   `id = auth.uid()` → SELECT hanya baris sendiri, tidak ada akses ke
--   profile Utility user meskipun store_id sama.
--
-- Fix:
--   DROP policy lama → CREATE policy baru yang mengizinkan:
--     a) Semua user melihat baris milik sendiri (perilaku existing)
--     b) Manajer melihat semua profile di store yang sama
--
-- Helper functions (sudah ada sejak 0007, SECURITY DEFINER):
--   get_my_role()     — returns role user yang sedang login
--   get_my_store_id() — returns store_id user yang sedang login
--   Keduanya SECURITY DEFINER → bypass RLS untuk query internal mereka sendiri
--   → tidak ada circular dependency.
--
-- Impact:
--   KelolaPenggunaPage (Manajer) sekarang menampilkan semua user di store.
--   Utility users tetap hanya melihat profil mereka sendiri (tidak berubah).
--   profiles_update_own tidak berubah — UPDATE tetap hanya untuk baris sendiri.
--
-- No data changes. No schema changes. RLS policy change only.
-- =============================================================================
-- Dependencies : 0012_fix_waste_type_constraint.sql (semua prior migrations applied)
-- =============================================================================

BEGIN;

-- ── Step 1: Drop policy lama ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;

-- ── Step 2: Buat policy baru ──────────────────────────────────────────────────
-- Kondisi SELECT:
--   a) id = auth.uid()               — user selalu bisa lihat profil sendiri
--   b) get_my_role() = 'manajer'     — hanya manajer yang dapat akses lebih luas
--      AND store_id = get_my_store_id() — terbatas pada store yang sama
--
-- Jika get_my_store_id() = NULL (seharusnya tidak terjadi untuk manajer aktif),
-- kondisi (b) gagal → hanya (a) yang berlaku. Aman.
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT USING (
        id = auth.uid()
        OR (
            get_my_role() = 'manajer'
            AND store_id = get_my_store_id()
        )
    );

COMMIT;
