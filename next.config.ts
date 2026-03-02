import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["@prisma/client"],
  bundlePagesRouterDependencies: true,
};

export default nextConfig;
