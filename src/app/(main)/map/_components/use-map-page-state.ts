import { useState, useMemo } from "react";
import { MOCK_ROUTES } from "@/constants/mock-data";
import { LINE_DEMAND_STATS } from "@/constants/demand-data";
import { Agency } from "@/types";

type ActiveTab = "map" | "coo" | "cmo";

export function useMapPageState() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("map");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedAgencies, setSelectedAgencies] = useState<Agency[]>([]);
  const [cooLineId, setCooLineId] = useState(LINE_DEMAND_STATS[0].lineId);
  const [cmoLineId, setCmoLineId] = useState(LINE_DEMAND_STATS[0].lineId);

  const filteredRoutes = useMemo(() => {
    if (selectedAgencies.length === 0) return MOCK_ROUTES;
    return MOCK_ROUTES.filter((route) =>
      selectedAgencies.includes(route.agency)
    );
  }, [selectedAgencies]);

  const selectedRoute = useMemo(
    () => MOCK_ROUTES.find((r) => r.id === selectedRouteId) || null,
    [selectedRouteId]
  );

  const mapSelectedRouteId = useMemo(() => {
    if (activeTab === "map") return selectedRouteId;
    if (activeTab === "coo") return cooLineId;
    return cmoLineId;
  }, [activeTab, selectedRouteId, cooLineId, cmoLineId]);

  const handleAgencyToggle = (agency: Agency) => {
    setSelectedAgencies((prev) =>
      prev.includes(agency)
        ? prev.filter((a) => a !== agency)
        : [...prev, agency]
    );
  };

  return {
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
  };
}
