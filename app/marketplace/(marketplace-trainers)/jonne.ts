import type { Trainer } from './types'

export const jonne: Trainer = {
  id: "jonne",
  name: "Jonne",
  slug: "jonne",
  image: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/trainer-profile-images/jonne%20trainer.png",
  certification: "RYT-500",
  specialties: ["Strength Training"],
  rating: 5.0,
  reviews: 156,
  hourlyRate: 110,
  featured: true,
  location: {
    city: "Vienna",
    country: "Austria",
    coordinates: {
      lat: 48.2082,
      lng: 16.3738
    }
  },
  serviceRadius: 50,
  remoteAvailable: true,
  bio: "I'll help you get into the best shape of your life through my 1-on-1 personal training and online fitness coaching program.",
  profileUrl: "/marketplace/trainer/jonne"
}
