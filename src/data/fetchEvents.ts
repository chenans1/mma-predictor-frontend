import { supabase } from "../lib/supabaseClient";

export type UpcomingEvent = {
  event_id: string;
  event_name: string;
  event_date: string;
};

export async function fetchUpcomingEvents(signal: AbortSignal) {
    const { data, error } = await supabase
        .from("upcoming_events_unique")
        .select("*")
        .order("event_date", { ascending: true })
        .limit(200)
        .abortSignal(signal);
    if (error) throw error;
    return data ?? [];
}