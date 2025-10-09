// pages/Home.jsx
import React from "react";
import UpcomingEventsList from "../components/upcomingEvents";

export default function Home() {
  return (
    <div className="p-6">
      <UpcomingEventsList />
    </div>
  );
}