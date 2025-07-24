import { list } from "@vercel/blob"
import matter from "gray-matter"
import { serialize } from "next-mdx-remote/serialize"

export interface BlogPost {
  slug: string
  frontmatter: {
    title: string
    excerpt: string
    date: string
    category: string
    author?: string
    image?: string
  }
  content: string
  serializedContent: any
}

// Function to extract title from markdown content (handles emojis)
function extractTitleFromContent(content: string): string {
  // First try to find emoji title at the start
  const emojiTitleRegex = /^([\p{Emoji}\u200d]+.*?)[\r\n]/u
  const emojiMatch = content.match(emojiTitleRegex)
  if (emojiMatch) {
    return emojiMatch[1].trim()
  }

  // Try to find any heading
  const headingRegex = /^#+\s+(.+)$/m
  const headingMatch = content.match(headingRegex)
  if (headingMatch) {
    return headingMatch[1].trim()
  }

  // Fallback to first line
  const firstLine = content.split("\n")[0]
  return firstLine.trim() || "Untitled"
}

// Function to extract excerpt from content
function extractExcerptFromContent(content: string): string {
  // Look for TL;DR section
  const tldrRegex = /TL;DR:?\s*(.*?)(?:\n\n|\n(?=[A-Z])|$)/s
  const tldrMatch = content.match(tldrRegex)
  if (tldrMatch) {
    return tldrMatch[1].trim()
  }

  // Look for first paragraph after title
  const lines = content.split("\n").filter((line) => line.trim())
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line && !line.startsWith("#") && !line.startsWith("---") && line.length > 50) {
      return line.substring(0, 200) + (line.length > 200 ? "..." : "")
    }
  }

  return "No excerpt available."
}

export async function getPostSlugs(): Promise<string[]> {
  console.log("[getPostSlugs] Starting to fetch post slugs...")

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error("[getPostSlugs] BLOB_READ_WRITE_TOKEN not found")
    return []
  }

  try {
    const { blobs } = await list({ token })
    console.log(`[getPostSlugs] Found ${blobs.length} total blobs`)

    const blogBlobs = blobs.filter((blob) => blob.pathname.startsWith("blog/") && blob.pathname.endsWith(".md"))
    console.log(`[getPostSlugs] Found ${blogBlobs.length} blog markdown files`)

    const slugs = blogBlobs.map((blob) => {
      const slug = blob.pathname.replace("blog/", "").replace(/\.md$/, "")
      console.log(`[getPostSlugs] Extracted slug: "${slug}" from ${blob.pathname}`)
      return slug
    })

    return slugs
  } catch (error) {
    console.error("[getPostSlugs] Error fetching slugs:", error)
    return []
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  console.log("[getAllPosts] Starting to fetch all posts...")

  const slugs = await getPostSlugs()
  console.log(`[getAllPosts] Got ${slugs.length} slugs`)

  const posts: BlogPost[] = []

  for (const slug of slugs) {
    try {
      const post = await getPostBySlug(slug)
      if (post) {
        posts.push(post)
        console.log(`[getAllPosts] Successfully loaded post: ${post.frontmatter.title}`)
      }
    } catch (error) {
      console.error(`[getAllPosts] Error loading post ${slug}:`, error)
    }
  }

  console.log(`[getAllPosts] Returning ${posts.length} posts`)
  return posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[getPostBySlug] Fetching post for slug: "${slug}"`)

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error("[getPostBySlug] BLOB_READ_WRITE_TOKEN not found")
    return null
  }

  try {
    const { blobs } = await list({ token })
    const blobPath = `blog/${slug}.md`
    console.log(`[getPostBySlug] Looking for blob at path: ${blobPath}`)

    const blob = blobs.find((b) => b.pathname === blobPath)
    if (!blob) {
      console.log(`[getPostBySlug] Blob not found. Available blog blobs:`)
      blobs
        .filter((b) => b.pathname.startsWith("blog/"))
        .forEach((b) => {
          console.log(`  - ${b.pathname}`)
        })
      return null
    }

    console.log(`[getPostBySlug] Found blob: ${blob.pathname} (${blob.size} bytes)`)
    console.log(`[getPostBySlug] Blob URL: ${blob.url}`)

    const response = await fetch(blob.url)
    if (!response.ok) {
      console.error(`[getPostBySlug] Failed to fetch blob content: ${response.status} ${response.statusText}`)
      return null
    }

    const content = await response.text()
    console.log(`[getPostBySlug] Fetched content: ${content.length} characters`)
    console.log(`[getPostBySlug] Content preview: ${content.substring(0, 200)}...`)

    let frontmatter: any = {}
    let markdownContent = content

    // Parse frontmatter if it exists
    if (content.startsWith("---")) {
      console.log("[getPostBySlug] Parsing frontmatter...")
      const { data, content: bodyContent } = matter(content)
      frontmatter = data
      markdownContent = bodyContent
      console.log("[getPostBySlug] Frontmatter parsed:", frontmatter)
    } else {
      console.log("[getPostBySlug] No frontmatter found, extracting from content")
    }

    // Extract title and excerpt from content if not in frontmatter
    const title = frontmatter.title || extractTitleFromContent(content)
    const excerpt = frontmatter.excerpt || extractExcerptFromContent(markdownContent)
    const date = frontmatter.date || new Date().toISOString().split("T")[0]
    const category = frontmatter.category || "Uncategorized"

    console.log(`[getPostBySlug] Extracted title: "${title}"`)
    console.log(`[getPostBySlug] Extracted excerpt: "${excerpt.substring(0, 100)}..."`)

    // Serialize the content for MDX
    const serializedContent = await serialize(markdownContent)

    const post: BlogPost = {
      slug,
      frontmatter: {
        title,
        excerpt,
        date,
        category,
        author: frontmatter.author,
        image: frontmatter.image,
      },
      content: markdownContent,
      serializedContent,
    }

    console.log(`[getPostBySlug] Successfully created post object for: ${title}`)
    return post
  } catch (error) {
    console.error(`[getPostBySlug] Error fetching post ${slug}:`, error)
    return null
  }
}
