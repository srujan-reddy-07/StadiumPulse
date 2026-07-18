import React from "react";
import { Clock, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Users, Coffee, MessageSquare, ShieldAlert } from "lucide-react";

export default function TelemetryGrid({ telemetry }) {
  if (!telemetry) return null;

  const { gates = [], concessions = [], fanSentiment = {}, attendance = {} } = telemetry;

  // Helper to determine threat color for gate wait time
  const getGateBadgeColor = (status, waitTime) => {
    if (status?.toLowerCase().includes("breach") || waitTime >= 45) {
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    }
    if (status?.toLowerCase().includes("congested") || waitTime >= 20) {
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    }
    return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
  };

  // Helper to determine threat icon
  const getStatusIcon = (status, waitTime) => {
    if (status?.toLowerCase().includes("breach") || waitTime >= 45) {
      return <ShieldAlert className="w-4 h-4 text-red-400" />;
    }
    if (status?.toLowerCase().includes("congested") || waitTime >= 20) {
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  };

  const sentimentScore = fanSentiment.score ?? 0;
  const isSentimentLow = sentimentScore < 65;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Attendance & Ingress Column */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Live Ingress
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Live Capacity
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Stadium Attendance</span>
                <span className="text-white font-medium">
                  {attendance.current?.toLocaleString()} / {attendance.capacity?.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${attendance.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-500">Target Level</span>
                <span className="text-xs text-indigo-400 font-bold">{attendance.percentage}% Cap</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Entrance Gates</h4>
              <div className="space-y-2">
                {gates.map((gate) => (
                  <div key={gate.id} className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(gate.status, gate.waitTimeMinutes)}
                      <span className="text-sm font-medium text-slate-200">{gate.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{gate.throughputPerMin}/min</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${getGateBadgeColor(gate.status, gate.waitTimeMinutes)}`}>
                        {gate.waitTimeMinutes} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concessions Status Column */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Coffee className="w-5 h-5 text-emerald-400" /> Concessions & Dining
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Wait Times
            </span>
          </div>

          <div className="space-y-3">
            {concessions.map((stand) => (
              <div
                key={stand.id}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  stand.status === "Incident"
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-slate-950/40 border-white/5"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-sm font-semibold text-slate-200">{stand.name}</span>
                    <p className="text-xs text-slate-500">{stand.zone}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      stand.waitTimeMinutes >= 20
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {stand.waitTimeMinutes} min
                  </span>
                </div>

                {stand.activeIncident && (
                  <div className="mt-2 flex gap-1.5 bg-amber-950/40 p-2 rounded border border-amber-500/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300 font-medium leading-relaxed">
                      {stand.activeIncident}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fan Sentiment Column */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" /> Fan Sentiment
            </h3>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                fanSentiment.trend === "Downwards"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {fanSentiment.trend === "Downwards" ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5" />
              )}
              {fanSentiment.trend}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-4 relative">
            {/* SVG Circular Gauge */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className={`transition-all duration-700 ease-out ${
                  isSentimentLow ? "stroke-amber-500" : "stroke-emerald-500"
                }`}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * sentimentScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white">{sentimentScore}%</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Positive</span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Live Feedback Painpoints</h4>
            <ul className="space-y-1.5">
              {fanSentiment.primaryComplaints?.map((complaint, index) => (
                <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                  <span className="leading-normal">{complaint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
