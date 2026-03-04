export interface GlowLayerConfig {
  id: string;
  type: "line";
  source: string;
  paint: {
    "line-color": string;
    "line-width": number;
    "line-opacity": number;
    "line-blur"?: number;
  };
  layout: {
    "line-join": "round" | "bevel" | "miter";
    "line-cap": "butt" | "round" | "square";
  };
}

export function createGlowLayers(
  sourceId: string,
  color: string
): { outer: GlowLayerConfig; inner: GlowLayerConfig } {
  return {
    outer: {
      id: `${sourceId}-glow`,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": color,
        "line-width": 8,
        "line-opacity": 0.4,
        "line-blur": 3,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
    },
    inner: {
      id: `${sourceId}-line`,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": color,
        "line-width": 3,
        "line-opacity": 1,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
    },
  };
}

export interface CircleLayerConfig {
  id: string;
  type: "circle";
  source: string;
  paint: {
    "circle-radius": number;
    "circle-color": string;
    "circle-opacity"?: number;
    "circle-blur"?: number;
    "circle-stroke-width"?: number;
    "circle-stroke-color"?: string;
  };
}

export function createStopLayer(sourceId: string): {
  circle: CircleLayerConfig;
  glow: CircleLayerConfig;
} {
  return {
    glow: {
      id: `${sourceId}-stop-glow`,
      type: "circle",
      source: sourceId,
      paint: {
        "circle-radius": 8,
        "circle-color": "#3B82F6",
        "circle-opacity": 0.3,
        "circle-blur": 1,
      },
    },
    circle: {
      id: `${sourceId}-stop`,
      type: "circle",
      source: sourceId,
      paint: {
        "circle-radius": 5,
        "circle-color": "#FFFFFF",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#3B82F6",
      },
    },
  };
}
