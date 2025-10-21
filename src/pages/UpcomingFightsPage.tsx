import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUpcomingEvents, type UpcomingEvent } from "../data/fetchEvents";

export default function UpcomingFightsPage() {
  const [rows, setRows] = useState<UpcomingEvent[]>([]);
  const [status, setStatus] = useState<"idle"|"loading"|"error"|"ready">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let done = false;

    (async () => {
      setStatus("loading");
      setError(null);
      try {
        const data = await fetchUpcomingEvents(controller.signal);
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

  if (status === "loading") return <p>Loading upcoming events…</p>;
  if (status === "error") return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <section>
      <h2>Upcoming Events: </h2>
        {rows.length === 0 ? (
          <p>No upcoming events were found.</p>
        ) : (
          <ul style = {{listStyle: "none", padding: 0, margin: "1rem 0"}}>
            {rows.map((e) => (
              <li key={e.event_id} style={{ padding: ".75rem 0", borderBottom: "1px solid #3334" }}>
                <Link to={`/events/${encodeURIComponent(e.event_id)}`} style={{ textDecoration: "none" }}>
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