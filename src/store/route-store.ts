import { create } from "zustand";
import { Route, Agency } from "@/types";
import { MOCK_ROUTES } from "@/constants/mock-data";

interface RouteState {
  routes: Route[];
  selectedRouteId: string | null;
  selectedAgencies: Agency[];
  searchQuery: string;
  setSelectedRoute: (routeId: string | null) => void;
  toggleAgency: (agency: Agency) => void;
  setSearchQuery: (query: string) => void;
  getFilteredRoutes: () => Route[];
}

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: MOCK_ROUTES,
  selectedRouteId: null,
  selectedAgencies: [],
  searchQuery: "",

  setSelectedRoute: (routeId) => set({ selectedRouteId: routeId }),

  toggleAgency: (agency) =>
    set((state) => ({
      selectedAgencies: state.selectedAgencies.includes(agency)
        ? state.selectedAgencies.filter((a) => a !== agency)
        : [...state.selectedAgencies, agency],
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredRoutes: () => {
    const { routes, selectedAgencies, searchQuery } = get();
    return routes.filter((route) => {
      const matchesAgency =
        selectedAgencies.length === 0 ||
        selectedAgencies.includes(route.agency);
      const matchesSearch =
        searchQuery === "" ||
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.shortName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAgency && matchesSearch;
    });
  },
}));
