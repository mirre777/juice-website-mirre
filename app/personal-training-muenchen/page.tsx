import { Metadata } from 'next'
import CityLandingPage from '@/components/city-landing/CityLandingPage'
import { munichContent } from '@/lib/city-content'

export const metadata: Metadata = {
  title: 'Personal Training München - Finde deinen Trainer | Juice',
  description: 'Personal Trainer in München finden. Kostenloses Probetraining, erfahrene Coaches für Muskelaufbau, Abnehmen und Fitness. Starte noch heute!',
  keywords: 'personal trainer münchen, fitness coach münchen, probetraining münchen, muskelaufbau münchen, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.juice.fitness/personal-training-muenchen'
  },
  openGraph: {
    title: 'Personal Training München - Finde deinen Trainer | Juice',
    description: 'Personal Trainer in München finden. Kostenloses Probetraining, erfahrene Coaches für Muskelaufbau, Abnehmen und Fitness. Starte noch heute!',
    url: 'https://www.juice.fitness/personal-training-muenchen',
    siteName: 'Juice Fitness',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Training München - Finde deinen Trainer | Juice',
    description: 'Personal Trainer in München finden. Kostenloses Probetraining, erfahrene Coaches für Muskelaufbau, Abnehmen und Fitness. Starte noch heute!',
  }
}

export default function MunichPersonalTrainingPage() {
  return <CityLandingPage content={munichContent} />
}
