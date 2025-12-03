import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPastEvents, type PastEvent } from "../data/fetchUniquePastEvents";

export default function PastFightsPage() {
  const [rows, setRows] = useState<PastEvent[]>([]);
  const [status, setStatus] = useState<"idle"|"loading"|"error"|"ready">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let done = false;

    (async () => {
      setStatus("loading");
      setError(null);
      try {
        const data = await fetchPastEvents(controller.signal);
        if (controller.signal.aborted || done) return;
        setRows(data);
        setStatus("ready");
      } catch (err: any) {
        if (err?.name === "AbortError" || /aborted/i.test(err?.message ?? "")) return;
        if (done) return;
        setError(err?.message ?? "Failed to load events");
        setStatus("error");
      }
    })();

    return () => {
      done = true;
      controller.abort();
    };
  }, []);
  if (status === "loading") return <p>Loading past events...</p>;
  if (status === "error") return <p style={{ color: "crimson" }}>{error}</p>;

  return (
  // <h2>Past Fights & Performance</h2>
  <section>
    <h2>Past Fight Predictions: </h2>
    {rows.length === 0 ? (
      <p>Error: No Past Fight Predictions Found. </p>
    ) : (
      <ul style = {{listStyle: "none", padding: 0, margin: "1rem 0"}}>
        {rows.map((e) => (
          <li key={e.event_id}>
            <Link to={`/past_events/${encodeURIComponent(e.event_id)}`} style={{ textDecoration: "none" }} state = {{ event_name: e.event_name }}>
              <div style={{ fontWeight: 600 }}>{e.event_name}</div>
              <div style={{ opacity: 0.8 }}>{e.event_date}</div>
            </Link>
          </li>
        ))}
      </ul>
    )}
  </section>
  );
}
