import { supabase } from "../lib/supabaseClient";

export type PredictedFight = {
    event_id: string;
    fight_id: string;
    event_date: string;
    event_name: string;
    weight_class: string;

    fighter1: string;
    fighter1_id: string;
    fighter1_win_odds: number;

    fighter2: string;
    fighter2_id: string;
    fighter2_win_odds: number;
}

//fetch predicted fights by event_id in predicted_events_public.
export async function fetchPredictionsByEvent(
    eventId: string,
    signal?: AbortSignal
): Promise<PredictedFight[]> {
    let query = supabase
        .from("predicted_events_public")
        .select("*")
        .eq("event_id", eventId)
        .order("bout_order", { ascending: true });

    if (signal) query = query.abortSignal(signal);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as PredictedFight[];
}