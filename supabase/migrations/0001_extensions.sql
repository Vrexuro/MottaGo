-- =============================================================================
-- Migration 0001 — Extensions
-- =============================================================================
-- Dependencies : none (must run first)
-- Enables      : pg_trgm    → vendor name ILIKE '%keyword%' search (idx_vendors_name_trgm)
--                uuid-ossp  → gen_random_uuid() for UUID primary keys
-- Note         : pickup_seq sequence is created in 0002_tables.sql
--                (co-located with the pickups table that owns it)
-- =============================================================================

BEGIN;

-- ── Extensions ────────────────────────────────────────────────────────────────
-- TODO: CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
-- TODO: CREATE EXTENSION IF NOT EXISTS "pg_trgm"   WITH SCHEMA extensions;

COMMIT;
