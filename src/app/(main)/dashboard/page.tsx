"use client";

import { useState } from "react";
import { Fuel, Leaf, Gauge, Bus, Route, Users, TrendingUp, Zap } from "lucide-react";
import { KPICard } from "@/components/shared/kpi-card";
import { ROIComparisonCard } from "@/components/shared/roi-comparison-card";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { BarChart } from "@/components/charts/bar-chart";
import { DoughnutChart } from "@/components/charts/doughnut-chart";
import { LineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { MOCK_KPI, MOCK_ROI_MONTHLY, ROUTE_AGENCY_COUNT, MOCK_FLEET, MOCK_ROUTES } from "@/constants/mock-data";
import { BUS_MODELS } from "@/constants/bus-models";

// Constantes para proyección de expansión
const MXN_PER_USD = 17.5;
const DIESEL_LITERS_PER_KM = 0.35;
const DIESEL_PRICE_MXN = 24;
const PRICE_PER_KWH_MXN = 2.8;
const DAILY_TRIPS = 10;
const OPERATING_DAYS = 310;
const CO2_KG_PER_LITER_DIESEL = 2.68;

// Pasajeros estimados por ruta (diario)
const ROUTE_PASSENGERS: Record<string, number> = {
  "mb-1": 95000, "mb-2": 72000, "mb-3": 68000,
  "metro-1": 285000, "trolebus-1": 52000,
  "cablebus-1": 28000, "rtp-1": 38000,
};

export default function DashboardPage() {
  const [expansionBuses, setExpansionBuses] = useState(50);
  const [expansionModelId, setExpansionModelId] = useState(BUS_MODELS[0].id);
  const [selectedRouteId, setSelectedRouteId] = useState(MOCK_ROUTES[0].id);

  const expansionModel = BUS_MODELS.find((m) => m.id === expansionModelId) ?? BUS_MODELS[0];
  const selectedRoute = MOCK_ROUTES.find((r) => r.id === selectedRouteId) ?? MOCK_ROUTES[0];

  // Proyección de expansión a 5 años
  const kmPerBusYear = selectedRoute.distanceKm * DAILY_TRIPS * OPERATING_DAYS;
  const investmentMXN = expansionBuses * expansionModel.unitCostUsd * MXN_PER_USD;
  const annualFuelSaving = expansionBuses * kmPerBusYear * DIESEL_LITERS_PER_KM * DIESEL_PRICE_MXN
    - expansionBuses * kmPerBusYear * expansionModel.energyConsumptionKwhPerKm * PRICE_PER_KWH_MXN;
  const annualCO2Tons = expansionBuses * kmPerBusYear * DIESEL_LITERS_PER_KM * CO2_KG_PER_LITER_DIESEL / 1000;
  const expansionROI = investmentMXN > 0 ? (annualFuelSaving / investmentMXN) * 100 : 0;
  const expansionPayback = annualFuelSaving > 0 ? investmentMXN / annualFuelSaving : 0;

  const expansionProjectionData = {
    labels: ["Año 1", "Año 2", "Año 3", "Año 4", "Año 5"],
    datasets: [
      {
        label: "Ahorro Acumulado (MXN)",
        data: [1, 2, 3, 4, 5].map((y) => Math.round(annualFuelSaving * y / 1_000_000)),
        borderColor: "#22C55E",
        backgroundColor: "rgba(34,197,94,0.15)",
        fill: true,
      },
      {
        label: "Inversión Total (MXN)",
        data: [1, 2, 3, 4, 5].map(() => Math.round(investmentMXN / 1_000_000)),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.0)",
        fill: false,
      },
    ],
  };

  // Tablero por ruta: pasajeros + CO2
  const routePassengersData = {
    labels: MOCK_ROUTES.map((r) => `${r.shortName}`),
    datasets: [{
      label: "Pasajeros diarios (miles)",
      data: MOCK_ROUTES.map((r) => Math.round((ROUTE_PASSENGERS[r.id] ?? 0) / 1000)),
      backgroundColor: ["#DC2626","#7C3AED","#059669","#F472B6","#3B82F6","#8B5CF6","#22C55E"],
    }],
  };

  const routeCO2Data = {
    labels: MOCK_ROUTES.map((r) => `${r.shortName}`),
    datasets: [
      {
        label: "CO₂ evitado eléctrico (ton/año)",
        data: MOCK_ROUTES.map((r) => {
          const buses = Math.round((ROUTE_PASSENGERS[r.id] ?? 0) / 80);
          return Math.round(buses * r.distanceKm * DAILY_TRIPS * OPERATING_DAYS * DIESEL_LITERS_PER_KM * CO2_KG_PER_LITER_DIESEL / 1000);
        }),
        backgroundColor: "#22C55E",
      },
      {
        label: "CO₂ diésel equivalente (ton/año)",
        data: MOCK_ROUTES.map((r) => {
          const buses = Math.round((ROUTE_PASSENGERS[r.id] ?? 0) / 80);
          return Math.round(buses * r.distanceKm * DAILY_TRIPS * OPERATING_DAYS * DIESEL_LITERS_PER_KM * CO2_KG_PER_LITER_DIESEL / 1000 * 1.0);
        }),
        backgroundColor: "#EF4444",
      },
    ],
  };

  const fmt = (v: number) =>
    v >= 1_000_000_000 ? `$${(v / 1_000_000_000).toFixed(1)}B MXN`
    : v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M MXN`
    : `$${Math.round(v).toLocaleString("es-MX")} MXN`;

  const fleetStatusData = {
    labels: ["Activos", "Cargando", "Mantenimiento", "Inactivos"],
    datasets: [
      {
        data: [392, 35, 15, 8],
        backgroundColor: ["#22C55E", "#3B82F6", "#F97316", "#64748B"],
        borderWidth: 0,
      },
    ],
  };

  const agencyRoutesData = {
    labels: ROUTE_AGENCY_COUNT.map((a) => a.agency),
    datasets: [
      {
        label: "Rutas",
        data: ROUTE_AGENCY_COUNT.map((a) => a.count),
        backgroundColor: ROUTE_AGENCY_COUNT.map((a) => a.color),
        borderWidth: 0,
      },
    ],
  };

  const passengerTrendData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Pasajeros (miles)",
        data: [245, 258, 262, 255, 248, 185, 142],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
      },
    ],
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "default" | "warning" | "secondary"> = {
      active: "success",
      charging: "default",
      maintenance: "warning",
      inactive: "secondary",
    };
    const labels: Record<string, string> = {
      active: "Activo",
      charging: "Cargando",
      maintenance: "Mantto",
      inactive: "Inactivo",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-xs text-text-secondary">Visión general del sistema de transporte eléctrico</p>
        </div>
        <p className="text-xs text-text-muted">Actualizado: {new Date().toLocaleTimeString("es-MX")}</p>
      </div>

      {/* ROI + KPIs */}
      <div className="grid gap-3 lg:grid-cols-3">
        <ROIComparisonCard
          roiActual={MOCK_KPI.roi}
          roiEstimated={MOCK_KPI.roiEstimated}
          monthlyData={MOCK_ROI_MONTHLY}
        />
        <div className="grid gap-3 md:grid-cols-3 lg:col-span-2">
          <KPICard
            title="Ahorro Combustible"
            value={formatCurrency(MOCK_KPI.fuelSavingsMXN)}
            trend={MOCK_KPI.fuelSavingsTrend}
            trendLabel="vs mes ant."
            icon={<Fuel className="h-4 w-4" />}
          />
          <KPICard
            title="CO₂ Reducido"
            value={`${formatNumber(MOCK_KPI.co2ReductionTons)} ton`}
            trend={MOCK_KPI.co2ReductionTrend}
            trendLabel="vs año ant."
            icon={<Leaf className="h-4 w-4" />}
            valueClassName="text-accent-green"
          />
          <KPICard
            title="Utilización Flota"
            value={`${MOCK_KPI.fleetUtilization}%`}
            trend={MOCK_KPI.fleetUtilizationTrend}
            trendLabel="vs semana ant."
            icon={<Gauge className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { icon: Bus, label: "Total Buses", value: MOCK_KPI.totalBuses, sub: `${MOCK_KPI.activeBuses} activos` },
          { icon: Route, label: "Rutas Activas", value: MOCK_KPI.totalRoutes, sub: "5 agencias" },
          { icon: Users, label: "Pasajeros Diarios", value: `${formatNumber(MOCK_KPI.totalPassengersDaily / 1000)}K`, sub: "promedio" },
        ].map(({ icon: Icon, label, value, sub }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary-light" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{label}</p>
                  <p className="text-xl font-bold leading-none">{value}</p>
                  <p className="text-xs text-text-muted">{sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficas + Buses recientes */}
      <div className="grid gap-3 lg:grid-cols-3">
        <ChartWrapper title="Rutas por Agencia" description="Por sistema de transporte">
          <BarChart data={agencyRoutesData} />
        </ChartWrapper>

        <ChartWrapper title="Estado de la Flota" description="Buses por estado">
          <DoughnutChart data={fleetStatusData} centerText={`${MOCK_KPI.totalBuses}`} />
        </ChartWrapper>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm">Buses Recientes</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2">
              {MOCK_FLEET.slice(0, 5).map((bus) => {
                const model = BUS_MODELS.find((m) => m.id === bus.modelId);
                return (
                  <div key={bus.id} className="flex items-center justify-between p-2 rounded-md bg-surface-light/50">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10">
                        <Bus className="h-4 w-4 text-primary-light" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">{bus.id.toUpperCase()}</p>
                        <p className="text-xs text-text-muted">{model?.manufacturer} {model?.modelName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${
                        bus.currentBatteryPercent > 50 ? "text-accent-green"
                        : bus.currentBatteryPercent > 20 ? "text-accent-yellow"
                        : "text-accent-red"
                      }`}>{bus.currentBatteryPercent}%</span>
                      {getStatusBadge(bus.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia pasajeros */}
      <ChartWrapper title="Tendencia de Pasajeros" description="Última semana (miles)">
        <LineChart data={passengerTrendData} />
      </ChartWrapper>

      {/* ── Escenario de Expansión de Flota ── */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary-light" />
                Escenario de Expansión de Flota Eléctrica
              </CardTitle>
              <p className="text-xs text-text-muted mt-0.5">Proyección ejecutiva para toma de decisiones estratégicas</p>
            </div>
            <Badge variant="default" className="text-xs">Director General</Badge>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          {/* Controles */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-text-muted block mb-1">Ruta objetivo</label>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="w-full text-xs bg-surface-light border border-border rounded-md px-2 py-1.5 text-foreground"
              >
                {MOCK_ROUTES.map((r) => (
                  <option key={r.id} value={r.id}>{r.shortName} — {r.name.split(" - ")[0]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Modelo de bus</label>
              <select
                value={expansionModelId}
                onChange={(e) => setExpansionModelId(e.target.value)}
                className="w-full text-xs bg-surface-light border border-border rounded-md px-2 py-1.5 text-foreground"
              >
                {BUS_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>{m.manufacturer} {m.modelName} — ${(m.unitCostUsd/1000).toFixed(0)}K USD</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Buses a adquirir</label>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={1} max={500} value={expansionBuses}
                  onChange={(e) => setExpansionBuses(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-xs bg-surface-light border border-border rounded-md px-2 py-1.5 text-foreground"
                />
                <div className="flex gap-1">
                  {[20, 50, 100, 200].map((n) => (
                    <button key={n} onClick={() => setExpansionBuses(n)}
                      className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${expansionBuses === n ? "border-primary-light bg-primary/10 text-primary-light" : "border-border text-text-muted hover:border-primary-light"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KPIs del escenario */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-text-muted">Inversión total</p>
              <p className="text-base font-bold text-primary-light">{fmt(investmentMXN)}</p>
              <p className="text-xs text-text-muted">{expansionBuses} buses × ${(expansionModel.unitCostUsd/1000).toFixed(0)}K USD</p>
            </div>
            <div className={`p-3 rounded-lg ${expansionROI >= 15 ? "bg-accent-green/5 border border-accent-green/20" : expansionROI >= 8 ? "bg-primary/5 border border-primary/20" : "bg-accent-red/5 border border-accent-red/20"}`}>
              <p className="text-xs text-text-muted">ROI proyectado año 1</p>
              <p className={`text-base font-bold ${expansionROI >= 15 ? "text-accent-green" : expansionROI >= 8 ? "text-primary-light" : "text-accent-red"}`}>{expansionROI.toFixed(1)}%</p>
              <p className="text-xs text-text-muted">Recuperación en {expansionPayback.toFixed(1)} años</p>
            </div>
            <div className="p-3 rounded-lg bg-accent-yellow/5 border border-accent-yellow/20">
              <p className="text-xs text-text-muted">Ahorro combustible/año</p>
              <p className="text-base font-bold text-accent-yellow">{fmt(annualFuelSaving)}</p>
              <p className="text-xs text-text-muted">eléctrico vs diésel</p>
            </div>
            <div className="p-3 rounded-lg bg-accent-green/5 border border-accent-green/20">
              <p className="text-xs text-text-muted flex items-center gap-1"><Zap className="h-3 w-3" />CO₂ evitado/año</p>
              <p className="text-base font-bold text-accent-green">{Math.round(annualCO2Tons).toLocaleString("es-MX")} ton</p>
              <p className="text-xs text-text-muted">ruta {selectedRoute.shortName} · {selectedRoute.distanceKm} km</p>
            </div>
          </div>

          {/* Gráfica proyección */}
          <div className="h-48">
            <LineChart data={expansionProjectionData} />
          </div>
          <p className="text-xs text-text-muted text-center">Ahorro acumulado vs inversión inicial (millones MXN) · {selectedRoute.shortName} con {expansionModel.manufacturer} {expansionModel.modelName}</p>
        </CardContent>
      </Card>

      {/* ── Tablero por Ruta ── */}
      <div className="grid gap-3 lg:grid-cols-2">
        <ChartWrapper title="Pasajeros Diarios por Ruta" description="Estimado por línea de transporte">
          <BarChart data={routePassengersData} horizontal />
        </ChartWrapper>
        <ChartWrapper title="CO₂ Evitado por Ruta vs Diésel" description="Toneladas anuales estimadas con flota eléctrica equivalente">
          <BarChart data={routeCO2Data} />
        </ChartWrapper>
      </div>

      {/* Detalle por ruta */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm">Tablero por Ruta — Pasajeros · CO₂ · Día de Semana</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MOCK_ROUTES.map((route) => {
              const dailyPax = ROUTE_PASSENGERS[route.id] ?? 0;
              const busesSim = Math.round(dailyPax / 80);
              const co2Year = Math.round(busesSim * route.distanceKm * DAILY_TRIPS * OPERATING_DAYS * DIESEL_LITERS_PER_KM * CO2_KG_PER_LITER_DIESEL / 1000);
              const agencyColors: Record<string, string> = {
                metrobus: "bg-red-500", metro: "bg-orange-500", trolebus: "bg-blue-500",
                cablebus: "bg-purple-500", rtp: "bg-green-500",
              };
              return (
                <div key={route.id} className="p-3 rounded-lg bg-surface-light border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${agencyColors[route.agency] ?? "bg-primary"}`} />
                      <span className="text-xs font-bold">{route.shortName}</span>
                    </div>
                    <span className="text-xs text-text-muted">{route.agency}</span>
                  </div>
                  <p className="text-xs text-text-muted truncate mb-2">{route.name.split(" - ").slice(-1)[0]}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted flex items-center gap-1"><Users className="h-3 w-3" />Pasajeros/día</span>
                      <span className="font-medium">{dailyPax >= 1000 ? `${(dailyPax/1000).toFixed(0)}K` : dailyPax}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted flex items-center gap-1"><Leaf className="h-3 w-3 text-accent-green" />CO₂ evitado/año</span>
                      <span className="font-medium text-accent-green">{co2Year.toLocaleString("es-MX")} ton</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Distancia</span>
                      <span className="font-medium">{route.distanceKm} km</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Frec. entre semana</span>
                      <span className="font-medium">c/{route.frequency} min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
