import { Metadata } from 'next'
import CityLandingPage from '@/components/city-landing/CityLandingPage'
import { viennaContent } from '@/lib/city-content'

export const metadata: Metadata = {
  title: 'Personal Training Wien - Finde deinen Coach | Juice',
  description: 'Personal Trainer*innen in Wien finden. Gratis Probetraining, erfahrene Coaches für Muskelaufbau, Gewichtsverlust und Fitness. Starte noch heute mit deinem Training.',
  keywords: 'personal trainer wien, fitnesscoach wien, probetraining wien, muskelaufbau wien, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://juiceapp.de/personal-training-wien'
  }
}

export default function ViennaPersonalTrainingPage() {
  return <CityLandingPage content={viennaContent} />
}
