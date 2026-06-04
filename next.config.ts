import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Standalone output cocok untuk container/Docker dan self-hosting.
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  eslint: {
    // Lint pre-existing memiliki 2 error React 19 yang belum di-refactor.
    // Tetap dijalankan via `npm run lint` di CI, tetapi tidak memblokir build.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Gambar landing di-upload via admin ke /public/uploads/landing — semua local.
    remotePatterns: [],
  },
  transpilePackages: ['motion'],
  experimental: {
    viewTransition: true,
    // Tree-shaking lebih agresif untuk library besar → bundle JS lebih kecil.
    optimizePackageImports: ['lucide-react', 'motion'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
