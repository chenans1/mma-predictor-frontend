import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const styles = {
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#e6e6e6",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  card: {
    display: "block",
    textDecoration: "none",
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    background: "#0f0f10",
    padding: "16px",
    color: "#e6e6e6",
    transition: "background 0.15s ease",
  },
  cardHover: {
    background: "#1a1a1b",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },
  cardDate: {
    fontSize: "14px",
    color: "#9aa0a6",
  },
  cardName: {
    fontSize: "18px",
    fontWeight: 600,
    marginTop: "4px",
  },
  cardId: {
    fontSize: "12px",
    color: "#7a7a7a",
    marginTop: "2px",
  },
  boutTag: {
    background: "#1c1c1e",
    borderRadius: "10px",
    padding: "4px 10px",
    fontSize: "14px",
    color: "#e6e6e6",
    whiteSpace: "nowrap",
  },
  loadingSkeleton: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "20px",
  },
  skeleton: (w, h) => ({
    width: w,
    height: h,
    borderRadius: "10px",
    background: "#1c1c1e",
  }),
  errorBox: {
    border: "1px solid rgba(244, 67, 54, 0.4)",
    background: "rgba(244, 67, 54, 0.15)",
    color: "#ffb4a9",
    borderRadius: "14px",
    padding: "16px",
  },
  emptyBox: {
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    padding: "16px",
    color: "#cfcfcf",
  },
};

function EventCard({ evt }) {
  const [hover, setHover] = useState(false);
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
      style={{
        ...styles.card,
        ...(hover ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.cardTop}>
        <div>
          <div style={styles.cardDate}>{dateStr}</div>
          <div style={styles.cardName}>{evt.event_name}</div>
          {/* <div style={styles.cardId}>{evt.event_id}</div> */}
        </div>
        <div style={styles.boutTag}>
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
      <div style={styles.loadingSkeleton}>
        <div style={styles.skeleton("180px", "24px")} />
        <div style={styles.skeleton("100%", "80px")} />
        <div style={styles.skeleton("100%", "80px")} />
        <div style={styles.skeleton("100%", "80px")} />
      </div>
    );
  }

  if (err) {
    return <div style={styles.errorBox}>Failed to load upcoming events: {err}</div>;
  }

  if (!events.length) {
    return <div style={styles.emptyBox}>No upcoming events found.</div>;
  }

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Upcoming Events</h2>
      <div style={styles.grid}>
        {events.map((evt) => (
          <EventCard key={evt.event_id} evt={evt} />
        ))}
      </div>
    </section>
  );
}
