import { type NextRequest, NextResponse } from "next/server"
import matter from "gray-matter"

function cleanSlugFromFilename(filename: string): string {
  return filename
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/g, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}

function extractTitleFromContent(content: string, filename: string): string {
  const { data: frontmatter, content: markdownContent } = matter(content)
  if (frontmatter.title) {
    return frontmatter.title
  }

  const headingMatch = markdownContent.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return headingMatch[1].trim()
  }

  const cleanName = filename
    .replace(/\.md$/, "")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim()

  return cleanName || "Untitled"
}

async function fetchBlobContent(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    console.error("Error fetching blob content:", error)
    return ""
  }
}

export async function GET(req: NextRequest) {
  // Basic authentication: Check for a debug token
  const debugToken = req.headers.get("X-Debug-Token") || req.nextUrl.searchParams.get("debug_token")
  if (process.env.DEBUG_TOKEN && debugToken !== process.env.DEBUG_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { list } = await import("@vercel/blob")
    const blobs = await list({ prefix: "blog/" })

    const posts = []

    for (const blob of blobs.blobs) {
      try {
        if (blob.pathname.endsWith(".md")) {
          const content = await fetchBlobContent(blob.downloadUrl)
          if (content) {
            const { data: frontmatter } = matter(content)
            const rawSlug = blob.pathname.replace("blog/", "").replace(/\.md$/, "")
            const cleanSlug = cleanSlugFromFilename(rawSlug)
            const extractedTitle = extractTitleFromContent(content, rawSlug)

            posts.push({
              slug: cleanSlug,
              title: extractedTitle,
              category: frontmatter.category || "General",
              url: `https://www.juice.fitness/blog/${cleanSlug}`,
            })
          }
        }
      } catch (error) {
        console.error(`Error processing blob ${blob.pathname}:`, error)
      }
    }

    return NextResponse.json({
      posts: posts.sort((a, b) => a.title.localeCompare(b.title)),
      total: posts.length,
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ message: "Failed to fetch blog posts", error: error.message }, { status: 500 })
  }
}
