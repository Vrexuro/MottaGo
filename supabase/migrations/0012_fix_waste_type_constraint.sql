-- =============================================================================
-- Migration 0012 — Fix waste_items.waste_type Taxonomy (KI-01)
-- =============================================================================
-- Sprint C Mini Sprint | MottaGo
-- =============================================================================
-- Problem : chk_waste_items_waste_type enforces English taxonomy
--           ('organic', 'liquid', 'recyclable', 'non-recyclable')
--           while the rest of the system uses Indonesian taxonomy
--           ('organik', 'anorganik', 'minyak') per K-01 decision.
--
-- Impact  : wasteService.insertWasteItem() fails at runtime with
--           Postgres error 23514 (check_violation).
--
-- Changes :
--   1. DROP old CHECK constraint
--   2. UPDATE seed data (English → Indonesian taxonomy)
--      Mapping:
--        'organic'        → 'organik'    (direct equivalent)
--        'liquid'         → 'minyak'     (liquid waste = minyak/oil)
--        'recyclable'     → 'anorganik'  (4→3 category consolidation)
--        'non-recyclable' → 'anorganik'  (4→3 category consolidation)
--   3. DROP COLUMN unit (GENERATED expr uses old 'liquid' keyword)
--   4. ADD COLUMN unit with corrected expression (uses 'minyak')
--   5. ADD new CHECK constraint with Indonesian taxonomy
--
-- Note on column ordering:
--   unit column is re-added at the end of the table definition.
--   This is safe — no service code uses SELECT * (verified against
--   src/services/wasteService.ts — all queries use explicit column lists).
--
-- Note on seed data:
--   This migration targets development seed data only.
--   The 4→3 category consolidation is intentional and acceptable
--   for development. New production inserts will use the 3-category
--   Indonesian taxonomy directly.
--
-- Rollback:
--   Migration is wrapped in a single transaction.
--   Any failure auto-rolls back the entire migration.
--   Manual rollback SQL is documented in SprintC_Migration0012_ClaudeCode.md
--   (Phase 1.2), preserved here for reference only — not executed.
-- =============================================================================
-- Dependencies : 0011_username_auth.sql (all prior migrations applied)
-- =============================================================================

BEGIN;

-- ── Step 1: Drop old CHECK constraint ────────────────────────────────────────
-- Must happen first — constraint would block Step 2 UPDATEs.
ALTER TABLE waste_items DROP CONSTRAINT chk_waste_items_waste_type;

-- ── Step 2: Migrate seed data taxonomy (English → Indonesian) ────────────────
-- 4 rows in waste_items from 0006_seed.sql.
-- NB: unit GENERATED column recomputes on each UPDATE, but the old expression
-- still uses 'liquid', so the 'minyak' row temporarily gets unit = 'kg'.
-- This transient state is corrected by Step 3–4 (drop + re-add column).
UPDATE waste_items SET waste_type = 'organik'   WHERE waste_type = 'organic';
UPDATE waste_items SET waste_type = 'minyak'    WHERE waste_type = 'liquid';
UPDATE waste_items SET waste_type = 'anorganik' WHERE waste_type IN ('recyclable', 'non-recyclable');

-- ── Step 3: Drop unit GENERATED column ───────────────────────────────────────
-- PostgreSQL does not support altering a GENERATED column's expression in place.
-- The expression CASE WHEN waste_type = 'liquid' THEN 'liter' ELSE 'kg' END
-- must be replaced with   CASE WHEN waste_type = 'minyak' THEN 'liter' ELSE 'kg' END
ALTER TABLE waste_items DROP COLUMN unit;

-- ── Step 4: Re-add unit GENERATED column with corrected expression ────────────
-- waste_type values are now Indonesian (Step 2), so the new expression
-- computes correctly for all existing rows on ADD COLUMN.
ALTER TABLE waste_items
    ADD COLUMN unit TEXT GENERATED ALWAYS AS (
        CASE WHEN waste_type = 'minyak' THEN 'liter' ELSE 'kg' END
    ) STORED;

-- ── Step 5: Add new CHECK constraint ─────────────────────────────────────────
-- Indonesian taxonomy — matches WasteType frontend type after Batch 1 fix.
ALTER TABLE waste_items
    ADD CONSTRAINT chk_waste_items_waste_type
    CHECK (waste_type IN ('organik', 'anorganik', 'minyak'));

COMMIT;
