import type { Trainer } from './types'
import { sarahMitchell } from './sarah-mitchell'
import { marcusRodriguez } from './marcus-rodriguez'
import { emmaChen } from './emma-chen'
import { davidThompson } from './david-thompson'
import { lisaAnderson } from './lisa-anderson'
import { jamesWilson } from './james-wilson'
import { sophieMartinez } from './sophie-martinez'

// Export all trainers
export const allTrainers: Trainer[] = [
  sarahMitchell,
  marcusRodriguez,
  emmaChen,
  davidThompson,
  lisaAnderson,
  jamesWilson,
  sophieMartinez,
]

// Export featured trainers (same as current FEATURED_TRAINERS)
export const featuredTrainers: Trainer[] = allTrainers.filter(trainer => trainer.featured)

// Export all unique specialties (same as current SPECIALTIES)
export const specialties: string[] = [
  "All Specialties",
  ...Array.from(new Set(allTrainers.flatMap(trainer => trainer.specialties)))
]

// Export individual trainers for direct access
export {
  sarahMitchell,
  marcusRodriguez,
  emmaChen,
  davidThompson,
  lisaAnderson,
  jamesWilson,
  sophieMartinez,
}

// Export types
export type { Trainer }
