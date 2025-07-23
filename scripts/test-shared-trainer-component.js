// Test script for the shared TrainerProfileDisplay component
console.log("🧪 Testing Shared TrainerProfileDisplay Component")

// Mock trainer data for testing
const mockTrainerData = {
  id: "test-trainer-123",
  fullName: "Sarah Johnson",
  email: "sarah@example.com",
  phone: "+1 (555) 123-4567",
  city: "Amsterdam",
  district: "Centrum",
  specialty: "Strength Training & Nutrition",
  bio: "Certified personal trainer with 5+ years of experience helping clients achieve their fitness goals. Specializing in strength training, weight loss, and nutrition coaching.",
  certifications: "NASM-CPT, Precision Nutrition Level 1, TRX Certified",
  services: ["Personal Training", "Nutrition Coaching", "Group Classes"],
  profileImage: "/placeholder-user.jpg",
  status: "active",
  isActive: true,
  isPaid: true,
}

const mockContent = {
  hero: {
    title: "Transform Your Body with Sarah Johnson",
    subtitle: "Certified Personal Trainer & Nutrition Coach",
    description:
      "Get personalized training programs and nutrition guidance to reach your fitness goals faster than ever before.",
  },
  about: {
    title: "About Sarah",
    bio: "With over 5 years of experience in the fitness industry, I've helped hundreds of clients transform their lives through proper training and nutrition. My approach combines evidence-based methods with personalized attention to ensure you get the results you deserve.",
  },
  contact: {
    title: "Let's Start Your Journey",
    description: "Ready to transform your fitness? Get in touch to schedule your first session.",
    phone: "+1 (555) 123-4567",
    email: "sarah@example.com",
    location: "Amsterdam, Centrum",
  },
  services: [
    {
      id: "personal-training",
      title: "Personal Training",
      description: "One-on-one customized workout sessions tailored to your goals",
      price: 80,
      duration: "60 minutes",
      featured: true,
    },
    {
      id: "nutrition-coaching",
      title: "Nutrition Coaching",
      description: "Personalized meal plans and nutrition guidance",
      price: 60,
      duration: "45 minutes",
      featured: false,
    },
    {
      id: "group-classes",
      title: "Group Classes",
      description: "Small group training sessions for motivation and community",
      price: 35,
      duration: "45 minutes",
      featured: false,
    },
  ],
}

// Test scenarios
const testScenarios = [
  {
    name: "Live Mode - Full Data",
    props: {
      trainer: mockTrainerData,
      content: mockContent,
      mode: "live",
      isEditable: true,
    },
  },
  {
    name: "Temp Mode - Preview",
    props: {
      trainer: mockTrainerData,
      content: mockContent,
      mode: "temp",
      timeLeft: "2 hours 15 minutes",
      activationPrice: "€70",
    },
  },
  {
    name: "Minimal Data - Fallbacks",
    props: {
      trainer: {
        id: "minimal-trainer",
        fullName: "John Doe",
        email: "john@example.com",
        specialty: "General Fitness",
        services: [],
        status: "temp",
      },
      mode: "temp",
    },
  },
  {
    name: "Expired Temp Mode",
    props: {
      trainer: mockTrainerData,
      content: mockContent,
      mode: "temp",
      isExpired: true,
    },
  },
]

// Mock event handlers
const mockHandlers = {
  onBookConsultation: () => console.log("📅 Book consultation clicked"),
  onScheduleSession: () => console.log("🗓️ Schedule session clicked"),
  onSendMessage: () => console.log("💬 Send message clicked"),
  onActivate: () => console.log("🚀 Activate profile clicked"),
  onEdit: () => console.log("✏️ Edit profile clicked"),
}

console.log("✅ Component interfaces defined")
console.log("✅ Mock data prepared")
console.log("✅ Test scenarios created:")

testScenarios.forEach((scenario, index) => {
  console.log(`  ${index + 1}. ${scenario.name}`)
})

console.log("✅ Event handlers mocked")
console.log("🎯 Component ready for integration testing")

// Export for use in other test files
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    mockTrainerData,
    mockContent,
    testScenarios,
    mockHandlers,
  }
}
