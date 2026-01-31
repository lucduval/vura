import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude pdf-parse from bundling - it needs native Node.js environment
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
