import { createClient } from '@supabase/supabase-js';

// CRA only exposes REACT_APP_* at build time
const url  = process.env.REACT_APP_SUPABASE_URL;
const anon = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error('Missing REACT_APP_* envs');
}

export const supabase = (url && anon)
  ? createClient(url, anon, { db: { schema: 'public' }, auth: { persistSession: false } })
  : null;