import { ElectricBusModel, BatterySimulation } from "@/types";

const BASE_CONSUMPTION_FACTOR = 1.0;
const OCCUPANCY_IMPACT = 0.003;
const TERRAIN_FACTOR = 1.15;
const AC_FACTOR = 1.1;

export function calculateBatteryConsumption(
  bus: ElectricBusModel,
  routeDistanceKm: number,
  occupancyPercent: number = 50
): BatterySimulation {
  const occupancyFactor = 1 + (occupancyPercent / 100) * OCCUPANCY_IMPACT * bus.passengerCapacity;

  const totalConsumptionFactor =
    BASE_CONSUMPTION_FACTOR * occupancyFactor * TERRAIN_FACTOR * AC_FACTOR;

  const estimatedConsumptionKwh =
    bus.energyConsumptionKwhPerKm * routeDistanceKm * totalConsumptionFactor;

  const batteryUsedPercent = (estimatedConsumptionKwh / bus.batteryCapacityKwh) * 100;
  const batteryPercentAfter = Math.max(0, 100 - batteryUsedPercent);

  const remainingEnergy = bus.batteryCapacityKwh - estimatedConsumptionKwh;
  const remainingRangeKm = Math.max(
    0,
    remainingEnergy / (bus.energyConsumptionKwhPerKm * totalConsumptionFactor)
  );

  const canCompleteRoute = batteryPercentAfter > 10;

  return {
    routeId: "",
    routeDistanceKm,
    occupancyPercent,
    estimatedConsumptionKwh: Math.round(estimatedConsumptionKwh * 10) / 10,
    remainingRangeKm: Math.round(remainingRangeKm * 10) / 10,
    batteryPercentAfter: Math.round(batteryPercentAfter * 10) / 10,
    canCompleteRoute,
  };
}

export function estimateChargingTime(
  currentPercent: number,
  targetPercent: number,
  bus: ElectricBusModel
): number {
  const percentNeeded = targetPercent - currentPercent;
  if (percentNeeded <= 0) return 0;

  const kwhNeeded = (percentNeeded / 100) * bus.batteryCapacityKwh;
  const hoursNeeded = (kwhNeeded / bus.batteryCapacityKwh) * bus.chargingTimeHours;

  return Math.round(hoursNeeded * 60);
}
