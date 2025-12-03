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
    model_correct: boolean;
};

export async function fetchPastEventsResults(
    eventId: string, signal: AbortSignal
    ) : Promise<PastEventResult[]> {
        
    let query = supabase
            .from("past_events_results_view")
            .select("*")
            .eq("event_id", eventId)
            // .order("bout_order", { ascending: true });
    
        if (signal) query = query.abortSignal(signal);
        
        const { data, error } = await query;
        if (error) throw error;
        return (data ?? []) as PastEventResult[];
}