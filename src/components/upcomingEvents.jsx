// src/components/UpcomingEventsList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import styles from "./upcomingEvents.module.css";

function EventCard({ evt }) {
  const date = new Date(evt.event_date);
  const dateStr = date.toLocaleDateString("en-CA", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      to={`/events/${encodeURIComponent(evt.event_id)}`}
      className={styles.card}
    >
      <div className={styles.cardTop}>
        <div>
          <div className={styles.cardDate}>{dateStr}</div>
          <div className={styles.cardName}>{evt.event_name}</div>
        </div>
        <div className={styles.boutTag}>
          {evt.num_bouts} bout{evt.num_bouts === 1 ? "" : "s"}
        </div>
      </div>
    </Link>
  );
}

export default function UpcomingEventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from("upcoming_events_unique")
        .select("*")
        .order("event_date", { ascending: true });

      if (cancelled) return;

      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }

      setEvents(data || []);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingSkeleton}>
        <div className={styles.skeleton} style={{ width: 180, height: 24 }} />
        <div className={styles.skeleton} style={{ width: "100%", height: 80 }} />
        <div className={styles.skeleton} style={{ width: "100%", height: 80 }} />
        <div className={styles.skeleton} style={{ width: "100%", height: 80 }} />
      </div>
    );
  }

  if (err) {
    return <div className={styles.errorBox}>Failed to load upcoming events: {err}</div>;
  }

  if (!events.length) {
    return <div className={styles.emptyBox}>No upcoming events found.</div>;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Upcoming Events</h2>
      <div className={styles.grid}>
        {events.map((evt) => (
          <EventCard key={evt.event_id} evt={evt} />
        ))}
      </div>
    </section>
  );
}
