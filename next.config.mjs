/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Disable Google logging utilities on client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'google-logging-utils': false,
        '@google-cloud/logging': false,
        'google-gax': false,
      }
      
      // Ignore Google logging modules
      config.externals = config.externals || []
      config.externals.push({
        'google-logging-utils': 'commonjs google-logging-utils',
        '@google-cloud/logging': 'commonjs @google-cloud/logging',
      })
    }
    
    return config
  },
  env: {
    DISABLE_FIREBASE_LOGGING: 'true',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
