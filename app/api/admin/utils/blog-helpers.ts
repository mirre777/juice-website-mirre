import { del, list, put } from "@vercel/blob"

/**
 * Clean and sanitize a slug from a filename
 * Removes special characters, timestamps, and normalizes to lowercase
 */
export function cleanSlugFromFilename(filename: string): string {
  return filename
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/g, "")
    .replace(/-\d{10,}/g, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}

/**
 * Find a blob file by slug using fuzzy matching
 * @param slug - The slug to search for
 * @param prefix - The blob storage prefix (e.g., "blog/" or "interviews/")
 * @returns The matching blob or undefined
 */
export async function findBlobBySlug(slug: string, prefix: string) {
  const { blobs } = await list({ prefix })
  return blobs.find((blob) => {
    if (!blob.pathname.endsWith(".md")) return false
    const rawSlug = blob.pathname.replace(prefix, "").replace(/\.md$/, "")
    const cleanedSlug = cleanSlugFromFilename(rawSlug)
    return (
      cleanedSlug === slug ||
      rawSlug === slug ||
      blob.pathname.includes(slug) ||
      rawSlug.includes(slug) ||
      slug.includes(cleanedSlug) ||
      slug.includes(rawSlug)
    )
  })
}

/**
 * Check if a slug already exists in blob storage (exact match only)
 * @param slug - The slug to check (should already be sanitized)
 * @param prefix - The blob storage prefix (e.g., "blog/" or "interviews/")
 * @returns true if slug exists, false otherwise
 */
export async function slugExists(slug: string, prefix: string): Promise<boolean> {
  const { blobs } = await list({ prefix })
  return blobs.some((blob) => {
    if (!blob.pathname.endsWith(".md")) return false
    const rawSlug = blob.pathname.replace(prefix, "").replace(/\.md$/, "")
    const cleanedSlug = cleanSlugFromFilename(rawSlug)
    // Exact match only for conflict checking
    return cleanedSlug === slug || rawSlug === slug
  })
}

/**
 * Atomically rename a slug by creating new file, verifying, then deleting old file
 * @param oldSlug - Current slug
 * @param newSlug - New slug value
 * @param prefix - Blob storage prefix (e.g., "blog/" or "interviews/")
 * @param revalidatePathFn - Function to revalidate Next.js cache paths
 * @returns Success status with new slug or error message
 */
export async function renameSlug(
  oldSlug: string,
  newSlug: string,
  prefix: string,
  revalidatePathFn: (path: string) => void,
): Promise<{ success: boolean; error?: string; newSlug?: string }> {
  // 1. Sanitize new slug
  const sanitizedNewSlug = cleanSlugFromFilename(newSlug)

  // 2. Validate new slug is different
  if (sanitizedNewSlug === oldSlug) {
    return { success: false, error: "New slug must be different from current slug" }
  }

  // 3. Find old file first (needed to exclude it from conflict check)
  const oldBlob = await findBlobBySlug(oldSlug, prefix)
  if (!oldBlob) {
    return { success: false, error: "Blog post not found" }
  }

  // 4. Check if new slug already exists (excluding the old file)
  const { blobs } = await list({ prefix })
  const conflictingBlob = blobs.find((blob) => {
    if (!blob.pathname.endsWith(".md")) return false
    // Skip the old file itself
    if (blob.pathname === oldBlob.pathname) return false
    const rawSlug = blob.pathname.replace(prefix, "").replace(/\.md$/, "")
    const cleanedSlug = cleanSlugFromFilename(rawSlug)
    // Exact match only for conflict checking
    return cleanedSlug === sanitizedNewSlug || rawSlug === sanitizedNewSlug
  })

  if (conflictingBlob) {
    return { success: false, error: `Slug "${sanitizedNewSlug}" already exists` }
  }

  // 5. Read current content
  const response = await fetch(oldBlob.url)
  if (!response.ok) {
    return { success: false, error: "Failed to read current file content" }
  }
  const content = await response.text()

  // 6. Create new file (atomic - do this first)
  const newPath = `${prefix}${sanitizedNewSlug}.md`
  try {
    await put(newPath, content, {
      access: "public",
      allowOverwrite: false, // Prevent accidental overwrites
    })
  } catch (error) {
    return {
      success: false,
      error: `Failed to create new file: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }

  // 7. Verify new file exists (safety check)
  const verifyBlob = await findBlobBySlug(sanitizedNewSlug, prefix)
  if (!verifyBlob) {
    return { success: false, error: "New file creation failed verification" }
  }

  // 8. Delete old file (only after successful creation)
  try {
    await del(oldBlob.url)
  } catch (error) {
    // If delete fails, we still have the new file, so log but don't fail
    console.error(`Failed to delete old file ${oldBlob.pathname}:`, error)
  }

  // 9. Revalidate both paths
  const basePath = prefix === "blog/" ? "/blog" : "/interview"
  revalidatePathFn(`${basePath}/${oldSlug}`)
  revalidatePathFn(`${basePath}/${sanitizedNewSlug}`)

  return { success: true, newSlug: sanitizedNewSlug }
}

