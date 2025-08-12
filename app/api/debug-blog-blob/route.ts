import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET() {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0,
      tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20) + "..." || "None",
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({
        ...debugInfo,
        error: "BLOB_READ_WRITE_TOKEN not found",
        blobContent: [],
        hardcodedPostsCount: 11,
        totalArticlesShown: 11,
        source: "hardcoded_fallback",
      })
    }

    // List all blog content in Blob storage
    const { blobs } = await list({
      prefix: "blog/",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const blobPosts = blobs.map((blob) => ({
      filename: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      url: blob.url,
    }))

    return NextResponse.json({
      ...debugInfo,
      blobContent: blobPosts,
      blobPostsCount: blobPosts.length,
      hardcodedPostsCount: 11,
      totalArticlesShown: blobPosts.length > 0 ? blobPosts.length : 11,
      source: blobPosts.length > 0 ? "blob_storage" : "hardcoded_fallback",
    })
  } catch (error) {
    return NextResponse.json({
      error: "Failed to access Blob storage",
      details: error instanceof Error ? error.message : "Unknown error",
      hardcodedPostsCount: 11,
      totalArticlesShown: 11,
      source: "hardcoded_fallback",
    })
  }
}
