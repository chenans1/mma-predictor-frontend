import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anon) {
    throw new Error(
        "[Supabase] Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY. " 
    );
}

export const supabase: SupabaseClient = createClient(url, anon, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
    },
    db: { schema: "public" },
});
