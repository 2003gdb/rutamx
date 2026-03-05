"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  History,
  Calculator,
  DollarSign,
  Zap,
  Bus,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { MOCK_ROI_MONTHLY } from "@/constants/mock-data";

// --- Constantes del modelo de simulación ---
// Basado en parámetros reales del sistema CDMX
const COST_PER_BUS_USD = 350000; // costo promedio bus eléctrico
const MXN_PER_USD = 17.5;
const ANNUAL_FUEL_SAVINGS_PER_BUS_MXN = 480000; // ahorro anual diesel vs eléctrico
const ANNUAL_MAINTENANCE_SAVINGS_PER_BUS_MXN = 120000; // menor mantenimiento eléctrico
const CHARGING_INFRA_PER_BUS_MXN = 280000; // infraestructura de carga por bus
const ANNUAL_ENERGY_COST_PER_BUS_MXN = 95000; // costo energía eléctrica por bus/año

function calcSimulation(investmentMXN: number) {
  const buses = Math.floor(
    investmentMXN / (COST_PER_BUS_USD * MXN_PER_USD + CHARGING_INFRA_PER_BUS_MXN)
  );
  const annualGains =
    buses * (ANNUAL_FUEL_SAVINGS_PER_BUS_MXN + ANNUAL_MAINTENANCE_SAVINGS_PER_BUS_MXN);
  const annualCosts = buses * ANNUAL_ENERGY_COST_PER_BUS_MXN;
  const netAnnualReturn = annualGains - annualCosts;
  const roi = investmentMXN > 0 ? (netAnnualReturn / investmentMXN) * 100 : 0;
  const paybackYears = netAnnualReturn > 0 ? investmentMXN / netAnnualReturn : 0;
  const co2AvoidedTons = buses * 82; // ~82 ton CO2/año por bus eléctrico vs diesel
  return { buses, annualGains, annualCosts, netAnnualReturn, roi, paybackYears, co2AvoidedTons };
}

