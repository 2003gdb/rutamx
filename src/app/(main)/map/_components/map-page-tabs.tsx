"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MapPageTabsProps {
  activeTab: "map" | "coo" | "cmo";
  onTabChange: (tab: "map" | "coo" | "cmo") => void;
}

export function MapPageTabs({ activeTab, onTabChange }: MapPageTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as "map" | "coo" | "cmo")}>
      <TabsList>
        <TabsTrigger value="map">Mapa de Rutas</TabsTrigger>
        <TabsTrigger value="coo">Optimización de Flota</TabsTrigger>
        <TabsTrigger value="cmo">Campañas Ambientales</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
