import { NextResponse } from "next/server"
import { list } from "@vercel/blob"
import matter from "gray-matter"

export async function GET() {
  try {
    const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

    if (!BLOB_TOKEN) {
      return NextResponse.json({ error: "No BLOB_TOKEN available" })
    }

    console.log("🔍 Starting individual blob debugging...")

    // List all blog files
    const { blobs } = await list({
      prefix: "blog/",
      token: BLOB_TOKEN,
    })

    console.log(`📁 Found ${blobs.length} blob files`)

    const results = []

    for (const blob of blobs) {
      const result = {
        filename: blob.pathname,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        size: blob.size,
        steps: [],
      }

      try {
        result.steps.push("✅ Blob file found")

        // Step 1: Try to fetch content
        console.log(`📥 Fetching content for: ${blob.pathname}`)
        const response = await fetch(blob.downloadUrl)

        if (!response.ok) {
          result.steps.push(`❌ Fetch failed: ${response.status} ${response.statusText}`)
          results.push(result)
          continue
        }

        result.steps.push("✅ Content fetched successfully")

        // Step 2: Get text content
        const content = await response.text()
        result.contentLength = content.length
        result.contentPreview = content.substring(0, 200) + "..."
        result.steps.push(`✅ Content read: ${content.length} characters`)

        // Step 3: Parse frontmatter
        try {
          const { data, content: markdownContent } = matter(content)
          result.frontmatter = data
          result.markdownLength = markdownContent.length
          result.steps.push("✅ Frontmatter parsed successfully")
        } catch (parseError) {
          result.steps.push(`❌ Frontmatter parsing failed: ${parseError.message}`)
          results.push(result)
          continue
        }

        // Step 4: Extract slug
        const slug = blob.pathname
          .replace("blog/", "")
          .replace(".md", "")
          .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
          .replace(/[^a-zA-Z0-9-]/g, "-") // Replace special chars with dashes
          .replace(/-+/g, "-") // Replace multiple dashes with single
          .toLowerCase()

        result.extractedSlug = slug
        result.steps.push(`✅ Slug extracted: ${slug}`)

        result.steps.push("✅ All steps completed successfully")
      } catch (error) {
        result.steps.push(`❌ Error: ${error.message}`)
        result.error = error.message
      }

      results.push(result)
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      totalBlobs: blobs.length,
      results,
    })
  } catch (error) {
    console.error("❌ Debug endpoint error:", error)
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}
