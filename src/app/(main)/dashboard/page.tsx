"use client";

import { TrendingUp, Fuel, Leaf, Gauge, Bus, Route, Users } from "lucide-react";
import { KPICard } from "@/components/shared/kpi-card";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { BarChart } from "@/components/charts/bar-chart";
import { DoughnutChart } from "@/components/charts/doughnut-chart";
import { LineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { MOCK_KPI, ROUTE_AGENCY_COUNT, MOCK_FLEET } from "@/constants/mock-data";
import { BUS_MODELS } from "@/constants/bus-models";

export default function DashboardPage() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-text-secondary">
            Visión general del sistema de transporte eléctrico
          </p>
        </div>
        <div className="text-sm text-text-muted">
          Última actualización: {new Date().toLocaleTimeString("es-MX")}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="ROI Anual"
          value={`${MOCK_KPI.roi}%`}
          trend={MOCK_KPI.roiTrend}
          trendLabel="vs año anterior"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="Ahorro en Combustible"
          value={formatCurrency(MOCK_KPI.fuelSavingsMXN)}
          trend={MOCK_KPI.fuelSavingsTrend}
          trendLabel="vs mes anterior"
          icon={<Fuel className="h-5 w-5" />}
        />
        <KPICard
          title="CO₂ Reducido"
          value={`${formatNumber(MOCK_KPI.co2ReductionTons)} ton`}
          trend={MOCK_KPI.co2ReductionTrend}
          trendLabel="vs año anterior"
          icon={<Leaf className="h-5 w-5" />}
          valueClassName="text-accent-green"
        />
        <KPICard
          title="Utilización Flota"
          value={`${MOCK_KPI.fleetUtilization}%`}
          trend={MOCK_KPI.fleetUtilizationTrend}
          trendLabel="vs semana anterior"
          icon={<Gauge className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bus className="h-6 w-6 text-primary-light" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total Buses</p>
                <p className="text-2xl font-bold">{MOCK_KPI.totalBuses}</p>
                <p className="text-xs text-text-muted">
                  {MOCK_KPI.activeBuses} activos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Route className="h-6 w-6 text-primary-light" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Rutas Activas</p>
                <p className="text-2xl font-bold">{MOCK_KPI.totalRoutes}</p>
                <p className="text-xs text-text-muted">5 agencias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary-light" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Pasajeros Diarios</p>
                <p className="text-2xl font-bold">
                  {formatNumber(MOCK_KPI.totalPassengersDaily / 1000)}K
                </p>
                <p className="text-xs text-text-muted">promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartWrapper
          title="Rutas por Agencia"
          description="Distribución de rutas por sistema de transporte"
        >
          <BarChart data={agencyRoutesData} />
        </ChartWrapper>

        <ChartWrapper
          title="Estado de la Flota"
          description="Distribución actual de buses por estado"
        >
          <DoughnutChart
            data={fleetStatusData}
            centerText={`${MOCK_KPI.totalBuses}`}
          />
        </ChartWrapper>
      </div>

      <ChartWrapper
        title="Tendencia de Pasajeros"
        description="Pasajeros transportados por día (última semana)"
      >
        <LineChart data={passengerTrendData} />
      </ChartWrapper>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Buses Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_FLEET.slice(0, 5).map((bus) => {
              const model = BUS_MODELS.find((m) => m.id === bus.modelId);
              return (
                <div
                  key={bus.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-light/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Bus className="h-5 w-5 text-primary-light" />
                    </div>
                    <div>
                      <p className="font-medium">{bus.id.toUpperCase()}</p>
                      <p className="text-sm text-text-secondary">
                        {model?.manufacturer} {model?.modelName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm">Batería</p>
                      <p
                        className={`font-medium ${
                          bus.currentBatteryPercent > 50
                            ? "text-accent-green"
                            : bus.currentBatteryPercent > 20
                            ? "text-accent-yellow"
                            : "text-accent-red"
                        }`}
                      >
                        {bus.currentBatteryPercent}%
                      </p>
                    </div>
                    {getStatusBadge(bus.status)}
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
