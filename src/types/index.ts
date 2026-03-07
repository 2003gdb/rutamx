// Agency Types
export type Agency = 'metrobus' | 'metro' | 'rtp' | 'trolebus' | 'cablebus';

export interface AgencyInfo {
  id: Agency;
  name: string;
  displayName: string;
  color: string;
  icon: string;
}

// Route Types
export interface Stop {
  id: string;
  name: string;
  coordinates: [number, number];
  sequence: number;
}

export interface Route {
  id: string;
  name: string;
  shortName: string;
  agency: Agency;
  color: string;
  coordinates: [number, number][];
  stops: Stop[];
  distanceKm: number;
  estimatedTimeMinutes: number;
  frequency: number;
  operatingHours: {
    start: string;
    end: string;
  };
}

// Electric Bus Types
export interface ElectricBusModel {
  id: string;
  modelName: string;
  manufacturer: string;
  rangeKm: number;
  batteryCapacityKwh: number;
  chargingTimeHours: number;
  energyConsumptionKwhPerKm: number;
  passengerCapacity: number;
  lengthMeters: number;
  widthMeters: number;
  heightMeters: number;
  weightKg: number;
  unitCostUsd: number;
  maintenanceCostPerKm: number;
  warrantyYears: number;
  imageUrl: string;
}

export interface FleetBus {
  id: string;
  modelId: string;
  routeId: string;
  status: 'active' | 'charging' | 'maintenance' | 'inactive';
  currentBatteryPercent: number;
  lastLocation: [number, number];
  assignedDriver: string;
  totalKmDriven: number;
}

// KPI Types
export interface KPIData {
  roi: number;
  roiTrend: number;
  roiEstimated: number;
  fuelSavingsMXN: number;
  fuelSavingsTrend: number;
  co2ReductionTons: number;
  co2ReductionTrend: number;
  fleetUtilization: number;
  fleetUtilizationTrend: number;
  totalBuses: number;
  activeBuses: number;
  totalRoutes: number;
  totalPassengersDaily: number;
}

export interface ROIMonthlyData {
  month: string;
  estimated: number;
  actual: number | null;
}

// Operations Types
export interface ScheduleEntry {
  routeId: string;
  routeName: string;
  scheduledDeparture: string;
  actualDeparture: string;
  scheduledArrival: string;
  actualArrival: string;
  variance: number;
  status: 'on-time' | 'delayed' | 'early';
}

export interface ServiceFrequency {
  timeSlot: string;
  scheduled: number;
  actual: number;
  occupancy: number;
}

export interface PeakHourData {
  hour: number;
  passengers: number;
  busesRequired: number;
  currentBuses: number;
}

// Report Types
export interface EmissionsData {
  month: string;
  co2Avoided: number;
  dieselEquivalent: number;
  electricConsumption: number;
}

export interface PassengerData {
  date: string;
  weekday: number;
  weekend: number;
  total: number;
}

export interface CorridorActivity {
  corridorId: string;
  corridorName: string;
  dailyPassengers: number;
  peakHourPassengers: number;
  averageOccupancy: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'analyst' | 'viewer';
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin: string;
}

// Battery Simulation
export interface BatterySimulation {
  routeId: string;
  routeDistanceKm: number;
  occupancyPercent: number;
  estimatedConsumptionKwh: number;
  remainingRangeKm: number;
  batteryPercentAfter: number;
  canCompleteRoute: boolean;
}

// Demand / COO / CMO Types
export type DayType = 'weekday' | 'saturday' | 'sunday';

export interface LineDemandStat {
  lineId: string;
  name: string;
  color: string;
  avgWeekday: number;
  avgSaturday: number;
  avgSunday: number;
  avgOverall: number;
  dataQuality: 'high' | 'medium' | 'low';
}

export interface BusCountRecommendation {
  recommendedBuses: number;
  peakHourDemand: number;
  targetOccupancy: number;
}

export interface ModelRecommendation {
  model: ElectricBusModel;
  requiredCapacity: number;
  isRecommended: boolean;
}

export interface CorridorCampaign {
  lineId: string;
  name: string;
  color: string;
  totalWeeklyTrips: number;
  peakDay: string;
  peakTrips: number;
  co2TonsPerYear: number;
  campaignScore: number;
  priority: 'high' | 'medium' | 'low';
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}
