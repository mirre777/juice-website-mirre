/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rhyfig0wjvgmsqpt.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/client',
        destination: '/clients',
        permanent: true,
      },
      {
        source: '/trainer/:id',
        destination: '/marketplace/public-trainer-page/:id',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
