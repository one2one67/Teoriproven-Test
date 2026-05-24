export interface UserAccess {
  id: string;
  user_id: string;
  plan_days: number;
  activated_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface AccessCode {
  id: string;
  code: string;
  plan_days: number;
  is_used: boolean;
  created_at: string;
  created_by: string;
  redeemed_at?: string;
  redeemed_by?: string;
}
