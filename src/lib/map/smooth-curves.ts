import * as turf from "@turf/turf";

export function createSmoothCurve(
  coordinates: [number, number][],
  resolution = 10000
): [number, number][] {
  if (coordinates.length < 3) {
    return coordinates;
  }

  try {
    const line = turf.lineString(coordinates);
    const curved = turf.bezierSpline(line, { resolution });
    return curved.geometry.coordinates as [number, number][];
  } catch {
    return coordinates;
  }
}

export function interpolateRoute(
  coordinates: [number, number][],
  steps = 100
): [number, number][] {
  if (coordinates.length < 2) {
    return coordinates;
  }

  try {
    const line = turf.lineString(coordinates);
    const length = turf.length(line, { units: "kilometers" });
    const step = length / steps;
    const interpolated: [number, number][] = [];

    for (let i = 0; i <= steps; i++) {
      const point = turf.along(line, step * i, { units: "kilometers" });
      interpolated.push(point.geometry.coordinates as [number, number]);
    }

    return interpolated;
  } catch {
    return coordinates;
  }
}
