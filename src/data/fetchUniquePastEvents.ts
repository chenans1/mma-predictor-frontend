import { supabase } from "../lib/supabaseClient";

export type PastEvent = {
  event_id: string;
  event_name: string;
  event_date: string;
};

export async function fetchPastEvents(signal: AbortSignal) {
    const { data, error } = await supabase
        .from("past_events_results_view")
        .select("*")
        .order("event_date", { ascending: true })
        // .limit(200)
        .abortSignal(signal);
    if (error) throw error;
    return data ?? [];
}