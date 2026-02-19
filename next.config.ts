import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn1.kingschat.online",
      },
      {
        protocol: "https",
        hostname: "cdn2.kingschat.online",
      },
    ],
  },
};

export default nextConfig;
