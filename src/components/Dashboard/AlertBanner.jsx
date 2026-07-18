import React from "react";
import { Shield, AlertOctagon, AlertTriangle, Info, Sparkles, UserCheck, Megaphone } from "lucide-react";

export default function AlertBanner({ analysis }) {
  if (!analysis) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center h-[280px]" role="status">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 animate-pulse">
          <Sparkles className="w-6 h-6 text-slate-500" />
        </div>
        <h3 className="text-white font-semibold mb-1">Waiting for Telemetry Feed...</h3>
        <p className="text-xs text-slate-400 max-w-[280px]">AI Venue Architect will generate tactical protocols once telemetry ingestion begins.</p>
      </div>
    );
  }

  const {
    threatLevel = "GREEN",
    summary = "No telemetry analyzed.",
    criticalAlerts = [],
    staffProtocols = [],
    multilingualBroadcasts = {},
    generationSource = "Local Engine",
    timestamp
  } = analysis;

  const getThreatColors = () => {
    switch (threatLevel) {
      case "RED":
        return {
          bg: "bg-red-950/40 border-red-500/30",
          text: "text-red-400",
          badge: "bg-red-500/20 text-red-300 border-red-500/40",
          icon: <AlertOctagon className="w-6 h-6 text-red-500 animate-pulse" />
        };
      case "YELLOW":
        return {
          bg: "bg-amber-950/30 border-amber-500/20",
          text: "text-amber-400",
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" />
        };
      default:
        return {
          bg: "bg-emerald-950/20 border-emerald-500/20",
          text: "text-emerald-400",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: <Shield className="w-6 h-6 text-emerald-400" />
        };
    }
  };

  const threat = getThreatColors();

  const getAlertSeverityStyles = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      case "WARNING":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      default:
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Threat Summary Banner with emergency alert screen reader attributes */}
      <div
        role={threatLevel === "RED" ? "alert" : "status"}
        aria-live={threatLevel === "RED" ? "assertive" : "polite"}
        className={`border rounded-2xl p-6 shadow-xl transition-all duration-500 ${threat.bg}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5 shrink-0">
              {threat.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs font-bold px-3 py-0.5 rounded-full border uppercase tracking-wider ${threat.badge}`}>
                  Threat Level: {threatLevel}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {timestamp ? new Date(timestamp).toLocaleTimeString() : ""}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                {summary}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col md:items-end justify-center text-xs text-slate-500 border-t border-white/5 md:border-none pt-2.5 md:pt-0">
            <span className="font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Operational Agent
            </span>
            <span className="font-mono text-[9px] mt-0.5 text-slate-600 truncate max-w-[200px]" title={generationSource}>
              {generationSource}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Incident Alerts Feed */}
        <section aria-label="Incident Alerts" className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2.5">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" /> Active Venue Exceptions
            </h3>

            {criticalAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Shield className="w-8 h-8 text-emerald-500/40 mb-2" />
                <p className="text-xs text-slate-400">All security zones clear. No exceptions logged.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border flex gap-3 transition-all duration-300 ${getAlertSeverityStyles(
                      alert.severity
                    )}`}
                  >
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="text-sm font-bold text-white leading-tight">{alert.title}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-950/60 text-slate-300">
                          {alert.affectedArea}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Staff Action Protocols */}
        <section aria-label="Staff Protocols" className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2.5">
              <UserCheck className="w-4.5 h-4.5 text-indigo-400" /> Tactical Dispatch Directions
            </h3>

            {staffProtocols.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <UserCheck className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">Standard operational layouts active. No dispatches needed.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {staffProtocols.map((protocol) => (
                  <div
                    key={protocol.id}
                    className="p-3.5 rounded-xl border border-white/5 bg-slate-950/40 hover:bg-slate-950/60 transition-all duration-300 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-extrabold text-[10px] mt-0.5">
                      PA
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider block mb-1">
                        Dispatch To: {protocol.role}
                      </span>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {protocol.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Multilingual Broadcast Announcements */}
      <section aria-label="Announcements Grid" className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2.5">
          <Megaphone className="w-4.5 h-4.5 text-emerald-400" /> Multilingual Fan Broadcast Overlay
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ENGLISH (US)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">ENG</span>
            </div>
            <p className="text-xs text-slate-200 font-semibold leading-relaxed italic">
              "{multilingualBroadcasts.en || "Welcome to MetLife Stadium! All sections are normal."}"
            </p>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">SPANISH (MX)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">ESP</span>
            </div>
            <p className="text-xs text-slate-200 font-semibold leading-relaxed italic">
              "{multilingualBroadcasts.es || "¡Bienvenidos al MetLife Stadium! Todo funciona normalmente."}"
            </p>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">FRENCH (CA)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">FRA</span>
            </div>
            <p className="text-xs text-slate-200 font-semibold leading-relaxed italic">
              "{multilingualBroadcasts.fr || "Bienvenue au MetLife Stadium ! Opérations normales dans tous les secteurs."}"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}