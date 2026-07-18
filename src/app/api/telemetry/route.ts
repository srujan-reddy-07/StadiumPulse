import { NextResponse } from "next/server";
import { getTelemetry, triggerEmergency, resetSim } from "../../../lib/telemetrySim";
import { analyzeTelemetry, TelemetrySnapshot } from "../../../lib/gemini";

export async function GET() {
    try {
        const telemetrySnapshot: TelemetrySnapshot = getTelemetry() as any;
        const analysis = await analyzeTelemetry(telemetrySnapshot);

        return NextResponse.json({
            success: true,
            telemetry: telemetrySnapshot,
            analysis: analysis
        });
    } catch (error: any) {
        console.error("GET Error:", error);
        return NextResponse.json({ success: false, error: error?.message || "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, crisis } = body;

        if (action === "trigger") {
            if (!crisis) return NextResponse.json({ success: false, error: "Missing crisis type" }, { status: 400 });
            triggerEmergency(crisis);
        } else if (action === "reset") {
            resetSim();
        } else {
            return NextResponse.json({ success: false, error: "Action not supported" }, { status: 400 });
        }

        const telemetrySnapshot: TelemetrySnapshot = getTelemetry() as any;
        const analysis = await analyzeTelemetry(telemetrySnapshot);

        return NextResponse.json({
            success: true,
            telemetry: telemetrySnapshot,
            analysis: analysis
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error?.message || "Request fault" }, { status: 500 });
    }
}