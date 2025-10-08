import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function usePredictedEvents() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
    const { data, error } = await supabase
        .from('predicted_events') 
        .select('event_id,event_name, fighter1,fighter2,fighter1_win_odds,fighter2_win_odds,event_date,weight_class')
        .order('event_date', { ascending: true })
        .limit(500);

    if (!isMounted) return;
    if (error) setError(error.message);
    else setData(data || []);
    setLoading(false);
    })();
    return () => { isMounted = false; };
    }, []);

    return {data, error, loading};
}
