import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-map-gl", "mapbox-gl", "@react-pdf/renderer"],
  turbopack: {},
};

export default nextConfig;
