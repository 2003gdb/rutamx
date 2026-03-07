"use client";

import { useState, useEffect } from "react";
import { ElectricBusModel } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormData = Omit<ElectricBusModel, "id" | "imageUrl">;

const EMPTY_FORM: FormData = {
  modelName: "",
  manufacturer: "",
  rangeKm: 0,
  batteryCapacityKwh: 0,
  chargingTimeHours: 0,
  energyConsumptionKwhPerKm: 0,
  passengerCapacity: 0,
  lengthMeters: 0,
  widthMeters: 0,
  heightMeters: 0,
  weightKg: 0,
  unitCostUsd: 0,
  maintenanceCostPerKm: 0,
  warrantyYears: 0,
};

interface Props {
  bus: ElectricBusModel | null;
  isNew?: boolean;
  onClose: () => void;
  onSave: (data: ElectricBusModel) => void;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  step,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="text-sm text-text-secondary">{label}</label>
      <Input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function BusModelDialog({ bus, isNew = false, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  useEffect(() => {
    if (bus && !isNew) {
      const { id, imageUrl, ...rest } = bus;
      setForm(rest);
    } else {
      setForm(EMPTY_FORM);
    }
  }, [bus, isNew]);

  const set = (key: keyof FormData) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: typeof EMPTY_FORM[key] === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const isValid = form.modelName.trim() !== "" && form.manufacturer.trim() !== "";

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      id: bus?.id ?? `${form.manufacturer.toLowerCase().replace(/\s+/g, "-")}-${form.modelName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      imageUrl: bus?.imageUrl ?? "",
      ...form,
    });
  };

  const open = isNew || !!bus;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "Agregar Modelo" : "Editar Modelo"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Identificación */}
          <div>
            <p className="text-sm font-medium mb-3">Identificación</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fabricante" value={form.manufacturer} onChange={set("manufacturer")} />
              <Field label="Modelo" value={form.modelName} onChange={set("modelName")} />
            </div>
          </div>

          {/* Rendimiento */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium mb-3">Rendimiento</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Autonomía (km)" value={form.rangeKm} onChange={set("rangeKm")} type="number" step="1" />
              <Field label="Capacidad Batería (kWh)" value={form.batteryCapacityKwh} onChange={set("batteryCapacityKwh")} type="number" step="0.1" />
              <Field label="Tiempo de Carga (h)" value={form.chargingTimeHours} onChange={set("chargingTimeHours")} type="number" step="0.5" />
              <Field label="Consumo (kWh/km)" value={form.energyConsumptionKwhPerKm} onChange={set("energyConsumptionKwhPerKm")} type="number" step="0.01" />
              <Field label="Capacidad Pasajeros" value={form.passengerCapacity} onChange={set("passengerCapacity")} type="number" step="1" />
            </div>
          </div>

          {/* Dimensiones */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium mb-3">Dimensiones</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Largo (m)" value={form.lengthMeters} onChange={set("lengthMeters")} type="number" step="0.01" />
              <Field label="Ancho (m)" value={form.widthMeters} onChange={set("widthMeters")} type="number" step="0.01" />
              <Field label="Alto (m)" value={form.heightMeters} onChange={set("heightMeters")} type="number" step="0.01" />
              <Field label="Peso (kg)" value={form.weightKg} onChange={set("weightKg")} type="number" step="100" />
            </div>
          </div>

          {/* Costos */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium mb-3">Costos y Garantía</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Costo Unitario (USD)" value={form.unitCostUsd} onChange={set("unitCostUsd")} type="number" step="1000" />
              <Field label="Mantto por km (USD)" value={form.maintenanceCostPerKm} onChange={set("maintenanceCostPerKm")} type="number" step="0.01" />
              <Field label="Garantía (años)" value={form.warrantyYears} onChange={set("warrantyYears")} type="number" step="1" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {isNew ? "Agregar Modelo" : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
