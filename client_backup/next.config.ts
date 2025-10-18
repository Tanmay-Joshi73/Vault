import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: __dirname,  // ✅ This defines the correct root path
};

export default nextConfig;
