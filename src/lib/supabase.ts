/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="vite/client" />

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://eyulnlvvtvnjbptlsusr.supabase.co').trim();
const supabaseUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dWxubHZ2dHZuamJwdGxzdXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzkwNjcsImV4cCI6MjA5NTMxNTA2N30.Yg6R6Gr3bfxDfkEMAuwimyl9NgCnTvalcT01tvzz8Sw').trim();
const supabaseAnonKey = rawKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL og Anon Key mangler. Vennligst sjekk konfigurasjonen i .env.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabase(): SupabaseClient {
  return supabase;
}

// Retained for backward-compat (no longer needs a clerkToken parameter)
export function getAuthenticatedSupabase(_clerkToken?: string): SupabaseClient {
  return supabase;
}

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'amjmah87@gmail.com';
