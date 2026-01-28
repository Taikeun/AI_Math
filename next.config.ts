import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: isProd ? "/AI_Math" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
