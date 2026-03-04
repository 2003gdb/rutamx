const DIESEL_CO2_KG_PER_LITER = 2.68;
const DIESEL_CONSUMPTION_LITERS_PER_KM = 0.35;
const ELECTRICITY_CO2_KG_PER_KWH = 0.435;

export function calculateCO2Avoided(
  electricConsumptionKwh: number,
  distanceKm: number
): number {
  const dieselCO2 = distanceKm * DIESEL_CONSUMPTION_LITERS_PER_KM * DIESEL_CO2_KG_PER_LITER;
  const electricCO2 = electricConsumptionKwh * ELECTRICITY_CO2_KG_PER_KWH;
  return Math.max(0, dieselCO2 - electricCO2);
}

export function calculateFuelSavings(
  distanceKm: number,
  dieselPricePerLiter: number = 24.5
): number {
  const dieselLiters = distanceKm * DIESEL_CONSUMPTION_LITERS_PER_KM;
  return dieselLiters * dieselPricePerLiter;
}

export function calculateTreeEquivalent(co2Kg: number): number {
  const CO2_PER_TREE_PER_YEAR = 21.77;
  return co2Kg / CO2_PER_TREE_PER_YEAR;
}

export function calculateCarEquivalent(co2Kg: number): number {
  const CO2_PER_CAR_PER_YEAR = 4600;
  return co2Kg / CO2_PER_CAR_PER_YEAR;
}
