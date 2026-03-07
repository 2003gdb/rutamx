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
        <TabsTrigger value="map">Mapa</TabsTrigger>
        <TabsTrigger value="coo">Optimización</TabsTrigger>
        <TabsTrigger value="cmo">Campañas</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
