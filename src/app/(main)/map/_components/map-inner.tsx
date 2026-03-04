"use client";

import { useState, useCallback } from "react";
import Map, { Source, Layer, NavigationControl } from "react-map-gl/mapbox";
import type { ViewState } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MEXICO_CITY_CENTER, DEFAULT_ZOOM } from "@/constants/agencies";
import { Route } from "@/types";
import { createSmoothCurve } from "@/lib/map/smooth-curves";

interface MapInnerProps {
  routes: Route[];
  selectedRouteId: string | null;
  mapboxToken: string;
}

export function MapInner({
  routes,
  selectedRouteId,
  mapboxToken,
}: MapInnerProps) {
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: MEXICO_CITY_CENTER[0],
    latitude: MEXICO_CITY_CENTER[1],
    zoom: DEFAULT_ZOOM,
    pitch: 0,
    bearing: 0,
  });

  const handleMove = useCallback((evt: { viewState: ViewState }) => {
    setViewState(evt.viewState);
  }, []);

  return (
    <Map
      {...viewState}
      onMove={handleMove}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={mapboxToken}
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
    >
      <NavigationControl position="top-right" />

      {routes.map((route) => {
        const smoothCoords = createSmoothCurve(route.coordinates);
        const isSelected = selectedRouteId === route.id;
        const opacity = selectedRouteId ? (isSelected ? 1 : 0.3) : 0.8;

        return (
          <Source
            key={route.id}
            id={`route-${route.id}`}
            type="geojson"
            data={{
              type: "Feature",
              properties: { id: route.id },
              geometry: {
                type: "LineString",
                coordinates: smoothCoords,
              },
            }}
          >
            <Layer
              id={`route-${route.id}-glow`}
              type="line"
              paint={{
                "line-color": route.color,
                "line-width": isSelected ? 12 : 8,
                "line-opacity": opacity * 0.4,
                "line-blur": 3,
              }}
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
            />
            <Layer
              id={`route-${route.id}-line`}
              type="line"
              paint={{
                "line-color": route.color,
                "line-width": isSelected ? 4 : 3,
                "line-opacity": opacity,
              }}
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
            />
          </Source>
        );
      })}

      {routes.map((route) => {
        const isSelected = selectedRouteId === route.id;
        if (!isSelected && selectedRouteId) return null;

        return (
          <Source
            key={`stops-${route.id}`}
            id={`stops-${route.id}`}
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: route.stops.map((stop) => ({
                type: "Feature",
                properties: { name: stop.name },
                geometry: {
                  type: "Point",
                  coordinates: stop.coordinates,
                },
              })),
            }}
          >
            <Layer
              id={`stops-${route.id}-glow`}
              type="circle"
              paint={{
                "circle-radius": 8,
                "circle-color": route.color,
                "circle-opacity": 0.3,
                "circle-blur": 1,
              }}
            />
            <Layer
              id={`stops-${route.id}-point`}
              type="circle"
              paint={{
                "circle-radius": 5,
                "circle-color": "#FFFFFF",
                "circle-stroke-width": 2,
                "circle-stroke-color": route.color,
              }}
            />
          </Source>
        );
      })}
    </Map>
  );
}
