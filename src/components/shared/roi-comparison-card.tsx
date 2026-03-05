"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ROIMonthlyData } from "@/types";
import { MOCK_ROUTES } from "@/constants/mock-data";
import { BUS_MODELS } from "@/constants/bus-models";

const MXN_PER_USD = 17.5;
const PRICE_PER_KWH_MXN = 2.8;
const DIESEL_PRICE_PER_LITER_MXN = 24;
const DIESEL_LITERS_PER_KM = 0.35;
const DAILY_TRIPS = 10;
const OPERATING_DAYS = 310;

function estimateROI(routeId: string, modelId: string, buses: number) {
  const route = MOCK_ROUTES.find((r) => r.id === routeId);
  const model = BUS_MODELS.find((m) => m.id === modelId);
  if (!route || !model || buses < 1) return null;

  const kmPerBusPerYear = route.distanceKm * DAILY_TRIPS * OPERATING_DAYS;
  const totalInvestmentMXN = buses * (model.unitCostUsd * MXN_PER_USD);

  const electricCostPerYear = buses * kmPerBusPerYear * model.energyConsumptionKwhPerKm * PRICE_PER_KWH_MXN;
  const dieselCostPerYear = buses * kmPerBusPerYear * DIESEL_LITERS_PER_KM * DIESEL_PRICE_PER_LITER_MXN;
  const maintenanceSavings = buses * kmPerBusPerYear * 0.25;
  const netAnnualReturn = dieselCostPerYear - electricCostPerYear + maintenanceSavings;
  const roi = (netAnnualReturn / totalInvestmentMXN) * 100;
  const payback = netAnnualReturn > 0 ? totalInvestmentMXN / netAnnualReturn : 0;
  const co2 = buses * kmPerBusPerYear * DIESEL_LITERS_PER_KM * 2.68 / 1000;

  return { roi, payback, netAnnualReturn, totalInvestmentMXN, co2, dieselCostPerYear, electricCostPerYear, maintenanceSavings };
}

interface ROIComparisonCardProps {
  roiActual: number;
  roiEstimated: number;
  monthlyData: ROIMonthlyData[];
  className?: string;
}

