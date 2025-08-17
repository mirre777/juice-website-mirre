import { Metadata } from 'next'
import CityLandingPage from '@/components/city-landing/CityLandingPage'
import { amsterdamContent } from '@/lib/city-content'

export const metadata: Metadata = {
  title: 'Personal Training Amsterdam - Vind jouw trainer | Juice',
  description: 'Personal trainer in Amsterdam vinden. Gratis proefles, ervaren coaches voor spieropbouw, gewichtsverlies en fitness. Start vandaag nog met je training.',
  keywords: 'personal trainer amsterdam, fitness coach amsterdam, proefles amsterdam, spieropbouw amsterdam, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.juice.fitness/personal-training-amsterdam'
  },
  openGraph: {
    title: 'Personal Training Amsterdam - Vind jouw trainer | Juice',
    description: 'Personal trainer in Amsterdam vinden. Gratis proefles, ervaren coaches voor spieropbouw, gewichtsverlies en fitness. Start vandaag nog met je training.',
    url: 'https://www.juice.fitness/personal-training-amsterdam',
    siteName: 'Juice Fitness',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Training Amsterdam - Vind jouw trainer | Juice',
    description: 'Personal trainer in Amsterdam vinden. Gratis proefles, ervaren coaches voor spieropbouw, gewichtsverlies en fitness. Start vandaag nog met je training.',
  }
}

export default function AmsterdamPersonalTrainingPage() {
  return <CityLandingPage content={amsterdamContent} />
}
