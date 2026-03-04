"use client";

import { useState, useMemo } from "react";
import { Battery, Users, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Route, ElectricBusModel } from "@/types";
import { BUS_MODELS } from "@/constants/bus-models";
import { calculateBatteryConsumption } from "@/lib/calculations/battery";
import { formatNumber } from "@/lib/utils";

interface BatterySimulatorProps {
  selectedRoute: Route | null;
}

export function BatterySimulator({ selectedRoute }: BatterySimulatorProps) {
  const [selectedBusId, setSelectedBusId] = useState<string>(BUS_MODELS[0].id);
  const [occupancy, setOccupancy] = useState(50);

  const selectedBus = useMemo(
    () => BUS_MODELS.find((b) => b.id === selectedBusId) || BUS_MODELS[0],
    [selectedBusId]
  );

  const simulation = useMemo(() => {
    if (!selectedRoute) return null;
    return calculateBatteryConsumption(
      selectedBus,
      selectedRoute.distanceKm,
      occupancy
    );
  }, [selectedRoute, selectedBus, occupancy]);

  if (!selectedRoute) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-text-muted">
            <Battery className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Selecciona una ruta para simular</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary-light" />
          Simulador de Batería
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs text-text-secondary mb-2 block">
            Modelo de Bus
          </label>
          <Select value={selectedBusId} onValueChange={setSelectedBusId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUS_MODELS.map((bus) => (
                <SelectItem key={bus.id} value={bus.id}>
                  {bus.manufacturer} {bus.modelName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-text-secondary flex items-center gap-1">
              <Users className="h-3 w-3" />
              Ocupación
            </label>
            <span className="text-sm font-medium">{occupancy}%</span>
          </div>
          <Slider
            value={occupancy}
            onValueChange={setOccupancy}
            min={0}
            max={100}
            step={5}
          />
        </div>

        {simulation && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Ruta</span>
              <span className="text-sm font-medium">
                {formatNumber(selectedRoute.distanceKm, 1)} km
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                Consumo Estimado
              </span>
              <span className="text-sm font-medium text-primary-light">
                {formatNumber(simulation.estimatedConsumptionKwh, 1)} kWh
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                Batería Restante
              </span>
              <span
                className={`text-sm font-medium ${
                  simulation.batteryPercentAfter > 50
                    ? "text-accent-green"
                    : simulation.batteryPercentAfter > 20
                    ? "text-accent-yellow"
                    : "text-accent-red"
                }`}
              >
                {formatNumber(simulation.batteryPercentAfter, 1)}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                Autonomía Restante
              </span>
              <span className="text-sm font-medium">
                {formatNumber(simulation.remainingRangeKm, 1)} km
              </span>
            </div>

            <div className="pt-2">
              {simulation.canCompleteRoute ? (
                <Badge variant="success" className="w-full justify-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Puede completar la ruta
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="w-full justify-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Batería insuficiente
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-text-muted">
            Bus: {selectedBus.manufacturer} {selectedBus.modelName}
          </p>
          <p className="text-xs text-text-muted">
            Capacidad: {selectedBus.batteryCapacityKwh} kWh • Rango:{" "}
            {selectedBus.rangeKm} km
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
