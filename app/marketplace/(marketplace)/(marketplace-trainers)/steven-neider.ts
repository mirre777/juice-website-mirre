import type { Trainer } from './types'

export const stevenNeider: Trainer = {
  id: "steven-neider",
  name: "Steven Neider",
  slug: "steven-neider",
  image: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/trainer-profile-images/steve%20neider.jpg",
  certification: "",
  specialties: ["Mobility", "Strength Training",  "Alternative Medicine"],
  rating: 4.9,
  reviews: 118,
  hourlyRate: 180,
  featured: false,
  location: {
    city: "Ocala",
    country: "United States",
    coordinates: {
      lat: 29.1872,
      lng: -82.1401
    }
  },
  serviceRadius: 100,
  remoteAvailable: true,
  bio: "I'll help you get into the best shape of your life through my 1-on-1 personal training and online fitness coaching program.",
  profileUrl: "/marketplace/trainer/steven-neider"
}
