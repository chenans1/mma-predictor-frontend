// src/pages/EventPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import styles from "./eventPage.module.css";

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
      <div className={styles.skeletonWrap}>
        <div className={styles.skeleton} style={{ width: 180, height: 24 }} />
        <div className={styles.skeleton} style={{ width: "100%", height: 96 }} />
        <div className={styles.skeleton} style={{ width: "100%", height: 96 }} />
      </div>
    );
  }

  if (err) {
    return <div className={styles.error}>Failed to load event: {err}</div>;
  }

  if (!eventInfo) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>Event not found</div>
        <Link className={styles.backLink} to="/">← Back to events</Link>
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
    <div className={styles.page}>
      <div className={styles.header}>
        <Link className={styles.backLink} to="/">← Back to events</Link>
        <h1 className={styles.title}>{eventInfo.event_name}</h1>
        <div className={styles.date}>{dateStr}</div>
      </div>

      <div className={styles.list}>
        {bouts.map((b) => {
          const p1 = b.fighter1_win_odds ?? null;
          const p2 = b.fighter2_win_odds ?? (p1 != null ? 1 - p1 : null);

          return (
            <div
              key={`${b.event_id}-${b.fighter1}-${b.fighter2}`}
              className={styles.card}
            >
              <div className={styles.meta}>
                Bout {b.bout_order}
                {b.weight_class ? ` • ${b.weight_class}` : ""}
              </div>

              <div className={styles.fightLine}>
                <span className={styles.fighterName}>
                  {b.fighter1}{" "}
                  {p1 != null && (
                    <span className={styles.percent}>
                      ({(p1 * 100).toFixed(1)}%)
                    </span>
                  )}
                </span>

                <span className={styles.vs}>vs</span>

                <span className={styles.fighterName}>
                  {b.fighter2}{" "}
                  {p2 != null && (
                    <span className={styles.percent}>
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
        <div className={styles.empty}>No predicted bouts available yet.</div>
      )}
    </div>
  );
}
