import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'readdy.ai',
        // You can optionally specify port and pathname if needed
        // port: '',
        // pathname: '/api/search-image/**', // Or a more specific path
      },
    ],
    // For older Next.js versions (before 12.3.0 generally, or if remotePatterns isn't working for you)
    // domains: ['readdy.ai'],
  },
};

export default nextConfig;
