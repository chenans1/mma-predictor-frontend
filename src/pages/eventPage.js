// src/pages/EventPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const styles = {
  page: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    color: "#e6e6e6",
    backgroundColor: "transparent",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  backLink: {
    color: "#8ab4f8",
    textDecoration: "none",
    fontSize: "14px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    lineHeight: 1.25,
  },
  date: {
    fontWeight: 700,
    color: "#d4d4d4",
    marginTop: "2px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px", // spacing between bouts
  },
  card: {
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    background: "#0f0f10",
    padding: "16px",
  },
  meta: {
    fontSize: "12px",
    color: "#9aa0a6",
    marginBottom: "8px",
  },
  fightLine: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#e6e6e6",
  },
  fighterName: {
    color: "#e6e6e6",
    fontWeight: 600,
  },
  percent: {
    fontWeight: 800,
    color: "#8ab4f8",
  },
  vs: {
    margin: "0 10px",
    color: "#9aa0a6",
    fontWeight: 500,
  },
  error: {
    border: "1px solid rgba(244, 67, 54, 0.4)",
    background: "rgba(244, 67, 54, 0.15)",
    color: "#ffb4a9",
    borderRadius: "14px",
    padding: "16px",
  },
  empty: {
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    padding: "16px",
    color: "#cfcfcf",
  },
  skeletonWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "24px",
  },
  skeleton: (w, h) => ({
    width: w,
    height: h,
    borderRadius: "10px",
    background: "#1c1c1e",
  }),
};

export default function EventPage() {
  const { event_id } = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const [bouts, setBouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr(null);

      const { data: evRows, error: evError } = await supabase
        .from("upcoming_events_unique")
        .select("*")
        .eq("event_id", event_id)
        .limit(1);

      if (cancelled) return;
      if (evError) {
        setErr(evError.message);
        setLoading(false);
        return;
      }
      const ev = (evRows && evRows[0]) || null;
      setEventInfo(ev);

      const { data: fights, error: fErr } = await supabase
        .from("predicted_events_public")
        .select("*")
        .eq("event_id", event_id);

      if (cancelled) return;
      if (fErr) {
        setErr(fErr.message);
        setLoading(false);
        return;
      }

      setBouts(fights || []);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [event_id]);

  if (loading) {
    return (
      <div style={styles.skeletonWrap}>
        <div style={styles.skeleton("180px", "24px")} />
        <div style={styles.skeleton("100%", "96px")} />
        <div style={styles.skeleton("100%", "96px")} />
      </div>
    );
  }

  if (err) {
    return <div style={styles.error}>Failed to load event: {err}</div>;
  }

  if (!eventInfo) {
    return (
      <div style={styles.page}>
        <div className="mb-3" style={{ fontSize: "20px", fontWeight: 600 }}>
          Event not found
        </div>
        <Link style={styles.backLink} to="/">
          ← Back to events
        </Link>
      </div>
    );
  }

  const dateStr = new Date(eventInfo.event_date).toLocaleDateString("en-CA", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link style={styles.backLink} to="/">
          ← Back to events
        </Link>
        <h1 style={styles.title}>{eventInfo.event_name}</h1>
        <div style={styles.date}>{dateStr}</div>
      </div>

      <div style={styles.list}>
        {bouts.map((b) => {
          const p1 = b.fighter1_win_odds ?? null;
          const p2 = b.fighter2_win_odds ?? (p1 != null ? 1 - p1 : null);

          return (
            <div
              key={`${b.event_id}-${b.fighter1}-${b.fighter2}`}
              style={styles.card}
            >
              <div style={styles.meta}>
                Bout {b.bout_order}
                {b.weight_class ? ` • ${b.weight_class}` : ""}
              </div>

              <div style={styles.fightLine}>
                <span style={styles.fighterName}>
                  {b.fighter1}{" "}
                  {p1 != null && (
                    <span style={styles.percent}>
                      ({(p1 * 100).toFixed(1)}%)
                    </span>
                  )}
                </span>

                <span style={styles.vs}>vs</span>

                <span style={styles.fighterName}>
                  {b.fighter2}{" "}
                  {p2 != null && (
                    <span style={styles.percent}>
                      ({(p2 * 100).toFixed(1)}%)
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {!bouts.length && (
        <div style={styles.empty}>No predicted bouts available yet.</div>
      )}
    </div>
  );
}
