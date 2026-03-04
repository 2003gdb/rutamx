import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function getAgencyColor(agency: string): string {
  const colors: Record<string, string> = {
    metrobus: '#DC2626',
    metro: '#F97316',
    rtp: '#22C55E',
    trolebus: '#3B82F6',
    cablebus: '#8B5CF6',
  };
  return colors[agency] || '#3B82F6';
}

export function calculateVariance(scheduled: string, actual: string): number {
  const scheduledTime = new Date(`2024-01-01T${scheduled}`);
  const actualTime = new Date(`2024-01-01T${actual}`);
  return (actualTime.getTime() - scheduledTime.getTime()) / 60000;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'on-time': '#22C55E',
    'delayed': '#EF4444',
    'early': '#EAB308',
    'active': '#22C55E',
    'charging': '#3B82F6',
    'maintenance': '#F97316',
    'inactive': '#64748B',
  };
  return colors[status] || '#64748B';
}
