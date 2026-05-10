// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  devIndicators: {
    position: "bottom-right",   // only allowed property
  },
  images: {
    domains: ['res.cloudinary.com'], // add your Cloudinary domain
  },
};

export default nextConfig;