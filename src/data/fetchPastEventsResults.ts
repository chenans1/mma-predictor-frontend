import { supabase } from "../lib/supabaseClient";

export type PastEventResult = {
    fight_id: string;
    event_id: string;
    event_name: string;
    event_date: string;
    weight_class: string;
    fighter1: string;
    fighter2: string;
    outcome: string;
    method: string;
    fighter1_win_odds: number;
    fighter2_win_odds: number;
};

export async function fetchUpcomingEvents(signal: AbortSignal) {
    const { data, error } = await supabase
        .from("past_events_view_public")
        .select("*")
        .order("event_date", { ascending: true })
        // .limit(200)
        .abortSignal(signal);
    if (error) throw error;
    return data ?? [];
}