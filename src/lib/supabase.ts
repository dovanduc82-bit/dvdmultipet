import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grbruiekdgtuzbwovgnm.supabase.co';
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_CFpR9z9mNwR1dveJflYpEg_YKm7jeGx';

// Sanitize potential surrounding quotes and whitespace
const supabaseUrl = rawUrl.replace(/['"]/g, '').trim();
const supabaseAnonKey = rawKey.replace(/['"]/g, '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  (supabaseAnonKey.startsWith('ey') || supabaseAnonKey.startsWith('sb_') || supabaseAnonKey.length > 20)
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
