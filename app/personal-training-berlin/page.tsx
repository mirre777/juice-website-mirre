import { Metadata } from 'next'
import CityLandingPage from '@/components/city-landing/CityLandingPage'
import { berlinContent } from '@/lib/city-content'

export const metadata: Metadata = {
  title: 'Personal Training Berlin - Finde deinen Trainer | Juice',
  description: 'Personal Trainer in Berlin finden. Kostenloses Probetraining, erfahrene Coaches für Muskelaufbau, Abnehmen und Fitness. Starte noch heute!',
  keywords: 'personal trainer berlin, fitness coach berlin, probetraining berlin, muskelaufbau berlin, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://juiceapp.de/personal-training-berlin'
  }
}

export default function BerlinPersonalTrainingPage() {
  return <CityLandingPage content={berlinContent} />
}
