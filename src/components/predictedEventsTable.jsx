import React from 'react';
import { usePredictedEvents } from '../hooks/predictedEvents';

export default function PredictedEventsTable() {
    const {data, error, loading} = usePredictedEvents();
    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <table>
            <thead>
                <tr>
                    <th>Event</th><th>Date</th><th>F1</th><th>F2</th><th>Fighter 1 Win Odds</th><th>Fighter 2 Win Odds</th>
                </tr>
            </thead>
            <tbody>
                {data.map(r => (
                    <tr key={r.event_id}>
                        <td>{r.event_name}</td>
                        <td>{new Date(r.event_date).toLocaleDateString()}</td>
                        <td>{r.fighter1}</td>
                        <td>{r.fighter2}</td>
                        <td>{Number(r.fighter1_win_odds*100).toFixed(2)}%</td>
                        <td>{Number(r.fighter2_win_odds*100).toFixed(2)}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}