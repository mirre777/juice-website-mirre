import type { Trainer } from './types'
import { erikKirchhoff } from './erik-kirchhoff'
import { marcusRodriguez } from './marcus-rodriguez'
import { jonne } from './jonne'
import { jonasEricsson } from './jonas-ericsson'
import { lisaAnderson } from './lisa-anderson'
import { jamesWilson } from './james-wilson'
import { sophieMartinez } from './sophie-martinez'

// Export all trainers
export const allTrainers: Trainer[] = [
  erikKirchhoff,
  marcusRodriguez,
  jonne,
  jonasEricsson,
  lisaAnderson,
  jamesWilson,
  sophieMartinez,
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
  marcusRodriguez,
  jonne,
  jonasEricsson,
  lisaAnderson,
  jamesWilson,
  sophieMartinez,
}

// Export types
export type { Trainer }
