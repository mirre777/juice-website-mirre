import { Metadata } from 'next'
import CityLandingPage from '@/components/city-landing/CityLandingPage'
import { viennaContent } from '@/lib/city-content'

export const metadata: Metadata = {
  title: 'Personal Training Wien - Finde deinen Trainer | Juice',
  description: 'Personal Trainer in Wien finden. Kostenloses Probetraining, erfahrene Coaches für Muskelaufbau, Abnehmen und Fitness. Starte noch heute!',
  keywords: 'personal trainer wien, fitness coach wien, probetraining wien, muskelaufbau wien, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://juiceapp.de/personal-training-wien'
  }
}

export default function ViennaPersonalTrainingPage() {
  return <CityLandingPage content={viennaContent} />
}
