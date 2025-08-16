import { NextResponse } from "next/server"
import { list } from "@vercel/blob"
import { getAllPosts } from "@/lib/blog"

export async function GET() {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0,
      tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20) + "..." || "None",
    }

    // Test the actual getAllPosts function that the blog page uses
    const allPosts = await getAllPosts()

    // Also check Blob storage directly
    let blobPosts = []
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { blobs } = await list({
          prefix: "blog/",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        blobPosts = blobs.map((blob) => ({
          filename: blob.pathname,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
        }))
      } catch (blobError) {
        console.error("Blob storage error:", blobError)
      }
    }

    // Count posts by source
    const hardcodedPosts = allPosts.filter((post) => post.source === "hardcoded")
    const blobStoragePosts = allPosts.filter((post) => post.source === "blob")

    return NextResponse.json({
      ...debugInfo,
      // What getAllPosts actually returns
      actualPostsReturned: allPosts.length,
      hardcodedPostsInResult: hardcodedPosts.length,
      blobPostsInResult: blobStoragePosts.length,
      postSources: allPosts.map((post) => ({ title: post.title, source: post.source })),

      // Direct Blob storage check
      blobStorageFiles: blobPosts,
      blobStorageCount: blobPosts.length,

      // Summary
      isWorkingCorrectly: allPosts.length === hardcodedPosts.length + blobStoragePosts.length,
      expectedTotal: hardcodedPosts.length + blobPosts.length,
    })
  } catch (error) {
    return NextResponse.json({
      error: "Failed to debug blog system",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
