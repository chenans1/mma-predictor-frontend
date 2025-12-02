import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {fetchPredictionsByEvent, type PredictedFight} from "../data/fetchPredictions";

export default function ResultsPage() {
    const { event_id } = useParams<{ event_id: string }>();
    const [rows, setRows] = useState<PredictedFight[]>([]);
    const [status, setStatus] = useState<"idle"|"loading"|"error"|"ready">("idle");
    const [error, setError] = useState<string | null>(null);

    // use the current page location as a var
    const location = useLocation();
    const event_name = (location.state as { event_name?: string })?.event_name;

    useEffect(() => {
        const controller = new AbortController();
        let done = false;
        if (!event_id) return;
        (async () => {
            setStatus("loading");
            setError(null);
            try {
                const data = await fetchPredictionsByEvent(event_id, controller.signal);
                setRows(data);
                setStatus("ready");
            } catch (err: any) {
                if (err?.name === "AbortError" || /aborted/i.test(err?.message ?? "")) return;
                if (done) return;
                setError(err?.message ?? "Failed to load model results");
                setStatus("error");
            }
        })();

        return()=> {
            done=true;
            controller.abort();
        };
    }, [event_id]);

    if (!event_id) return <p>Invalid event id.</p>;
    if (status === "loading") return <p>Loading Results...</p>;
    if (status === "error") return <p style={{ color: "crimson" }}>{error}</p>;

    return (
        <section>
            <Link to="/past" style={{ display: "inline-block", marginBottom: "1rem" }}>← Back</Link>
            <h2>{event_name}Results Compared to Model</h2>
        </section>
    )
}