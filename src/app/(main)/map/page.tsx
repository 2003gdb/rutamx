"use client";

import { MapContainer } from "./_components/map-container";
import { MapPageTabs } from "./_components/map-page-tabs";
import { SidebarContent } from "./_components/sidebar-content";
import { useMapPageState } from "./_components/use-map-page-state";

export default function MapPage() {
  const {
    activeTab,
    setActiveTab,
    selectedRouteId,
    setSelectedRouteId,
    selectedAgencies,
    handleAgencyToggle,
    cooLineId,
    setCooLineId,
    cmoLineId,
    setCmoLineId,
    filteredRoutes,
    selectedRoute,
    mapSelectedRouteId,
  } = useMapPageState();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-3">
      <MapPageTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-1 gap-4 min-h-0">
        <div className="w-[380px] flex-shrink-0 flex flex-col gap-4 min-h-0">
          <SidebarContent
            activeTab={activeTab}
            selectedRouteId={selectedRouteId}
            onRouteSelect={setSelectedRouteId}
            selectedAgencies={selectedAgencies}
            onAgencyToggle={handleAgencyToggle}
            selectedRoute={selectedRoute}
            cooLineId={cooLineId}
            onCooLineIdChange={setCooLineId}
            cmoLineId={cmoLineId}
            onCmoLineIdChange={setCmoLineId}
          />
        </div>

        <div className="flex-1 rounded-lg overflow-hidden border border-border min-h-0">
          <MapContainer
            routes={filteredRoutes}
            selectedRouteId={mapSelectedRouteId}
            onRouteSelect={setSelectedRouteId}
          />
        </div>
      </div>
    </div>
  );
}
