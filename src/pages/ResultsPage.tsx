import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {fetchPastEventsResults, type PastEventResult} from "../data/fetchPastEventsResults";

const getResultIcon = (correct: boolean | null, actual_winner: string | null, method: string) => {
    if (correct === null) {
        return <div><b>No Contest</b></div>;
    }
    return (
        <>
            <div><b>Actual winner: {actual_winner} by {method}</b></div>
            <div>{correct ? "✔️" : "❌"}</div>
        </>
    );
};

export default function ResultsPage() {
    const { event_id } = useParams<{ event_id: string }>();
    const [rows, setRows] = useState<PastEventResult[]>([]);
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
                const data = await fetchPastEventsResults(event_id, controller.signal);
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

    const total = rows.length;
    const correct = rows.filter(f => f.model_correct).length;
    const event_accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : null;

    return (
        <section>
            <Link to="/past" style={{ display: "inline-block", marginBottom: "1rem" }}>← Back</Link>
            <h2>{event_name} Results Compared to Model</h2>
            {rows.length === 0 ? (
                <p>Model did not predict this event live (event was used in either testing, training or calibration dataset)</p>
            ) : (
                <>
                <h3>Model Accuracy for this event: {correct}/{total} ({event_accuracy}%)</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0" }}>
                    {rows.map((f) => {
                        const f1 = f.fighter1;
                        const f2 = f.fighter2;
                        const p1 = f.fighter1_win_odds;
                        const p2 = f.fighter2_win_odds;
                        const method = f.method;
                        const actual_winner = f.outcome;
                        const model_correct = f.model_correct;
                        return (
                            <li key={f.fight_id}>
                                <div style={{ marginBottom: "1rem" }}>
                                    {/* <div>Model Prediction: {f1} ({(p1 * 100).toFixed(1)}%) 
                                        vs {f2} ({(p2 * 100).toFixed(1)}%)</div> */}
                                    <div style={{ fontWeight: 700, fontSize: 18 }}>
                                        <span style = {{color: p1>=p2 ? "green" : "inherit"}}>
                                            {f1} ({(p1 * 100).toFixed(1)}%)
                                        </span>
                                        {" "}vs{" "}
                                        <span style={{ color: p2>p1 ? "green" : "inherit" }}>
                                            {f2} ({(p2 * 100).toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div>{getResultIcon(model_correct, actual_winner, method)}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                </>
            )}
        </section>
    )
}