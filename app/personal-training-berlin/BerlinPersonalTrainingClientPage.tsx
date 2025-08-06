'use client'

import CityLandingPage from '@/components/city-landing/CityLandingPage'
import { berlinContent } from '@/lib/city-content'

export default function BerlinPersonalTrainingClientPage() {
  return <CityLandingPage content={berlinContent} />
}
