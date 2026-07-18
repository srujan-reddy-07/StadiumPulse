/**
 * StadiumPulse - Telemetry Simulation Engine
 * Represents a chaotic matchday environment at MetLife Stadium during FIFA World Cup 2026.
 */

const INITIAL_STATE = {
  stadiumName: "MetLife Stadium",
  capacity: 82500,
  attendance: 75900, // ~92% capacity
  gates: [
    { id: "Gate A", name: "North Gate (Gate A)", waitTimeMinutes: 28, throughputPerMin: 14, status: "Congested" },
    { id: "Gate B", name: "East Gate (Gate B)", waitTimeMinutes: 7, throughputPerMin: 32, status: "Optimal" },
    { id: "Gate C", name: "South Gate (Gate C)", waitTimeMinutes: 5, throughputPerMin: 36, status: "Optimal" },
    { id: "Gate D", name: "West Gate (Gate D)", waitTimeMinutes: 9, throughputPerMin: 28, status: "Optimal" }
  ],
  concessions: [
    { id: "Stand 1", name: "Jersey Eats (Stand 1)", zone: "Lower Tier East", waitTimeMinutes: 4, status: "Optimal", activeIncident: null },
    { id: "Stand 2", name: "Liberty Grill (Stand 2)", zone: "Lower Tier West", waitTimeMinutes: 6, status: "Optimal", activeIncident: null },
    { id: "Stand 3", name: "Taco Express (Stand 3)", zone: "Upper Tier East", waitTimeMinutes: 9, status: "Optimal", activeIncident: null },
    { id: "Stand 4", name: "World Bistro (Stand 4)", zone: "Upper Tier West", waitTimeMinutes: 24, status: "Incident", activeIncident: "Language Barrier Incident: Large group of Spanish-speaking fans and English-only concession staff causing heavy queue buildup and order confusion." }
  ],
  fanSentiment: {
    score: 64, // out of 100
    trend: "Downwards",
    breakdown: { positive: 45, neutral: 25, negative: 30 },
    primaryComplaints: [
      "Severe gate entrance bottlenecks at Gate A",
      "Extreme queues and communication delays at Concession Stand 4"
    ]
  },
  activeCrisis: null, // Holds crisis object if triggered
  lastUpdated: new Date().toISOString()
};

// Use global binding to persist state in Next.js hot-reloads during local dev
if (!global.stadiumPulseTelemetryState) {
  global.stadiumPulseTelemetryState = JSON.parse(JSON.stringify(INITIAL_STATE));
}

/**
 * Gets the current telemetry snapshot.
 * Applies minor realistic fluctuations to simulate live data stream unless a crisis overrides it.
 */
export function getTelemetry() {
  const state = global.stadiumPulseTelemetryState;
  
  // Create a deep copy to avoid direct mutation
  const snapshot = JSON.parse(JSON.stringify(state));
  
  // Add minor fluctuations to wait times and throughputs to simulate real-time sensors
  snapshot.gates = snapshot.gates.map(gate => {
    let deltaWait = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
    let newWait = gate.waitTimeMinutes + deltaWait;
    
    // Ensure Gate A remains a bottleneck, others remain optimal
    if (gate.id === "Gate A") {
      newWait = Math.max(24, Math.min(35, newWait));
      gate.status = newWait > 25 ? "Congested" : "Warning";
    } else {
      newWait = Math.max(3, Math.min(12, newWait));
      gate.status = "Optimal";
    }
    
    gate.waitTimeMinutes = newWait;
    gate.throughputPerMin = Math.max(5, gate.throughputPerMin + (Math.floor(Math.random() * 5) - 2));
    return gate;
  });

  snapshot.concessions = snapshot.concessions.map(stand => {
    let deltaWait = Math.floor(Math.random() * 3) - 1;
    let newWait = stand.waitTimeMinutes + deltaWait;
    
    if (stand.id === "Stand 4") {
      newWait = Math.max(20, Math.min(30, newWait));
    } else {
      newWait = Math.max(2, Math.min(12, newWait));
    }
    
    stand.waitTimeMinutes = newWait;
    return stand;
  });

  // Sentiment slowly drops slightly if Gate A and Stand 4 remain bottlenecks
  if (!snapshot.activeCrisis) {
    let sentimentDelta = (Math.random() * 0.4) - 0.25; // slight negative bias
    snapshot.fanSentiment.score = Math.max(45, Math.min(80, parseFloat((snapshot.fanSentiment.score + sentimentDelta).toFixed(1))));
  } else {
    // Sharp drop under active crisis
    let crisisDelta = (Math.random() * 1.5) + 1.0;
    snapshot.fanSentiment.score = Math.max(20, parseFloat((snapshot.fanSentiment.score - crisisDelta).toFixed(1)));
  }

  snapshot.lastUpdated = new Date().toISOString();
  return snapshot;
}

