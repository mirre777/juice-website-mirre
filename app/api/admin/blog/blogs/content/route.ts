import { type NextRequest, NextResponse } from "next/server"
import { list, put } from "@vercel/blob"
import { findBlobBySlug } from "@/app/admin/blog/utils/blog-and-interview-helpers"

function isHardcodedPost(slug: string): boolean {
  const hardcodedSlugs = [
    "fundamentals-of-weightlifting-guide-to-building-real-strength",
    "are-wearables-accurate-enough-to-track-complex-lifting-movements",
    "tracking-biometrics-what-actually-moves-the-needle",
    "google-sheets-for-coaching-trainers-secret-weapon-or-trap",
    "how-to-get-more-clients-with-booking-page",
    "top-5-free-personal-trainer-website-builders-2025",
    "seo-tips-for-fitness-coaches-in-europe",
    "strength-training-revolution-berlin-gyms",
  ]

  return hardcodedSlugs.includes(slug)
}

// GET endpoint to fetch full markdown content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    if (isHardcodedPost(slug)) {
      return NextResponse.json({ error: "Cannot fetch hardcoded sample posts" }, { status: 403 })
    }

    const blogFile = await findBlobBySlug(slug, "blog/")

    if (!blogFile) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const response = await fetch(blogFile.url)
    const content = await response.text()

    return NextResponse.json({
      success: true,
      content,
      pathname: blogFile.pathname,
    })
  } catch (error) {
    console.error("Error fetching blog content:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch blog content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// PATCH endpoint to update full markdown content
export async function PATCH(request: NextRequest) {
  try {
    const { slug, content } = await request.json()

    if (!slug || !content) {
      return NextResponse.json({ error: "Slug and content are required" }, { status: 400 })
    }

    if (isHardcodedPost(slug)) {
      return NextResponse.json({ error: "Cannot update hardcoded sample posts" }, { status: 403 })
    }

    const blogFile = await findBlobBySlug(slug, "blog/")

    if (!blogFile) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Upload the updated content
    await put(blogFile.pathname, content, {
      access: "public",
      allowOverwrite: true,
    })

    // Revalidate cache
    try {
      const { revalidatePath } = await import("next/cache")
      revalidatePath("/blog")
      revalidatePath(`/blog/${slug}`)
    } catch (revalidateError) {
      console.error("Failed to revalidate cache:", revalidateError)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated content for post: ${slug}`,
    })
  } catch (error) {
    console.error("Error updating blog content:", error)
    return NextResponse.json(
      {
        error: "Failed to update blog content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

