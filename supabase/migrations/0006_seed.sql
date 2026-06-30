-- =============================================================================
-- Migration 0006 — Development Seed Data
-- =============================================================================
-- Purpose   : Load known, deterministic rows for local development and manual
--             testing. All INSERTs are idempotent (ON CONFLICT DO NOTHING).
-- Scope     : Development only — do NOT run against staging or production.
-- =============================================================================
-- Dependencies:
--   0002_tables.sql       (all tables + pickup_seq)
--   0003_constraints.sql  (FK, CHECK, UNIQUE in place)
--   0004_indexes.sql      (indexes in place)
--   0005_triggers.sql     (triggers active — fn_create_capacity_alert FIRES here)
-- =============================================================================
-- Dependency / INSERT order:
--   1. vendors               — no FK deps
--   2. stores                — FK: vendors.id
--   3. profiles              — FK: auth.users.id (bypassed), stores.id
--   4. capacity_snapshots    — FK: stores.id; trigger auto-fills:
--                               → capacity_alerts  (2 rows)
--                               → notifications of type capacity_alert (2 rows)
--   5. waste_items           — FK: stores.id, profiles.id
--   6. pickups               — FK: stores.id, vendors.id
--   7. notifications         — manual rows: pickup_status + system only
--   8. sequence resets       — ensure future app INSERTs don't conflict
-- =============================================================================
-- UUID scheme (explicit, for idempotency across re-runs):
--   profiles            aaaaaaaa-0000-0000-0000-0000000000{01–03}
--   capacity_snapshots  bbbbbbbb-0000-0000-0000-0000000000{01–03}
--   waste_items         cccccccc-0000-0000-0000-0000000000{01–04}
--   notifications       dddddddd-0000-0000-0000-0000000000{01–02}  (manual only)
-- =============================================================================
-- Row counts:
--   vendors             4   (3 active + 1 inactive)
--   stores              2
--   profiles            3   (manajer, utility, pelayan)
--   capacity_snapshots  3   (normal 30%, perlu-perhatian 70%, kritis 92%)
--   capacity_alerts     2   [AUTO — created by fn_create_capacity_alert trigger]
--   waste_items         4   (organic, liquid, recyclable, non-recyclable)
--   pickups             4   (waiting, in-transit, completed, cancelled)
--   notifications       4   [2 AUTO via trigger + 2 manual]
--   ─────────────────────────────────────────────────────────────────────────
--   TOTAL               26 rows
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. vendors
-- =============================================================================
-- SERIAL PK: explicit IDs allowed for deterministic seeding.
-- Sequence advanced past max(id) in step 8.
-- Vendor 4 is inactive (DL-05): excluded from new pickup creation but
-- existing FK references from pickups.vendor_id are preserved.
-- =============================================================================
INSERT INTO vendors (id, name, is_active)
VALUES
    (1, 'PT Limbah Bersih Indonesia',     true),
    (2, 'CV Daur Ulang Nusantara',        true),
    (3, 'UD Pengelola Organik Sejahtera', true),
    (4, 'Mitra Sampah Lestari',           false)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. stores
-- =============================================================================
-- GENERATED ALWAYS AS IDENTITY PK: OVERRIDING SYSTEM VALUE required for
-- explicit ID inserts. Sequence advanced in step 8.
-- Two stores satisfy DL-03 (one active pickup per store):
--   Store 1 → holds the 'waiting' pickup
--   Store 2 → holds the 'in-transit' pickup
-- =============================================================================
INSERT INTO stores (id, store_name, city, max_capacity, default_vendor_id)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 'Warung MottaGo Sudirman', 'Jakarta', 100.00, 1),
    (2, 'Warung MottaGo Blok M',   'Jakarta',  75.00, 2)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. profiles
-- =============================================================================
-- profiles.id FK → auth.users.id (ON DELETE CASCADE).
-- No real auth users are created at this seed stage. Placeholder UUIDs are
-- inserted by temporarily disabling FK enforcement via session_replication_role.
-- IMPORTANT: reset to DEFAULT before step 4 so triggers fire normally.
-- =============================================================================
SET session_replication_role = 'replica';

INSERT INTO profiles (id, store_id, role, full_name)
VALUES
    ('aaaaaaaa-0000-0000-0000-000000000001', 1, 'manajer', 'Budi Santoso'),
    ('aaaaaaaa-0000-0000-0000-000000000002', 1, 'utility', 'Agus Pratama'),
    ('aaaaaaaa-0000-0000-0000-000000000003', 1, 'pelayan', 'Siti Rahayu')
ON CONFLICT (id) DO NOTHING;

SET session_replication_role = DEFAULT;

