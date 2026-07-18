import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GateTelemetry {
    id: string;
    name: string;
    waitTimeMinutes: number;
    throughputPerMin: number;
    status: string;
}

export interface ConcessionTelemetry {
    id: string;
    name: string;
    zone: string;
    waitTimeMinutes: number;
    status: string;
    activeIncident: string | null;
}

export interface SentimentTelemetry {
    score: number;
    trend: string;
    breakdown: { positive: number; neutral: number; negative: number };
    primaryComplaints: string[];
}

export interface CrisisTelemetry {
    type: string;
    title: string;
    severity: string;
    description: string;
    affectedAreas: string[];
    recommendedAction: string;
}

export interface TelemetrySnapshot {
    stadiumName: string;
    capacity: number;
    attendance: number;
    gates: GateTelemetry[];
    concessions: ConcessionTelemetry[];
    fanSentiment: SentimentTelemetry;
    activeCrisis: CrisisTelemetry | null;
    lastUpdated: string;
}

export interface OperationsAnalysis {
    threatLevel: "GREEN" | "YELLOW" | "RED";
    summary: string;
    criticalAlerts: Array<{
        id: string;
        severity: "INFO" | "WARNING" | "CRITICAL";
        title: string;
        message: string;
        affectedArea: string;
    }>;
    staffProtocols: Array<{
        id: string;
        role: string;
        action: string;
    }>;
    multilingualBroadcasts: {
        en: string;
        es: string;
        fr: string;
    };
    generationSource: string;
    timestamp: string;
}

function generateMockAnalysis(telemetryData: TelemetrySnapshot): OperationsAnalysis {
    const gates = telemetryData.gates || [];
    const concessions = telemetryData.concessions || [];
    const activeCrisis = telemetryData.activeCrisis;
    const sentiment = telemetryData.fanSentiment || { score: 64 };

    let threatLevel: "GREEN" | "YELLOW" | "RED" = "GREEN";
    let summary = "Stadium operations are running within normal thresholds. All entrance corridors and services are fully functional.";
    const criticalAlerts: OperationsAnalysis["criticalAlerts"] = [];
    const staffProtocols: OperationsAnalysis["staffProtocols"] = [];

    let enBroadcast = "Welcome to MetLife Stadium! All gates are open. Visit our concession stalls on concourse tiers.";
    let esBroadcast = "¡Bienvenidos al MetLife Stadium! Todas las puertas están abiertas. Visite los puestos de comida.";
    let frBroadcast = "Bienvenue au MetLife Stadium ! Toutes les portes sont ouvertes. Visitez nos stands de concession.";

    const congestedGate = gates.find(g => g.waitTimeMinutes >= 20);
    const languageBistro = concessions.find(c => c.id === "Stand 4" && c.status === "Incident");

    if (congestedGate) {
        threatLevel = "YELLOW";
        summary = `Elevated queue delays detected at ${congestedGate.name}. Core stadium facilities are operational, but ingress is throttled.`;
        criticalAlerts.push({
            id: "alert-gate-congestion",
            severity: "WARNING",
            title: `${congestedGate.name} Severe Ingress Bottleneck`,
            message: `Turnstile processing delays have increased wait times to ${congestedGate.waitTimeMinutes} minutes, creating potential crowd packing hazards near turnstile corridors.`,
            affectedArea: "North Gate / Outer Perimeter A"
        });
        staffProtocols.push({
            id: "proto-gate-redeploy",
            role: "Guest Experience & Ground Security",
            action: "Redeploy 4 guest service stewards from Gate B to Gate A to redirect incoming fans. Adjust digital displays."
        });
        enBroadcast = `Alert: Gate A has a ${congestedGate.waitTimeMinutes}-minute wait. Please proceed to Gate B or Gate D.`;
        esBroadcast = `Alerta: La Puerta A tiene una espera de ${congestedGate.waitTimeMinutes} minutos. Diríjase a la Puerta B o D.`;
        frBroadcast = `Alerte : La porte A a une attente de ${congestedGate.waitTimeMinutes} min. Veuillez utiliser les portes B ou D.`;
    }

    if (languageBistro) {
        criticalAlerts.push({
            id: "alert-concession-incident",
            severity: "INFO",
            title: `${languageBistro.name} Support Incident`,
            message: "An active language barrier incident between fans and staff is slowing lanes. Wait times reached 24 minutes.",
            affectedArea: `${languageBistro.zone} - Stand 4`
        });
        staffProtocols.push({
            id: "proto-translator-deploy",
            role: "Bilingual Host Operations Team",
            action: "Deploy 2 Spanish-speaking fan hosts with translation tablets to Concession Stand 4 to expedite checkout."
        });
    }

    if (activeCrisis) {
        threatLevel = "RED";
        summary = `CRITICAL EVENT WARNING: Active ${activeCrisis.type} hazard in progress. Standard stadium protocols are suspended.`;

        criticalAlerts.unshift({
            id: `alert-crisis-${activeCrisis.type.toLowerCase()}`,
            severity: "CRITICAL",
            title: activeCrisis.title,
            message: activeCrisis.description,
            affectedArea: activeCrisis.affectedAreas.join(", ")
        });

        staffProtocols.unshift({
            id: `proto-crisis-${activeCrisis.type.toLowerCase()}`,
            role: "Emergency Action Officers & Venue Safety Team",
            action: activeCrisis.recommendedAction
        });

        if (activeCrisis.type === "WEATHER") {
            enBroadcast = "WEATHER EVACUATION: Lightning storm detected. Evacuate all open stands immediately and proceed to inner concourse zones.";
            esBroadcast = "EVACUACIÓN POR CLIMA: Tormenta eléctrica detectada. Evacue las gradas y diríjase a las zonas interiores.";
            frBroadcast = "ÉVACUATION MÉTÉO: Orage détecté. Évacuez les tribunes ouvertes et rejoignez les coursives intérieures.";
        }
    }

    return {
        threatLevel,
        summary,
        criticalAlerts,
        staffProtocols,
        multilingualBroadcasts: { en: enBroadcast, es: esBroadcast, fr: frBroadcast },
        generationSource: "Locally Synthesized Operational Heuristics (Mock AI Fallback Mode)",
        timestamp: new Date().toISOString()
    };
}

export async function analyzeTelemetry(telemetryData: TelemetrySnapshot): Promise<OperationsAnalysis> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return generateMockAnalysis(telemetryData);
    }

    const systemPrompt = `Analyze the following telemetry dataset and output clean raw JSON matching the required schema: ${JSON.stringify(telemetryData)}`;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        let cleanText = text.trim();
        if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        }

        const parsedData = JSON.parse(cleanText) as OperationsAnalysis;
        parsedData.generationSource = "Google Gemini API (gemini-1.5-flash)";
        parsedData.timestamp = new Date().toISOString();

        return parsedData;
    } catch (error: any) {
        const fallback = generateMockAnalysis(telemetryData);
        fallback.generationSource = `Locally Synthesized Operational Heuristics (Fallback due to error: ${error?.message || "Unknown"})`;
        return fallback;
    }
}