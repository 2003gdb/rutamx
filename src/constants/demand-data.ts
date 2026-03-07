import { LineDemandStat, CorridorCampaign } from '@/types';

export const LINE_DEMAND_STATS: LineDemandStat[] = [
  {
    lineId: 'mb-1',
    name: 'Línea 1',
    color: '#DC2626',
    avgWeekday: 388000,
    avgSaturday: 231000,
    avgSunday: 134000,
    avgOverall: 318000,
    dataQuality: 'high',
  },
  {
    lineId: 'mb-2',
    name: 'Línea 2',
    color: '#7C3AED',
    avgWeekday: 171000,
    avgSaturday: 101000,
    avgSunday: 58000,
    avgOverall: 140000,
    dataQuality: 'high',
  },
  {
    lineId: 'mb-3',
    name: 'Línea 3',
    color: '#059669',
    avgWeekday: 158000,
    avgSaturday: 93000,
    avgSunday: 54000,
    avgOverall: 129000,
    dataQuality: 'medium',
  },
  {
    lineId: 'mb-4',
    name: 'Línea 4',
    color: '#D97706',
    avgWeekday: 74000,
    avgSaturday: 44000,
    avgSunday: 25000,
    avgOverall: 60000,
    dataQuality: 'medium',
  },
  {
    lineId: 'mb-5',
    name: 'Línea 5',
    color: '#DB2777',
    avgWeekday: 145000,
    avgSaturday: 86000,
    avgSunday: 50000,
    avgOverall: 118000,
    dataQuality: 'medium',
  },
  {
    lineId: 'mb-6',
    name: 'Línea 6',
    color: '#0891B2',
    avgWeekday: 190000,
    avgSaturday: 113000,
    avgSunday: 65000,
    avgOverall: 155000,
    dataQuality: 'low',
  },
  {
    lineId: 'mb-7',
    name: 'Línea 7',
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
const KM_PER_TRIP = 15; // avg km per trip
const CO2_PER_DIESEL_KM = 0.89; // kg CO2 per km (diesel bus)

function computeCampaign(stat: LineDemandStat): CorridorCampaign {
  const weekly = LINE_WEEKLY_TRIPS[stat.lineId];
  const totalWeeklyTrips = weekly.reduce((a, b) => a + b, 0);
  const peakIdx = weekly.indexOf(Math.max(...weekly));
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const annualPassengers = (stat.avgWeekday * 261 + stat.avgSaturday * 52 + stat.avgSunday * 52);
  const annualTrips = Math.round(annualPassengers / AVG_BUS_CAPACITY);
  const co2TonsPerYear = Math.round((annualTrips * KM_PER_TRIP * CO2_PER_DIESEL_KM) / 1000);
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
const maxTrips = Math.max(...rawCampaigns.map(c => c.totalWeeklyTrips));
const maxCO2 = Math.max(...rawCampaigns.map(c => c.co2TonsPerYear));

export const CORRIDOR_RANKING: CorridorCampaign[] = rawCampaigns
  .map(c => {
    const score = (c.totalWeeklyTrips / maxTrips) * 0.6 + (c.co2TonsPerYear / maxCO2) * 0.4;
    const priority: 'high' | 'medium' | 'low' = score >= 0.7 ? 'high' : score >= 0.4 ? 'medium' : 'low';
    return { ...c, campaignScore: Math.round(score * 100) / 100, priority };
  })
  .sort((a, b) => b.campaignScore - a.campaignScore);
