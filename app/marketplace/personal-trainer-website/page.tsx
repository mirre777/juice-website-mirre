import type { Metadata } from 'next'
import PersonalTrainerWebsitePage from './PersonalTrainerWebsitePage'

export const metadata: Metadata = {
  title: 'Personal Trainer Website Builder – Go Live in 10 Minutes | Juice',
  description: 'Launch your own personal trainer website in minutes. No coding needed. Capture leads, boost visibility and book sessions with a high-converting landing page.',
  keywords: [
    'personal trainer website',
    'fitness coach landing page', 
    'no code trainer site',
    'book personal training sessions',
    'fitness website Europe',
    'personal training SEO',
    'trainer marketing',
    'gym coach profile',
    'website builder for PTs'
  ],
  openGraph: {
    title: 'Personal Trainer Website Builder – Go Live in 10 Minutes',
    description: 'Create your own personal trainer site that books clients and ranks in search. No tech skills required. Trusted by 500+ European trainers.',
    url: 'https://juice-website-mirre.vercel.app/marketplace/personal-trainer-website',
    siteName: 'Juice',
    images: [
      {
        url: '/images/og-feature-graphic.png',
        width: 1200,
        height: 630,
        alt: 'Personal Trainer Website Builder Preview'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Trainer Website Builder – Go Live in 10 Minutes',
    description: 'Get your fitness site online in minutes. Book clients, grow your visibility and stay 24/7 available – all without coding.',
    images: ['/images/og-feature-graphic.png'],
  },
  alternates: {
    canonical: 'https://juice-website-mirre.vercel.app/marketplace/personal-trainer-website'
  },
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
}

export default function Page() {
  return (
    <>
      <PersonalTrainerWebsitePage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Personal Trainer Website Builder",
            "description": "Create a professional website as a personal trainer without coding. Book clients, increase visibility, and launch fast.",
            "url": "https://juice-website-mirre.vercel.app/marketplace/personal-trainer-website",
            "publisher": {
              "@type": "Organization",
              "name": "Juice",
              "logo": {
                "@type": "ImageObject",
                "url": "https://juice-website-mirre.vercel.app/images/juiceNewLogoPrime.png"
              }
            },
            "mainEntity": {
              "@type": "Service",
              "name": "Personal Trainer Website Generator",
              "serviceType": "Website Builder",
              "provider": {
                "@type": "Organization",
                "name": "Juice"
              },
              "areaServed": {
                "@type": "Place",
                "geo": {
                  "@type": "GeoCircle",
                  "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "latitude": 51.1657,
                    "longitude": 10.4515
                  },
                  "geoRadius": "1500"
                }
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Fitness Coaches, Personal Trainers"
              }
            }
          })
        }}
      />
    </>
  )
}
