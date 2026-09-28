import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  devIndicators: false,
  basePath: process.env.GITHUB_ACTIONS ? "/jenywrapped" : "",
};
export default nextConfig;
