// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizePackageImports: ['recharts', 'lodash', 'lucide-react'],
  },
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;