import type { Metadata } from 'next'
import ViennaPersonalTrainingClientPage from './ViennaPersonalTrainingClientPage'

export const metadata: Metadata = {
  title: 'Personal Training Wien - Finde deinen Coach | Juice',
  description: 'Personal Trainer in Wien finden. Gratis Probetraining oder Video-Call. Für Anfänger und Fortgeschrittene. Muskelaufbau, Gesundheit, Haltung - starte jetzt!',
  keywords: [
    'personal trainer wien',
    'fitnesscoach wien', 
    'probetraining wien',
    'training mit rückenproblemen',
    'muskelaufbau wien',
    'personal training wien',
    'fitness coach wien',
    'krafttraining wien',
    'gesundheitstraining wien'
  ],
  openGraph: {
    title: 'Personal Training Wien - Finde deinen Coach | Juice',
    description: 'Personal Trainer in Wien finden. Gratis Probetraining oder Video-Call. Für Anfänger und Fortgeschrittene. Muskelaufbau, Gesundheit, Haltung - starte jetzt!',
    url: 'https://www.juice.fitness/personal-training-wien',
    siteName: 'Juice',
    locale: 'de_AT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Training Wien - Finde deinen Coach | Juice',
    description: 'Personal Trainer in Wien finden. Gratis Probetraining oder Video-Call. Für Anfänger und Fortgeschrittene. Muskelaufbau, Gesundheit, Haltung - starte jetzt!',
  },
  alternates: {
    canonical: 'https://www.juice.fitness/personal-training-wien',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ViennaPersonalTrainingPage() {
  return <ViennaPersonalTrainingClientPage />
}
