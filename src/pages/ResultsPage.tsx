import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {fetchPredictionsByEvent, type PredictedFight} from "../data/fetchPredictions";

export default function ResultsPage() {
    const { event_id } = useParams<{ event_id: string }>();
    const [rows, setRows] = useState<PredictedFight[]>([]);
    const [status, setStatus] = useState<"idle"|"loading"|"error"|"ready">("idle");
    const [error, setError] = useState<string | null>(null);

    
    return (
        <section>
            <Link to="/" style={{ display: "inline-block", marginBottom: "1rem" }}>← Back</Link>
            <p>MEOW?</p>
        </section>
    )
}