# RutaMX Implementation Plan

## Overview
Electric Fleet Management & Urban Mobility Platform for Mexico City

---

## Phase 1: Foundation (Current)

### 1.1 Project Setup
- [ ] Initialize Next.js 14 + TypeScript
- [ ] Configure Tailwind CSS with dark theme
- [ ] Install and configure shadcn/ui
- [ ] Set up project folder structure

### 1.2 Theme & Styling
- [ ] Configure Deep Ocean blue palette in globals.css
- [ ] Set up CSS variables for consistent theming
- [ ] Configure dark mode as default

### 1.3 Core Dependencies
```bash
npm install react-map-gl mapbox-gl @turf/turf
npm install chart.js react-chartjs-2
npm install @react-pdf/renderer
npm install zustand zod date-fns papaparse
npm install @types/papaparse
```

---

## Phase 2: Layout & Navigation

### 2.1 App Structure
```
src/app/
├── (main)/                 # Main app group with shared layout
│   ├── layout.tsx          # Sidebar + header layout
│   ├── dashboard/page.tsx  # Landing - KPI dashboard
│   ├── map/page.tsx        # Map visualization
│   ├── fleet/page.tsx      # Fleet analytics
│   ├── operations/page.tsx # Operations management
│   └── reports/page.tsx    # Reports & PDF generation
├── admin/                  # Hidden admin section
│   ├── layout.tsx
│   └── page.tsx
└── layout.tsx              # Root layout
```

### 2.2 Components
- [ ] Header with logo and navigation tabs
- [ ] Collapsible sidebar
- [ ] Tab navigation component
- [ ] Page wrapper with consistent styling

---

## Phase 3: Map & Routes

### 3.1 Mapbox Integration
- [ ] Set up react-map-gl with dark-v11 style
- [ ] Center on Mexico City (19.4326, -99.1332)
- [ ] Configure map controls and interactions

### 3.2 Route Visualization
- [ ] Double-layer glow effect for polylines
  - Outer: width 8, opacity 0.4, blur 3
  - Inner: width 3, opacity 1, solid
- [ ] Smooth curves using Turf.js bezierSpline
- [ ] Waypoint markers with blue glow

### 3.3 Route Sidebar
- [ ] Route list with search/filter
- [ ] Agency filter (Metrobús, Metro, RTP, Trolebús, Cablebus)
- [ ] Battery consumption simulator
- [ ] Occupancy slider (0-100%)

---

## Phase 4: Dashboard & Analytics

### 4.1 KPI Cards
- [ ] ROI percentage
- [ ] Fuel savings (MXN)
- [ ] CO₂ reduction (tons)
- [ ] Fleet utilization (%)

### 4.2 Charts (Chart.js)
- [ ] Route count by agency (bar chart)
- [ ] Fleet summary (doughnut)
- [ ] Demand vs capacity (line chart)
- [ ] Daily demand visualization

### 4.3 Fleet Analytics
- [ ] Bus model comparison table
- [ ] Energy consumption cards
- [ ] Cost analysis widgets

---

## Phase 5: Operations

### 5.1 Schedule Analysis
- [ ] Actual vs scheduled times table
- [ ] Variance highlighting
- [ ] Service frequency by time slot

### 5.2 Peak Hours
- [ ] Peak hours identification chart
- [ ] Optimal bus allocation calculator
- [ ] Capacity recommendations

---

## Phase 6: Reports

### 6.1 Emissions Dashboard
- [ ] CO₂ tons avoided chart
- [ ] Passenger count trends
- [ ] Weekend vs weekday comparison
- [ ] Corridor activity analysis

### 6.2 PDF Generation
- [ ] @react-pdf/renderer setup
- [ ] Feasibility report template
- [ ] Electric vs diesel comparison
- [ ] Cost-benefit analysis

---

## Phase 7: Admin Section

### 7.1 User Management
- [ ] User CRUD operations
- [ ] Suspend/activate users
- [ ] CSV export functionality
- [ ] Role management

### 7.2 Bus Catalog
- [ ] Full specs display
- [ ] Image gallery
- [ ] Comparison tool
- [ ] Add/edit bus models

