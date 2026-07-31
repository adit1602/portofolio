/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode for better React practices
  reactStrictMode: true,

  // Standalone output for Docker — bundles only what's needed to run
  output: 'standalone',

  // Allow images from external domains if needed
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
