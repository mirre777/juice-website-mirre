// Script to create a test trainer document in Firebase
import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function createTestTrainer() {
  try {
    const trainerId = "POj2MRZ5ZRbq3CW1U0zJ"

    const trainerData = {
      id: trainerId,
      fullName: "Alex Johnson",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      specialty: "Strength Training",
      specialization: "Strength Training",
      experience: "5+ Years",
      bio: "Certified personal trainer specializing in strength training and functional fitness.",
      services: ["Personal Training", "Strength Coaching", "Fitness Assessment"],
      certifications: ["NASM-CPT", "CSCS"],
      isActive: true,
      status: "active",
      isPaid: true,
      activatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("Creating test trainer with ID:", trainerId)
    console.log("Trainer data:", trainerData)

    await setDoc(doc(db, "trainers", trainerId), trainerData)

    console.log("✅ Test trainer created successfully!")
    console.log("🔗 Access at: /marketplace/trainer/" + trainerId)
  } catch (error) {
    console.error("❌ Error creating test trainer:", error)
  }
}

createTestTrainer()
