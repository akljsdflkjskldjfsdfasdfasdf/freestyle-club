import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Moderne, lakše slike (manji prenos → brže učitavanje)
    formats: ["image/avif", "image/webp"],
    // Dozvoli optimizaciju flyer slika sa lokalnog PocketBase-a
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
        pathname: "/api/files/**",
      },
    ],
  },
};

export default nextConfig;
