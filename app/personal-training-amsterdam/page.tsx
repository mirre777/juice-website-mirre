import { Metadata } from 'next'
import AmsterdamPersonalTrainingClientPage from './AmsterdamPersonalTrainingClientPage'

export const metadata: Metadata = {
  title: 'Personal Training Amsterdam - Vind jouw trainer | Juice',
  description: 'Personal trainer in Amsterdam vinden. Gratis proefles, ervaren coaches voor spieropbouw, gewichtsverlies en fitness. Start vandaag nog met je training.',
  keywords: 'personal trainer amsterdam, fitness coach amsterdam, proefles amsterdam, spieropbouw amsterdam, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://juiceapp.de/personal-training-amsterdam'
  }
}

export default function AmsterdamPersonalTrainingPage() {
  return <AmsterdamPersonalTrainingClientPage />
}
