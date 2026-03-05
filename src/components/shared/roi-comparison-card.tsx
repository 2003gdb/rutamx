"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ROIMonthlyData } from "@/types";

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
      </CardContent>
    </Card>
  );
}
