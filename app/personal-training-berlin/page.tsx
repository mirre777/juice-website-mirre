import { Metadata } from 'next'
import BerlinPersonalTrainingClientPage from './BerlinPersonalTrainingClientPage'

export const metadata: Metadata = {
  title: 'Personal Training Berlin - Dein Coach wartet | Juice',
  description: 'Personal Trainer in Berlin finden. Gratis Probetraining, erfahrene Coaches für Muskelaufbau, Gewichtsverlust und Fitness. Starte noch heute mit deinem Training.',
  keywords: 'personal trainer berlin, fitnesscoach berlin, probetraining berlin, muskelaufbau berlin, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://juiceapp.de/personal-training-berlin'
  }
}

export default function BerlinPersonalTrainingPage() {
  return <BerlinPersonalTrainingClientPage />
}
