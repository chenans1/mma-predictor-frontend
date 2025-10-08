import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !anon) {
  throw new Error('Missing VITE_SUPABASE_* envs');
}

export const supabase = createClient(url, anon, {
  db: { schema: 'mma' },
  auth: { persistSession: false },
});
export default supabase;