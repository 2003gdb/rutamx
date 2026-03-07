"use client";

import { ReactNode } from "react";
import { RouteList } from "./sidebar/route-list";
import { BatterySimulator } from "./sidebar/battery-simulator";
import { CooSidebar } from "./sidebar/coo-sidebar";
import { CmoSidebar } from "./sidebar/cmo-sidebar";
import { MOCK_ROUTES } from "@/constants/mock-data";
import { Agency, Route } from "@/types";

interface SidebarContentProps {
  activeTab: "map" | "coo" | "cmo";
  selectedRouteId: string | null;
  onRouteSelect: (routeId: string | null) => void;
  selectedAgencies: Agency[];
  onAgencyToggle: (agency: Agency) => void;
  selectedRoute: Route | null;
  cooLineId: string;
  onCooLineIdChange: (lineId: string) => void;
  cmoLineId: string;
  onCmoLineIdChange: (lineId: string) => void;
}

export function SidebarContent({
  activeTab,
  selectedRouteId,
  onRouteSelect,
  selectedAgencies,
  onAgencyToggle,
  selectedRoute,
  cooLineId,
  onCooLineIdChange,
  cmoLineId,
  onCmoLineIdChange,
}: SidebarContentProps): ReactNode {
  if (activeTab === "map") {
    return (
      <>
        <div className="flex-1 bg-surface rounded-lg border border-border overflow-hidden min-h-0">
          <RouteList
            routes={MOCK_ROUTES}
            selectedRouteId={selectedRouteId}
            onRouteSelect={onRouteSelect}
            selectedAgencies={selectedAgencies}
            onAgencyToggle={onAgencyToggle}
          />
        </div>
        <BatterySimulator selectedRoute={selectedRoute} />
      </>
    );
  }

  if (activeTab === "coo") {
    return (
      <div className="flex-1 bg-surface rounded-lg border border-border overflow-hidden min-h-0">
        <CooSidebar lineId={cooLineId} onLineIdChange={onCooLineIdChange} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-surface rounded-lg border border-border overflow-hidden min-h-0">
      <CmoSidebar lineId={cmoLineId} onLineIdChange={onCmoLineIdChange} />
    </div>
  );
}
