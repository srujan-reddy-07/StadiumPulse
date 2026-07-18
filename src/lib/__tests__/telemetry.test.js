import { getTelemetry, triggerEmergency, resetSim } from '../telemetrySim';

describe('StadiumPulse Telemetry Simulation Engine', () => {
    beforeEach(() => {
        resetSim();
    });

    test('should initialize with baseline matchday conditions', () => {
        const telemetry = getTelemetry();
        expect(telemetry.stadiumName).toBe('MetLife Stadium');
        expect(telemetry.gates.length).toBe(4);
        expect(telemetry.activeCrisis).toBeNull();
    });

    test('should correctly inject a weather emergency', () => {
        triggerEmergency('WEATHER');
        const telemetry = getTelemetry();
        expect(telemetry.activeCrisis.type).toBe('WEATHER');
        expect(telemetry.activeCrisis.severity).toBe('CRITICAL');
    });

    test('should reset simulation properly', () => {
        triggerEmergency('POWER_OUTAGE');
        resetSim();
        const telemetry = getTelemetry();
        expect(telemetry.activeCrisis).toBeNull();
    });
});