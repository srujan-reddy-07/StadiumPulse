import { analyzeTelemetry } from '../gemini';

describe('Gemini AI Heuristics Analysis Engine', () => {
    const mockTelemetry = {
        stadiumName: "MetLife Stadium",
        gates: [
            { id: "Gate A", name: "North Gate (Gate A)", waitTimeMinutes: 28, throughputPerMin: 14, status: "Congested" }
        ],
        concessions: [],
        fanSentiment: { score: 64 },
        activeCrisis: null
    };

    test('should gracefully fall back to local heuristics analysis if API key is missing', async () => {
        const result = await analyzeTelemetry(mockTelemetry);
        expect(result).toHaveProperty('threatLevel');
        expect(result).toHaveProperty('summary');
        expect(result).toHaveProperty('criticalAlerts');
        expect(result.generationSource).toContain('Heuristics');
    });
});