-- =============================================================================
-- 4. capacity_snapshots
-- =============================================================================
-- Three snapshots covering all three DL-04 capacity bands.
-- pct_used and status are GENERATED ALWAYS AS STORED — excluded from INSERT.
--
-- TRIGGER BEHAVIOR (fn_create_capacity_alert fires AFTER each INSERT):
--   bbbb...0001  30.00% → 'normal'          — no alert, no notification
--   bbbb...0002  70.00% → 'perlu-perhatian' — auto INSERT capacity_alerts (warning)
--                                           — auto INSERT notifications  (warning)
--   bbbb...0003  92.00% → 'kritis'          — auto INSERT capacity_alerts (critical)
--                                           — auto INSERT notifications  (critical)
--
-- ON CONFLICT DO NOTHING: on re-run, existing rows are skipped and trigger
-- does NOT fire again — no duplicate auto-rows are produced. ✓
-- =============================================================================
INSERT INTO capacity_snapshots (id, store_id, current_kg, max_kg, source)
VALUES
    ('bbbbbbbb-0000-0000-0000-000000000001', 1,  30.00, 100.00, 'manual'),
    ('bbbbbbbb-0000-0000-0000-000000000002', 1,  70.00, 100.00, 'manual'),
    ('bbbbbbbb-0000-0000-0000-000000000003', 1,  92.00, 100.00, 'manual')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 5. waste_items
-- =============================================================================
-- One entry per waste_type, all recorded by the utility staff (aaaa...0002).
-- Columns unit and quantity_kg are GENERATED ALWAYS AS STORED — excluded.
--   organic / recyclable / non-recyclable → unit = 'kg'  (DL-02)
--   liquid                                → unit = 'liter' (DL-02)
-- =============================================================================
INSERT INTO waste_items (id, store_id, waste_type, quantity, recorded_by, notes)
VALUES
    (
        'cccccccc-0000-0000-0000-000000000001',
        1, 'organic',        15.000,
        'aaaaaaaa-0000-0000-0000-000000000002',
        'Sisa makanan dapur makan siang'
    ),
    (
        'cccccccc-0000-0000-0000-000000000002',
        1, 'liquid',          5.000,
        'aaaaaaaa-0000-0000-0000-000000000002',
        'Minyak goreng bekas penggunaan'
    ),
    (
        'cccccccc-0000-0000-0000-000000000003',
        1, 'recyclable',      8.500,
        'aaaaaaaa-0000-0000-0000-000000000002',
        'Botol plastik dan kardus bekas'
    ),
    (
        'cccccccc-0000-0000-0000-000000000004',
        1, 'non-recyclable',  3.200,
        'aaaaaaaa-0000-0000-0000-000000000002',
        'Kemasan berlapis tidak dapat didaur ulang'
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 6. pickups
-- =============================================================================
-- Four pickups covering all status values.
-- DL-03: uix_pickups_one_active_per_store enforces 1 active pickup per store.
--   PU-SEED-001  store_id=1  'waiting'     → active; only active row on store 1 ✓
--   PU-SEED-002  store_id=2  'in-transit'  → active; only active row on store 2 ✓
--   PU-SEED-003  store_id=1  'completed'   → outside partial index, OK ✓
--   PU-SEED-004  store_id=1  'cancelled'   → outside partial index, OK ✓
--
-- pickups.id is TEXT PK; explicit values bypass fn_generate_pickup_id trigger.
-- vendor_name is denormalized — snapshot of vendor name at pickup creation time.
-- =============================================================================
INSERT INTO pickups (id, store_id, vendor_id, vendor_name, estimasi_kg, status, completed_at)
VALUES
    (
        'PU-SEED-001', 1, 1,
        'PT Limbah Bersih Indonesia',     45.00, 'waiting',    NULL
    ),
    (
        'PU-SEED-002', 2, 2,
        'CV Daur Ulang Nusantara',        30.00, 'in-transit', NULL
    ),
    (
        'PU-SEED-003', 1, 1,
        'PT Limbah Bersih Indonesia',     52.00, 'completed',  now() - INTERVAL '2 days'
    ),
    (
        'PU-SEED-004', 1, 3,
        'UD Pengelola Organik Sejahtera', 20.00, 'cancelled',  NULL
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 7. notifications — manual rows
-- =============================================================================
-- 2 capacity_alert notifications already auto-created by trigger in step 4.
-- Only pickup_status and system types require manual seeding here.
-- =============================================================================
INSERT INTO notifications (id, store_id, type, title, body, severity, metadata)
VALUES
    (
        'dddddddd-0000-0000-0000-000000000001',
        1,
        'pickup_status',
        'Pickup Sedang Dalam Perjalanan',
        'Vendor CV Daur Ulang Nusantara sedang menuju lokasi Warung MottaGo Blok M.',
        'info',
        '{"pickup_id": "PU-SEED-002"}'::JSONB
    ),
    (
        'dddddddd-0000-0000-0000-000000000002',
        1,
        'system',
        'Selamat Datang di MottaGo',
        'Sistem MottaGo telah siap digunakan. Mulai catat limbah makanan Anda hari ini.',
        'info',
        NULL
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 8. Sequence resets
-- =============================================================================
-- Advance sequences past the highest seeded ID so future application INSERTs
-- (without explicit id) do not collide with seed rows.
-- pg_get_serial_sequence works for both SERIAL and GENERATED AS IDENTITY columns.
-- GREATEST(..., 1) guards against setval(0) on an unexpectedly empty table.
-- =============================================================================
SELECT setval(
    pg_get_serial_sequence('vendors', 'id'),
    GREATEST((SELECT MAX(id) FROM vendors), 1)
);

SELECT setval(
    pg_get_serial_sequence('stores', 'id'),
    GREATEST((SELECT MAX(id) FROM stores), 1)
);

COMMIT;
