import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {fetchPredictionsByEvent, type PredictedFight} from "../data/fetchPredictions";

export default function PredictionsPage() {
    const { event_id } = useParams<{ event_id: string }>();
    const [rows, setRows] = useState<PredictedFight[]>([]);
    const [status, setStatus] = useState<"idle"|"loading"|"error"|"ready">("idle");
    const [error, setError] = useState<string | null>(null);

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
                setError(err?.message ?? "Failed to load fights");
                setStatus("error");
            }
        })();

        return() => {
            done=true;
            controller.abort();
        };
    }, [event_id]);

    if (!event_id) return <p>Invalid event id.</p>;
    if (status === "loading") return <p>Loading Predictions...</p>;
    if (status === "error") return <p style={{ color: "crimson" }}>{error}</p>;

    return (
        <section>
            <Link to="/" style={{ display: "inline-block", marginBottom: "1rem" }}>← Back</Link>
            <h2>Event: {event_id}</h2>
            {rows.length === 0 ? (
                <p>No fights found</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0" }}>
                    {rows.map((f) => {
                        const f1 = f.fighter1;
                        const f2 = f.fighter2;
                        const p1 = f.fighter1_win_odds;
                        const p2 = f.fighter2_win_odds;

                        return (
                            <li key={f.fight_id}
                                style={{padding: "1rem", border: "1px solid #3334", borderRadius: 12, marginBottom: ".75rem",}}>
                                <div style={{ fontWeight: 700, fontSize: 18 }}>
                                    {f1} ({(p1*100).toFixed(1)}%) vs {f2} ({(p2*100).toFixed(1)}%)
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}