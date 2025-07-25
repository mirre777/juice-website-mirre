import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
  const tokenAvailable = !!BLOB_TOKEN
  const tokenLength = BLOB_TOKEN?.length || 0

  const results: any = {
    tokenAvailable,
    tokenLength,
    allBlobs: [],
    blogBlobs: [],
    markdownFiles: [],
    prefixTests: {},
    errors: [],
    contentTest: null,
  }

  try {
    // Get all blobs
    const { blobs } = await list({ token: BLOB_TOKEN })
    results.allBlobs = blobs.map((blob, index) => ({
      index: index + 1,
      pathname: blob.pathname,
      size: blob.size,
      url: blob.url,
      uploadedAt: blob.uploadedAt,
    }))

    // Filter for blog/ prefix
    results.blogBlobs = blobs
      .filter((blob) => blob.pathname.startsWith("blog/"))
      .map((blob, index) => ({
        index: index + 1,
        pathname: blob.pathname,
        isMarkdown: blob.pathname.endsWith(".md"),
        size: blob.size,
      }))

    // Find all markdown files
    results.markdownFiles = blobs
      .filter((blob) => blob.pathname.endsWith(".md"))
      .map((blob, index) => {
        const parts = blob.pathname.split("/")
        const directory = parts.length > 1 ? parts.slice(0, -1).join("/") : "root"
        return {
          index: index + 1,
          pathname: blob.pathname,
          directory,
        }
      })

    // Test different prefixes
    const prefixesToTest = ["", "content/", "posts/", "blog-posts/", "content/blog/"]
    for (const prefix of prefixesToTest) {
      const { blobs: prefixBlobs } = await list({ prefix, token: BLOB_TOKEN })
      const markdownFiles = prefixBlobs.filter((blob) => blob.pathname.endsWith(".md")).map((blob) => blob.pathname)
      results.prefixTests[prefix || "root"] = {
        totalBlobs: prefixBlobs.length,
        markdownCount: markdownFiles.length,
        markdownFiles,
      }
    }

    // Try to fetch content from the first markdown file
    if (results.markdownFiles.length > 0) {
      const firstFile = results.markdownFiles[0].pathname
      try {
        const firstBlob = blobs.find((blob) => blob.pathname === firstFile)
        if (firstBlob) {
          const response = await fetch(firstBlob.url, {
            headers: {
              Authorization: `Bearer ${BLOB_TOKEN}`,
            },
          })

          if (response.ok) {
            const content = await response.text()
            results.contentTest = {
              file: firstFile,
              fetchStatus: response.status,
              contentPreview: content.substring(0, 200) + "...",
            }
          } else {
            results.contentTest = {
              file: firstFile,
              fetchStatus: response.status,
              error: "Failed to fetch content",
            }
          }
        }
      } catch (error) {
        results.contentTest = {
          file: firstFile,
          error: error.message,
        }
      }
    }
  } catch (error) {
    results.errors.push({
      message: error.message,
      stack: error.stack,
    })
  }

  return NextResponse.json(results)
}
