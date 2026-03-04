import { create } from "zustand";
import { FleetBus, ElectricBusModel } from "@/types";
import { MOCK_FLEET } from "@/constants/mock-data";
import { BUS_MODELS } from "@/constants/bus-models";

interface FleetState {
  buses: FleetBus[];
  busModels: ElectricBusModel[];
  selectedBusId: string | null;
  setSelectedBus: (busId: string | null) => void;
  updateBusStatus: (busId: string, status: FleetBus["status"]) => void;
  getBusModel: (modelId: string) => ElectricBusModel | undefined;
  getActiveBuses: () => FleetBus[];
  getChargingBuses: () => FleetBus[];
}

export const useFleetStore = create<FleetState>((set, get) => ({
  buses: MOCK_FLEET,
  busModels: BUS_MODELS,
  selectedBusId: null,

  setSelectedBus: (busId) => set({ selectedBusId: busId }),

  updateBusStatus: (busId, status) =>
    set((state) => ({
      buses: state.buses.map((bus) =>
        bus.id === busId ? { ...bus, status } : bus
      ),
    })),

  getBusModel: (modelId) => {
    return get().busModels.find((model) => model.id === modelId);
  },

  getActiveBuses: () => {
    return get().buses.filter((bus) => bus.status === "active");
  },

  getChargingBuses: () => {
    return get().buses.filter((bus) => bus.status === "charging");
  },
}));
