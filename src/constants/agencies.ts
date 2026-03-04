import { AgencyInfo } from '@/types';

export const AGENCIES: AgencyInfo[] = [
  {
    id: 'metrobus',
    name: 'Metrobús',
    displayName: 'Metrobús',
    color: '#DC2626',
    icon: '🚌',
  },
  {
    id: 'metro',
    name: 'Metro',
    displayName: 'Metro CDMX',
    color: '#F97316',
    icon: '🚇',
  },
  {
    id: 'rtp',
    name: 'RTP',
    displayName: 'Red de Transporte de Pasajeros',
    color: '#22C55E',
    icon: '🚍',
  },
  {
    id: 'trolebus',
    name: 'Trolebús',
    displayName: 'Servicio de Transportes Eléctricos',
    color: '#3B82F6',
    icon: '🚎',
  },
  {
    id: 'cablebus',
    name: 'Cablebús',
    displayName: 'Cablebús CDMX',
    color: '#8B5CF6',
    icon: '🚡',
  },
];

export const AGENCY_MAP = AGENCIES.reduce((acc, agency) => {
  acc[agency.id] = agency;
  return acc;
}, {} as Record<string, AgencyInfo>);

export const MEXICO_CITY_CENTER: [number, number] = [-99.1332, 19.4326];
export const DEFAULT_ZOOM = 11;
