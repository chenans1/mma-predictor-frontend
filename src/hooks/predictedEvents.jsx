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
        .from('predicted_events_public') 
        .select('*')
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
