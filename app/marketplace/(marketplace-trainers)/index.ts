import type { Trainer } from './types'
import { erikKirchhoff } from './erik-kirchhoff'
import { lenaTraninger } from './lena-traninger'
import { jonne } from './jonne'
import { jonasEricsson } from './jonas-ericsson'
import { lisaAnderson } from './lisa-anderson'
import { flokiBarth } from './floki-barth'
import { stevenNeider } from './steven-neider'

// Export all trainers
export const allTrainers: Trainer[] = [
  erikKirchhoff,
  lenaTraninger,
  jonne,
  jonasEricsson,
  lisaAnderson,
  flokiBarth,
  stevenNeider,
].filter((trainer): trainer is Trainer => Boolean(trainer))

// Export featured trainers (same as current FEATURED_TRAINERS)
export const featuredTrainers: Trainer[] = allTrainers.filter((trainer): trainer is Trainer => Boolean(trainer && trainer.featured))

// Export all unique specialties (same as current SPECIALTIES)
export const specialties: string[] = [
  "All Specialties",
  ...Array.from(
    new Set(
      allTrainers
        .filter(Boolean)
        .flatMap((trainer) => trainer.specialties || [])
    )
  ),
]

// Export individual trainers for direct access
export {
  erikKirchhoff,
  lenaTraninger,
  jonne,
  jonasEricsson,
  lisaAnderson,
  flokiBarth,
  stevenNeider,
}

// Export types
export type { Trainer }
