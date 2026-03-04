declare module "@mapbox/point-geometry" {
  class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
  }
  export default Point;
}

declare module "mapbox__point-geometry" {
  import Point from "@mapbox/point-geometry";
  export = Point;
}
