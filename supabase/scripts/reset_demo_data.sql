-- =============================================================================
-- Script — Reset Data Demo (Total Sampah + Riwayat Pickup)
-- =============================================================================
-- BUKAN migration — jangan taruh di folder migrations/ dan jangan disertakan
-- di pipeline migration otomatis. Ini one-off maintenance script untuk reset
-- data demo sebelum penilaian tugas, dijalankan manual lewat Supabase SQL
-- Editor kapan pun dibutuhkan (bisa dijalankan berkali-kali).
--
-- Scope   : SEMUA store (tidak difilter store_id).
-- Dihapus : waste_items (semua entri sampah — sumber "Total Sampah" &
--           "Kapasitas Terpakai", karena kapasitas dihitung live dari sini)
--           + pickups (seluruh riwayat & pickup aktif, semua status).
-- TIDAK disentuh: stores (nama/kota/kapasitas maksimum tetap), profiles/akun
--           login, vendors, capacity_snapshots, capacity_alerts, notifications.
--
-- Setelah dijalankan:
--   - "Total Sampah", "Total Minyak", "Entri Hari Ini" → 0
--   - "Kapasitas Terpakai" (gabungan & per kategori) → 0%
--   - "Pickup Aktif" & Riwayat Pickup → kosong
--   - pickup_seq direset → pickup baru mulai lagi dari PU-YYMM-001
--
-- Cara pakai: buka Supabase Dashboard → SQL Editor → paste seluruh isi file
-- ini → Run. Aman dijalankan berulang (idempotent — DELETE tanpa syarat,
-- tidak error jika tabel sudah kosong).
-- =============================================================================

BEGIN;

-- Tidak ada FK lain yang mereferensikan waste_items.id atau pickups.id,
-- jadi urutan DELETE di bawah aman tanpa perlu menonaktifkan constraint.
DELETE FROM waste_items;
DELETE FROM pickups;

-- Reset counter ID pickup manusiawi ('PU-YYMM-NNN') supaya demo berikutnya
-- mulai bersih dari NNN=001. Hapus/komentari baris ini jika ingin counter
-- tetap berlanjut dari nilai terakhir.
ALTER SEQUENCE pickup_seq RESTART WITH 1;

COMMIT;
