import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  allowedDevOrigins: ['10.12.80.200'],
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
