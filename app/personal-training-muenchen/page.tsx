import { Metadata } from 'next'
import MunichPersonalTrainingClientPage from './MunichPersonalTrainingClientPage'

export const metadata: Metadata = {
  title: 'Personal Training München - Finde deinen passenden Coach | Juice',
  description: 'Personal Trainer in München finden. Gratis Probetraining, erfahrene Coaches für Muskelaufbau, Gewichtsverlust und Fitness. Starte noch heute mit deinem Training.',
  keywords: 'personal trainer münchen, fitnesscoach münchen, probetraining münchen, muskelaufbau münchen, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://juiceapp.de/personal-training-muenchen'
  }
}

export default function MunichPersonalTrainingPage() {
  return <MunichPersonalTrainingClientPage />
}
