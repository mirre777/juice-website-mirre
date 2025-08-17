import { Metadata } from 'next'
import CityLandingPage from '@/components/city-landing/CityLandingPage'
import { viennaContent } from '@/lib/city-content'

export const metadata: Metadata = {
  title: 'Personal Training Wien - Finde deinen Trainer | Juice',
  description: 'Personal Trainer in Wien finden. Kostenloses Probetraining, erfahrene Coaches für Muskelaufbau, Abnehmen und Fitness. Starte noch heute!',
  keywords: 'personal trainer wien, fitness coach wien, probetraining wien, muskelaufbau wien, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.juice.fitness/personal-training-wien'
  },
  openGraph: {
    title: 'Personal Training Wien - Finde deinen Trainer | Juice',
    description: 'Personal Trainer in Wien finden. Kostenloses Probetraining, erfahrene Coaches für Muskelaufbau, Abnehmen und Fitness. Starte noch heute!',
    url: 'https://www.juice.fitness/personal-training-wien',
    siteName: 'Juice Fitness',
    locale: 'de_AT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Training Wien - Finde deinen Trainer | Juice',
    description: 'Personal Trainer in Wien finden. Kostenloses Probetraining, erfahrene Coaches für Muskelaufbau, Abnehmen und Fitness. Starte noch heute!',
  }
}

export default function ViennaPersonalTrainingPage() {
  return <CityLandingPage content={viennaContent} />
}
