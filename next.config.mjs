/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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
