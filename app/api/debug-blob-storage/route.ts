import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

export async function GET() {
  console.log("[DEBUG] Starting blob storage debug...")

  const result = {
    tokenAvailable: !!BLOB_TOKEN,
    tokenLength: BLOB_TOKEN?.length || 0,
    allBlobs: [] as any[],
    blogBlobs: [] as any[],
    markdownFiles: [] as any[],
    prefixTests: {} as any,
    errors: [] as string[],
    contentTest: null as any,
  }

  if (!BLOB_TOKEN) {
    result.errors.push("BLOB_READ_WRITE_TOKEN not found")
    return NextResponse.json(result)
  }

  try {
    // Get all blobs
    console.log("[DEBUG] Fetching all blobs...")
    const { blobs: allBlobs } = await list({ token: BLOB_TOKEN })
    result.allBlobs = allBlobs.map((blob, index) => ({
      index: index + 1,
      pathname: blob.pathname,
      size: blob.size,
      url: blob.url,
      uploadedAt: blob.uploadedAt,
    }))

    // Get blog-specific blobs
    console.log("[DEBUG] Fetching blog/ prefixed blobs...")
    const { blobs: blogBlobs } = await list({ prefix: "blog/", token: BLOB_TOKEN })
    result.blogBlobs = blogBlobs.map((blob, index) => ({
      index: index + 1,
      pathname: blob.pathname,
      isMarkdown: blob.pathname.endsWith(".md"),
      size: blob.size,
    }))

    // Find all markdown files
    const markdownFiles = allBlobs.filter((blob) => blob.pathname.endsWith(".md"))
    result.markdownFiles = markdownFiles.map((blob, index) => ({
      index: index + 1,
      pathname: blob.pathname,
      directory: blob.pathname.split("/")[0],
    }))

    // Test different prefixes
    const prefixesToTest = ["", "content/", "posts/", "blog-posts/", "content/blog/"]
    for (const prefix of prefixesToTest) {
      try {
        const { blobs } = await list({ prefix, token: BLOB_TOKEN })
        const markdownCount = blobs.filter((b) => b.pathname.endsWith(".md")).length
        result.prefixTests[prefix || "root"] = {
          totalBlobs: blobs.length,
          markdownCount,
          markdownFiles: blobs.filter((b) => b.pathname.endsWith(".md")).map((b) => b.pathname),
        }
      } catch (error) {
        result.prefixTests[prefix || "root"] = { error: error.message }
      }
    }

    // Try to fetch content from the first markdown file
    if (markdownFiles.length > 0) {
      const firstFile = markdownFiles[0]
      try {
        console.log(`[DEBUG] Attempting to fetch content from: ${firstFile.url}`)
        const response = await fetch(firstFile.url)
        result.contentTest = {
          file: firstFile.pathname,
          fetchStatus: response.status,
          error: response.ok ? null : "Failed to fetch content",
        }
      } catch (error) {
        result.contentTest = {
          file: firstFile.pathname,
          fetchStatus: null,
          error: error.message,
        }
      }
    }
  } catch (error) {
    console.error("[DEBUG] Error in blob storage debug:", error)
    result.errors.push(error.message)
  }

  return NextResponse.json(result)
}
