/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="vite/client" />

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://eyulnlvvtvnjbptlsusr.supabase.co').trim();
    const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dWxubHZ2dHZuamJwdGxzdXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzkwNjcsImV4cCI6MjA5NTMxNTA2N30.Yg6R6Gr3bfxDfkEMAuwimyl9NgCnTvalcT01tvzz8Sw').trim();

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase URL og Anon Key er påkrevd. Vennligst legg dem til i Secrets-panelet i AI Studio.'
      );
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export function getAuthenticatedSupabase(clerkToken: string): SupabaseClient {
  const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://eyulnlvvtvnjbptlsusr.supabase.co').trim();
  const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dWxubHZ2dHZuamJwdGxzdXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzkwNjcsImV4cCI6MjA5NTMxNTA2N30.Yg6R6Gr3bfxDfkEMAuwimyl9NgCnTvalcT01tvzz8Sw').trim();

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
}

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@teoriøving.no';