export default function ROIPage() {
  const [investmentMXN, setInvestmentMXN] = useState(500_000_000); // $500M MXN default

  const sim = useMemo(() => calcSimulation(investmentMXN), [investmentMXN]);

  // Datos históricos del ROI real vs estimado (últimos 12 meses)
  const historicalChartData = {
    labels: MOCK_ROI_MONTHLY.map((d) => d.month),
    datasets: [
      {
        label: "ROI Estimado (%)",
        data: MOCK_ROI_MONTHLY.map((d) => d.estimated),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.1)",
        fill: false,
      },
      {
        label: "ROI Real (%)",
        data: MOCK_ROI_MONTHLY.map((d) => d.actual ?? 0),
        borderColor: "#22C55E",
        backgroundColor: "rgba(34,197,94,0.15)",
        fill: true,
      },
    ],
  };

  // Proyección de ROI simulado a 5 años
  const projectionLabels = ["Año 1", "Año 2", "Año 3", "Año 4", "Año 5"];
  const projectedROI = projectionLabels.map((_, i) => {
    // ROI acumulado mejora con escala y optimización operativa
    const scale = 1 + i * 0.08;
    return parseFloat((sim.roi * scale).toFixed(1));
  });

  const projectionChartData = {
    labels: projectionLabels,
    datasets: [
      {
        label: "ROI Proyectado (%)",
        data: projectedROI,
        backgroundColor: projectedROI.map((v) =>
          v >= 20 ? "#22C55E" : v >= 10 ? "#3B82F6" : "#F97316"
        ),
      },
    ],
  };

  // Desglose anual de ganancias vs costos
  const breakdownData = {
    labels: ["Ahorro Combustible", "Ahorro Mantenimiento", "Costo Energía Eléctrica"],
    datasets: [
      {
        label: "MXN / año",
        data: [
          sim.buses * ANNUAL_FUEL_SAVINGS_PER_BUS_MXN,
          sim.buses * ANNUAL_MAINTENANCE_SAVINGS_PER_BUS_MXN,
          -(sim.buses * ANNUAL_ENERGY_COST_PER_BUS_MXN),
        ],
        backgroundColor: ["#22C55E", "#3B82F6", "#EF4444"],
      },
    ],
  };

  const formatMXN = (v: number) =>
    v >= 1_000_000_000
      ? `$${(v / 1_000_000_000).toFixed(1)}B`
      : v >= 1_000_000
      ? `$${(v / 1_000_000).toFixed(0)}M`
      : `$${formatNumber(v)}`;

  const historicalAvgROI =
    MOCK_ROI_MONTHLY.filter((d) => d.actual !== null).reduce((a, d) => a + (d.actual ?? 0), 0) /
    MOCK_ROI_MONTHLY.filter((d) => d.actual !== null).length;

  const bestMonth = MOCK_ROI_MONTHLY.filter((d) => d.actual !== null).reduce((best, d) =>
    (d.actual ?? 0) > (best.actual ?? 0) ? d : best
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">ROI — Retorno sobre Inversión</h1>
        <p className="text-text-secondary">
          Historial real de la empresa y simulador de inversión en infraestructura eléctrica
        </p>
      </div>

      {/* ── SECCIÓN HISTÓRICA ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-yellow/10">
            <History className="h-4 w-4 text-accent-yellow" />
          </div>
          <h2 className="text-lg font-semibold">ROI Histórico</h2>
          <Badge variant="warning" className="text-xs">Datos Pasados · 2024</Badge>
          <div className="flex items-center gap-1 text-xs text-text-muted ml-1">
            <Info className="h-3 w-3" />
            <span>Refleja el desempeño real registrado de la flota existente</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-accent-yellow/30 bg-accent-yellow/5">
            <CardContent className="p-4">
              <p className="text-xs text-text-secondary mb-1">ROI Promedio Anual Real</p>
              <p className="text-2xl font-bold text-accent-yellow">
                {historicalAvgROI.toFixed(1)}%
              </p>
              <p className="text-xs text-text-muted mt-1">
                Promedio de {MOCK_ROI_MONTHLY.filter((d) => d.actual !== null).length} meses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-text-secondary mb-1">ROI Estimado Original</p>
              <p className="text-2xl font-bold text-text-secondary">21.0%</p>
              <p className="text-xs text-text-muted mt-1">Proyección inicial del proyecto</p>
            </CardContent>
          </Card>

          <Card className="border-accent-green/30 bg-accent-green/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-accent-green" />
                <p className="text-xs text-text-secondary">Mejor Mes</p>
              </div>
              <p className="text-2xl font-bold text-accent-green">
                {bestMonth.actual?.toFixed(1)}%
              </p>
              <p className="text-xs text-text-muted mt-1">{bestMonth.month} 2024</p>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-xs text-text-secondary mb-1">Vs. Estimado</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-accent-green" />
                <p className="text-2xl font-bold text-accent-green">
                  +{(historicalAvgROI - 21.0).toFixed(1)}%
                </p>
              </div>
              <p className="text-xs text-text-muted mt-1">Supera la proyección</p>
            </CardContent>
          </Card>
        </div>

        <ChartWrapper
          title="ROI Mensual: Real vs Estimado (2024)"
          description="Comparación del retorno real obtenido contra la proyección inicial"
        >
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-accent-yellow text-accent-yellow">
              ⚠ Datos históricos pasados — no representan rendimiento futuro garantizado
            </Badge>
          </div>
          <LineChart data={historicalChartData} />
        </ChartWrapper>

        {/* Tabla detallada histórica */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4 text-accent-yellow" />
              Detalle Mensual 2024
              <Badge variant="warning" className="text-xs ml-1">Histórico</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-1 text-xs text-text-muted font-medium mb-2 px-2">
              <span className="col-span-2">Mes</span>
              <span className="col-span-3 text-right">Estimado</span>
              <span className="col-span-3 text-right">Real</span>
              <span className="col-span-4 text-right">Diferencia</span>
            </div>
            <div className="space-y-1">
              {MOCK_ROI_MONTHLY.map((d) => {
                const diff = d.actual !== null ? d.actual - d.estimated : null;
                return (
                  <div
                    key={d.month}
                    className="grid grid-cols-12 gap-1 items-center px-2 py-1.5 rounded-lg hover:bg-surface-light/50 text-sm"
                  >
                    <span className="col-span-2 font-medium">{d.month}</span>
                    <span className="col-span-3 text-right text-text-secondary">
                      {d.estimated.toFixed(1)}%
                    </span>
                    <span className="col-span-3 text-right">
                      {d.actual !== null ? (
                        <span
                          className={d.actual >= d.estimated ? "text-accent-green" : "text-accent-red"}
                        >
                          {d.actual.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-text-muted">Pendiente</span>
                      )}
                    </span>
                    <span className="col-span-4 text-right">
                      {diff !== null ? (
                        <span
                          className={`flex items-center justify-end gap-1 ${
                            diff >= 0 ? "text-accent-green" : "text-accent-red"
                          }`}
                        >
                          {diff >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {diff >= 0 ? "+" : ""}
                          {diff.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── SECCIÓN SIMULADOR ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Calculator className="h-4 w-4 text-primary-light" />
          </div>
          <h2 className="text-lg font-semibold">Simulador de Inversión</h2>
          <Badge variant="default" className="text-xs">Proyección Estimada</Badge>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary-light" />
              Inversión en Infraestructura Eléctrica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Slider de inversión */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-sm text-text-secondary">
                  Monto de inversión
                </label>
                <span className="text-2xl font-bold text-primary-light">
                  {formatMXN(investmentMXN)} MXN
                </span>
              </div>
              <Slider
                value={investmentMXN}
                onValueChange={setInvestmentMXN}
                min={50_000_000}
                max={5_000_000_000}
                step={50_000_000}
              />
              <div className="flex justify-between text-xs text-text-muted">
                <span>$50M MXN</span>
                <span>$5,000M MXN</span>
              </div>
              {/* Shortcuts */}
              <div className="flex gap-2 flex-wrap">
                {[100, 250, 500, 1000, 2000, 3500].map((m) => (
                  <button
                    key={m}
                    onClick={() => setInvestmentMXN(m * 1_000_000)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      investmentMXN === m * 1_000_000
                        ? "border-primary-light bg-primary/10 text-primary-light"
                        : "border-border text-text-muted hover:border-primary-light hover:text-primary-light"
                    }`}
                  >
                    ${m}M
                  </button>
                ))}
              </div>
            </div>

            {/* Supuestos del modelo */}
            <div className="p-3 rounded-lg bg-surface-light/50 border border-border/50">
              <p className="text-xs font-medium text-text-secondary mb-2">Supuestos del modelo</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-text-muted">
                <span>Costo bus: ${formatNumber(COST_PER_BUS_USD)} USD</span>
                <span>Infra/bus: ${formatNumber(CHARGING_INFRA_PER_BUS_MXN / 1000)}K MXN</span>
                <span>Ahorro fuel: ${formatNumber(ANNUAL_FUEL_SAVINGS_PER_BUS_MXN / 1000)}K MXN/año</span>
                <span>Tipo cambio: {MXN_PER_USD} MXN/USD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs de simulación */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bus className="h-4 w-4 text-primary-light" />
                <p className="text-xs text-text-secondary">Buses Adquiribles</p>
              </div>
              <p className="text-2xl font-bold text-primary-light">{formatNumber(sim.buses)}</p>
              <p className="text-xs text-text-muted mt-1">incluye infraestructura de carga</p>
            </CardContent>
          </Card>

          <Card
            className={`${
              sim.roi >= 20
                ? "border-accent-green/30 bg-accent-green/5"
                : sim.roi >= 10
                ? "border-primary/30 bg-primary/5"
                : "border-accent-red/30 bg-accent-red/5"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-accent-green" />
                <p className="text-xs text-text-secondary">ROI Estimado Año 1</p>
              </div>
              <p
                className={`text-2xl font-bold ${
                  sim.roi >= 20
                    ? "text-accent-green"
                    : sim.roi >= 10
                    ? "text-primary-light"
                    : "text-accent-red"
                }`}
              >
                {sim.roi.toFixed(1)}%
              </p>
              <p className="text-xs text-text-muted mt-1">retorno neto anual</p>
            </CardContent>
          </Card>

          <Card className="border-accent-yellow/30 bg-accent-yellow/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-accent-yellow" />
                <p className="text-xs text-text-secondary">Retorno Neto Anual</p>
              </div>
              <p className="text-2xl font-bold text-accent-yellow">
                {formatMXN(sim.netAnnualReturn)}
              </p>
              <p className="text-xs text-text-muted mt-1">MXN / año</p>
            </CardContent>
          </Card>

          <Card className="border-accent-green/30 bg-accent-green/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-accent-green" />
                <p className="text-xs text-text-secondary">CO₂ Evitado/Año</p>
              </div>
              <p className="text-2xl font-bold text-accent-green">
                {formatNumber(sim.co2AvoidedTons)} ton
              </p>
              <p className="text-xs text-text-muted mt-1">
                recuperación en {sim.paybackYears.toFixed(1)} años
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficas del simulador */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartWrapper
            title="ROI Proyectado a 5 Años"
            description="Estimación de retorno acumulado con mejora operativa progresiva"
          >
            <BarChart data={projectionChartData} />
          </ChartWrapper>

          <ChartWrapper
            title="Desglose Financiero Anual"
            description="Ahorros generados vs costos operativos de la flota simulada"
          >
            <BarChart data={breakdownData} />
          </ChartWrapper>
        </div>

        {/* Resumen financiero */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary-light" />
              Resumen Financiero de la Simulación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-3 rounded-lg bg-surface-light">
                <p className="text-xs text-text-secondary">Inversión Total</p>
                <p className="text-xl font-bold mt-1">{formatMXN(investmentMXN)}</p>
                <p className="text-xs text-text-muted">MXN</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-light">
                <p className="text-xs text-text-secondary">Buses + Infraestructura</p>
                <p className="text-xl font-bold mt-1">{formatNumber(sim.buses)} unidades</p>
                <p className="text-xs text-text-muted">
                  {formatMXN(
                    sim.buses * (COST_PER_BUS_USD * MXN_PER_USD + CHARGING_INFRA_PER_BUS_MXN)
                  )}{" "}
                  utilizado
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-light">
                <p className="text-xs text-text-secondary">Ahorro Combustible/Año</p>
                <p className="text-xl font-bold mt-1 text-accent-green">
                  {formatMXN(sim.buses * ANNUAL_FUEL_SAVINGS_PER_BUS_MXN)}
                </p>
                <p className="text-xs text-text-muted">vs flota diésel equivalente</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-light">
                <p className="text-xs text-text-secondary">Ahorro Mantenimiento/Año</p>
                <p className="text-xl font-bold mt-1 text-accent-green">
                  {formatMXN(sim.buses * ANNUAL_MAINTENANCE_SAVINGS_PER_BUS_MXN)}
                </p>
                <p className="text-xs text-text-muted">menor desgaste motor eléctrico</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-light">
                <p className="text-xs text-text-secondary">Costo Energía Eléctrica/Año</p>
                <p className="text-xl font-bold mt-1 text-accent-red">
                  -{formatMXN(sim.buses * ANNUAL_ENERGY_COST_PER_BUS_MXN)}
                </p>
                <p className="text-xs text-text-muted">costo de recarga de la flota</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs text-text-secondary">Punto de Equilibrio</p>
                <p className="text-xl font-bold mt-1 text-primary-light">
                  {sim.paybackYears > 0 ? `${sim.paybackYears.toFixed(1)} años` : "—"}
                </p>
                <p className="text-xs text-text-muted">recuperación de la inversión</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg border border-border/50 bg-surface-light/30">
              <p className="text-xs text-text-muted flex items-center gap-1">
                <Info className="h-3 w-3" />
                Esta es una <strong>estimación aproximada</strong> con fines de planeación. Los valores reales dependen de precios de energía, condiciones operativas, subsidios y tipo de cambio vigente.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
