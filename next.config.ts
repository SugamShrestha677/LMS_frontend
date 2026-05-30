// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true, 
  },
  output: 'standalone',
  reactStrictMode: true,
  compress: true,
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts', 'framer-motion'],
  },
  async rewrites() {
    return [
      // Proxy student dashboard to Vite dev server
      {
        source: '/student/dashboard',
        destination: 'http://localhost:5173/student/dashboard',
      },
      // Proxy Vite's internal assets
      {
        source: '/src/:path*',
        destination: 'http://localhost:5173/src/:path*',
      },
      {
        source: '/@vite/:path*',
        destination: 'http://localhost:5173/@vite/:path*',
      },
      {
        source: '/@react-refresh',
        destination: 'http://localhost:5173/@react-refresh',
      },
      {
        source: '/@fs/:path*',
        destination: 'http://localhost:5173/@fs/:path*',
      },
      {
        source: '/node_modules/:path*',
        destination: 'http://localhost:5173/node_modules/:path*',
      },
    ];
  },
};

export default withBundleAnalyzer(withSerwist(nextConfig));