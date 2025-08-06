'use client'

import CityLandingPage from '@/components/city-landing/CityLandingPage'
import { copenhagenContent } from '@/lib/city-content'

export default function CopenhagenPersonalTrainingClientPage() {
  return <CityLandingPage content={copenhagenContent} />
}
