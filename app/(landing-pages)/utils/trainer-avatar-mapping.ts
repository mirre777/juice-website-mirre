/**
 * Mapping of trainer IDs and names to avatar image URLs
 * 
 * This mapping allows you to assign custom avatars to trainers.
 * The system will check:
 * 1. Trainer ID first
 * 2. Trainer name (case-insensitive) second
 * 3. Fall back to database imageUrl if no mapping exists
 * 
 * To add avatars:
 * - Upload avatar images to Vercel Blob storage in: trainer-profile-images/avatar-placeholders/
 * - Copy the full Vercel Blob URL (e.g., https://xxx.public.blob.vercel-storage.com/trainer-profile-images/avatar-placeholders/avatar-1.png)
 * - Add entries to the mapping below
 * 
 * Example Vercel Blob URLs:
 * - https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/trainer-profile-images/avatar-placeholders/avatar-1.png
 * - https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/trainer-profile-images/avatar-placeholders/avatar-2.png
 */

export type TrainerAvatarMapping = {
  byId?: Record<string, string>
  byName?: Record<string, string>
}

// Avatar mapping - add your trainer IDs/names and their avatar URLs here
export const trainerAvatarMapping: TrainerAvatarMapping = {
  // Example: Map by trainer ID
  byId: {
    // "trainer-id-1": "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/trainer-profile-images/avatar-placeholders/avatar-1.png",
    // "trainer-id-2": "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/trainer-profile-images/avatar-placeholders/avatar-2.png",
  },
  // Example: Map by trainer name (case-insensitive)
  byName: {
    // "John Doe": "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/trainer-profile-images/avatar-placeholders/avatar-3.png",
    // "Jane Smith": "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/trainer-profile-images/avatar-placeholders/avatar-4.png",
  },
}

/**
 * Base URL for Vercel Blob storage
 */
const BLOB_STORAGE_BASE_URL = "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com"

/**
 * Available avatar filenames (avatar20.png through avatar30.png)
 */
const AVAILABLE_AVATARS = [
  "avatar20.png", 
  "avatar21.png", 
  "avatar22.png", 
  "avatar23.png", 
  "avatar24.png",
  "avatar25.png",
  "avatar26.png",
  "avatar27.png",
  "avatar28.png",
  "avatar29.png",
  "avatar30.png"
]

/**
 * Simple hash function to convert a string to a number
 * This ensures the same trainer ID always gets the same avatar
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Get a random avatar URL for a trainer based on their ID
 * Uses a hash function so the same trainer always gets the same avatar
 */
function getRandomAvatarUrl(trainerId: string): string {
  const hash = hashString(trainerId)
  const avatarIndex = hash % AVAILABLE_AVATARS.length
  const avatarFilename = AVAILABLE_AVATARS[avatarIndex]
  return `${BLOB_STORAGE_BASE_URL}/trainer-profile-images/avatar-placeholders/${avatarFilename}`
}

/**
 * Get avatar URL for a trainer based on ID or name
 * Returns the mapped avatar URL if found, otherwise returns a random avatar based on trainer ID
 */
export function getTrainerAvatarUrl(trainerId: string, trainerName: string): string | undefined {
  // Check manual mapping by ID first
  if (trainerAvatarMapping.byId?.[trainerId]) {
    return trainerAvatarMapping.byId[trainerId]
  }
  
  // Check manual mapping by name (case-insensitive)
  const normalizedName = trainerName.toLowerCase().trim()
  if (trainerAvatarMapping.byName) {
    for (const [name, url] of Object.entries(trainerAvatarMapping.byName)) {
      if (name.toLowerCase().trim() === normalizedName) {
        return url
      }
    }
  }
  
  // If no manual mapping exists, assign a random avatar based on trainer ID
  // This ensures each trainer gets a consistent avatar
  if (trainerId) {
    return getRandomAvatarUrl(trainerId)
  }
  
  return undefined
}
