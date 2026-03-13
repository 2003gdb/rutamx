"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { LINE_DEMAND_STATS } from "@/constants/demand-data";
import { MOCK_ROUTES } from "@/constants/mock-data";
import { BUS_MODELS } from "@/constants/bus-models";
import { recommendBusCount, recommendBusModel } from "@/lib/calculations/demand";
import { formatNumber } from "@/lib/utils";
import { DayType } from "@/types";

const DAY_TYPES: { value: DayType; label: string }[] = [
  { value: "weekday", label: "Entre Semana" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

const QUALITY_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const QUALITY_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  high: "default",
  medium: "secondary",
  low: "destructive",
};

interface CooSidebarProps {
  lineId: string;
  onLineIdChange: (id: string) => void;
}

export function CooSidebar({ lineId, onLineIdChange }: CooSidebarProps) {
  const [dayType, setDayType] = useState<DayType>("weekday");
  const [occupancy, setOccupancy] = useState(80);

  const lineStat = useMemo(
    () => LINE_DEMAND_STATS.find(s => s.lineId === lineId)!,
    [lineId]
  );

  // Find matching route for frequency/distance
  const route = useMemo(
    () => MOCK_ROUTES.find(r => r.id === lineId) ?? MOCK_ROUTES[0],
    [lineId]
  );

  const busCount = useMemo(
    () => recommendBusCount(lineId, dayType, 80, occupancy / 100),
    [lineId, dayType, occupancy]
  );

  const modelRecs = useMemo(
    () => recommendBusModel(lineId, dayType, route.frequency, route.distanceKm, occupancy / 100),
    [lineId, dayType, route, occupancy]
  );

  const recommendedModel = modelRecs.find(r => r.isRecommended);

  return (
    <div className="flex flex-col gap-3 p-3 overflow-y-auto h-full">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-sm text-foreground">Optimización de Flota</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Recomendaciones basadas en afluencia histórica 2005–2026
        </p>
      </div>

      {/* Selectors */}
      <div className="flex flex-col gap-2">
        <Select value={lineId} onValueChange={onLineIdChange}>
          <SelectTrigger className="h-8 text-xs">
            <span>{LINE_DEMAND_STATS.find(s => s.lineId === lineId)?.name ?? 'Seleccionar línea'}</span>
          </SelectTrigger>
          <SelectContent>
            {LINE_DEMAND_STATS.map(s => (
              <SelectItem key={s.lineId} value={s.lineId}>
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dayType} onValueChange={v => setDayType(v as DayType)}>
          <SelectTrigger className="h-8 text-xs">
            <span>{DAY_TYPES.find(d => d.value === dayType)?.label}</span>
          </SelectTrigger>
          <SelectContent>
            {DAY_TYPES.map(d => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Demand KPI */}
      <Card className="p-0">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
            Demanda diaria promedio
            <Badge variant={QUALITY_VARIANTS[lineStat.dataQuality]} className="text-[10px] px-1.5">
              Calidad {QUALITY_LABELS[lineStat.dataQuality]}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <p className="text-xl font-bold text-foreground">
            {formatNumber(
              dayType === "weekday"
                ? lineStat.avgWeekday
                : dayType === "saturday"
                ? lineStat.avgSaturday
                : lineStat.avgSunday
            )}
          </p>
          <p className="text-[10px] text-muted-foreground">pasajeros/día</p>
        </CardContent>
      </Card>

      {/* US1: Bus Count */}
      <div className="rounded-lg border border-border bg-surface p-3 flex flex-col gap-2">
        <p className="text-xs font-semibold text-foreground">Buses recomendados</p>

        <div className="flex items-end gap-3">
          <div>
            <p className="text-3xl font-bold text-primary leading-none">
              {busCount.recommendedBuses}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">buses recomendados en hora pico</p>
          </div>
          <div className="text-right ml-auto">
            <p className="text-sm font-semibold text-foreground">
              {formatNumber(busCount.peakHourDemand)}
            </p>
            <p className="text-[10px] text-muted-foreground">pasajeros/hora pico</p>
          </div>
        </div>

        {/* Occupancy slider */}
        <div className="mt-1">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Ocupación objetivo</span>
            <span className="text-[10px] font-medium text-foreground">{occupancy}%</span>
          </div>
          <Slider
            min={60}
            max={95}
            step={5}
            value={[occupancy]}
            onValueChange={([v]) => setOccupancy(v)}
          />
          <div className="flex justify-between mt-0.5">
            <span className="text-[10px] text-muted-foreground">60%</span>
            <span className="text-[10px] text-muted-foreground">95%</span>
          </div>
        </div>
      </div>

      {/* US2: Model Recommendation */}
      <div className="rounded-lg border border-border bg-surface p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">Modelo recomendado</p>
          {recommendedModel && (
            <span className="text-[10px] text-muted-foreground">
              Cap. mín: {recommendedModel.requiredCapacity} pas.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto">
          {modelRecs.map(({ model, isRecommended }) => (
            <div
              key={model.id}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs border transition-colors ${
                isRecommended
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-muted/30"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {model.manufacturer} {model.modelName}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {model.passengerCapacity} pas. · {model.rangeKm} km
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-muted-foreground">
                  ${(model.unitCostUsd / 1000).toFixed(0)}k USD
                </p>
                {isRecommended && (
                  <Badge className="text-[9px] px-1 py-0 leading-tight mt-0.5">
                    Recomendado
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
