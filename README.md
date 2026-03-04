# RutaMX - Electric Fleet Management Platform

A Next.js 16+ application for Mexico City electric bus fleet management with real-time route visualization, fleet analytics, and PDF report generation.

## Features

- **Dashboard** - Executive KPI overview with ROI, fuel savings, CO₂ reduction metrics
- **Map Visualization** - Mapbox GL dark theme with glowing polyline routes
- **Fleet Analytics** - Bus model comparison, energy consumption analysis
- **Operations** - Schedule tracking, peak hours identification, bus allocation
- **Reports** - CO₂ emissions dashboard, PDF feasibility reports
- **Admin** - User management, bus catalog (hidden at `/admin`)

## Tech Stack

- **Framework**: Next.js 16 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Maps**: react-map-gl + Mapbox GL (dark-v11 style)
- **Charts**: Chart.js + react-chartjs-2
- **PDF**: @react-pdf/renderer
- **State**: Zustand
- **Utilities**: Turf.js, date-fns, zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Mapbox API token

### Installation

```bash
# Install dependencies
npm install

# Copy environment example
cp .env.local.example .env.local

# Add your Mapbox token to .env.local
# NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (main)/           # Main app with navigation
│   │   ├── dashboard/    # KPI dashboard
│   │   ├── map/          # Route visualization
│   │   ├── fleet/        # Fleet analytics
│   │   ├── operations/   # Operations management
│   │   └── reports/      # Reports & PDF
│   └── admin/            # Hidden admin section
├── components/
│   ├── ui/               # UI components (button, card, etc.)
│   ├── layout/           # Header, navigation
│   ├── charts/           # Chart.js wrappers
│   └── shared/           # KPI cards, loading states
├── lib/
│   ├── map/              # Glow layers, smooth curves
│   ├── calculations/     # Battery, emissions logic
│   └── pdf/              # Report templates
├── store/                # Zustand stores
├── types/                # TypeScript definitions
└── constants/            # Mock data, bus models
```

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | #1E40AF | Buttons, accents |
| Secondary | #3B82F6 | Glow, highlights |
| Background | #0F172A | Page background |
| Surface | #1E293B | Cards, panels |

## Transit Agencies

- Metrobús (BRT)
- Metro CDMX
- RTP (Bus network)
- Trolebús (Electric trolley)
- Cablebús (Cable car)

## License

Private - All rights reserved
