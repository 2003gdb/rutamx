"use client";

import { Clock, AlertTriangle, CheckCircle, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import {
  MOCK_SCHEDULE,
  MOCK_SERVICE_FREQUENCY,
  MOCK_PEAK_HOURS,
} from "@/constants/mock-data";
import { formatNumber } from "@/lib/utils";

export default function OperationsPage() {
  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { variant: "success" | "destructive" | "warning"; label: string }
    > = {
      "on-time": { variant: "success", label: "A tiempo" },
      delayed: { variant: "destructive", label: "Retrasado" },
      early: { variant: "warning", label: "Adelantado" },
    };
    const { variant, label } = config[status] || config["on-time"];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const frequencyData = {
    labels: MOCK_SERVICE_FREQUENCY.map((s) => s.timeSlot.split("-")[0]),
    datasets: [
      {
        label: "Ocupación %",
        data: MOCK_SERVICE_FREQUENCY.map((s) => s.occupancy),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
      },
    ],
  };

  const peakHoursData = {
    labels: MOCK_PEAK_HOURS.map((p) => `${p.hour}:00`),
    datasets: [
      {
        label: "Buses Requeridos",
        data: MOCK_PEAK_HOURS.map((p) => p.busesRequired),
        backgroundColor: "#3B82F6",
      },
      {
        label: "Buses Actuales",
        data: MOCK_PEAK_HOURS.map((p) => p.currentBuses),
        backgroundColor: "#22C55E",
      },
    ],
  };

  const onTimeCount = MOCK_SCHEDULE.filter((s) => s.status === "on-time").length;
  const delayedCount = MOCK_SCHEDULE.filter((s) => s.status === "delayed").length;
  const avgVariance =
    MOCK_SCHEDULE.reduce((a, b) => a + Math.abs(b.variance), 0) /
    MOCK_SCHEDULE.length;

  const peakHour = MOCK_PEAK_HOURS.reduce((max, p) =>
    p.passengers > max.passengers ? p : max
  );

  const busDeficit = MOCK_PEAK_HOURS.filter(
    (p) => p.busesRequired > p.currentBuses
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Operations</h1>
        <p className="text-text-secondary">
          Análisis de operaciones y puntualidad del servicio
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10">
                <CheckCircle className="h-5 w-5 text-accent-green" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">A Tiempo</p>
                <p className="text-xl font-bold">{onTimeCount}</p>
                <p className="text-xs text-accent-green">
                  {((onTimeCount / MOCK_SCHEDULE.length) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-red/10">
                <AlertTriangle className="h-5 w-5 text-accent-red" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Retrasados</p>
                <p className="text-xl font-bold">{delayedCount}</p>
                <p className="text-xs text-accent-red">
                  {((delayedCount / MOCK_SCHEDULE.length) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary-light" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Variación Prom.</p>
                <p className="text-xl font-bold">{avgVariance.toFixed(1)} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-yellow/10">
                <TrendingUp className="h-5 w-5 text-accent-yellow" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Hora Pico</p>
                <p className="text-xl font-bold">{peakHour.hour}:00</p>
                <p className="text-xs text-text-muted">
                  {formatNumber(peakHour.passengers)} pas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Horarios: Programado vs Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ruta</TableHead>
                <TableHead>Salida Prog.</TableHead>
                <TableHead>Salida Real</TableHead>
                <TableHead>Llegada Prog.</TableHead>
                <TableHead>Llegada Real</TableHead>
                <TableHead className="text-right">Variación</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SCHEDULE.map((entry, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    {entry.routeName}
                  </TableCell>
                  <TableCell>{entry.scheduledDeparture}</TableCell>
                  <TableCell>{entry.actualDeparture}</TableCell>
                  <TableCell>{entry.scheduledArrival}</TableCell>
                  <TableCell>{entry.actualArrival}</TableCell>
                  <TableCell
                    className={`text-right ${
                      entry.variance > 0
                        ? "text-accent-red"
                        : entry.variance < 0
                        ? "text-accent-yellow"
                        : "text-accent-green"
                    }`}
                  >
                    {entry.variance > 0 ? "+" : ""}
                    {entry.variance} min
                  </TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartWrapper
          title="Ocupación por Franja Horaria"
          description="Porcentaje de ocupación promedio"
        >
          <LineChart data={frequencyData} />
        </ChartWrapper>

        <ChartWrapper
          title="Buses Requeridos vs Actuales"
          description="Análisis de capacidad por hora"
        >
          <BarChart data={peakHoursData} />
        </ChartWrapper>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-light" />
            Calculadora de Asignación Óptima
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-surface-light">
              <p className="text-sm text-text-secondary mb-1">
                Déficit de Buses
              </p>
              <p className="text-2xl font-bold text-accent-red">
                {busDeficit} franjas
              </p>
              <p className="text-xs text-text-muted mt-1">
                Franjas horarias con capacidad insuficiente
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surface-light">
              <p className="text-sm text-text-secondary mb-1">
                Buses Adicionales Necesarios
              </p>
              <p className="text-2xl font-bold text-primary-light">
                {Math.max(
                  ...MOCK_PEAK_HOURS.map((p) => p.busesRequired - p.currentBuses)
                )}
              </p>
              <p className="text-xs text-text-muted mt-1">
                En hora pico máxima
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surface-light">
              <p className="text-sm text-text-secondary mb-1">
                Eficiencia Actual
              </p>
              <p className="text-2xl font-bold text-accent-green">
                {(
                  (MOCK_PEAK_HOURS.reduce((a, b) => a + b.currentBuses, 0) /
                    MOCK_PEAK_HOURS.reduce((a, b) => a + b.busesRequired, 0)) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-xs text-text-muted mt-1">
                Relación buses actuales vs requeridos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
