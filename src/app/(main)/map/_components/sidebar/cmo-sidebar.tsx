"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  CORRIDOR_RANKING,
  LINE_DEMAND_STATS,
  LINE_WEEKLY_TRIPS,
} from "@/constants/demand-data";
import { formatNumber } from "@/lib/utils";

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];
const DAY_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const AVG_BUS_CAPACITY = 79;

const PRIORITY_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const PRIORITY_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  high: "default",
  medium: "secondary",
  low: "destructive",
};

interface CmoSidebarProps {
  lineId: string;
  onLineIdChange: (id: string) => void;
}

export function CmoSidebar({ lineId, onLineIdChange }: CmoSidebarProps) {
  const corridor = useMemo(
    () => CORRIDOR_RANKING.find((c) => c.lineId === lineId) ?? CORRIDOR_RANKING[0],
    [lineId]
  );

  const lineStat = useMemo(
    () => LINE_DEMAND_STATS.find((s) => s.lineId === lineId) ?? LINE_DEMAND_STATS[0],
    [lineId]
  );

  const weeklyTrips = useMemo(() => LINE_WEEKLY_TRIPS[lineId] ?? [], [lineId]);
  const maxTrips = useMemo(() => Math.max(...weeklyTrips), [weeklyTrips]);
  const peakIdx = useMemo(() => weeklyTrips.indexOf(maxTrips), [weeklyTrips, maxTrips]);

  return (
    <div className="flex flex-col gap-3 p-3 overflow-y-auto h-full">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-sm text-foreground">Campañas Ambientales</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Priorización de corredores para campañas de impacto ambiental
        </p>
      </div>

      {/* Detail panel for selected line */}
      {corridor && (
        <div className="rounded-lg border border-primary/40 bg-surface p-3 flex flex-col gap-2.5">
          {/* Title + priority */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: lineStat.color }}
              />
              <span className="text-xs font-semibold text-foreground truncate">
                {corridor.name.split(' - ')[0]}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] text-muted-foreground">
                Score: {(corridor.campaignScore * 100).toFixed(0)}
              </span>
              <Badge
                variant={PRIORITY_VARIANTS[corridor.priority]}
                className="text-[9px] px-1.5"
              >
                {PRIORITY_LABELS[corridor.priority]}
              </Badge>
            </div>
          </div>

          {/* Daily table: Lun–Dom */}
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Detalle por día
            </p>
            {weeklyTrips.map((trips, i) => {
              const passengers = trips * AVG_BUS_CAPACITY;
              const pct = maxTrips > 0 ? trips / maxTrips : 0;
              const isPeak = i === peakIdx;
              return (
                <div
                  key={i}
                  className={`grid grid-cols-[28px_1fr_48px_56px] items-center gap-1 rounded px-1 py-0.5 ${
                    isPeak ? "bg-primary/10" : ""
                  }`}
                >
                  <span
                    className={`text-[10px] font-medium ${
                      isPeak ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {DAY_LABELS[i]}
                  </span>
                  {/* proportional bar */}
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct * 100}%`, opacity: 0.4 + pct * 0.6 }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground text-right">
                    {formatNumber(trips)} v
                  </span>
                  <span className="text-[9px] text-muted-foreground text-right">
                    {formatNumber(passengers)} p
                  </span>
                </div>
              );
            })}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-border">
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">{DAY_FULL[peakIdx]}</p>
              <p className="text-[9px] text-muted-foreground leading-tight">día pico</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">
                {formatNumber(corridor.co2TonsPerYear)}t
              </p>
              <p className="text-[9px] text-muted-foreground leading-tight">CO₂ evit/año</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">
                {formatNumber(corridor.totalWeeklyTrips)}
              </p>
              <p className="text-[9px] text-muted-foreground leading-tight">viajes/semana</p>
            </div>
          </div>
        </div>
      )}

      {/* Global ranking — compact */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Ranking de corredores
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Ordenado por CO₂ evitado por km de ruta. Las líneas con mayor densidad de emisiones ahorradas son las de mayor prioridad para campañas ambientales.
          </p>
        </div>
        {CORRIDOR_RANKING.map((c, idx) => {
          const isSelected = c.lineId === lineId;
          return (
            <div
              key={c.lineId}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 cursor-pointer transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/80"
              }`}
              onClick={() => onLineIdChange(c.lineId)}
            >
              <span className="text-[10px] text-muted-foreground w-5 flex-shrink-0">
                #{idx + 1}
              </span>
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-xs text-foreground flex-1 truncate">{c.name.split(' - ')[0]}</span>
              <span className="text-[9px] text-muted-foreground flex-shrink-0">
                {(c.campaignScore * 100).toFixed(0)} pts
              </span>
              <Badge
                variant={PRIORITY_VARIANTS[c.priority]}
                className="text-[9px] px-1 flex-shrink-0"
              >
                {PRIORITY_LABELS[c.priority]}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="rounded-md bg-muted/30 p-2 mt-auto">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Score = CO₂ evitado (t/año) ÷ km de ruta. Fuente: afluencia histórica Metrobús 2005–2026.
        </p>
      </div>
    </div>
  );
}
