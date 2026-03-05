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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { BusCarousel3D } from "@/components/fleet/bus-carousel-3d";
import { BUS_MODELS } from "@/constants/bus-models";
import { MOCK_FLEET, MOCK_SERVICE_FREQUENCY } from "@/constants/mock-data";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function FleetPage() {
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

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

  const demandData = {
    labels: MOCK_SERVICE_FREQUENCY.map((s) => s.timeSlot.split("-")[0]),
    datasets: [
      {
        label: "Programados",
        data: MOCK_SERVICE_FREQUENCY.map((s) => s.scheduled),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
      },
      {
        label: "Reales",
        data: MOCK_SERVICE_FREQUENCY.map((s) => s.actual),
        borderColor: "#22C55E",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
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

      <Tabs defaultValue="3d-view">
        <TabsList>
          <TabsTrigger value="3d-view">Vista 3D</TabsTrigger>
          <TabsTrigger value="comparison">Comparación</TabsTrigger>
        </TabsList>

        <TabsContent value="3d-view">
          <BusCarousel3D />
        </TabsContent>

        <TabsContent value="comparison">
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
        </TabsContent>
      </Tabs>

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

      <ChartWrapper
        title="Demanda vs Capacidad"
        description="Buses programados vs reales por franja horaria"
      >
        <LineChart data={demandData} />
      </ChartWrapper>
    </div>
  );
}
