-- =============================================================================
-- Migration 0016 — Kapasitas Maksimum Terpisah per Kategori Sampah
-- =============================================================================
-- Sprint F · Kapasitas per Kategori · MottaGo
-- =============================================================================
-- Problem : "Kapasitas Terpakai" selama ini satu angka gabungan (organik +
--           anorganik, minyak dikecualikan sepenuhnya) terhadap satu
--           stores.max_capacity. Manajer perlu memantau kapasitas tiap jenis
--           sampah (organik, anorganik, minyak) secara terpisah, masing-
--           masing dengan batas maksimumnya sendiri, dan tiap gauge kembali
--           ke 0% begitu pickup kategori tersebut selesai.
--
-- Fix:
--   Tambah 3 kolom baru pada stores: max_capacity_organik, max_capacity_
--   anorganik, max_capacity_minyak (NUMERIC(10,2), nullable — konsisten
--   dengan max_capacity lama yang juga nullable sebelum dikonfigurasi
--   manajer). Backfill dari nilai max_capacity yang ada (per DL-01 lama)
--   supaya tidak ada store yang mendadak terlihat "over capacity" pasca
--   migration; manajer dapat menyesuaikan tiap nilai lewat Pengaturan.
--
--   Kolom stores.max_capacity LAMA TETAP ADA (tidak di-drop) — dipakai
--   reportService.getKpi (efisiensiPct laporan) dan dipelihara sebagai
--   SUM dari 3 kolom baru setiap kali manajer mengubah kapasitas lewat
--   capacityService.updateCategoryMaxCapacity (lihat frontend). Ini
--   menghindari perubahan pada reportService di migration ini.
--
--   Minyak jelantah (liter) kini IKUT dihitung dalam kapasitas gabungan
--   dan punya gauge + max sendiri — MVP 1 liter = 1 kg (lihat komentar
--   0002_tables.sql baris waste_items.quantity_kg) sudah mengasumsikan
--   satuan liter & kg dapat dijumlahkan langsung untuk keperluan ini.
--
-- Impact:
--   - Frontend: capacityService.ts — StoreInfo, getCategoryCapacities baru,
--     updateCategoryMaxCapacity menggantikan updateMaxCapacity.
--   - Frontend: PengaturanPage.tsx — 3 input kapasitas maksimum terpisah.
--   - Frontend: CategoryBreakdownCard + KapasitasPage — 3 gauge kapasitas
--     per kategori, masing-masing reset ke 0% setelah pickup kategori
--     tersebut selesai.
--
-- No data loss. Additive schema change only.
-- =============================================================================
-- Dependencies : 0015_restrict_pickup_update_utility_only.sql (semua prior migrations applied)
-- =============================================================================

BEGIN;

-- ── Step 1: Tambah kolom kapasitas maksimum per kategori ────────────────────
ALTER TABLE stores
    ADD COLUMN max_capacity_organik NUMERIC(10,2),
    ADD COLUMN max_capacity_anorganik NUMERIC(10,2),
    ADD COLUMN max_capacity_minyak NUMERIC(10,2);

COMMENT ON COLUMN stores.max_capacity IS
    'DEPRECATED sejak 0016 — dipertahankan untuk kompatibilitas reportService '
    '(efisiensiPct). Dipelihara sebagai SUM(max_capacity_organik, '
    'max_capacity_anorganik, max_capacity_minyak) oleh capacityService.'
    'updateCategoryMaxCapacity. Untuk gauge kapasitas per kategori gunakan '
    'kolom max_capacity_* baru.';

COMMENT ON COLUMN stores.max_capacity_organik IS
    'Kapasitas maksimum sampah organik (kg). NULL = belum dikonfigurasi manajer.';
COMMENT ON COLUMN stores.max_capacity_anorganik IS
    'Kapasitas maksimum sampah anorganik (kg). NULL = belum dikonfigurasi manajer.';
COMMENT ON COLUMN stores.max_capacity_minyak IS
    'Kapasitas maksimum minyak jelantah (liter). NULL = belum dikonfigurasi manajer.';

-- ── Step 2: CHECK constraints — konsisten dgn chk_stores_max_capacity lama ──
ALTER TABLE stores
    ADD CONSTRAINT chk_stores_max_capacity_organik
        CHECK (max_capacity_organik IS NULL OR max_capacity_organik > 0);

ALTER TABLE stores
    ADD CONSTRAINT chk_stores_max_capacity_anorganik
        CHECK (max_capacity_anorganik IS NULL OR max_capacity_anorganik > 0);

ALTER TABLE stores
    ADD CONSTRAINT chk_stores_max_capacity_minyak
        CHECK (max_capacity_minyak IS NULL OR max_capacity_minyak > 0);

-- ── Step 3: Backfill dari max_capacity lama ──────────────────────────────────
-- Store yang sudah mengonfigurasi max_capacity: pakai nilai yang sama untuk
-- ketiga kategori sebagai titik awal (manajer bisa sesuaikan masing-masing
-- lewat Pengaturan setelah migration). Store yang belum dikonfigurasi
-- (max_capacity IS NULL) tetap NULL di ketiganya.
UPDATE stores
SET max_capacity_organik = max_capacity,
    max_capacity_anorganik = max_capacity,
    max_capacity_minyak = max_capacity
WHERE max_capacity IS NOT NULL;

COMMIT;
