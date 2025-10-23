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
  location: {
    city: string
    country: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  serviceRadius?: number // km radius they serve (default: 50km)
  remoteAvailable?: boolean // can they do online sessions?
  bio?: string
  profileUrl?: string
}
