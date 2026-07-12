-- =============================================================================
-- Migration 0017 — Default Kapasitas Maksimum per Kategori (tanpa setup manual)
-- =============================================================================
-- Sprint F · Kapasitas per Kategori · MottaGo
-- =============================================================================
-- Problem : Migration 0016 menambah kolom max_capacity_organik/anorganik/
--           minyak tapi HANYA backfill dari max_capacity lama jika sudah
--           terisi. Store yang belum pernah mengonfigurasi max_capacity sama
--           sekali (NULL) jadi tetap NULL di ketiga kolom baru — Pengaturan
--           Store menampilkan "belum dikonfigurasi" untuk semuanya dan
--           gauge Kapasitas per Kategori tidak bisa dihitung persentasenya.
--           Manajer tidak seharusnya WAJIB isi form dulu agar fitur ini jalan.
--
-- Fix:
--   Set nilai default langsung untuk store yang max_capacity_* -nya masih
--   NULL: organik 400 kg, anorganik 150 kg, minyak 50 liter (estimasi
--   kapasitas gudang toko skala kecil-menengah — sama seperti nilai contoh
--   yang sudah dikomunikasikan ke Manajer sebelumnya). Manajer tetap bisa
--   menyesuaikan tiap nilai lewat Pengaturan Store kapan pun, tapi fitur
--   kapasitas per kategori langsung berfungsi tanpa setup manual.
--
--   Kolom max_capacity (lama, gabungan) ikut diisi SUM ketiganya jika masih
--   NULL, supaya reportService.getKpi (efisiensiPct) juga langsung akurat.
--
-- Impact:
--   - Data-only migration. Tidak ada perubahan skema, kolom, atau kode.
--   - Store yang SUDAH pernah mengatur max_capacity_* (baik lewat 0016
--     backfill maupun manual lewat Pengaturan) TIDAK tersentuh — hanya
--     store dengan nilai NULL yang diisi default.
-- =============================================================================
-- Dependencies : 0016_split_max_capacity_per_category.sql
-- =============================================================================

BEGIN;

UPDATE stores
SET max_capacity_organik = COALESCE(max_capacity_organik, 400),
    max_capacity_anorganik = COALESCE(max_capacity_anorganik, 150),
    max_capacity_minyak = COALESCE(max_capacity_minyak, 50)
WHERE max_capacity_organik IS NULL
   OR max_capacity_anorganik IS NULL
   OR max_capacity_minyak IS NULL;

UPDATE stores
SET max_capacity = max_capacity_organik + max_capacity_anorganik + max_capacity_minyak
WHERE max_capacity IS NULL;

COMMIT;
