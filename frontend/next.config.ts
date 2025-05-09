import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  // Add this configuration to remove the 'n' symbol
  devIndicators: false
};

export default nextConfig;
