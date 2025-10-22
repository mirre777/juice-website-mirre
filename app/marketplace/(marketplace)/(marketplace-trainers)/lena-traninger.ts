import type { Trainer } from './types'

export const lenaTraninger: Trainer = {
  id: "8ogaYAb7xAQp022wfJCowAiWnHB2",
  name: "Lena Traninger",
  slug: "lena-traninger",
  image: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/trainer-profile-images/lena-strength-lab-vienna.png",
  certification: "ACE Certified",
  specialties: ["HIIT", "Functional Training"],
  rating: 4.8,
  reviews: 94,
  hourlyRate: 95,
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
  bio: "ACE certified trainer with expertise in HIIT and functional training.",
  profileUrl: "/marketplace/trainer/lena-traninger"
}
