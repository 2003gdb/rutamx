import { LineDemandStat, CorridorCampaign } from '@/types';
import { MOCK_ROUTES } from './mock-data';

export const LINE_DEMAND_STATS: LineDemandStat[] = [
  {
    lineId: 'mb-1',
    name: 'Línea 1 - Indios Verdes - El Caminero',
    color: '#DC2626',
    avgWeekday: 388000,
    avgSaturday: 231000,
    avgSunday: 134000,
    avgOverall: 318000,
    dataQuality: 'high',
  },
  {
    lineId: 'mb-2',
    name: 'Línea 2 - Tacubaya - Tepalcates',
    color: '#7C3AED',
    avgWeekday: 171000,
    avgSaturday: 101000,
    avgSunday: 58000,
    avgOverall: 140000,
    dataQuality: 'high',
  },
  {
    lineId: 'mb-3',
    name: 'Línea 3 - Tenayuca - Etiopía',
    color: '#059669',
    avgWeekday: 158000,
    avgSaturday: 93000,
    avgSunday: 54000,
    avgOverall: 129000,
    dataQuality: 'medium',
  },
  {
    lineId: 'mb-4',
    name: 'Línea 4 - Terminal Aérea - General Anaya',
    color: '#D97706',
    avgWeekday: 74000,
    avgSaturday: 44000,
    avgSunday: 25000,
    avgOverall: 60000,
    dataQuality: 'medium',
  },
  {
    lineId: 'mb-5',
    name: 'Línea 5 - Politécnico - Río de los Remedios',
    color: '#DB2777',
    avgWeekday: 145000,
    avgSaturday: 86000,
    avgSunday: 50000,
    avgOverall: 118000,
    dataQuality: 'medium',
  },
  {
    lineId: 'mb-6',
    name: 'Línea 6 - El Rosario - Deportivo 18 de Marzo',
    color: '#0891B2',
    avgWeekday: 190000,
    avgSaturday: 113000,
    avgSunday: 65000,
    avgOverall: 155000,
    dataQuality: 'low',
  },
  {
    lineId: 'mb-7',
    name: 'Línea 7 - Indios Verdes - Buenavista',
    color: '#65A30D',
    avgWeekday: 134000,
    avgSaturday: 80000,
    avgSunday: 46000,
    avgOverall: 109000,
    dataQuality: 'low',
  },
];

// Average passenger trips per day of week (Mon=0 ... Sun=6)
// Estimated from weekday (Mon-Fri) and weekend data
export const LINE_WEEKLY_TRIPS: Record<string, number[]> = {
  'mb-1':    [388000, 395000, 390000, 402000, 410000, 231000, 134000].map(v => Math.round(v / 79)),
  'mb-2':    [171000, 174000, 170000, 176000, 180000, 101000,  58000].map(v => Math.round(v / 79)),
  'mb-3':    [158000, 160000, 157000, 162000, 165000,  93000,  54000].map(v => Math.round(v / 79)),
  'mb-4':    [ 74000,  75000,  73000,  76000,  78000,  44000,  25000].map(v => Math.round(v / 79)),
  'mb-5':    [145000, 147000, 144000, 149000, 152000,  86000,  50000].map(v => Math.round(v / 79)),
  'mb-6':    [190000, 193000, 189000, 195000, 199000, 113000,  65000].map(v => Math.round(v / 79)),
  'mb-7':    [134000, 136000, 133000, 137000, 140000,  80000,  46000].map(v => Math.round(v / 79)),
};

const AVG_BUS_CAPACITY = 79;
const CO2_PER_DIESEL_KM = 0.89; // kg CO2 per km (diesel bus)

function computeCampaign(stat: LineDemandStat): CorridorCampaign {
  const weekly = LINE_WEEKLY_TRIPS[stat.lineId];
  const totalWeeklyTrips = weekly.reduce((a, b) => a + b, 0);
  const peakIdx = weekly.indexOf(Math.max(...weekly));
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const route = MOCK_ROUTES.find(r => r.id === stat.lineId);
  const routeKm = route?.distanceKm ?? 15;
  const annualPassengers = (stat.avgWeekday * 261 + stat.avgSaturday * 52 + stat.avgSunday * 52);
  const annualTrips = Math.round(annualPassengers / AVG_BUS_CAPACITY);
  const co2TonsPerYear = Math.round((annualTrips * routeKm * CO2_PER_DIESEL_KM) / 1000);
  return {
    lineId: stat.lineId,
    name: stat.name,
    color: stat.color,
    totalWeeklyTrips,
    peakDay: days[peakIdx],
    peakTrips: weekly[peakIdx],
    co2TonsPerYear,
    campaignScore: 0, // computed below
    priority: 'low',
  };
}

const rawCampaigns = LINE_DEMAND_STATS.map(computeCampaign);
const maxCO2PerKm = Math.max(...rawCampaigns.map(c => {
  const route = MOCK_ROUTES.find(r => r.id === c.lineId);
  return c.co2TonsPerYear / (route?.distanceKm ?? 15);
}));

export const CORRIDOR_RANKING: CorridorCampaign[] = rawCampaigns
  .map(c => {
    const route = MOCK_ROUTES.find(r => r.id === c.lineId);
    const co2PerKm = c.co2TonsPerYear / (route?.distanceKm ?? 15);
    const score = co2PerKm / maxCO2PerKm;
    const priority: 'high' | 'medium' | 'low' = score >= 0.7 ? 'high' : score >= 0.4 ? 'medium' : 'low';
    return { ...c, campaignScore: Math.round(score * 100) / 100, priority };
  })
  .sort((a, b) => b.campaignScore - a.campaignScore);
