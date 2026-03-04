"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { MEXICO_CITY_CENTER, DEFAULT_ZOOM } from "@/constants/agencies";
import { Route } from "@/types";
import { createSmoothCurve } from "@/lib/map/smooth-curves";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

interface MapContainerProps {
  routes: Route[];
  selectedRouteId: string | null;
  onRouteSelect?: (routeId: string) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export function MapContainer({
  routes,
  selectedRouteId,
}: MapContainerProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<MapInnerProps> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("./map-inner").then((mod) => {
      setMapComponent(() => mod.MapInner);
      setIsLoading(false);
    });
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface rounded-lg">
        <div className="text-center p-8">
          <p className="text-text-secondary mb-2">Mapbox Token Required</p>
          <p className="text-sm text-text-muted">
            Add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || !MapComponent) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface rounded-lg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <MapComponent
      routes={routes}
      selectedRouteId={selectedRouteId}
      mapboxToken={MAPBOX_TOKEN}
    />
  );
}

interface MapInnerProps {
  routes: Route[];
  selectedRouteId: string | null;
  mapboxToken: string;
}
