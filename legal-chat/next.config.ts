import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 👇 Skip ESLint errors during Vercel builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;