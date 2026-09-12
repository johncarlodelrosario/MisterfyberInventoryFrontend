/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable chunk optimization for development
  optimizeFonts: false,
  // Use the default output
  output: 'standalone',
}

module.exports = nextConfig
