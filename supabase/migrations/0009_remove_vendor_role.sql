-- ============================================================
-- 0009_remove_vendor_role.sql — Vendor Role Removal
-- MottaGo | Sprint A — Batch A1
-- ============================================================
-- Context: Vendor sebelumnya adalah pengguna sistem (role 'vendor')
--          dengan akun Supabase Auth, profiles.vendor_id FK,
--          dan RLS policy pickups_select_vendor (0008).
--          Arsitektur baru: vendor adalah Master Data murni.
--          Tidak ada akun, tidak ada login, tidak ada RLS khusus vendor.
-- Approved by: Product Owner + Technical Lead, 2 Juli 2026
-- Reference: VENDOR_ARCHITECTURE_v1.1.md
-- ============================================================

BEGIN;

-- ── 1. Migrasi data sebelum drop constraint ─────────────────
-- Update existing profiles dengan role yang akan dihapus.
-- 'pelayan' dihapus dari scope (ARCHITECTURE_ALIGNMENT_v1).
-- 'vendor' dihapus karena vendor bukan pengguna sistem lagi.
-- Kedua role dikonversi ke 'utility' sebagai fallback aman.
-- Jika ada profil vendor dengan store_id NULL, ini akan GAGAL
-- setelah constraint baru diterapkan di bawah — lihat catatan.
UPDATE profiles
    SET role = 'utility'
    WHERE role IN ('pelayan', 'vendor');

-- ── 2. Hapus policy RLS vendor (dari 0008_vendor_identity) ──
DROP POLICY IF EXISTS "pickups_select_vendor" ON pickups;

-- ── 3. Hapus kolom profiles.vendor_id (dari 0008) ────────────
-- ON DELETE SET NULL sudah ada, kolom aman untuk di-drop.
ALTER TABLE profiles DROP COLUMN IF EXISTS vendor_id;

-- ── 4. Revisi chk_profiles_role ──────────────────────────────
-- Hapus constraint lama yang mengizinkan 'pelayan' dan 'vendor'.
-- Tambah constraint baru: hanya 'manajer' dan 'utility'.
ALTER TABLE profiles DROP CONSTRAINT chk_profiles_role;
ALTER TABLE profiles ADD CONSTRAINT chk_profiles_role
    CHECK (role IN ('utility', 'manajer'));

-- ── 5. Revisi chk_profiles_store_id_role ─────────────────────
-- Sebelumnya: vendor role boleh NULL store_id.
-- Sekarang: semua role wajib punya store_id (tidak ada lagi vendor).
ALTER TABLE profiles DROP CONSTRAINT chk_profiles_store_id_role;
ALTER TABLE profiles ADD CONSTRAINT chk_profiles_store_id_role
    CHECK (store_id IS NOT NULL);

-- ── 6. Hapus stores.default_vendor_id ───────────────────────
-- Kolom ini digantikan oleh store_vendor_assignments (0010).
-- Hapus FK dulu, baru kolom.
ALTER TABLE stores DROP CONSTRAINT IF EXISTS fk_stores_default_vendor;
ALTER TABLE stores DROP COLUMN IF EXISTS default_vendor_id;

COMMIT;

-- ============================================================
-- CATATAN PASCA-EKSEKUSI:
-- Jika UPDATE di langkah 1 mengubah profil vendor yang store_id-nya NULL,
-- constraint baru di langkah 5 (store_id IS NOT NULL) akan menolak row tersebut.
-- Solusi: hapus profil vendor yang store_id-nya NULL sebelum migration ini.
-- Dalam kondisi development normal (seed data saja), tidak ada profil vendor.
-- ============================================================
