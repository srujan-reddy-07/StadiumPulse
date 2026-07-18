StadiumPulse 🏟️
FIFA World Cup — GenAI-Powered Operational Intelligence & Fan Experience Platform
🌟 Chosen Vertical & Value Proposition
StadiumPulse is an ultra-lightweight, high-performance, and context-aware operational intelligence hub designed specifically for the scale, diversity, and intensity of the FIFA World Cup. Hosting global match schedules across massive target venues presents unprecedented logistical, crowd packing, and communication challenges.

By combining real-time IoT stadium telemetry (turnstile activity, concession queues, security checkpoints) and fan sentiment with the cognitive reasoning of the Google Gemini API, StadiumPulse solves two critical bottlenecks in stadium operations:

Operational Blind Spots: Organizers are empowered with predictive alerts, queue management recommendations, and dynamic resource allocation intelligence before bottlenecks turn into security hazards.

Friction in the Fan Experience: Global fans receive an instant, zero-friction, multilingual mobile assistant that understands localized stadium maps, event scheduling, concessions, and security updates in their native languages.

⚡ Repository Optimization (Sub-10MB Limit)
To guarantee lightning-fast deployment and seamless drag-and-drop submission in hackathon environments, the codebase is architected with a strict zero-bloat philosophy:

Tailwind CSS & Vanilla CSS: Avoids heavy third-party UI libraries, relying on highly optimized, responsive Tailwind utility classes.

Component-First Architecture: Eliminates heavy external charting and mapping packages, utilizing custom SVG-based interactive maps and lightweight, high-performance components.

Serverless Next.js API Routes: Bypasses complex server structures, leveraging Next.js API endpoints to talk directly to Gemini's SDK.

Asset Optimization: All icons are inline SVGs; UI assets are procedurally generated or vector-based to keep repository footprint well below 2MB.

🚀 Core Features
1. Multilingual Fan Assistant
An AI companion residing in the fan's browser, providing:

Hyper-Localized Navigation: Translates textual stadium telemetry and seating structures into dynamic step-by-step guidance.

Multi-Dialect Translation: Employs Gemini's high-context translation window to facilitate conversations between global fans and local stadium staff.

Zero-Friction Ordering & Concierge: Translates menu choices, addresses dietary preferences, and answers dynamic questions about transportation.

2. Live Organizer Dashboard
A mission-control console for venue operators, featuring:

Telemetry Aggregator: Real-time visual updates from turnstiles, ticket scanners, concession lanes, and safety monitors.

AI-Powered Predictive Logistics: Gemini-driven analysis of telemetry trends, triggering preemptive alerts.

Fan Sentiment Tracking: Synthesizes local social feeds and in-app feedback to map the emotional climate of the stadium.

🏗️ System Architecture & Data Flow
StadiumPulse uses a clean unidirectional data loop. Real-time telemetry, crowd statistics, and user inquiries flow into the Next.js API layer. This content is structured, augmented with context templates, and processed through the Gemini API to produce structured, actionable JSON outputs.

DATA FLOW STEPS:

Data Ingestion: Sensors send telemetry updates to the serverless /api/telemetry endpoint.

Context Assembly: The Next.js API handler fetches current status, packages it with system prompt guidelines.

Gemini Ingestion & Reasoning: Gemini analyzes the aggregated telemetry frame and applies structural fallback schemas.

Structured Delivery: Gemini returns a strictly formatted JSON object using schema enforcement, allowing the React frontend to render alert states natively without brittle text parsing.

Real-time UX Update: The Live Dashboard renders color-coded heatmap warnings, while the Fan Assistant receives updated directional suggestions.

📁 Flat & Modular Folder Structure
The project layout isolates business logic, components, styling, and server-side logic into a clean, flat architecture:

StadiumPulse/
├── .env.example                # Template for Gemini API credentials
├── .gitignore                  # Standard git ignore definitions
├── README.md                   # Complete architectural strategy & user guide
├── jest.config.js              # Jest configuration for unit testing
├── next-env.d.ts               # Global Next type configurations
├── next.config.js              # Next.js runtime configuration
├── package.json                # Curated project dependencies & scripts
├── postcss.config.js           # PostCSS Tailwind directives configuration
├── tailwind.config.js          # FIFA custom color palettes & HSL tokens
├── tsconfig.json               # Environment TypeScript compiler choices
└── src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout viewport shell (HTML/Body wrapper)
│   ├── page.tsx            # Fan Assistant portal view (Mobile Interface)
│   ├── dashboard/          # Organizer console dashboard view
│   │   └── page.tsx        # Dashboard layout & simulated crisis triggers
│   └── api/                # Serverless Next.js API Routes
│       ├── chat/
│       │   └── route.ts    # Gemini API route for concierge assistant
│       └── telemetry/
│           └── route.ts    # Telemetry simulation endpoints
├── components/             # Reusable modular UI components
│   └── Dashboard/
│       ├── AlertBanner.jsx # Renders threat states & broadcasts
│       ├── CrowdHeatmap.jsx# Interactive SVG stadium zone heatmap
│       └── TelemetryGrid.jsx# Live wait times & fan sentiment
├── lib/                    # Core libraries and configuration utilities
│   ├── tests/          # Quality validation test scripts
│   │   └── ui.test.js      # Component role attributes tests
│   ├── gemini.ts           # Gemini API connection client wrapper
│   └── telemetrySim.js     # Stateful matchday environment database simulator
└── styles/
└── globals.css         # Custom animations & Tailwind imports

📊 Operational Assertions & Mathematical Framework
The application relies on deterministic mathematical metrics to compute threat assessments before feeding contextual data arrays into the Google Gemini SDK:

Ingress Throughput Calibration

Turnstile Wait Escalation:
Wait Time (T_w) = Current Queue Length * friction_coefficient

Congestion Thresholds:

T_w < 20 mins: Status is flagged as Optimal (Emerald Corridor).

20 mins <= T_w < 45 mins: Status scales to Congested (Amber Alert State). Triggers redirection matrices.

T_w >= 45 mins: Status reaches Critical Breach parameters (Red Evacuation Alert).

Input Clamping & Boundary Safety

Anti-Crash Guardrails: All dynamic sensor outputs (attendance numbers, turnstile ticks, queue lengths) pass through a safety clamping utility:
f(x) = max(0, x)
Any non-finite variables (NaN, Infinity, or negative values) are clamped to 0 instantly, preventing real-time parsing errors and ensuring UI graph stability during active matchday streaming.

🎨 FIFA Premium Design Tokens
To reflect the energetic, global nature of the tournament, the UI utilizes custom HSL color coordinates specified within tailwind.config.js:

Stadium Emerald (#0D9488): Main brand color reflecting premium stadium lawns.

FIFA Gold (#F59E0B): Warm accent color for alerts, warnings, and high-priority zones.

Championship Indigo (#4F46E5): Midnight blue backdrop for the Organizer Dashboard.

Glassmorphic Panels: Elegant semi-transparent backdrops (backdrop-blur-md bg-white/10) for a premium modern command aesthetic.

🛠️ Testing & Quality Control
The workspace features automated code coverage tracking. To execute the complete validation pipeline and view branch statement reports, run:
npm test