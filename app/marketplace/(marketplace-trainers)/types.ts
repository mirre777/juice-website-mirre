export interface Trainer {
  id: string
  name: string
  slug: string
  image: string
  certification: string
  specialties: string[]
  rating: number
  reviews: number
  hourlyRate: number
  featured: boolean
  location?: string
  bio?: string
  profileUrl?: string
}
