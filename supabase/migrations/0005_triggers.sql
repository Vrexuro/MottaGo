-- =============================================================================
-- Migration 0005 — Trigger Functions & Triggers
-- =============================================================================
-- Dependencies : 0002_tables.sql        (all tables and pickup_seq must exist)
--                0003_constraints.sql   (constraints in place before triggers fire)
--                0004_indexes.sql       (indexes in place for trigger queries)
-- Creates      : 4 functions + 6 triggers
-- =============================================================================
-- Function inventory:
--
--   fn_set_updated_at()          BEFORE UPDATE  → profiles, stores, vendors
--   fn_generate_pickup_id()      BEFORE INSERT  → pickups
--   fn_create_capacity_alert()   AFTER  INSERT  → capacity_snapshots
--   fn_handle_new_user()         AFTER  INSERT  → auth.users  (SECURITY DEFINER)
--
-- Trigger inventory:
--
--   trg_profiles_updated_at      BEFORE UPDATE ON profiles
--   trg_stores_updated_at        BEFORE UPDATE ON stores
--   trg_vendors_updated_at       BEFORE UPDATE ON vendors
--   trg_pickups_generate_id      BEFORE INSERT ON pickups
--   trg_capacity_snapshots_alert AFTER  INSERT ON capacity_snapshots
--   trg_auth_users_new_profile   AFTER  INSERT ON auth.users
-- =============================================================================

BEGIN;

-- =============================================================================
-- FUNCTION 1 — fn_set_updated_at
-- =============================================================================
-- Purpose  : Stamp the updated_at column with the current timestamp on every
--            UPDATE, so the application always has an accurate "last modified"
--            time without the caller needing to supply it.
-- Consumer : trg_profiles_updated_at
--            trg_stores_updated_at
--            trg_vendors_updated_at
-- Note     : updated_at is intentionally NOT added to pickups, waste_items,
--            capacity_snapshots, capacity_alerts, or notifications
--            (B2.1 governance decision — immutable event records).
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

-- Bind to every table that carries an updated_at column.
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

