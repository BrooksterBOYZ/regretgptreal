/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', 
  images: {
    unoptimized: true, 
  },
  eslint: {
    // This allows the production build to successfully complete 
    // even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This allows the production build to successfully complete
    // even if your project has TypeScript type errors.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;