"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import TelemetryGrid from "../../components/Dashboard/TelemetryGrid";
import CrowdHeatmap from "../../components/Dashboard/CrowdHeatmap";
import AlertBanner from "../../components/Dashboard/AlertBanner";
import { Activity, Play, Pause, RotateCcw, CloudLightning, Zap, ShieldAlert, HeartHandshake, Wifi, RefreshCw } from "lucide-react";

export default function Dashboard() {
    const [telemetry, setTelemetry] = useState<any>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(true);
    const [pollingCountdown, setPollingCountdown] = useState(5);
    const [submittingCrisis, setSubmittingCrisis] = useState<string | null>(null);
    const [resetting, setResetting] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState("");

    const fetchTelemetryFeed = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const response = await fetch("/api/telemetry");
            if (!response.ok) throw new Error(`Status ${response.status}`);
            const data = await response.json();
            if (data.success) {
                setTelemetry(data.telemetry);
                setAnalysis(data.analysis);
                setLastRefreshed(new Date().toLocaleTimeString());
                setError(null);
            }
        } catch (err: any) {
            setError(err?.message || "Ingestion fault");
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTelemetryFeed(); }, [fetchTelemetryFeed]);

    useEffect(() => {
        if (!isPolling) return;
        setPollingCountdown(5);
        const interval = setInterval(() => {
            setPollingCountdown(prev => {
                if (prev <= 1) {
                    fetchTelemetryFeed(true);
                    return 5;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isPolling, fetchTelemetryFeed]);

    const handleTriggerCrisis = useCallback(async (crisisType: string) => {
        setSubmittingCrisis(crisisType);
        try {
            const response = await fetch("/api/telemetry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "trigger", crisis: crisisType })
            });
            const data = await response.json();
            if (data.success) {
                setTelemetry(data.telemetry);
                setAnalysis(data.analysis);
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setSubmittingCrisis(null);
        }
    }, []);

    const handleResetSimulation = useCallback(async () => {
        setResetting(true);
        try {
            const response = await fetch("/api/telemetry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reset" })
            });
            const data = await response.json();
            if (data.success) {
                setTelemetry(data.telemetry);
                setAnalysis(data.analysis);
            }
        } catch { } finally {
            setResetting(false);
        }
    }, []);

    const memoizedTelemetry = useMemo(() => telemetry, [telemetry]);
    const memoizedAnalysis = useMemo(() => analysis, [analysis]);

    return (
        <div className="bg-slate-950 min-h-screen text-slate-100 font-sans p-6 md:p-12">
            <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                    <Activity className="w-8 h-8 text-teal-400 animate-pulse" />
                    <div>
                        <h1 className="text-2xl font-extrabold text-white">StadiumPulse Control Console</h1>
                        <p className="text-xs text-slate-400">GenAI Operation Dashboard — Matchday Stream</p>
                    </div>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                    Sync: {lastRefreshed || "Awaiting Ingestion"}
                </div>
            </header>

            {error && <p className="text-red-400 text-sm mb-4">Feeds error: {error}</p>}

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <AlertBanner analysis={memoizedAnalysis} />
                    <TelemetryGrid telemetry={memoizedTelemetry} />
                </div>
                <div>
                    <CrowdHeatmap telemetry={memoizedTelemetry} />
                    <div className="mt-6 p-4 bg-slate-900/60 rounded-xl border border-white/5 space-y-2">
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Trigger Incident Injection</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleTriggerCrisis("WEATHER")} className="py-2 bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold rounded hover:bg-red-900/20">Lightning Storm</button>
                            <button onClick={() => handleTriggerCrisis("POWER_OUTAGE")} className="py-2 bg-amber-950/40 border border-amber-500/30 text-amber-400 text-xs font-bold rounded hover:bg-amber-900/20">Grid Failure</button>
                            <button onClick={handleResetSimulation} className="py-2 col-span-2 bg-slate-800 text-teal-400 border border-teal-500/20 text-xs font-bold rounded hover:bg-slate-700">Reset Map Simulation</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}