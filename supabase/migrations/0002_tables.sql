-- =============================================================================
-- Migration 0002 — Table Definitions
-- =============================================================================
-- Dependencies : 0001_extensions.sql  (uuid-ossp, pg_trgm)
-- Creates      : pickup_seq, vendors, stores, profiles, pickups, waste_items,
--                capacity_snapshots, notifications, capacity_alerts
-- =============================================================================
-- Creation order follows FK dependency chain (FKs added in 0003_constraints.sql):
--
--   vendors               ← no inbound deps from other new tables
--   stores                ← references vendors (default_vendor_id)
--   profiles              ← references auth.users (id), stores (store_id)
--   pickups               ← references stores, vendors
--   waste_items           ← references stores, profiles
--   capacity_snapshots    ← references stores
--   notifications         ← references stores, profiles
--   capacity_alerts       ← references stores, capacity_snapshots
--
-- Governance applied:
--   DL-01  stores.max_capacity              nullable; set by Manajer
--   DL-02  waste_items.unit                 GENERATED from waste_type
--   DL-03  pickups partial UNIQUE           → 0003_constraints.sql
--   DL-04  capacity_snapshots.status        GENERATED (threshold logic)
--          notifications.is_read            default false; 30-sec polling
--   DL-05  vendors.is_active               default true
--   DL-06  stores.default_vendor_id        nullable; FK → 0003_constraints.sql
--   DL-07  waste_items.recorded_by         nullable (Utility; no Pelayan wait)
--
-- Column decisions (B2.1 governance final):
--   capacity_snapshots  → max_kg (NOT max_capacity)
--   profiles.store_id   → NULLABLE (vendor accounts have no store)
--   pickups.status      → includes 'cancelled' (soft delete; no hard DELETE)
--   waste_items         → quantity_kg GENERATED; MVP 1 liter = 1 kg
--   updated_at          → ONLY profiles, stores, vendors
-- =============================================================================

BEGIN;

-- ── Sequence: pickup_seq ──────────────────────────────────────────────────────
-- Global ascending sequence for the NNN suffix in pickups.id ('PU-YYMM-NNN').
-- Co-located here with pickups, not in 0001_extensions.sql.
-- MVP: does not reset per month. Per-month reset can be added in a future sprint
-- by replacing nextval() in fn_generate_pickup_id() with a MAX()+1 approach.
CREATE SEQUENCE IF NOT EXISTS pickup_seq START 1;

