-- ============================================================
-- 0011_username_auth.sql — Username Authentication
-- MottaGo | Sprint A — Batch A1
-- ============================================================
-- Context: Login uses a username-based flow. The client transforms
--          the entered username to "username@mottago.internal" before
--          calling Supabase Auth signInWithPassword. This migration
--          adds the username column to profiles and replaces the
--          fn_handle_new_user trigger to include username on insert.
-- ============================================================

BEGIN;

-- ── 1. Add username column ───────────────────────────────────
-- NOT NULL enforced by DEFAULT ''; the UPDATE below fills real values
-- before the DEFAULT is dropped and the UNIQUE constraint is added.
ALTER TABLE profiles ADD COLUMN username TEXT NOT NULL DEFAULT '';

-- ── 2. Derive usernames from existing full_name values ───────
-- Transformation: lowercase, spaces → underscores, strip non-alphanumeric
-- (except underscore and hyphen). Matches the derivation formula used
-- by 0006_seed.sql (Budi Santoso → budi_santoso, etc.).
-- WHERE username = '' targets only seed rows — future rows inserted by
-- fn_handle_new_user already carry a username from raw_user_meta_data.
UPDATE profiles
    SET username = REGEXP_REPLACE(
        REGEXP_REPLACE(LOWER(full_name), '\s+', '_', 'g'),
        '[^a-z0-9_\-]', '', 'g'
    )
    WHERE username = '';

-- ── 3. Harden the column ─────────────────────────────────────
ALTER TABLE profiles ALTER COLUMN username DROP DEFAULT;
ALTER TABLE profiles ADD CONSTRAINT uq_profiles_username UNIQUE (username);
CREATE INDEX idx_profiles_username ON profiles (username);

-- ── 4. Replace fn_handle_new_user to include username ────────
-- Replaces the version defined in 0005_triggers.sql.
-- New behavior: reads 'username' key from raw_user_meta_data; falls back
-- to the part before '@' in the Supabase email (which is the username
-- itself when the client sends "username@mottago.internal").
-- Fail-Fast: role tidak memiliki default — jika Edge Function tidak
-- menyertakan 'role' dalam metadata, INSERT gagal dengan NOT NULL violation.
-- Ini disengaja agar bug di Edge Function terdeteksi segera.
CREATE OR REPLACE FUNCTION fn_handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (id, store_id, role, full_name, username)
    VALUES (
        NEW.id,
        NULLIF(NEW.raw_user_meta_data ->> 'store_id', '')::INTEGER,
        NEW.raw_user_meta_data ->> 'role',           -- Fail-Fast: NULL role → NOT NULL violation
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        COALESCE(
            NULLIF(NEW.raw_user_meta_data ->> 'username', ''),
            SPLIT_PART(NEW.email, '@', 1)
        )
    );
    RETURN NEW;
END;
$$;

COMMIT;

-- ============================================================
-- LOGIN FLOW NOTE (for frontend — not enforced by the DB):
-- Client sends: signInWithPassword({ email: username + '@mottago.internal', ... })
-- Supabase stores real email as "username@mottago.internal" in auth.users.
-- fn_handle_new_user extracts the username via SPLIT_PART(email, '@', 1)
-- if not supplied explicitly in raw_user_meta_data.
-- ============================================================
