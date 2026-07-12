import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ai-tools-directory",
  assetPrefix: "/ai-tools-directory",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
