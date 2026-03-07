import { BUS_MODELS } from '@/constants/bus-models';
import { LINE_DEMAND_STATS, CORRIDOR_RANKING } from '@/constants/demand-data';
import {
  DayType,
  BusCountRecommendation,
  ModelRecommendation,
} from '@/types';

export function getAvgDemand(lineId: string, dayType: DayType): number {
  const stat = LINE_DEMAND_STATS.find(s => s.lineId === lineId);
  if (!stat) return 0;
  if (dayType === 'weekday') return stat.avgWeekday;
  if (dayType === 'saturday') return stat.avgSaturday;
  return stat.avgSunday;
}

export function recommendBusCount(
  lineId: string,
  dayType: DayType,
  busCapacity: number,
  targetOccupancy: number,
): BusCountRecommendation {
  const avgDailyDemand = getAvgDemand(lineId, dayType);
  const peakHourDemand = Math.round(avgDailyDemand * 0.12);
  const recommendedBuses = Math.ceil(peakHourDemand / (busCapacity * targetOccupancy));
  return { recommendedBuses, peakHourDemand, targetOccupancy };
}

export function recommendBusModel(
  lineId: string,
  dayType: DayType,
  routeFrequency: number,
  routeDistanceKm: number,
  targetOccupancy: number,
): ModelRecommendation[] {
  const avgDailyDemand = getAvgDemand(lineId, dayType);
  const peakHourDemand = Math.round(avgDailyDemand * 0.12);
  const busesPerHour = routeFrequency > 0 ? Math.round(60 / routeFrequency) : 10;
  const requiredCapacity = Math.ceil(peakHourDemand / (busesPerHour * targetOccupancy));

  const eligible = BUS_MODELS.filter(
    m => m.passengerCapacity >= requiredCapacity && m.rangeKm >= routeDistanceKm * 2
  ).sort((a, b) => a.unitCostUsd - b.unitCostUsd);

  const recommendedId = eligible[0]?.id;

  return BUS_MODELS.map(model => ({
    model,
    requiredCapacity,
    isRecommended: model.id === recommendedId,
  }));
}

export function getCampaignScore(lineId: string): number {
  return CORRIDOR_RANKING.find(c => c.lineId === lineId)?.campaignScore ?? 0;
}