-- =============================================================================
-- 1. vendors
-- =============================================================================
-- Master list of waste-pickup vendors.
-- DL-05: is_active gates new pickup creation; does NOT cancel active pickups.
-- No FK dependencies.
-- =============================================================================
CREATE TABLE vendors (
    id         SERIAL      PRIMARY KEY,
    name       TEXT        NOT NULL,
    is_active  BOOLEAN     NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 2. stores
-- =============================================================================
-- Restaurant store locations.
-- DL-01: max_capacity is nullable until Manajer configures it.
-- DL-06: default_vendor_id is nullable until Manajer assigns a vendor.
--        FK → vendors(id) added in 0003_constraints.sql.
-- =============================================================================
CREATE TABLE stores (
    id                INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_name        TEXT        NOT NULL,
    city              TEXT        NOT NULL,
    max_capacity      NUMERIC(10,2),
    default_vendor_id INTEGER,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 3. profiles
-- =============================================================================
-- Application user profiles linked 1:1 to Supabase auth.users.
-- id is set by fn_handle_new_user trigger (0005_triggers.sql) to match
-- auth.users.id — do NOT use gen_random_uuid() here.
-- store_id is NULLABLE: vendor-role accounts are not tied to any store.
-- FK → auth.users(id) and stores(id) added in 0003_constraints.sql.
-- =============================================================================
CREATE TABLE profiles (
    id         UUID        PRIMARY KEY,
    store_id   INTEGER,
    role       TEXT        NOT NULL,
    full_name  TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 4. pickups
-- =============================================================================
-- Waste pickup requests and their full lifecycle.
-- id (TEXT 'PU-YYMM-NNN') is generated by fn_generate_pickup_id trigger
-- (0005_triggers.sql) using pickup_seq. Left empty on INSERT — trigger fills it.
-- vendor_name is a denormalized snapshot of vendors.name at creation time.
-- Soft delete only: use status = 'cancelled'. Hard DELETE is not permitted.
-- DL-03 partial UNIQUE enforced in 0003_constraints.sql.
-- FK → stores(id), vendors(id) added in 0003_constraints.sql.
-- =============================================================================
CREATE TABLE pickups (
    id           TEXT        PRIMARY KEY,
    store_id     INTEGER     NOT NULL,
    vendor_id    INTEGER     NOT NULL,
    vendor_name  TEXT        NOT NULL,
    estimasi_kg  NUMERIC(10,2) NOT NULL,
    status       TEXT        NOT NULL DEFAULT 'waiting',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 5. waste_items
-- =============================================================================
-- Individual waste entries recorded by Pegawai Utility (DL-07).
-- unit: GENERATED from waste_type — DL-02 (liquid → 'liter', else → 'kg').
-- quantity_kg: GENERATED — MVP assumes 1 liter = 1 kg; used by capacity calc.
--   Both GENERATED columns are STORED (persisted, not computed on read).
--   Do NOT include unit or quantity_kg in INSERT statements.
-- recorded_by is NULLABLE to allow system or trigger-based inserts.
-- FK → stores(id), profiles(id) added in 0003_constraints.sql.
-- =============================================================================
CREATE TABLE waste_items (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id    INTEGER       NOT NULL,
    waste_type  TEXT          NOT NULL,
    quantity    NUMERIC(10,3) NOT NULL,
    unit        TEXT          GENERATED ALWAYS AS (
                    CASE WHEN waste_type = 'liquid' THEN 'liter' ELSE 'kg' END
                ) STORED,
    quantity_kg NUMERIC(10,3) GENERATED ALWAYS AS (quantity) STORED,
    recorded_by UUID,
    notes       TEXT,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- =============================================================================
-- 6. capacity_snapshots
-- =============================================================================
-- Point-in-time snapshots of store capacity.
-- max_kg: copy of stores.max_capacity at snapshot time (historical immutability).
--         NOTE: capacityService.ts currently reads column 'max_capacity' — must
--               be updated to 'max_kg' after this migration runs (B2 followup).
-- pct_used: GENERATED — ROUND(current_kg / NULLIF(max_kg, 0) * 100, 2).
-- status: GENERATED — DL-04 thresholds:
--           'kritis'          when pct_used >= 90
--           'perlu-perhatian' when pct_used >= 60
--           'normal'          otherwise
--   Both GENERATED columns are STORED. Do NOT include them in INSERT statements.
--   Note: status cannot reference pct_used (PostgreSQL forbids generated-to-
--         generated references), so the threshold formula is repeated inline.
-- source: records what initiated the snapshot (manual entry, auto, post-pickup).
--         CHECK constraint added in 0003_constraints.sql.
-- FK → stores(id) added in 0003_constraints.sql.
-- =============================================================================
CREATE TABLE capacity_snapshots (
    id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id   INTEGER       NOT NULL,
    current_kg NUMERIC(10,2) NOT NULL,
    max_kg     NUMERIC(10,2) NOT NULL,
    pct_used   NUMERIC(5,2)  GENERATED ALWAYS AS (
                   ROUND(current_kg / NULLIF(max_kg, 0) * 100, 2)
               ) STORED,
    status     TEXT          GENERATED ALWAYS AS (
                   CASE
                       WHEN (current_kg / NULLIF(max_kg, 0) * 100) >= 90
                           THEN 'kritis'
                       WHEN (current_kg / NULLIF(max_kg, 0) * 100) >= 60
                           THEN 'perlu-perhatian'
                       ELSE 'normal'
                   END
               ) STORED,
    source     TEXT          NOT NULL DEFAULT 'manual',
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- =============================================================================
-- 7. notifications
-- =============================================================================
-- System-wide notifications polled every 30 seconds by the client (DL-04).
-- type: categorises the notification ('capacity_alert', 'pickup_status', 'system').
--       CHECK constraint added in 0003_constraints.sql.
-- severity: optional urgency level ('info', 'warning', 'critical').
--           CHECK constraint added in 0003_constraints.sql.
-- metadata: JSONB for type-specific payload
--           (e.g. { "pickup_id": "PU-2406-001" } or { "pct": 91, "snapshot_id": "..." }).
-- is_read / read_by / read_at: mark-as-read support.
-- FK → stores(id), profiles(id) added in 0003_constraints.sql.
-- =============================================================================
CREATE TABLE notifications (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id   INTEGER     NOT NULL,
    type       TEXT        NOT NULL,
    title      TEXT        NOT NULL,
    body       TEXT        NOT NULL,
    severity   TEXT,
    metadata   JSONB,
    is_read    BOOLEAN     NOT NULL DEFAULT false,
    read_by    UUID,
    read_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 8. capacity_alerts
-- =============================================================================
-- Alert records created when a capacity snapshot crosses a threshold.
-- Populated by fn_create_capacity_alert trigger (0005_triggers.sql).
-- snapshot_id: nullable FK → capacity_snapshots(id); links alert to its source.
--              FK added in 0003_constraints.sql.
-- pct: the pct_used value at the moment the alert was generated.
-- FK → stores(id) added in 0003_constraints.sql.
-- =============================================================================
CREATE TABLE capacity_alerts (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id    INTEGER       NOT NULL,
    snapshot_id UUID,
    status      TEXT          NOT NULL,
    pct         NUMERIC(5,2)  NOT NULL,
    description TEXT          NOT NULL,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

COMMIT;