/**
 * Triggers a sudden emergency crisis in the stadium telemetry.
 * @param {string} type - 'WEATHER' | 'POWER_OUTAGE' | 'SECURITY_BREACH' | 'MEDICAL_ALERT'
 */
export function triggerEmergency(type) {
  const state = global.stadiumPulseTelemetryState;
  
  const crisisTypes = {
    WEATHER: {
      type: "WEATHER",
      title: "Severe Weather Evacuation Protocol",
      severity: "CRITICAL",
      description: "Severe lightning storm detected within a 5-mile radius of MetLife Stadium. High winds and electrical discharge risks imminent.",
      affectedAreas: ["All Open Terraces", "Upper Concourse Sections 300-340"],
      recommendedAction: "Activate sheltering protocol. Direct upper-deck fans to interior concourses immediately."
    },
    POWER_OUTAGE: {
      type: "POWER_OUTAGE",
      title: "South Concourse Substation Power Failure",
      severity: "CRITICAL",
      description: "Localized transformer failure has knocked out main power grid across Sections 110-128 and South Concourse. Auxiliary generators active but limited.",
      affectedAreas: ["Sections 110-128", "Concourse South Gates C & D Concessions"],
      recommendedAction: "Deploy emergency staff with portable floodlights and dispatch electrical engineers to Substation 3B."
    },
    SECURITY_BREACH: {
      type: "SECURITY_BREACH",
      title: "Gate A Perimeter Security Breach",
      severity: "CRITICAL",
      description: "Uncontrolled crowd surge has breached Outer Perimeter Gate A security fencing. Ticket scanning temporarily suspended as security establishes a secondary cordon.",
      affectedAreas: ["Gate A (North Entrance)", "Sections 101-105 Lobby"],
      recommendedAction: "Suspend turnstile access at Gate A, deploy rapid response security teams, and redirect inbound queues to Gate B."
    },
    MEDICAL_ALERT: {
      type: "MEDICAL_ALERT",
      title: "Heat Exhaustion Cluster in Section 224",
      severity: "WARNING",
      description: "High humidity levels have triggered a cluster of five heat-related medical calls within Section 224 in the last 10 minutes.",
      affectedAreas: ["Section 224", "Upper Level East Corridor"],
      recommendedAction: "Deploy mobile medical responders, allocate extra water reserves to Concession Stand 3, and display hydration reminders on regional big screens."
    }
  };

  const selectedCrisis = crisisTypes[type.toUpperCase()];
  if (selectedCrisis) {
    state.activeCrisis = selectedCrisis;
    // Adjust telemetry immediately to reflect the chaos
    if (type === "WEATHER") {
      state.fanSentiment.score = 50;
      state.gates.forEach(g => {
        g.waitTimeMinutes = Math.max(g.waitTimeMinutes, 15);
        g.status = "Warning";
      });
    } else if (type === "POWER_OUTAGE") {
      state.gates.forEach(g => {
        if (g.id === "Gate C" || g.id === "Gate D") {
          g.waitTimeMinutes = 25;
          g.status = "Congested";
        }
      });
    } else if (type === "SECURITY_BREACH") {
      const gateA = state.gates.find(g => g.id === "Gate A");
      if (gateA) {
        gateA.waitTimeMinutes = 55;
        gateA.status = "Critical Breach";
      }
    }
    state.lastUpdated = new Date().toISOString();
    return selectedCrisis;
  }
  return null;
}

/**
 * Resets the telemetry simulation to the baseline state.
 */
export function resetSim() {
  global.stadiumPulseTelemetryState = JSON.parse(JSON.stringify(INITIAL_STATE));
  return global.stadiumPulseTelemetryState;
}
