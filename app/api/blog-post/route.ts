import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import matter from "gray-matter"
import { revalidatePath } from "next/cache"

// Function to slugify a string
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
}

function getFileExtension(contentType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  }
  return mimeToExt[contentType] || "jpg"
}

// Function to generate a simple filename from content
function generateSimpleFilenameFromContent(content: string): string {
  // Remove markdown formatting and get plain text
  const plainText = content
    .replace(/^---[\s\S]*?---/, "") // Remove frontmatter
    .replace(/[#*_`]/g, "") // Remove markdown formatting
    .replace(/\n/g, " ") // Replace newlines with spaces
    .trim()

  // Take first 6 words and create a slug
  const words = plainText.split(/\s+/).slice(0, 6)
  const title = words.join(" ")

  return slugify(title)
}

export async function POST(req: NextRequest) {
  // Basic authentication: Check for a debug token
  const debugToken = req.headers.get("X-Debug-Token") || req.nextUrl.searchParams.get("debug_token")
  if (process.env.DEBUG_TOKEN && debugToken !== process.env.DEBUG_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const contentType = req.headers.get("content-type") || ""
    let payload: any
    let imageFile: File | null = null
    let markdownContent: string | undefined

    if (contentType.includes("multipart/form-data")) {
      // Handle form data with potential image upload
      const formData = await req.formData()

      // Extract JSON payload from form data
      const payloadString = formData.get("payload") as string
      payload = payloadString ? JSON.parse(payloadString) : {}

      // Extract image file if present
      imageFile = formData.get("image") as File | null

      console.log("[API] Received multipart request with image:", !!imageFile)
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData()

      // Extract content from "body" parameter (Relay sends processed markdown here)
      markdownContent = formData.get("body") as string

      // Extract image file if present
      imageFile = formData.get("image") as File | null

      // Create a simple payload structure for compatibility
      payload = {
        result: {
          markdownValue: markdownContent,
        },
      }

      console.log("[API] Received form-encoded request with image:", !!imageFile)
      console.log("[API] Form-encoded content length:", markdownContent?.length || 0)
    } else {
      // Handle regular JSON payload
      payload = await req.json()
    }

    console.log("[API] Received payload:", JSON.stringify(payload, null, 2))

    // Only extract markdownContent if not already set (for form-encoded requests)
    if (!markdownContent) {
      // Prioritize content from operations[0].result.markdownValue
      if (
        payload.operations &&
        Array.isArray(payload.operations) &&
        payload.operations.length > 0 &&
        payload.operations[0].result &&
        typeof payload.operations[0].result.markdownValue === "string"
      ) {
        markdownContent = payload.operations[0].result.markdownValue
        console.log("[API] Extracted markdownContent from operations[0].result.markdownValue.")
      } else if (typeof payload.result?.markdownValue === "string") {
        // Fallback to result.markdownValue
        markdownContent = payload.result.markdownValue
        console.log("[API] Extracted markdownContent from result.markdownValue.")
      } else if (typeof payload.result?.textView === "string") {
        // Fallback to result.textView
        markdownContent = payload.result.textView
        console.log("[API] Extracted markdownContent from result.textView.")
      } else if (typeof payload.markdownContent === "string") {
        // Fallback to top-level markdownContent
        markdownContent = payload.markdownContent
        console.log("[API] Extracted markdownContent from top-level markdownContent.")
      }
    }

    console.log(
      "[API] Final extracted markdownContent (first 100 chars):",
      markdownContent ? markdownContent.substring(0, 100) + "..." : "N/A",
    )

    const providedSlug = payload.slug // Explicit slug from payload
    console.log("[API] Provided slug from payload:", providedSlug)

    if (!markdownContent) {
      return NextResponse.json({ message: "Markdown content is required" }, { status: 400 })
    }

    // Parse frontmatter to get the title
    const { data } = matter(markdownContent)
    const frontmatterTitle = data.title
    console.log("[API] Frontmatter title:", frontmatterTitle)

    // Try to get a title from "article name" in subject
    const articleNameTitle =
      typeof payload.subject?.["article name"] === "string" ? payload.subject["article name"] : undefined
    console.log("[API] Article name from subject:", articleNameTitle)

    // Try to get a title from the subject value, truncated to avoid long slugs
    const subjectValueTitle =
      typeof payload.subject?.value === "string"
        ? payload.subject.value
            .split("\n")[0]
            .substring(0, 100) // Take first line, max 100 chars
        : undefined
    console.log("[API] Subject value title:", subjectValueTitle)

    let fileName = providedSlug

    if (!fileName) {
      if (frontmatterTitle) {
        fileName = slugify(frontmatterTitle)
        console.log("[API] Slug derived from frontmatter title:", fileName)
      } else if (articleNameTitle) {
        fileName = slugify(articleNameTitle)
        console.log("[API] Slug derived from article name:", fileName)
      } else if (subjectValueTitle) {
        fileName = slugify(subjectValueTitle)
        console.log("[API] Slug derived from subject value:", fileName)
      } else {
        // Simple content-based filename generation
        const contentBasedSlug = generateSimpleFilenameFromContent(markdownContent)

        if (contentBasedSlug && contentBasedSlug.length > 3) {
          fileName = contentBasedSlug
          console.log("[API] Slug derived from content (first 6 words):", fileName)
        } else {
          // Final fallback: timestamp-based
          fileName = `blog-post-${Date.now()}`
          console.log("[API] Slug derived from timestamp (fallback):", fileName)
        }
      }
    } else {
      console.log("[API] Slug explicitly provided:", fileName)
    }

    // Define the path in Blob storage (e.g., "blog/my-post.md")
    const blobPath = `blog/${fileName}.md`
    console.log("[API] Final blob path:", blobPath)

    // Store the markdown content in Vercel Blob
    const { url } = await put(blobPath, markdownContent, {
      access: "public", // Make the blob publicly accessible for reading
      contentType: "text/markdown",
      addRandomSuffix: false, // Ensure the filename matches the slug exactly
      allowOverwrite: true, // Allow overwriting existing blobs with the same name
    })

    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      const fileExtension = getFileExtension(imageFile.type)
      const imageBlobPath = `blog/${fileName}.${fileExtension}`

      console.log("[API] Uploading image to:", imageBlobPath)

      const imageBuffer = await imageFile.arrayBuffer()
      const { url: uploadedImageUrl } = await put(imageBlobPath, imageBuffer, {
        access: "public",
        contentType: imageFile.type,
        addRandomSuffix: false,
        allowOverwrite: true,
      })

      imageUrl = uploadedImageUrl
      console.log("[API] Image uploaded successfully:", imageUrl)
    }

    // Construct the full URL for the blog post page
    // Use NEXT_PUBLIC_APP_URL if available, otherwise default to a placeholder
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com"
    const postUrl = `${baseUrl}/blog/${fileName}`

    // Revalidate the blog paths to show the new content
    revalidatePath("/blog") // Revalidate the main blog listing page
    revalidatePath(`/blog/${fileName}`) // Revalidate the specific new blog post page

    return NextResponse.json(
      {
        message: "Blog post created successfully",
        slug: fileName,
        blobUrl: url, // URL of the stored markdown blob
        imageUrl: imageUrl, // URL of the stored image blob (if uploaded)
        postUrl: postUrl, // Full URL to the blog post page
        hasImage: !!imageUrl, // Boolean indicating if an image was uploaded
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ message: "Failed to create blog post", error: error.message }, { status: 500 })
  }
}
