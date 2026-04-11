import type { NextConfig } from "next";

const inMaintenance = process.env.MAINTENANCE_MODE === "true";

const maintenanceRedirects = inMaintenance
  ? [
      { source: "/", destination: "/maintenance", permanent: false },
      { source: "/compare/:path*", destination: "/maintenance", permanent: false },
      { source: "/attorney/:path*", destination: "/maintenance", permanent: false },
      { source: "/join/:path*", destination: "/maintenance", permanent: false },
    ]
  : [];

const nextConfig: NextConfig = {
  async redirects() {
    return maintenanceRedirects;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "thdrvqoabigfkpvuazei.supabase.co",
      },
    ],
  },
};

export default nextConfig;
