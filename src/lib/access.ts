import { getSupabase } from './supabase';

// Checks if the user has an active, valid access pass
// Supports both legacy access_codes table and new user_redemptions table
export async function checkUserAccess(userId: string): Promise<Date | null> {
  const supabase = getSupabase();
  let maxExpiration: Date | null = null;

  // 1. Check legacy single-use codes (backward compatibility)
  const { data: legacyData, error: legacyErr } = await supabase
    .from('access_codes')
    .select('expires_at')
    .eq('redeemed_by', userId)
    .eq('is_used', true)
    .gte('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false })
    .limit(1);

  if (!legacyErr && legacyData && legacyData.length > 0 && legacyData[0].expires_at) {
    maxExpiration = new Date(legacyData[0].expires_at);
  }

  // 2. Check new user_redemptions table
  const { data: newRedemptions, error: newErr } = await supabase
    .from('user_redemptions')
    .select('access_granted_until')
    .eq('user_id', userId)
    .gte('access_granted_until', new Date().toISOString())
    .order('access_granted_until', { ascending: false })
    .limit(1);

  if (!newErr && newRedemptions && newRedemptions.length > 0 && newRedemptions[0].access_granted_until) {
    const newExp = new Date(newRedemptions[0].access_granted_until);
    if (!maxExpiration || newExp > maxExpiration) {
      maxExpiration = newExp;
    }
  }

  return maxExpiration;
}

// Redeems a code for a user
export async function redeemAccessCode(userId: string, inputCode: string): Promise<Date> {
  const supabase = getSupabase();
  const codeStr = inputCode.trim().toUpperCase();

  // We call the secure RPC function instead of trusting the client to update tables
  const { data, error } = await supabase.rpc('redeem_access_code_secure', {
    p_code: codeStr,
    p_user_id: userId
  });

  if (error) {
    if (error.message.includes('invalid_code')) throw new Error('invalid_code');
    if (error.message.includes('already_used')) throw new Error('already_used');
    if (error.message.includes('code_expired')) throw new Error('code_expired');
    throw new Error('activation_failed');
  }

  if (data && data.success && data.expires_at) {
    return new Date(data.expires_at);
  }

  throw new Error('activation_failed');
}
