"use client";

import { useState } from "react";
import { Search, MapPin, Clock, Ruler } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";
import { Route, Agency } from "@/types";
import { AGENCY_MAP } from "@/constants/agencies";

interface RouteListProps {
  routes: Route[];
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string | null) => void;
  selectedAgencies: Agency[];
  onAgencyToggle: (agency: Agency) => void;
}

export function RouteList({
  routes,
  selectedRouteId,
  onRouteSelect,
  selectedAgencies,
  onAgencyToggle,
}: RouteListProps) {
  const [search, setSearch] = useState("");

  const agencies: Agency[] = ["metrobus", "metro", "rtp", "trolebus", "cablebus"];

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.name.toLowerCase().includes(search.toLowerCase()) ||
      route.shortName.toLowerCase().includes(search.toLowerCase());
    const matchesAgency =
      selectedAgencies.length === 0 || selectedAgencies.includes(route.agency);
    return matchesSearch && matchesAgency;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Buscar rutas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {agencies.map((agency) => {
            const info = AGENCY_MAP[agency];
            const isSelected = selectedAgencies.includes(agency);
            return (
              <button
                key={agency}
                onClick={() => onAgencyToggle(agency)}
                className={cn(
                  "px-2 py-1 rounded-md text-xs font-medium transition-colors",
                  isSelected
                    ? "text-white"
                    : "bg-surface-light text-text-secondary hover:text-foreground"
                )}
                style={{
                  backgroundColor: isSelected ? info.color : undefined,
                }}
              >
                {info.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredRoutes.length === 0 ? (
          <div className="p-4 text-center text-text-muted">
            No se encontraron rutas
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredRoutes.map((route) => {
              const agencyInfo = AGENCY_MAP[route.agency];
              const isSelected = selectedRouteId === route.id;

              return (
                <button
                  key={route.id}
                  onClick={() =>
                    onRouteSelect(isSelected ? null : route.id)
                  }
                  className={cn(
                    "w-full p-4 text-left transition-colors",
                    isSelected
                      ? "bg-primary/10"
                      : "hover:bg-surface-light"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-3 w-3 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: route.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{ borderColor: agencyInfo.color, color: agencyInfo.color }}
                        >
                          {route.shortName}
                        </Badge>
                        <span className="text-xs text-text-muted">
                          {agencyInfo.name}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        {route.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          {formatNumber(route.distanceKm, 1)} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {route.estimatedTimeMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {route.stops.length} paradas
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
