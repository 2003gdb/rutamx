"use client";

import { useState } from "react";
import { Bus, Battery, Zap, DollarSign, Ruler, Users } from "lucide-react";
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
import { BusCarousel3D } from "@/components/fleet/bus-carousel-3d";
import { BUS_MODELS } from "@/constants/bus-models";
import { MOCK_FLEET, MOCK_SERVICE_FREQUENCY, MOCK_ROUTES } from "@/constants/mock-data";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function FleetPage() {
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState(MOCK_ROUTES[0].id);

  const selectedRoute = MOCK_ROUTES.find((r) => r.id === selectedRouteId) || MOCK_ROUTES[0];

  // Calcular velocidad promedio: distancia / tiempo
  const avgSpeedKmH = selectedRoute.distanceKm / (selectedRoute.estimatedTimeMinutes / 60);

  // Datos de tiempos recorrido por ruta
  const travelTimeData = {
    labels: MOCK_ROUTES.map((r) => r.shortName),
    datasets: [
      {
        label: "Tiempo Estimado (min)",
        data: MOCK_ROUTES.map((r) => r.estimatedTimeMinutes),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
      },
      {
        label: "Tiempo Programado (min)",
        data: MOCK_ROUTES.map((r) => Math.round(r.estimatedTimeMinutes * (1 + Math.random() * 0.15))),
        borderColor: "#22C55E",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
      },
    ],
  };

  const comparisonData = {
    labels: BUS_MODELS.map((b) => `${b.manufacturer} ${b.modelName}`),
    datasets: [
      {
        label: "Rango (km)",
        data: BUS_MODELS.map((b) => b.rangeKm),
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const capacityData = {
    labels: BUS_MODELS.map((b) => b.modelName),
    datasets: [
      {
        label: "Capacidad de Pasajeros",
        data: BUS_MODELS.map((b) => b.passengerCapacity),
        backgroundColor: "#22C55E",
      },
    ],
  };

  const selectedBus = selectedBusId
    ? BUS_MODELS.find((b) => b.id === selectedBusId)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fleet Analytics</h1>
        <p className="text-text-secondary">
          Análisis y comparación de modelos de buses eléctricos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bus className="h-5 w-5 text-primary-light" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Modelos</p>
                <p className="text-xl font-bold">{BUS_MODELS.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10">
                <Battery className="h-5 w-5 text-accent-green" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Rango Promedio</p>
                <p className="text-xl font-bold">
                  {formatNumber(
                    BUS_MODELS.reduce((a, b) => a + b.rangeKm, 0) /
                      BUS_MODELS.length
                  )}{" "}
                  km
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-yellow/10">
                <Zap className="h-5 w-5 text-accent-yellow" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Consumo Promedio</p>
                <p className="text-xl font-bold">
                  {(
                    BUS_MODELS.reduce(
                      (a, b) => a + b.energyConsumptionKwhPerKm,
                      0
                    ) / BUS_MODELS.length
                  ).toFixed(2)}{" "}
                  kWh/km
                </p>
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
                <p className="text-xs text-text-secondary">Capacidad Total</p>
                <p className="text-xl font-bold">
                  {formatNumber(
                    MOCK_FLEET.length *
                      (BUS_MODELS.reduce((a, b) => a + b.passengerCapacity, 0) /
                        BUS_MODELS.length)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BusCarousel3D />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Comparación de Modelos de Bus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Fabricante</TableHead>
                  <TableHead className="text-right">Rango</TableHead>
                  <TableHead className="text-right">Batería</TableHead>
                  <TableHead className="text-right">Consumo</TableHead>
                  <TableHead className="text-right">Capacidad</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                  <TableHead className="text-right">Garantía</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BUS_MODELS.map((bus) => (
                  <TableRow
                    key={bus.id}
                    className={cn(
                      "cursor-pointer",
                      selectedBusId === bus.id && "bg-primary/10"
                    )}
                    onClick={() =>
                      setSelectedBusId(
                        selectedBusId === bus.id ? null : bus.id
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {bus.modelName}
                    </TableCell>
                    <TableCell>{bus.manufacturer}</TableCell>
                    <TableCell className="text-right">
                      {formatNumber(bus.rangeKm)} km
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(bus.batteryCapacityKwh)} kWh
                    </TableCell>
                    <TableCell className="text-right">
                      {bus.energyConsumptionKwhPerKm} kWh/km
                    </TableCell>
                    <TableCell className="text-right">
                      {bus.passengerCapacity} pas.
                    </TableCell>
                    <TableCell className="text-right">
                      ${formatNumber(bus.unitCostUsd / 1000)}K
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{bus.warrantyYears} años</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedBus && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary-light" />
              {selectedBus.manufacturer} {selectedBus.modelName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-xs text-text-secondary flex items-center gap-1">
                  <Ruler className="h-3 w-3" />
                  Dimensiones
                </p>
                <p className="text-sm">
                  {selectedBus.lengthMeters}m x {selectedBus.widthMeters}m x{" "}
                  {selectedBus.heightMeters}m
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary flex items-center gap-1">
                  <Battery className="h-3 w-3" />
                  Tiempo de Carga
                </p>
                <p className="text-sm">{selectedBus.chargingTimeHours} horas</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Mantenimiento
                </p>
                <p className="text-sm">
                  ${selectedBus.maintenanceCostPerKm}/km
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary">Peso</p>
                <p className="text-sm">
                  {formatNumber(selectedBus.weightKg)} kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartWrapper
          title="Rango por Modelo"
          description="Comparación de autonomía en kilómetros"
        >
          <BarChart data={comparisonData} horizontal />
        </ChartWrapper>

        <ChartWrapper
          title="Capacidad de Pasajeros"
          description="Capacidad máxima por modelo"
        >
          <BarChart data={capacityData} />
        </ChartWrapper>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Tiempos de Recorrido por Ruta</CardTitle>
              <p className="text-xs text-text-muted mt-1">Estimados vs Programados · Detección de Variabilidad Operativa</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selector de ruta */}
          <div className="flex gap-3">
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="flex-1 text-sm bg-surface-light border border-border rounded-lg px-3 py-2 text-foreground"
            >
              {MOCK_ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.shortName} — {r.name.split(" - ")[0]}
                </option>
              ))}
            </select>
          </div>

          {/* KPIs de la ruta seleccionada */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-text-muted">Distancia</p>
              <p className="text-base font-bold text-primary-light">{selectedRoute.distanceKm} km</p>
            </div>
            <div className="p-3 rounded-lg bg-accent-green/5 border border-accent-green/20">
              <p className="text-xs text-text-muted">Tiempo Estimado</p>
              <p className="text-base font-bold text-accent-green">{selectedRoute.estimatedTimeMinutes} min</p>
            </div>
            <div className="p-3 rounded-lg bg-accent-yellow/5 border border-accent-yellow/20">
              <p className="text-xs text-text-muted">Velocidad Promedio</p>
              <p className="text-base font-bold text-accent-yellow">{avgSpeedKmH.toFixed(1)} km/h</p>
            </div>
            <div className="p-3 rounded-lg bg-accent-red/5 border border-accent-red/20">
              <p className="text-xs text-text-muted">Frecuencia</p>
              <p className="text-base font-bold text-accent-red">c/{selectedRoute.frequency} min</p>
            </div>
          </div>

          {/* Gráfico de comparación */}
          <ChartWrapper title="Tiempos Estimados vs Programados" description="Por ruta del sistema">
            <LineChart data={travelTimeData} />
          </ChartWrapper>

          {/* Tabla detallada por ruta */}
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-surface-light border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-left text-text-secondary">Ruta</th>
                  <th className="px-4 py-2 text-right text-text-secondary">Distancia</th>
                  <th className="px-4 py-2 text-right text-text-secondary">Tiempo Est.</th>
                  <th className="px-4 py-2 text-right text-text-secondary">Velocidad</th>
                  <th className="px-4 py-2 text-right text-text-secondary">Variabilidad</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ROUTES.map((route) => {
                  const speed = route.distanceKm / (route.estimatedTimeMinutes / 60);
                  const variability = Math.round(Math.random() * 20 - 10);
                  const variabilityColor = variability > 5 ? "text-accent-red" : variability < -5 ? "text-accent-green" : "text-accent-yellow";
                  return (
                    <tr key={route.id} className="border-b border-border/50 hover:bg-surface-light transition-colors">
                      <td className="px-4 py-3 font-medium">{route.shortName}</td>
                      <td className="px-4 py-3 text-right">{route.distanceKm} km</td>
                      <td className="px-4 py-3 text-right">{route.estimatedTimeMinutes} min</td>
                      <td className="px-4 py-3 text-right">{speed.toFixed(1)} km/h</td>
                      <td className={`px-4 py-3 text-right font-medium ${variabilityColor}`}>
                        {variability > 0 ? "+" : ""}{variability}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
