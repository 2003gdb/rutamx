"use client";

import { useState, useMemo } from "react";
import { MapContainer } from "./_components/map-container";
import { RouteList } from "./_components/sidebar/route-list";
import { BatterySimulator } from "./_components/sidebar/battery-simulator";
import { MOCK_ROUTES } from "@/constants/mock-data";
import { Agency } from "@/types";

export default function MapPage() {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedAgencies, setSelectedAgencies] = useState<Agency[]>([]);

  const filteredRoutes = useMemo(() => {
    if (selectedAgencies.length === 0) return MOCK_ROUTES;
    return MOCK_ROUTES.filter((route) =>
      selectedAgencies.includes(route.agency)
    );
  }, [selectedAgencies]);

  const selectedRoute = useMemo(() => {
    return MOCK_ROUTES.find((r) => r.id === selectedRouteId) || null;
  }, [selectedRouteId]);

  const handleAgencyToggle = (agency: Agency) => {
    setSelectedAgencies((prev) =>
      prev.includes(agency)
        ? prev.filter((a) => a !== agency)
        : [...prev, agency]
    );
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="w-[380px] flex-shrink-0 flex flex-col gap-4">
        <div className="flex-1 bg-surface rounded-lg border border-border overflow-hidden">
          <RouteList
            routes={MOCK_ROUTES}
            selectedRouteId={selectedRouteId}
            onRouteSelect={setSelectedRouteId}
            selectedAgencies={selectedAgencies}
            onAgencyToggle={handleAgencyToggle}
          />
        </div>
        <BatterySimulator selectedRoute={selectedRoute} />
      </div>

      <div className="flex-1 rounded-lg overflow-hidden border border-border">
        <MapContainer
          routes={filteredRoutes}
          selectedRouteId={selectedRouteId}
          onRouteSelect={setSelectedRouteId}
        />
      </div>
    </div>
  );
}
