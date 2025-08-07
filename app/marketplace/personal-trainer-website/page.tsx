import { Metadata } from 'next'
import PersonalTrainerWebsitePage from './PersonalTrainerWebsitePage'

export const metadata: Metadata = {
  title: 'Create Your Personal Trainer Website | Professional Fitness Websites',
  description: 'Build a stunning personal trainer website in minutes. Get more clients, showcase your expertise, and grow your fitness business with our easy-to-use platform.',
  keywords: 'personal trainer website, fitness website builder, trainer marketing, fitness business',
  authors: [{ name: 'Juice' }],
  creator: 'Juice',
  publisher: 'Juice',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/personal-trainer-website`,
    title: 'Create Your Personal Trainer Website | Professional Fitness Websites',
    description: 'Build a stunning personal trainer website in minutes. Get more clients, showcase your expertise, and grow your fitness business with our easy-to-use platform.',
    siteName: 'Juice',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/og-feature-graphic.png`,
        width: 1200,
        height: 630,
        alt: 'Personal Trainer Website Builder - Juice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your Personal Trainer Website | Professional Fitness Websites',
    description: 'Get your fitness site online in minutes. Book clients, grow your visibility and stay 24/7 available – all without coding.',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/images/og-feature-graphic.png`],
    creator: '@juice',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/personal-trainer-website`,
  },
  other: {
    'application-name': 'Juice',
    'apple-mobile-web-app-title': 'Juice',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#f97316',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#f97316',
  },
}

// Structured Data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Personal Trainer Website Builder',
  description: 'Create a professional website as a personal trainer without coding. Book clients, increase visibility, and launch fast.',
  url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/personal-trainer-website`,
  publisher: {
    '@type': 'Organization',
    name: 'Juice',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/images/juiceNewLogoPrime.png`,
    },
  },
  mainEntity: {
    '@type': 'Service',
    name: 'Personal Trainer Website Generator',
    serviceType: 'Website Builder',
    provider: {
      '@type': 'Organization',
      name: 'Juice',
    },
    areaServed: {
      '@type': 'Place',
      geo: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 51.1657,
          longitude: 10.4515,
        },
        geoRadius: '1500',
      },
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Fitness Coaches, Personal Trainers',
    },
    offers: {
      '@type': 'Offer',
      price: '70',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
  },
}

export default function Page() {
  return <PersonalTrainerWebsitePage />
}
