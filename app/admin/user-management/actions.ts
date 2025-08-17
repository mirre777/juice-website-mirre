// Helper function to standardize plan values
function standardizePlan(plan: string, userType: string): string {
  // For trainers
  if (userType === "trainer" || userType === "coach") {
    if (plan === "coach") {
      return "pro"
    } else if (["pro", "elite"].includes(plan)) {
      return plan
    }
    return "pro" // Default for trainers
  }
  // For clients
  else {
    if (["basic", "premium"].includes(plan)) {
      return plan
    }
    return "basic" // Default for clients
  }
}

export async function convertPotentialUserToPending(potentialUserId: string) {
  // Assuming you have necessary imports and database connection setup

  try {
    // Fetch potential user data (replace with your actual data fetching logic)
    const potentialUserData = await fetchPotentialUser(potentialUserId)

    if (!potentialUserData) {
      return { success: false, message: "Potential user not found" }
    }

    const now = new Date()

    // Determine user_type based on existing data
    const user_type =
      potentialUserData.user_type ||
      (potentialUserData.role === "trainer" || potentialUserData.role === "coach" || potentialUserData.plan === "coach"
        ? "trainer"
        : "client")

    // Create the user document data
    const userData = {
      // Standard fields
      createdAt: now,
      updatedAt: now,

      // Status
      status: "pending",
      pendingAt: now,

      // Fields from potential user
      email: potentialUserData.email,
      user_type, // Use user_type instead of role
      hasTrainer: false, // Use hasTrainer instead of hasCoach

      // Connection to potential user
      potentialUserId: potentialUserId,
      fromWaitlist: true,

      // Additional data
      displayName: potentialUserData.displayName || "",
      plan: standardizePlan(potentialUserData.plan || "basic", user_type),
    }

    // Create the user in the database (replace with your actual database logic)
    const userId = await createUser(userData)

    // Update the potential user record (replace with your actual database logic)
    await updatePotentialUser(potentialUserId, { converted: true })

    return {
      success: true,
      userId: userId,
      message: "Potential user successfully converted to pending user",
      user_type, // Use user_type instead of role
    }
  } catch (error: any) {
    console.error("Error converting potential user:", error)
    return { success: false, message: `Error converting potential user: ${error.message}` }
  }
}

// Placeholder functions - replace with your actual database interaction logic
async function fetchPotentialUser(potentialUserId: string): Promise<any> {
  // Replace with your actual data fetching logic
  return {
    email: "test@example.com",
    user_type: "client",
    plan: "basic",
    displayName: "Test User",
    role: null,
  }
}

async function createUser(userData: any): Promise<string> {
  // Replace with your actual user creation logic
  return "new-user-id"
}

async function updatePotentialUser(potentialUserId: string, updateData: any): Promise<void> {
  // Replace with your actual update logic
}
