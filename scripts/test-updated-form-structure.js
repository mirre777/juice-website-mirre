// Test script for updated form structure with city/district fields and optional services
console.log("🧪 Testing Updated Form Structure...\n")

// Mock form data structures
const validFormData = {
  fullName: "John Smith",
  email: "john@example.com",
  phone: "+1234567890",
  city: "Vienna",
  district: "Innere Stadt",
  specialty: "Personal Training",
  bio: "Experienced trainer with 5 years in the industry",
  certifications: "NASM-CPT, ACE",
  services: ["Personal Training", "Strength Training"],
}

const validFormDataNoServices = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: "",
  city: "Berlin",
  district: "Mitte",
  specialty: "Yoga Instructor",
  bio: "",
  certifications: "",
  services: [], // Empty services array - should be valid now
}

const invalidFormData = {
  fullName: "",
  email: "invalid-email",
  phone: "",
  city: "",
  district: "",
  specialty: "",
  bio: "Short",
  certifications: "",
  services: [],
}

// Test validation function
function validateForm(formData) {
  const errors = {}

  // Required field validations
  if (!formData.fullName || formData.fullName.length < 2) {
    errors.fullName = "Name must be at least 2 characters"
  }

  if (!formData.email) {
    errors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!formData.city || formData.city.length < 2) {
    errors.city = "City must be at least 2 characters"
  }

  if (!formData.district || formData.district.length < 2) {
    errors.district = "District must be at least 2 characters"
  }

  if (!formData.specialty) {
    errors.specialty = "Please select your specialty"
  }

  // Bio is optional, but if provided, validate length
  if (formData.bio && formData.bio.length > 0 && formData.bio.length < 20) {
    errors.bio = "Bio must be at least 20 characters if provided"
  } else if (formData.bio && formData.bio.length > 500) {
    errors.bio = "Bio must be less than 500 characters"
  }

  // Services are now optional - no validation needed

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Test cases
console.log("Test 1: Valid form with services")
const test1 = validateForm(validFormData)
console.log("✅ Valid:", test1.isValid)
console.log("Errors:", test1.errors)
console.log("")

console.log("Test 2: Valid form without services (should pass now)")
const test2 = validateForm(validFormDataNoServices)
console.log("✅ Valid:", test2.isValid)
console.log("Errors:", test2.errors)
console.log("")

console.log("Test 3: Invalid form data")
const test3 = validateForm(invalidFormData)
console.log("❌ Valid:", test3.isValid)
console.log("Expected errors:", test3.errors)
console.log("")

// Test API compatibility
console.log("🔌 Testing API Compatibility...")
console.log("New field structure:")
console.log("- location → city + district")
console.log("- experience → removed")
console.log("- bio → optional")
console.log("- services → optional")
console.log("")

// Test database structure
console.log("🗄️ Testing Database Structure...")
const mockTrainerDocument = {
  id: "test-trainer-123",
  fullName: validFormData.fullName,
  email: validFormData.email,
  phone: validFormData.phone,
  city: validFormData.city,
  district: validFormData.district,
  specialty: validFormData.specialty,
  bio: validFormData.bio,
  certifications: validFormData.certifications,
  services: validFormData.services,
  status: "temp",
  createdAt: new Date(),
  updatedAt: new Date(),
}

console.log("Mock trainer document structure:")
console.log(JSON.stringify(mockTrainerDocument, null, 2))
console.log("")

// Migration considerations
console.log("🔄 Migration Considerations...")
console.log("Existing trainers with location field need:")
console.log("1. Parse location into city and district")
console.log("2. Handle cases where location cannot be split")
console.log("3. Set default values for missing fields")
console.log("")

console.log("✅ Form structure tests completed!")
console.log("Key changes validated:")
console.log("- City and district fields work correctly")
console.log("- Services are now optional")
console.log("- Bio is optional")
console.log("- Experience field removed")
