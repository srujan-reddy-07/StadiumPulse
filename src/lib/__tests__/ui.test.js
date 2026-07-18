import React from 'react';
import { render, screen } from '@testing-library/react';
// Imports the missing matcher definitions (toBeInTheDocument, etc.) to satisfy Jest
import "@testing-library/jest-dom";
import AlertBanner from '../../components/Dashboard/AlertBanner';

describe('StadiumPulse UI Component Validation Suite', () => {
    const mockAnalysis = {
        threatLevel: "RED",
        summary: "Critical power grid failure detected in North Sector.",
        criticalAlerts: [{ id: 1, severity: "CRITICAL", title: "Power Outage", affectedArea: "Gate A", message: "Backup generators active." }],
        staffProtocols: [{ id: 1, role: "Security", action: "Deploy to Gate A" }],
        multilingualBroadcasts: { en: "Power outage at Gate A." },
        generationSource: "Gemini 1.5 Flash",
        timestamp: Date.now()
    };

    test('should render active emergency elements with correct alert role attributes', () => {
        render(<AlertBanner analysis={mockAnalysis} />);
        const alertBox = screen.getByRole('alert');
        expect(alertBox).toBeInTheDocument();
        expect(screen.getByText(/Critical power grid failure/i)).toBeInTheDocument();
    });
});