export function ROIComparisonCard({
  roiActual,
  roiEstimated,
  monthlyData,
  className,
}: ROIComparisonCardProps) {
  const variance = roiActual - roiEstimated;
  const isPositive = variance >= 0;

  const [showEstimator, setShowEstimator] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(MOCK_ROUTES[0].id);
  const [selectedModel, setSelectedModel] = useState(BUS_MODELS[0].id);
  const [buses, setBuses] = useState(10);
  const est = estimateROI(selectedRoute, selectedModel, buses);

  const fmt = (v: number) =>
    v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${Math.round(v).toLocaleString("es-MX")}`;

  const maxValue = Math.max(
    ...monthlyData.map((d) => Math.max(d.estimated, d.actual ?? 0))
  );

  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-text-secondary">
              ROI Anual
            </CardTitle>
            <p className="text-3xl font-bold tracking-tight mt-1">
              {roiActual.toFixed(1)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Estimado</p>
            <p className="text-lg font-semibold text-text-secondary">
              {roiEstimated.toFixed(1)}%
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-1 text-xs mt-1",
            isPositive ? "text-accent-green" : "text-accent-red"
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>
            {isPositive ? "+" : ""}
            {variance.toFixed(1)}% vs estimado
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Barras comparativas */}
        <div className="space-y-2 mt-2">
          {monthlyData.map((item) => (
            <div key={item.month} className="flex items-center gap-2">
              <span className="text-xs text-text-muted w-7 shrink-0">
                {item.month}
              </span>
              <div className="flex-1 flex flex-col gap-0.5">
                {/* Barra estimado */}
                <div className="h-1.5 w-full bg-surface-light rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/40"
                    style={{
                      width: `${(item.estimated / maxValue) * 100}%`,
                    }}
                  />
                </div>
                {/* Barra real */}
                <div className="h-1.5 w-full bg-surface-light rounded-full overflow-hidden">
                  {item.actual !== null ? (
                    <div
                      className={cn(
                        "h-full rounded-full",
                        item.actual >= item.estimated
                          ? "bg-accent-green"
                          : "bg-accent-red"
                      )}
                      style={{
                        width: `${(item.actual / maxValue) * 100}%`,
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-surface-light/50 rounded-full" />
                  )}
                </div>
              </div>
              <div className="text-xs text-right w-12 shrink-0">
                {item.actual !== null ? (
                  <span
                    className={
                      item.actual >= item.estimated
                        ? "text-accent-green"
                        : "text-accent-red"
                    }
                  >
                    {item.actual.toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-full bg-primary/40" />
            <span className="text-xs text-text-muted">Estimado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-full bg-accent-green" />
            <span className="text-xs text-text-muted">Real (sobre estimado)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-full bg-accent-red" />
            <span className="text-xs text-text-muted">Real (bajo estimado)</span>
          </div>
        </div>

        {/* Estimador */}
        <div className="mt-3 border-t border-border/30 pt-3">
          <button
            onClick={() => setShowEstimator((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-primary-light hover:text-primary-light/80 transition-colors w-full"
          >
            <ChevronDown className={cn("h-3 w-3 transition-transform", showEstimator && "rotate-180")} />
            Estimar ROI por ruta y flotilla
          </button>

          {showEstimator && (
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-text-muted block mb-1">Ruta</label>
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="w-full text-xs bg-surface-light border border-border rounded-md px-2 py-1.5 text-foreground"
                  >
                    {MOCK_ROUTES.map((r) => (
                      <option key={r.id} value={r.id}>{r.shortName} — {r.agency}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">Modelo de bus</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full text-xs bg-surface-light border border-border rounded-md px-2 py-1.5 text-foreground"
                  >
                    {BUS_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.manufacturer} {m.modelName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-text-muted shrink-0">Buses:</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={buses}
                  onChange={(e) => setBuses(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-xs bg-surface-light border border-border rounded-md px-2 py-1.5 text-foreground"
                />
                <div className="flex gap-1">
                  {[5, 10, 20, 50].map((n) => (
                    <button key={n} onClick={() => setBuses(n)}
                      className={cn("px-2 py-0.5 text-xs rounded-full border transition-colors",
                        buses === n ? "border-primary-light bg-primary/10 text-primary-light" : "border-border text-text-muted hover:border-primary-light"
                      )}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {est && (
                <div className="space-y-1.5 pt-1">
                  {/* ROI + recuperación */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className={cn("p-2 rounded-lg", est.roi >= 15 ? "bg-accent-green/5 border border-accent-green/20" : est.roi >= 8 ? "bg-primary/5 border border-primary/20" : "bg-accent-red/5 border border-accent-red/20")}>
                      <p className="text-xs text-text-muted">ROI año 1</p>
                      <p className={cn("text-lg font-bold", est.roi >= 15 ? "text-accent-green" : est.roi >= 8 ? "text-primary-light" : "text-accent-red")}>
                        {est.roi.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-light">
                      <p className="text-xs text-text-muted">Recuperación</p>
                      <p className="text-lg font-bold">{est.payback.toFixed(1)} años</p>
                    </div>
                  </div>
                  {/* Comparativa eléctrico vs diésel */}
                  <div className="p-2 rounded-lg bg-surface-light space-y-1">
                    <p className="text-xs font-medium text-text-secondary">Costo operativo anual (eléctrico vs diésel)</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">⚡ Eléctrico</span>
                      <span className="text-primary-light font-medium">{fmt(est.electricCostPerYear)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">⛽ Diésel equiv.</span>
                      <span className="text-accent-red font-medium">{fmt(est.dieselCostPerYear)}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-border/30 pt-1">
                      <span className="text-text-muted font-medium">Ahorro total/año</span>
                      <span className="text-accent-green font-bold">{fmt(est.netAnnualReturn)}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-accent-green/5 border border-accent-green/20">
                    <p className="text-xs text-text-muted">CO₂ evitado/año</p>
                    <p className="text-sm font-bold text-accent-green">{Math.round(est.co2).toLocaleString("es-MX")} ton</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
