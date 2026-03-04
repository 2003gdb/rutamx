const fs = require("fs");
const path = require("path");

const typesDir = path.join(
  __dirname,
  "..",
  "node_modules",
  "@types",
  "mapbox__point-geometry"
);

const indexDts = `declare class Point {
  x: number;
  y: number;
  constructor(x: number, y: number);
  clone(): Point;
  add(p: Point): Point;
  sub(p: Point): Point;
  mult(k: number): Point;
  div(k: number): Point;
  rotate(a: number): Point;
  matMult(m: [number, number, number, number]): Point;
  unit(): Point;
  perp(): Point;
  round(): Point;
  mag(): number;
  equals(p: Point): boolean;
  dist(p: Point): number;
  distSqr(p: Point): number;
  angle(): number;
  angleTo(p: Point): number;
  angleWith(p: Point): number;
  angleWithSep(x: number, y: number): number;
  static convert(a: [number, number] | Point): Point;
}

export = Point;
`;

try {
  if (fs.existsSync(typesDir)) {
    const indexPath = path.join(typesDir, "index.d.ts");
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(indexPath, indexDts);
      console.log("✓ Created missing mapbox__point-geometry types");
    }
  }
} catch (err) {
  console.warn("Warning: Could not fix mapbox types:", err.message);
}