---

## Data Models

### Electric Bus Model
```typescript
interface ElectricBusModel {
  id: string;
  modelName: string;
  manufacturer: string;
  rangeKm: number;
  batteryCapacityKwh: number;
  chargingTimeHours: number;
  energyConsumptionKwhPerKm: number;
  passengerCapacity: number;
  lengthMeters: number;
  widthMeters: number;
  heightMeters: number;
  weightKg: number;
  unitCostUsd: number;
  maintenanceCostPerKm: number;
  warrantyYears: number;
  imageUrl: string;
}
```

### Route
```typescript
interface Route {
  id: string;
  name: string;
  agency: 'metrobus' | 'metro' | 'rtp' | 'trolebus' | 'cablebus';
  color: string;
  coordinates: [number, number][];
  stops: Stop[];
  distanceKm: number;
  estimatedTimeMinutes: number;
}
```

### KPI Data
```typescript
interface KPIData {
  roi: number;
  fuelSavingsMXN: number;
  co2ReductionTons: number;
  fleetUtilization: number;
  totalBuses: number;
  activeBuses: number;
  totalRoutes: number;
}
```

---

## Color Palette

| Variable | Hex | Usage |
|----------|-----|-------|
| --primary | #1E40AF | Buttons, accents |
| --primary-light | #3B82F6 | Glow, highlights |
| --background | #0F172A | Page background |
| --surface | #1E293B | Cards, panels |
| --surface-light | #334155 | Hover states |
| --border | #475569 | Dividers |
| --text | #F8FAFC | Primary text |
| --text-muted | #94A3B8 | Secondary text |
| --glow | rgba(59,130,246,0.5) | Polyline glow |

---

## File Structure

```
src/
├── app/
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── map/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── map-container.tsx
│   │   │       ├── route-layer.tsx
│   │   │       ├── waypoint-markers.tsx
│   │   │       └── sidebar/
│   │   │           ├── route-list.tsx
│   │   │           ├── battery-simulator.tsx
│   │   │           └── occupancy-slider.tsx
│   │   ├── fleet/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   ├── operations/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   └── reports/
│   │       ├── page.tsx
│   │       └── _components/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── _components/
│   ├── api/
│   │   └── routes/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── nav-tabs.tsx
│   ├── charts/
│   │   ├── bar-chart.tsx
│   │   ├── line-chart.tsx
│   │   ├── doughnut-chart.tsx
│   │   └── chart-wrapper.tsx
│   └── shared/
│       ├── kpi-card.tsx
│       ├── data-table.tsx
│       └── loading-spinner.tsx
├── hooks/
│   ├── use-routes.ts
│   ├── use-fleet.ts
│   └── use-kpi.ts
├── lib/
│   ├── gtfs/
│   │   └── parser.ts
│   ├── map/
│   │   ├── glow-layers.ts
│   │   └── smooth-curves.ts
│   ├── calculations/
│   │   ├── battery.ts
│   │   ├── emissions.ts
│   │   └── costs.ts
│   ├── pdf/
│   │   └── report-template.tsx
│   └── utils.ts
├── store/
│   ├── route-store.ts
│   └── fleet-store.ts
├── types/
│   └── index.ts
├── constants/
│   ├── bus-models.ts
│   ├── agencies.ts
│   └── mock-data.ts
└── data/
    └── gtfs/
        └── metrobus/
```

---

## Verification Checklist

- [ ] Map renders with dark theme centered on CDMX
- [ ] Routes display with glowing polylines
- [ ] Battery simulator calculates consumption
- [ ] Dashboard shows KPI cards
- [ ] Charts render with Chart.js
- [ ] PDF report downloads correctly
- [ ] Admin section accessible at /admin
- [ ] Responsive on mobile/tablet
- [ ] All loading/error states implemented
- [ ] Type safety throughout

---

## Next Steps

1. **Initialize Next.js project**
2. **Configure Tailwind + shadcn/ui**
3. **Set up folder structure**
4. **Create root layout and main layout**
5. **Build navigation components**
6. **Implement dashboard page**
7. **Set up Mapbox integration**
8. **Continue with remaining pages**
