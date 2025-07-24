import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 DEBUGGING BLOB STORAGE CONTENTS")
  console.log("================================")

  const token = process.env.BLOB_READ_WRITE_TOKEN
  console.log("🔑 Token available:", !!token)
  console.log("🔑 Token length:", token?.length || 0)

  const debugInfo = {
    tokenAvailable: !!token,
    tokenLength: token?.length || 0,
    allBlobs: [],
    blogBlobs: [],
    markdownFiles: [],
    prefixTests: {},
    errors: [],
  }

  if (!token) {
    const error = "❌ No BLOB_READ_WRITE_TOKEN found"
    console.error(error)
    debugInfo.errors.push(error)
    return NextResponse.json(debugInfo)
  }

  try {
    // First, list ALL blobs to see what's there
    console.log("\n📊 LISTING ALL BLOBS:")
    console.log("====================")
    const allBlobs = await list({ token })
    console.log(`Total blobs found: ${allBlobs.blobs.length}`)

    debugInfo.allBlobs = allBlobs.blobs.map((blob, index) => {
      const info = {
        index: index + 1,
        pathname: blob.pathname,
        size: blob.size,
        url: blob.url,
        uploadedAt: blob.uploadedAt,
      }
      console.log(`${index + 1}. ${blob.pathname}`)
      console.log(`   Size: ${blob.size} bytes`)
      console.log(`   URL: ${blob.url}`)
      console.log(`   Uploaded: ${blob.uploadedAt}`)
      console.log("")
      return info
    })

    // Then, specifically look for blog/ prefix
    console.log("\n📝 LOOKING FOR BLOG/ PREFIX:")
    console.log("============================")
    const blogBlobs = await list({ prefix: "blog/", token })
    console.log(`Blog blobs found: ${blogBlobs.blobs.length}`)

    debugInfo.blogBlobs = blogBlobs.blobs.map((blob, index) => {
      const info = {
        index: index + 1,
        pathname: blob.pathname,
        isMarkdown: blob.pathname.endsWith(".md"),
        size: blob.size,
      }
      console.log(`${index + 1}. ${blob.pathname}`)
      console.log(`   Is markdown: ${blob.pathname.endsWith(".md")}`)
      console.log(`   Size: ${blob.size} bytes`)
      console.log("")
      return info
    })

    // Look for any markdown files anywhere
    console.log("\n📄 ALL MARKDOWN FILES:")
    console.log("======================")
    const markdownFiles = allBlobs.blobs.filter((blob) => blob.pathname.endsWith(".md"))
    console.log(`Markdown files found: ${markdownFiles.length}`)

    debugInfo.markdownFiles = markdownFiles.map((blob, index) => {
      const info = {
        index: index + 1,
        pathname: blob.pathname,
        directory: blob.pathname.split("/").slice(0, -1).join("/") || "root",
      }
      console.log(`${index + 1}. ${blob.pathname}`)
      console.log(`   Directory: ${blob.pathname.split("/").slice(0, -1).join("/") || "root"}`)
      console.log("")
      return info
    })

    // Try different prefixes
    console.log("\n🔍 TRYING DIFFERENT PREFIXES:")
    console.log("=============================")
    const prefixes = ["", "content/", "posts/", "blog-posts/", "content/blog/"]

    for (const prefix of prefixes) {
      try {
        const result = await list({ prefix, token })
        const mdFiles = result.blobs.filter((b) => b.pathname.endsWith(".md"))
        const info = {
          totalBlobs: result.blobs.length,
          markdownCount: mdFiles.length,
          markdownFiles: mdFiles.map((f) => f.pathname),
        }
        debugInfo.prefixTests[prefix || "root"] = info
        console.log(`Prefix "${prefix}": ${result.blobs.length} total, ${mdFiles.length} markdown`)
        if (mdFiles.length > 0) {
          mdFiles.forEach((file) => console.log(`  - ${file.pathname}`))
        }
      } catch (error) {
        const errorMsg = `Prefix "${prefix}": Error - ${error.message}`
        console.log(errorMsg)
        debugInfo.prefixTests[prefix || "root"] = { error: error.message }
      }
    }

    // Try to fetch content from the first markdown file if any exist
    if (markdownFiles.length > 0) {
      console.log("\n📖 TESTING CONTENT FETCH:")
      console.log("=========================")
      const firstMdFile = markdownFiles[0]
      console.log(`Attempting to fetch: ${firstMdFile.pathname}`)

      try {
        const response = await fetch(firstMdFile.url)
        console.log(`Fetch status: ${response.status}`)

        if (response.ok) {
          const content = await response.text()
          console.log(`Content length: ${content.length} characters`)
          console.log(`Content preview: ${content.substring(0, 200)}...`)

          debugInfo.contentTest = {
            file: firstMdFile.pathname,
            fetchStatus: response.status,
            contentLength: content.length,
            contentPreview: content.substring(0, 200),
          }
        } else {
          debugInfo.contentTest = {
            file: firstMdFile.pathname,
            fetchStatus: response.status,
            error: "Failed to fetch content",
          }
        }
      } catch (error) {
        debugInfo.contentTest = {
          file: firstMdFile.pathname,
          error: error.message,
        }
      }
    }
  } catch (error) {
    const errorMsg = `💥 Error accessing blob storage: ${error.message}`
    console.error(errorMsg)
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    debugInfo.errors.push(errorMsg)
  }

  return NextResponse.json(debugInfo, { status: 200 })
}
