import { Metadata } from 'next'
import CopenhagenPersonalTrainingClientPage from './CopenhagenPersonalTrainingClientPage'

export const metadata: Metadata = {
  title: 'Personlig træning København - Find din træner | Juice',
  description: 'Find personlig træner i København. Gratis prøvetræning, erfarne coaches til muskelopbygning, vægttab og fitness. Start din træning i dag.',
  keywords: 'personlig træner københavn, fitness coach københavn, prøvetræning københavn, muskelopbygning københavn, personal training',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://juiceapp.de/personal-training-koebenhavn'
  }
}

export default function CopenhagenPersonalTrainingPage() {
  return <CopenhagenPersonalTrainingClientPage />
}
