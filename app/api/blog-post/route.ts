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
    .replace(/^-+|-+$/g, "") // Remove leading and trailing dashes
}

export async function POST(req: NextRequest) {
  // Basic authentication: Check for a debug token
  const debugToken = req.headers.get("X-Debug-Token") || req.nextUrl.searchParams.get("debug_token")
  if (process.env.DEBUG_TOKEN && debugToken !== process.env.DEBUG_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const payload = await req.json()
    console.log("[API] Received payload:", JSON.stringify(payload, null, 2)) // Log the full payload

    let markdownContent: string | undefined

    // Check if this is a raw Slack API response (direct or from Transform step)
    if (payload.messages && Array.isArray(payload.messages) && payload.messages.length > 0) {
      // Direct Slack API response
      const messageText = payload.messages[0].text
      if (typeof messageText === "string") {
        markdownContent = messageText
        console.log("[API] Extracted message text from direct Slack API response.")
      }
    } else if (payload.result && typeof payload.result === "object") {
      // Check if Transform step wrapped Slack data in result object
      if (payload.result.messages && Array.isArray(payload.result.messages) && payload.result.messages.length > 0) {
        const messageText = payload.result.messages[0].text
        if (typeof messageText === "string") {
          markdownContent = messageText
          console.log("[API] Extracted message text from Transform step result.messages.")
        }
      } else if (typeof payload.result.value === "string" && payload.result.value !== "undefined") {
        // Transform step might have the text in result.value
        markdownContent = payload.result.value
        console.log("[API] Extracted message text from Transform step result.value.")
      } else if (typeof payload.result.image === "string") {
        try {
          const parsedSlackData = JSON.parse(payload.result.image)
          if (
            parsedSlackData.messages &&
            Array.isArray(parsedSlackData.messages) &&
            parsedSlackData.messages.length > 0
          ) {
            const messageText = parsedSlackData.messages[0].text
            if (typeof messageText === "string") {
              markdownContent = messageText
              console.log("[API] Extracted message text from parsed result.image.")
            }
          }
        } catch (e) {
          console.log("[API] Failed to parse result.image as JSON:", e.message)
        }
      }
    } else if (payload.subject && typeof payload.subject.value === "string" && payload.subject.value !== "undefined") {
      try {
        // Try to parse subject.value as JSON (might contain Slack API response)
        const parsedSubject = JSON.parse(payload.subject.value)
        if (parsedSubject.messages && Array.isArray(parsedSubject.messages) && parsedSubject.messages.length > 0) {
          const messageText = parsedSubject.messages[0].text
          if (typeof messageText === "string") {
            markdownContent = messageText
            console.log("[API] Extracted message text from parsed subject.value.messages.")
          }
        }
      } catch (e) {
        // If parsing fails, use subject.value as plain text
        markdownContent = payload.subject.value
        console.log("[API] Using subject.value as plain text.")
      }
    }
    // If not raw Slack format, use existing logic
    else {
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

    // Prioritize: explicit slug > frontmatter title > article name > subject value > content excerpt + timestamp
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
        // Fallback: generate slug from first 50 chars of markdown content + timestamp
        const contentExcerpt = markdownContent.substring(0, 50).replace(/\n/g, " ") // Take first 50 chars, remove newlines
        fileName = slugify(`${contentExcerpt}-${Date.now()}`)
        console.log("[API] Slug derived from content excerpt + timestamp (fallback):", fileName)
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

    let finalImageUrl: string | null = null

    const imageFile = payload.imageFile // Assuming imageFile is part of the payload
    const imageUrl = payload.imageUrl // Assuming imageUrl is part of the payload

    if (imageFile && imageFile.size > 0) {
    } else if (imageUrl && imageUrl.trim()) {
    } else {
      try {
        console.log("[API] No image provided, using placeholder image")

        // Read the placeholder image from the public folder
        const placeholderPath = new URL(
          "/images/blog-placeholder-dumbbells.png",
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        )
        const placeholderResponse = await fetch(placeholderPath.toString())

        if (placeholderResponse.ok) {
          const placeholderBuffer = await placeholderResponse.arrayBuffer()
          const imageBlobPath = `blog/${fileName}.png`

          console.log("[API] Uploading placeholder image to:", imageBlobPath)

          const { url: uploadedImageUrl } = await put(imageBlobPath, placeholderBuffer, {
            access: "public",
            contentType: "image/png",
            addRandomSuffix: false,
            allowOverwrite: true,
          })

          finalImageUrl = uploadedImageUrl
          console.log("[API] Placeholder image uploaded successfully:", finalImageUrl)
        } else {
          console.log("[API] Could not fetch placeholder image, continuing without image")
        }
      } catch (error) {
        console.error("[API] Failed to upload placeholder image:", error)
        // Continue without image rather than failing the entire request
      }
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
        blobUrl: url, // URL of the stored blob
        postUrl: postUrl, // Full URL to the blog post page
        imageUrl: finalImageUrl, // URL of the uploaded image
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ message: "Failed to create blog post", error: error.message }, { status: 500 })
  }
}