-- =============================================================================
-- FUNCTION 2 — fn_generate_pickup_id
-- =============================================================================
-- Purpose  : Generate a human-readable pickup ID in the format 'PU-YYMM-NNN'
--            before the row is inserted, so the caller never needs to supply it.
--            Format breakdown:
--              PU   — fixed prefix
--              YYMM — 2-digit year + 2-digit month from now() (e.g. '2606' = Jun 2026)
--              NNN  — zero-padded 3-digit sequence from pickup_seq
--            Example output: 'PU-2606-001', 'PU-2606-002', …
-- Consumer : trg_pickups_generate_id
-- Decision : DL-03 (one active pickup per store) — the partial UNIQUE index
--            on (store_id) WHERE status IN ('waiting','in-transit') blocks a
--            second INSERT for the same active store, so the sequence slot is
--            only consumed for pickup attempts that pass the constraint.
-- Note     : pickup_seq is a global ascending sequence (created in 0002_tables.sql).
--            MVP: the sequence does NOT reset per month. If per-month numbering
--            is required in a future sprint, replace nextval() with a MAX()+1
--            approach scoped to the current YYMM.
--            If NEW.id is already set (e.g. in test fixtures), this is a no-op.
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_generate_pickup_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        NEW.id := 'PU-'
            || TO_CHAR(now(), 'YYMM')
            || '-'
            || LPAD(nextval('pickup_seq')::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_pickups_generate_id
    BEFORE INSERT ON pickups
    FOR EACH ROW
    EXECUTE FUNCTION fn_generate_pickup_id();

-- =============================================================================
-- FUNCTION 3 — fn_create_capacity_alert
-- =============================================================================
-- Purpose  : After a new capacity snapshot is recorded, automatically create a
--            capacity_alerts row and a corresponding notifications row whenever
--            the snapshot status is non-normal (pct_used >= 60%).
--
--            DL-04 thresholds (same as the GENERATED status column in 0002):
--              'kritis'          — pct_used >= 90%
--              'perlu-perhatian' — pct_used >= 60%
--              'normal'          — pct_used  < 60%  (no alert created)
--
-- Consumer : trg_capacity_snapshots_alert
-- Decision : DL-04 — Notifications use a NOTIFICATION table with 30-second
--            polling. This trigger is the write-side that produces those rows.
-- Note     : NEW.pct_used and NEW.status are GENERATED ALWAYS AS STORED columns.
--            AFTER INSERT triggers receive the fully computed row in NEW, so
--            both values are available and accurate here.
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_create_capacity_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_description TEXT;
    v_title       TEXT;
    v_severity    TEXT;
BEGIN
    -- Skip when capacity is within the normal range.
    IF NEW.status = 'normal' THEN
        RETURN NEW;
    END IF;

    -- Build alert strings from the computed status.
    IF NEW.status = 'kritis' THEN
        v_title       := 'Kapasitas Kritis';
        v_description := 'Kapasitas melewati batas kritis (' || NEW.pct_used || '%).';
        v_severity    := 'critical';
    ELSE
        -- 'perlu-perhatian'
        v_title       := 'Kapasitas Perlu Perhatian';
        v_description := 'Kapasitas melewati batas perhatian (' || NEW.pct_used || '%).';
        v_severity    := 'warning';
    END IF;

    -- Record the operational alert (queried by capacityService.getCapacityAlertHistory).
    INSERT INTO capacity_alerts (store_id, snapshot_id, status, pct, description)
    VALUES (
        NEW.store_id,
        NEW.id,
        NEW.status,
        NEW.pct_used,
        v_description
    );

    -- Produce a notification row for the 30-second client poll (DL-04).
    INSERT INTO notifications (store_id, type, title, body, severity, metadata)
    VALUES (
        NEW.store_id,
        'capacity_alert',
        v_title,
        v_description,
        v_severity,
        jsonb_build_object(
            'status',      NEW.status,
            'pct',         NEW.pct_used,
            'snapshot_id', NEW.id
        )
    );

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_capacity_snapshots_alert
    AFTER INSERT ON capacity_snapshots
    FOR EACH ROW
    EXECUTE FUNCTION fn_create_capacity_alert();

-- =============================================================================
-- FUNCTION 4 — fn_handle_new_user
-- =============================================================================
-- Purpose  : Mirror every new Supabase auth.users row into the public.profiles
--            table, seeding role and store_id from the user's raw_user_meta_data.
--            This is the standard Supabase pattern for extending auth users
--            with application-level attributes.
--
--            Expected raw_user_meta_data keys (set at user creation time):
--              role      — one of 'pelayan' | 'utility' | 'manajer' | 'vendor'
--              store_id  — integer store PK (omit or leave empty for vendor role)
--              full_name — display name; falls back to email if missing
--
-- Consumer : trg_auth_users_new_profile
-- Decision : DL-05 (vendor accounts have no store_id → profiles.store_id NULLABLE)
-- Security : SECURITY DEFINER so the function runs with its owner's privileges
--            (necessary to INSERT into public.profiles from the auth schema context).
--            SET search_path = public prevents search_path injection.
-- Note     : NULLIF(store_id_string, '') casts '' and NULL both to NULL,
--            so vendor accounts that omit store_id get a clean NULL value.
--            The chk_profiles_store_id_role CHECK (0003) then validates that
--            non-vendor roles always have a store_id.
-- =============================================================================
CREATE OR REPLACE FUNCTION fn_handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (id, store_id, role, full_name)
    VALUES (
        NEW.id,
        NULLIF(NEW.raw_user_meta_data ->> 'store_id', '')::INTEGER,
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'pelayan'),
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auth_users_new_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION fn_handle_new_user();

COMMIT;
