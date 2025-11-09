import { TrainerDirectoryLayout } from "@/app/(landing-pages)/components/trainer-directory-layout"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

type TrainerDirectoryPageProps = {
  params: Promise<{
    city: string
  }>
}

// Sample data for Berlin
const berlinDistricts = [
  "Friedrichshain",
  "Mitte",
  "Kreuzberg",
  "Prenzlauer Berg",
  "Neukölln",
  "Charlottenburg",
  "Tempelhof",
  "Tiergarten",
]

const berlinTrainers = [
  {
    id: "1",
    name: "Sarah Mueller",
    isVerified: true,
    certifications: ["NASM CPT", "Certified Nutrition Coach"],
    hasReviews: true,
    specialties: ["Strength Training", "Weight Loss", "Nutrition"],
    locations: ["Friedrichshain", "Kreuzberg"],
    isOnline: true,
  },
  {
    id: "2",
    name: "Marcus Weber",
    isVerified: true,
    certifications: ["Personal Trainer Certification"],
    hasReviews: false,
    specialties: ["Nutrition Coaching", "Powerlifting"],
    locations: ["Friedrichshain"],
    isOnline: false,
  },
  {
    id: "3",
    name: "Lisa Hoffmann",
    isVerified: false,
    certifications: [],
    hasReviews: false,
    specialties: ["Yoga / Pilates", "Strength Training"],
    locations: ["Friedrichshain", "Mitte", "Prenzlauer Berg"],
    isOnline: true,
  },
  {
    id: "4",
    name: "Thomas Richter",
    isVerified: false,
    certifications: [],
    hasReviews: false,
    specialties: ["Boxing", "Bodybuilding", "Cardio"],
    locations: ["Friedrichshain", "Kreuzberg"],
    isOnline: true,
  },
  {
    id: "5",
    name: "Anna Schneider",
    isVerified: true,
    certifications: ["ACSM CPT"],
    hasReviews: false,
    specialties: ["Functional Training", "Rehabilitation"],
    locations: ["Friedrichshain"],
    isOnline: false,
  },
  {
    id: "6",
    name: "Kevin Martinez",
    isVerified: false,
    certifications: [],
    hasReviews: false,
    specialties: ["Calisthenics", "Bodyweight"],
    locations: ["Friedrichshain", "Neukölln"],
    isOnline: false,
  },
  {
    id: "7",
    name: "David Kim",
    isVerified: true,
    certifications: ["NSCA CSCS"],
    hasReviews: false,
    specialties: ["Strength & Conditioning", "Sports Performance"],
    locations: ["Mitte"],
    isOnline: true,
  },
]

// Sample data for London
const londonDistricts = [
  "Westminster",
  "Camden",
  "Islington",
  "Hackney",
  "Tower Hamlets",
  "Southwark",
  "Lambeth",
  "Kensington and Chelsea",
  "Hammersmith and Fulham",
]

const londonTrainers = [
  {
    id: "1",
    name: "James Wilson",
    isVerified: true,
    certifications: ["NASM CPT", "Certified Nutrition Coach"],
    hasReviews: true,
    specialties: ["Strength Training", "Weight Loss", "Nutrition"],
    locations: ["Westminster", "Camden"],
    isOnline: true,
  },
  {
    id: "2",
    name: "Emma Thompson",
    isVerified: true,
    certifications: ["ACSM CPT"],
    hasReviews: true,
    specialties: ["Yoga", "Pilates", "Flexibility"],
    locations: ["Islington", "Hackney"],
    isOnline: true,
  },
  {
    id: "3",
    name: "Michael Brown",
    isVerified: false,
    certifications: [],
    hasReviews: false,
    specialties: ["Boxing", "Cardio", "HIIT"],
    locations: ["Tower Hamlets", "Southwark"],
    isOnline: false,
  },
  {
    id: "4",
    name: "Sophie Davis",
    isVerified: true,
    certifications: ["NSCA CSCS"],
    hasReviews: false,
    specialties: ["Strength & Conditioning", "Athletic Performance"],
    locations: ["Kensington and Chelsea"],
    isOnline: true,
  },
  {
    id: "5",
    name: "Oliver Taylor",
    isVerified: false,
    certifications: [],
    hasReviews: false,
    specialties: ["Calisthenics", "Bodyweight Training"],
    locations: ["Lambeth", "Southwark"],
    isOnline: false,
  },
]

function getCityData(city: string) {
  const normalizedCity = city.toLowerCase()
  
  if (normalizedCity === "berlin") {
    return {
      cityName: "Berlin",
      districts: berlinDistricts,
      trainers: berlinTrainers,
    }
  }
  
  if (normalizedCity === "london") {
    return {
      cityName: "London",
      districts: londonDistricts,
      trainers: londonTrainers,
    }
  }
  
  // Default to Berlin if city not found
  return {
    cityName: city.charAt(0).toUpperCase() + city.slice(1),
    districts: berlinDistricts,
    trainers: berlinTrainers,
  }
}

export default async function TrainerDirectoryPage({ params }: TrainerDirectoryPageProps) {
  const { city } = await params
  const { cityName, districts, trainers } = getCityData(city)

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <TrainerDirectoryLayout city={cityName} districts={districts} trainers={trainers} />
      <Footer />
    </main>
  )
}

