import React, { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function CrowdHeatmap({ telemetry }) {
  const [hoveredZone, setHoveredZone] = useState(null);

  if (!telemetry) return null;

  const { gates = [], concessions = [], activeCrisis = null } = telemetry;

  const gateA = gates.find(g => g.id === "Gate A") || {};
  const gateB = gates.find(g => g.id === "Gate B") || {};
  const gateC = gates.find(g => g.id === "Gate C") || {};
  const gateD = gates.find(g => g.id === "Gate D") || {};

  const stand1 = concessions.find(c => c.id === "Stand 1") || {};
  const stand2 = concessions.find(c => c.id === "Stand 2") || {};
  const stand3 = concessions.find(c => c.id === "Stand 3") || {};
  const stand4 = concessions.find(c => c.id === "Stand 4") || {};

  const getZoneColor = (type, data) => {
    if (activeCrisis && activeCrisis.type === "WEATHER" && type === "gate") {
      return "fill-red-500/30 stroke-red-500 animate-pulse";
    }
    if (type === "gate") {
      const wait = data.waitTimeMinutes || 0;
      const status = data.status || "";
      if (status.toLowerCase().includes("breach") || wait >= 45) {
        return "fill-red-500/30 stroke-red-500 animate-pulse";
      }
      if (status.toLowerCase().includes("congested") || wait >= 20) {
        return "fill-amber-500/30 stroke-amber-500";
      }
      return "fill-emerald-500/10 stroke-emerald-500/60 hover:fill-emerald-500/20";
    }
    if (type === "concession") {
      if (data.status === "Incident") {
        return "fill-amber-500/40 stroke-amber-500 animate-pulse";
      }
      if (data.waitTimeMinutes >= 15) {
        return "fill-amber-500/20 stroke-amber-500/60";
      }
      return "fill-emerald-500/20 stroke-emerald-500/60 hover:fill-emerald-500/35";
    }
    return "fill-slate-800 stroke-slate-700";
  };

  const handleKeyDown = (e, zoneTitle, data, type) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setHoveredZone({ title: zoneTitle, data, type });
    }
  };

  return (
    <section
      aria-label="Interactive Stadium Map"
      className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center"
    >
      <div className="w-full flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">MetLife Stadium Live Heatmap</h3>
          <p className="text-xs text-slate-400">Interactive sensor grid. Focus or hover over zones to read telemetry.</p>
        </div>
        <div className="flex gap-4 text-xs" aria-hidden="true">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-400/50"></span> Optimal
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-400/50"></span> Congested
          </div>
          <div className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-400/50 animate-pulse"></span> Crisis
          </div>
        </div>
      </div>

      <div className="w-full max-w-[460px] relative">
        <svg
          viewBox="0 0 500 400"
          className="w-full h-auto drop-shadow-[0_0_15px_rgba(79,70,229,0.15)]"
          role="group"
          aria-label="Map layout showing gates A, B, C, and D with concession stands"
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <ellipse cx="250" cy="200" rx="220" ry="170" className="fill-slate-950/80 stroke-slate-800" strokeWidth="4" />

          {/* North Gate Sector (Gate A) */}
          <path
            d="M 120 80 A 220 170 0 0 1 380 80 L 320 130 A 130 100 0 0 0 180 130 Z"
            className={`transition-all duration-300 cursor-pointer stroke-[2.5] focus:outline-none focus:ring-2 focus:ring-teal-400 ${getZoneColor("gate", gateA)}`}
            tabIndex="0"
            role="button"
            aria-haspopup="dialog"
            aria-expanded={hoveredZone?.title === "North Ingress Zone (Gate A)" ? "true" : "false"}
            aria-label={`North Gate Sector A, current wait time ${gateA.waitTimeMinutes || 0} minutes`}
            onMouseEnter={() => setHoveredZone({ title: "North Ingress Zone (Gate A)", data: gateA, type: "gate" })}
            onMouseLeave={() => setHoveredZone(null)}
            onFocus={() => setHoveredZone({ title: "North Ingress Zone (Gate A)", data: gateA, type: "gate" })}
            onBlur={() => setHoveredZone(null)}
            onKeyDown={(e) => handleKeyDown(e, "North Ingress Zone (Gate A)", gateA, "gate")}
          />

          {/* East Gate Sector (Gate B) */}
          <path
            d="M 380 80 A 220 170 0 0 1 450 280 L 370 245 A 130 100 0 0 0 320 130 Z"
            className={`transition-all duration-300 cursor-pointer stroke-[2.5] focus:outline-none focus:ring-2 focus:ring-teal-400 ${getZoneColor("gate", gateB)}`}
            tabIndex="0"
            role="button"
            aria-haspopup="dialog"
            aria-expanded={hoveredZone?.title === "East Ingress Zone (Gate B)" ? "true" : "false"}
            aria-label={`East Gate Sector B, current wait time ${gateB.waitTimeMinutes || 0} minutes`}
            onMouseEnter={() => setHoveredZone({ title: "East Ingress Zone (Gate B)", data: gateB, type: "gate" })}
            onMouseLeave={() => setHoveredZone(null)}
            onFocus={() => setHoveredZone({ title: "East Ingress Zone (Gate B)", data: gateB, type: "gate" })}
            onBlur={() => setHoveredZone(null)}
            onKeyDown={(e) => handleKeyDown(e, "East Ingress Zone (Gate B)", gateB, "gate")}
          />

          {/* South Gate Sector (Gate C) */}
          <path
            d="M 450 280 A 220 170 0 0 1 120 320 L 180 270 A 130 100 0 0 0 370 245 Z"
            className={`transition-all duration-300 cursor-pointer stroke-[2.5] focus:outline-none focus:ring-2 focus:ring-teal-400 ${getZoneColor("gate", gateC)}`}
            tabIndex="0"
            role="button"
            aria-haspopup="dialog"
            aria-expanded={hoveredZone?.title === "South Ingress Zone (Gate C)" ? "true" : "false"}
            aria-label={`South Gate Sector C, current wait time ${gateC.waitTimeMinutes || 0} minutes`}
            onMouseEnter={() => setHoveredZone({ title: "South Ingress Zone (Gate C)", data: gateC, type: "gate" })}
            onMouseLeave={() => setHoveredZone(null)}
            onFocus={() => setHoveredZone({ title: "South Ingress Zone (Gate C)", data: gateC, type: "gate" })}
            onBlur={() => setHoveredZone(null)}
            onKeyDown={(e) => handleKeyDown(e, "South Ingress Zone (Gate C)", gateC, "gate")}
          />

          {/* West Gate Sector (Gate D) */}
          <path
            d="M 120 320 A 220 170 0 0 1 120 80 L 180 130 A 130 100 0 0 0 180 270 Z"
            className={`transition-all duration-300 cursor-pointer stroke-[2.5] focus:outline-none focus:ring-2 focus:ring-teal-400 ${getZoneColor("gate", gateD)}`}
            tabIndex="0"
            role="button"
            aria-haspopup="dialog"
            aria-expanded={hoveredZone?.title === "West Ingress Zone (Gate D)" ? "true" : "false"}
            aria-label={`West Gate Sector D, current wait time ${gateD.waitTimeMinutes || 0} minutes`}
            onMouseEnter={() => setHoveredZone({ title: "West Ingress Zone (Gate D)", data: gateD, type: "gate" })}
            onMouseLeave={() => setHoveredZone(null)}
            onFocus={() => setHoveredZone({ title: "West Ingress Zone (Gate D)", data: gateD, type: "gate" })}
            onBlur={() => setHoveredZone(null)}
            onKeyDown={(e) => handleKeyDown(e, "West Ingress Zone (Gate D)", gateD, "gate")}
          />

          {/* Seating Tier Ring */}
          <ellipse cx="250" cy="200" rx="130" ry="100" className="fill-slate-900 stroke-slate-800" strokeWidth="3" />

          {/* Concession Stand 4 */}
          <circle
            cx="175"
            cy="110"
            r="12"
            className={`cursor-pointer transition-all duration-300 stroke-[2] focus:outline-none focus:ring-2 focus:ring-teal-400 ${getZoneColor("concession", stand4)}`}
            filter={stand4.status === "Incident" ? "url(#glow)" : ""}
            tabIndex="0"
            role="button"
            aria-haspopup="dialog"
            aria-expanded={hoveredZone?.title === "Concession Stand 4 (World Bistro)" ? "true" : "false"}
            aria-label={`Concession Stand 4, current wait time ${stand4.waitTimeMinutes || 0} minutes`}
            onMouseEnter={() => setHoveredZone({ title: "Concession Stand 4 (World Bistro)", data: stand4, type: "concession" })}
            onMouseLeave={() => setHoveredZone(null)}
            onFocus={() => setHoveredZone({ title: "Concession Stand 4 (World Bistro)", data: stand4, type: "concession" })}
            onBlur={() => setHoveredZone(null)}
            onKeyDown={(e) => handleKeyDown(e, "Concession Stand 4 (World Bistro)", stand4, "concession")}
          />
          <text x="175" y="114" textAnchor="middle" className="fill-white font-bold text-[9px] pointer-events-none">S4</text>

          {/* Concession Stand 3 */}
          <circle
            cx="325"
            cy="110"
            r="12"
            className={`cursor-pointer transition-all duration-300 stroke-[2] focus:outline-none focus:ring-2 focus:ring-teal-400 ${getZoneColor("concession", stand3)}`}
            tabIndex="0"
            role="button"
            aria-haspopup="dialog"
            aria-expanded={hoveredZone?.title === "Concession Stand 3 (Taco Express)" ? "true" : "false"}
            aria-label={`Concession Stand 3, current wait time ${stand3.waitTimeMinutes || 0} minutes`}
            onMouseEnter={() => setHoveredZone({ title: "Concession Stand 3 (Taco Express)", data: stand3, type: "concession" })}
            onMouseLeave={() => setHoveredZone(null)}
            onFocus={() => setHoveredZone({ title: "Concession Stand 3 (Taco Express)", data: stand3, type: "concession" })}
            onBlur={() => setHoveredZone(null)}
            onKeyDown={(e) => handleKeyDown(e, "Concession Stand 3 (Taco Express)", stand3, "concession")}
          />
          <text x="325" y="114" textAnchor="middle" className="fill-white font-bold text-[9px] pointer-events-none">S3</text>

          {/* Concession Stand 1 */}
          <circle
            cx="380"
            cy="190"
            r="12"
            className={`cursor-pointer transition-all duration-300 stroke-[2] focus:outline-none focus:ring-2 focus:ring-teal-400 ${getZoneColor("concession", stand1)}`}
            tabIndex="0"
            role="button"
            aria-haspopup="dialog"
            aria-expanded={hoveredZone?.title === "Concession Stand 1 (Jersey Eats)" ? "true" : "false"}
            aria-label={`Concession Stand 1, current wait time ${stand1.waitTimeMinutes || 0} minutes`}
            onMouseEnter={() => setHoveredZone({ title: "Concession Stand 1 (Jersey Eats)", data: stand1, type: "concession" })}
            onMouseLeave={() => setHoveredZone(null)}
            onFocus={() => setHoveredZone({ title: "Concession Stand 1 (Jersey Eats)", data: stand1, type: "concession" })}
            onBlur={() => setHoveredZone(null)}
            onKeyDown={(e) => handleKeyDown(e, "Concession Stand 1 (Jersey Eats)", stand1, "concession")}
          />
          <text x="380" y="194" textAnchor="middle" className="fill-white font-bold text-[9px] pointer-events-none">S1</text>

          {/* Concession Stand 2 */}
          <circle
            cx="120"
            cy="190"
            r="12"
            className={`cursor-pointer transition-all duration-300 stroke-[2] focus:outline-none focus:ring-2 focus:ring-teal-400 ${getZoneColor("concession", stand2)}`}
            tabIndex="0"
            role="button"
            aria-haspopup="dialog"
            aria-expanded={hoveredZone?.title === "Concession Stand 2 (Liberty Grill)" ? "true" : "false"}
            aria-label={`Concession Stand 2, current wait time ${stand2.waitTimeMinutes || 0} minutes`}
            onMouseEnter={() => setHoveredZone({ title: "Concession Stand 2 (Liberty Grill)", data: stand2, type: "concession" })}
            onMouseLeave={() => setHoveredZone(null)}
            onFocus={() => setHoveredZone({ title: "Concession Stand 2 (Liberty Grill)", data: stand2, type: "concession" })}
            onBlur={() => setHoveredZone(null)}
            onKeyDown={(e) => handleKeyDown(e, "Concession Stand 2 (Liberty Grill)", stand2, "concession")}
          />
          <text x="120" y="194" textAnchor="middle" className="fill-white font-bold text-[9px] pointer-events-none">S2</text>

          <rect x="190" y="155" width="120" height="90" rx="6" className="fill-emerald-800/40 stroke-emerald-500/80" strokeWidth="2.5" />
          <line x1="250" y1="155" x2="250" y2="245" className="stroke-emerald-500/50" strokeWidth="1.5" />
          <circle cx="250" cy="200" r="18" className="fill-none stroke-emerald-500/50" strokeWidth="1.5" />

          <text x="250" y="70" textAnchor="middle" className="fill-slate-400 font-bold text-[10px] tracking-widest">GATE A (NORTH)</text>
          <text x="410" y="205" textAnchor="middle" className="fill-slate-400 font-bold text-[10px] tracking-widest rotate-90 origin-[410px_205px]">GATE B (EAST)</text>
          <text x="250" y="340" textAnchor="middle" className="fill-slate-400 font-bold text-[10px] tracking-widest">GATE C (SOUTH)</text>
          <text x="90" y="205" textAnchor="middle" className="fill-slate-400 font-bold text-[10px] tracking-widest -rotate-90 origin-[90px_205px]">GATE D (WEST)</text>
          <text x="250" y="204" textAnchor="middle" className="fill-white/80 font-extrabold text-[9px] tracking-widest pointer-events-none">METLIFE FIELD</text>
        </svg>

        {/* Dynamic dialog output window */}
        <div
          aria-live="polite"
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-slate-950/95 border border-white/10 rounded-xl p-3.5 shadow-2xl transition-all duration-300 flex items-start gap-2.5 ${hoveredZone ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
            }`}
        >
          {hoveredZone && (
            <>
              {hoveredZone.data.status === "Incident" || hoveredZone.data.status === "Congested" || hoveredZone.data.status === "Critical Breach" ? (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs font-bold text-white uppercase tracking-wider">{hoveredZone.title}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-[11px]">
                  <div className="text-slate-400">Wait Time:</div>
                  <div className="text-white font-semibold">{hoveredZone.data.waitTimeMinutes} minutes</div>
                  {hoveredZone.type === "gate" && (
                    <>
                      <div className="text-slate-400">Flow Throughput:</div>
                      <div className="text-white font-semibold">{hoveredZone.data.throughputPerMin}/min</div>
                    </>
                  )}
                  <div className="text-slate-400">Status:</div>
                  <div className={`font-bold ${hoveredZone.data.status === "Incident" || hoveredZone.data.status === "Congested" || hoveredZone.data.status === "Critical Breach" ? "text-amber-400" : "text-emerald-400"}`}>
                    {hoveredZone.data.status}
                  </div>
                </div>
                {hoveredZone.data.activeIncident && (
                  <p className="mt-1.5 text-[10px] text-amber-300 bg-amber-950/30 p-1.5 rounded border border-amber-500/10 leading-normal">
                    {hoveredZone.data.activeIncident}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}