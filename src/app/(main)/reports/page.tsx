"use client";

import { useState, useEffect } from "react";
import {
  Leaf,
  Users,
  Calendar,
  MapPin,
  Download,
  FileText,
  TreePine,
  Car,
  Bus,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import {
  MOCK_KPI,
  MOCK_EMISSIONS,
  MOCK_PASSENGERS,
  MOCK_CORRIDORS,
  MOCK_ROUTES,
} from "@/constants/mock-data";
import { formatNumber } from "@/lib/utils";
import {
  calculateTreeEquivalent,
  calculateCarEquivalent,
} from "@/lib/calculations/emissions";

// Datos por ruta
const DIESEL_LITERS_PER_KM = 0.35;
const DIESEL_PRICE_MXN = 24;
const PRICE_PER_KWH_MXN = 2.8;
const CO2_KG_PER_LITER = 2.68;
const DAILY_TRIPS = 10;
const OPERATING_DAYS = 310;
const AVG_KWH_PER_KM = 1.4;

const ROUTE_PASSENGERS: Record<string, { weekday: number; weekend: number }> = {
  "mb-1":       { weekday: 105000, weekend: 62000 },
  "mb-2":       { weekday: 80000,  weekend: 48000 },
  "mb-3":       { weekday: 75000,  weekend: 44000 },
  "metro-1":    { weekday: 320000, weekend: 195000 },
  "trolebus-1": { weekday: 58000,  weekend: 31000 },
  "cablebus-1": { weekday: 32000,  weekend: 21000 },
  "rtp-1":      { weekday: 42000,  weekend: 24000 },
};

export default function ReportsPage() {
  const [pdfReady, setPdfReady] = useState(false);
  const [PDFComponents, setPDFComponents] = useState<{
    PDFDownloadLink: React.ComponentType<{
      document: React.ReactElement;
      fileName: string;
      children: (props: { loading: boolean }) => React.ReactNode;
    }>;
    FeasibilityReport: React.ComponentType<{
      kpiData: typeof MOCK_KPI;
      emissionsData: typeof MOCK_EMISSIONS;
      generatedDate: string;
    }>;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      import("@react-pdf/renderer"),
      import("@/lib/pdf/report-template"),
    ]).then(([pdfRenderer, reportTemplate]) => {
      setPDFComponents({
        PDFDownloadLink: pdfRenderer.PDFDownloadLink as React.ComponentType<{
          document: React.ReactElement;
          fileName: string;
          children: (props: { loading: boolean }) => React.ReactNode;
        }>,
        FeasibilityReport: reportTemplate.FeasibilityReport,
      });
      setPdfReady(true);
    });
  }, []);

  const totalCO2 = MOCK_EMISSIONS.reduce((a, b) => a + b.co2Avoided, 0);
  const treeEquivalent = calculateTreeEquivalent(totalCO2 * 1000);
  const carEquivalent = calculateCarEquivalent(totalCO2 * 1000);

  const emissionsChartData = {
    labels: MOCK_EMISSIONS.map((e) => e.month),
    datasets: [
      {
        label: "CO₂ Evitado (ton)",
        data: MOCK_EMISSIONS.map((e) => e.co2Avoided),
        borderColor: "#22C55E",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: true,
      },
    ],
  };

  const passengerChartData = {
    labels: MOCK_PASSENGERS.map((p) =>
      new Date(p.date).toLocaleDateString("es-MX", { month: "short", day: "numeric" })
    ),
    datasets: [
      {
        label: "Entre Semana",
        data: MOCK_PASSENGERS.map((p) => p.weekday / 1000),
        backgroundColor: "#3B82F6",
      },
      {
        label: "Fin de Semana",
        data: MOCK_PASSENGERS.map((p) => p.weekend / 1000),
        backgroundColor: "#8B5CF6",
      },
    ],
  };

  const corridorChartData = {
    labels: MOCK_CORRIDORS.map((c) => c.corridorName),
    datasets: [
      {
        label: "Pasajeros Diarios (miles)",
        data: MOCK_CORRIDORS.map((c) => c.dailyPassengers / 1000),
        backgroundColor: [
          "#DC2626",
          "#F97316",
          "#22C55E",
          "#3B82F6",
          "#8B5CF6",
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-text-secondary">
            Análisis de emisiones, pasajeros y actividad por corredor
          </p>
        </div>
        <div className="flex gap-2">
          {pdfReady && PDFComponents ? (
            <PDFComponents.PDFDownloadLink
              document={
                <PDFComponents.FeasibilityReport
                  kpiData={MOCK_KPI}
                  emissionsData={MOCK_EMISSIONS}
                  generatedDate={new Date().toLocaleDateString("es-MX")}
                />
              }
              fileName="rutamx-feasibility-report.pdf"
            >
              {({ loading }) => (
                <Button disabled={loading} className="gap-2">
                  <Download className="h-4 w-4" />
                  {loading ? "Generando..." : "Descargar PDF"}
                </Button>
              )}
            </PDFComponents.PDFDownloadLink>
          ) : (
            <Button disabled className="gap-2">
              <Download className="h-4 w-4" />
              Cargando...
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-accent-green/30 bg-accent-green/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10">
                <Leaf className="h-5 w-5 text-accent-green" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">CO₂ Evitado Total</p>
                <p className="text-xl font-bold text-accent-green">
                  {formatNumber(totalCO2)} ton
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10">
                <TreePine className="h-5 w-5 text-accent-green" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">
                  Equivalente en Árboles
                </p>
                <p className="text-xl font-bold">
                  {formatNumber(treeEquivalent)}
                </p>
                <p className="text-xs text-text-muted">árboles/año</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Car className="h-5 w-5 text-primary-light" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Autos Retirados</p>
                <p className="text-xl font-bold">
                  {formatNumber(carEquivalent)}
                </p>
                <p className="text-xs text-text-muted">equivalente anual</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary-light" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Pasajeros Diarios</p>
                <p className="text-xl font-bold">
                  {formatNumber(MOCK_KPI.totalPassengersDaily / 1000)}K
                </p>
                <p className="text-xs text-text-muted">promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ChartWrapper
        title="Emisiones CO₂ Evitadas"
        description="Toneladas de CO₂ evitadas por mes"
      >
        <LineChart data={emissionsChartData} />
      </ChartWrapper>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartWrapper
          title="Pasajeros: Entre Semana vs Fin de Semana"
          description="Miles de pasajeros por semana"
        >
          <BarChart data={passengerChartData} />
        </ChartWrapper>

        <ChartWrapper
          title="Actividad por Corredor"
          description="Pasajeros diarios por corredor principal"
        >
          <BarChart data={corridorChartData} horizontal />
        </ChartWrapper>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-light" />
            Análisis por Corredor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_CORRIDORS.map((corridor) => (
              <div
                key={corridor.corridorId}
                className="p-4 rounded-lg bg-surface-light"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{corridor.corridorName}</h3>
                  <Badge variant="outline">
                    {corridor.averageOccupancy}% ocupación
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Pasajeros diarios</span>
                    <span className="font-medium">
                      {formatNumber(corridor.dailyPassengers)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Hora pico</span>
                    <span className="font-medium">
                      {formatNumber(corridor.peakHourPassengers)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-light rounded-full"
                    style={{ width: `${corridor.averageOccupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Tablero por Ruta ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bus className="h-5 w-5 text-primary-light" />
            Tablero por Ruta — Pasajeros · CO₂ · Semana vs Fin de Semana
          </CardTitle>
          <p className="text-sm text-text-secondary">Comparativa eléctrico vs diésel equivalente por línea de transporte</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MOCK_ROUTES.map((route) => {
              const pax = ROUTE_PASSENGERS[route.id] ?? { weekday: 0, weekend: 0 };
              const totalDailyAvg = Math.round((pax.weekday * 5 + pax.weekend * 2) / 7);
              const busesSim = Math.round(totalDailyAvg / 80);
              const kmYear = busesSim * route.distanceKm * DAILY_TRIPS * OPERATING_DAYS;
              const co2Avoided = Math.round(kmYear * DIESEL_LITERS_PER_KM * CO2_KG_PER_LITER / 1000);
              const dieselCost = Math.round(kmYear * DIESEL_LITERS_PER_KM * DIESEL_PRICE_MXN / 1_000_000);
              const electricCost = Math.round(kmYear * AVG_KWH_PER_KM * PRICE_PER_KWH_MXN / 1_000_000);
              const saving = dieselCost - electricCost;
              const agencyColor: Record<string, string> = {
                metrobus: "#DC2626", metro: "#F97316", trolebus: "#3B82F6",
                cablebus: "#8B5CF6", rtp: "#22C55E",
              };
              return (
                <div key={route.id} className="p-3 rounded-lg border border-border/50 bg-surface-light space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: agencyColor[route.agency] ?? "#64748B" }} />
                      <span className="text-sm font-bold">{route.shortName}</span>
                    </div>
                    <span className="text-xs text-text-muted capitalize">{route.agency}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-tight">{route.name.split(" - ").slice(-1)[0]} · {route.distanceKm} km</p>

                  {/* Pasajeros entre semana vs fin de semana */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-text-secondary flex items-center gap-1">
                      <Users className="h-3 w-3" /> Pasajeros / día
                    </p>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Entre semana</span>
                      <span className="font-medium">{pax.weekday >= 1000 ? `${(pax.weekday/1000).toFixed(0)}K` : pax.weekday}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Fin de semana</span>
                      <span className="font-medium">{pax.weekend >= 1000 ? `${(pax.weekend/1000).toFixed(0)}K` : pax.weekend}</span>
                    </div>
                    {/* Barra proporcional */}
                    <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden mt-1">
                      <div className="h-full rounded-full bg-primary-light/70"
                        style={{ width: `${Math.round((pax.weekend / pax.weekday) * 100)}%` }} />
                    </div>
                    <p className="text-xs text-text-muted">{Math.round((pax.weekend / pax.weekday) * 100)}% demanda fin de semana vs entre semana</p>
                  </div>

                  {/* CO₂ y costo */}
                  <div className="space-y-1 border-t border-border/30 pt-2">
                    <p className="text-xs font-medium text-text-secondary flex items-center gap-1">
                      <Leaf className="h-3 w-3 text-accent-green" /> CO₂ evitado vs diésel
                    </p>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">CO₂ evitado/año</span>
                      <span className="font-medium text-accent-green">{co2Avoided.toLocaleString("es-MX")} ton</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted flex items-center gap-0.5"><Zap className="h-3 w-3" />Costo eléctrico/año</span>
                      <span className="font-medium text-primary-light">${electricCost}M</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Costo diésel equiv.</span>
                      <span className="font-medium text-accent-red">${dieselCost}M</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-border/30 pt-1">
                      <span className="text-text-muted font-medium">Ahorro/año</span>
                      <span className="font-bold text-accent-green">${saving}M MXN</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-light" />
            Reportes Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border border-border hover:border-primary-light transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-accent-green/10">
                  <Leaf className="h-4 w-4 text-accent-green" />
                </div>
                <h3 className="font-medium">Reporte de Emisiones</h3>
              </div>
              <p className="text-sm text-text-secondary">
                Análisis completo de CO₂ evitado y comparativa diesel vs
                eléctrico
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border hover:border-primary-light transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                  <Users className="h-4 w-4 text-primary-light" />
                </div>
                <h3 className="font-medium">Reporte de Pasajeros</h3>
              </div>
              <p className="text-sm text-text-secondary">
                Estadísticas de pasajeros por ruta, horario y día de la semana
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border hover:border-primary-light transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-accent-yellow/10">
                  <Calendar className="h-4 w-4 text-accent-yellow" />
                </div>
                <h3 className="font-medium">Reporte Mensual</h3>
              </div>
              <p className="text-sm text-text-secondary">
                Resumen ejecutivo mensual con KPIs y métricas clave
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
