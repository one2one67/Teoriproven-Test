-- 1. Create or ensure user_redemptions table for multi-use code tracking
CREATE TABLE IF NOT EXISTS user_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid, -- Optional reference to access_codes.id if it's a uuid
  code varchar(255) NOT NULL,
  user_id text NOT NULL,
  redeemed_at timestamptz DEFAULT now(),
  access_granted_until timestamptz NOT NULL,
  assigned_modules jsonb DEFAULT '[]'::jsonb
);

-- 2. Upgrade the access_codes table safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'access_codes' AND column_name = 'status') THEN
        ALTER TABLE access_codes ADD COLUMN status text DEFAULT 'active';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'access_codes' AND column_name = 'max_uses') THEN
        ALTER TABLE access_codes ADD COLUMN max_uses int DEFAULT 1;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'access_codes' AND column_name = 'used_count') THEN
        ALTER TABLE access_codes ADD COLUMN used_count int DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'access_codes' AND column_name = 'assigned_modules') THEN
        ALTER TABLE access_codes ADD COLUMN assigned_modules jsonb DEFAULT '[]'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'access_codes' AND column_name = 'internal_note') THEN
        ALTER TABLE access_codes ADD COLUMN internal_note text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'access_codes' AND column_name = 'code_expires_at') THEN
        ALTER TABLE access_codes ADD COLUMN code_expires_at timestamptz;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'access_codes' AND column_name = 'plan_hours') THEN
        ALTER TABLE access_codes ADD COLUMN plan_hours int DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'access_codes' AND column_name = 'created_by') THEN
        ALTER TABLE access_codes ADD COLUMN created_by text;
    END IF;
END $$;

-- 3. Backfill statuses based on the legacy 'is_used' flag
UPDATE access_codes SET 
  status = 'used', 
  used_count = 1 
WHERE is_used = true AND status = 'active';


-- RLS Setup (Row Level Security)

-- Enable RLS
ALTER TABLE user_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: These policies assume users connect via Supabase client with JWT containing user ID
-- For this client-side app, we allow the authenticated user to read their own redemptions
CREATE POLICY "Users can view own redemptions" ON user_redemptions
  FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt() ->> 'email' = user_id);

CREATE POLICY "Admin full access redemptions" ON user_redemptions
  FOR ALL USING (auth.jwt() ->> 'email' = 'amjmah87@gmail.com');

-- Code lookup by regular users is strictly limited to their already redeemed codes
CREATE POLICY "Users can view own access codes" ON access_codes
  FOR SELECT USING (redeemed_by = auth.uid()::text OR redeemed_by = auth.jwt() ->> 'email');

-- We DROP the permissive 'Anyone can lookup access codes' entirely.

-- NOTE: Admins will use a service role key or need an admin-specific RLS.
-- For simple setup in apps with no custom claims, we can add:
CREATE POLICY "Admin full access" ON access_codes
  FOR ALL USING (auth.jwt() ->> 'email' = 'amjmah87@gmail.com');

-- Now, for redemption by normal users, we provide a secure server-side RPC:
CREATE OR REPLACE FUNCTION redeem_access_code_secure(p_code text, p_user_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER -- executes with privileges of the function creator, bypassing RLS
SET search_path = public
AS $$
DECLARE
  v_code_row access_codes%ROWTYPE;
  v_is_legacy_used boolean;
  v_is_status_used boolean;
  v_over_use_limit boolean;
  v_days int;
  v_hours int;
  v_exp_date timestamptz;
  v_new_used_count int;
  v_new_status text;
  v_is_single_use_legacy boolean;
BEGIN
  -- 1. Find the code
  SELECT * INTO v_code_row
  FROM access_codes
  WHERE code = upper(trim(p_code));

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid_code';
  END IF;

  -- 2. Graceful pass if already redeemed by this exact user
  IF v_code_row.redeemed_by = p_user_id AND v_code_row.expires_at IS NOT NULL THEN
    IF v_code_row.expires_at > now() THEN
      RETURN jsonb_build_object('success', true, 'expires_at', v_code_row.expires_at, 'message', 'already_active');
    END IF;
  END IF;

  -- 3. New validations
  v_is_legacy_used := (v_code_row.is_used = true) AND v_code_row.redeemed_by != p_user_id;
  v_is_status_used := v_code_row.status IN ('used', 'revoked', 'expired');
  v_over_use_limit := v_code_row.max_uses IS NOT NULL AND v_code_row.used_count >= v_code_row.max_uses;

  IF v_is_legacy_used OR v_is_status_used OR v_over_use_limit THEN
    RAISE EXCEPTION 'already_used';
  END IF;

  IF v_code_row.code_expires_at IS NOT NULL AND v_code_row.code_expires_at < now() THEN
    RAISE EXCEPTION 'code_expired';
  END IF;

  -- 4. Calculate expiration
  v_days := COALESCE(v_code_row.plan_days, 0);
  v_hours := COALESCE(v_code_row.plan_hours, 0);
  
  IF v_days = 0 AND v_hours = 0 THEN
    IF p_code ILIKE 'T24-%' THEN v_hours := 24;
    ELSIF p_code ILIKE 'D3-%' THEN v_days := 3;
    ELSIF p_code ILIKE 'D7-%' THEN v_days := 7;
    END IF;
  END IF;

  v_exp_date := now() + make_interval(days := v_days, hours := v_hours);

  -- 5. Apply the redemption
  v_is_single_use_legacy := (v_code_row.max_uses IS NULL OR v_code_row.max_uses = 1);

  IF v_is_single_use_legacy THEN
    UPDATE access_codes
    SET is_used = true,
        status = 'used',
        used_count = 1,
        redeemed_by = p_user_id,
        expires_at = v_exp_date
    WHERE id = v_code_row.id;
  ELSE
    INSERT INTO user_redemptions (code, user_id, access_granted_until)
    VALUES (v_code_row.code, p_user_id, v_exp_date);

    v_new_used_count := COALESCE(v_code_row.used_count, 0) + 1;
    IF v_new_used_count >= v_code_row.max_uses THEN
      v_new_status := 'used';
    ELSE
      v_new_status := 'partially_used';
    END IF;

    UPDATE access_codes
    SET used_count = v_new_used_count,
        status = v_new_status,
        is_used = (v_new_status = 'used')
    WHERE id = v_code_row.id;
  END IF;

  RETURN jsonb_build_object('success', true, 'expires_at', v_exp_date);

END;
$$;
