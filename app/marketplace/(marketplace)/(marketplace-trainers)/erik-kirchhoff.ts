import type { Trainer } from './types'

export const erikKirchhoff: Trainer = {
  id: "BO0Wox1M5wf00IoFmyDTVMZrtHn1",
  name: "Erik Kirchhoff",
  slug: "erik-kirchhoff",
  image: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/trainer-profile-images/ErikKirchhoff.jpeg",
  certification: "NASM Certified",
  specialties: ["Weight Loss", "Strength Training", "Mobility", "General Fitness",],
  rating: 4.9,
  reviews: 127,
  hourlyRate: 85,
  featured: true,
  location: {
    city: "Berlin",
    country: "Germany",
    coordinates: {
      lat: 52.3676,
      lng: 13.4049
    }
  },
  serviceRadius: 50,
  remoteAvailable: true,
  bio: "Experienced NASM certified trainer specializing in weight loss and strength training.",
  profileUrl: "/marketplace/trainer/erik-kirchhoff"
}
