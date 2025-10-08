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
                    <th>Date</th><th>F1</th><th>F2</th><th>P(F1)</th><th>P(F2)</th><th>Weight</th>
                </tr>
            </thead>
            <tbody>
                {data.map(r => (
                    <tr key={r.event_id}>
                        <td>{r.event_name}</td>
                        <td>{new Date(r.event_date).toLocaleDateString()}</td>
                        <td>{r.weight_class}</td>
                        <td>{r.fighter1}</td>
                        <td>{r.fighter2}</td>
                        <td>{r.figher1_win_odds?.toFixed?.(3)}</td>
                        <td>{r.fighter2_win_odds?.toFixed?.(3)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}