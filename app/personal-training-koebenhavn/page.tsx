import { Metadata } from 'next'
import CityLandingPage from '@/components/city-landing/CityLandingPage'
import { copenhagenContent } from '@/lib/city-content'

export const metadata: Metadata = {
  title: 'Personlig træning København - Find din træner | Juice',
  description: 'Find personlig træner i København. Gratis prøvetræning, erfarne coaches til muskelopbygning, vægttab og fitness. Start din træning i dag.',
  keywords: 'personlig træner københavn, fitness coach københavn, prøvetræning københavn, muskelopbygning københavn, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.juice.fitness/personal-training-koebenhavn'
  },
  openGraph: {
    title: 'Personlig træning København - Find din træner | Juice',
    description: 'Find personlig træner i København. Gratis prøvetræning, erfarne coaches til muskelopbygning, vægttab og fitness. Start din træning i dag.',
    url: 'https://www.juice.fitness/personal-training-koebenhavn',
    siteName: 'Juice Fitness',
    locale: 'da_DK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personlig træning København - Find din træner | Juice',
    description: 'Find personlig træner i København. Gratis prøvetræning, erfarne coaches til muskelopbygning, vægttab og fitness. Start din træning i dag.',
  }
}

export default function CopenhagenPersonalTrainingPage() {
  return <CityLandingPage content={copenhagenContent} />
}
