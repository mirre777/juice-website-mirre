import { list } from "@vercel/blob"
import matter from "gray-matter"
import { serialize } from "next-mdx-remote/serialize"

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

export interface BlogPostFrontmatter {
  title: string
  date: string
  excerpt: string
  category: string
  image?: string
  slug: string
}

export interface BlogPost {
  frontmatter: BlogPostFrontmatter
  serializedContent: any
  content: string
  slug: string
}

const BLOG_CONTENT_PATH = "blog/"

// Helper function to normalize slugs from filenames
function normalizeSlug(pathname: string): string {
  // Remove the blog/ prefix and .md extension
  let slug = pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")

  // Handle special characters in filenames
  slug = slug
    .replace(/\s+$$\d+$$/g, "") // Remove " (1)" type suffixes
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]/g, "") // Remove any non-alphanumeric characters except hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .toLowerCase() // Convert to lowercase

  return slug
}

// Helper function to get pathname from slug
function getPathnameFromSlug(slug: string, blobs: any[]): string | null {
  // First try exact match (without normalization)
  const exactMatch = blobs.find((blob) => blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "") === slug)

  if (exactMatch) {
    return exactMatch.pathname
  }

  // If no exact match, try normalized comparison
  for (const blob of blobs) {
    const normalizedBlobSlug = normalizeSlug(blob.pathname)
    if (normalizedBlobSlug === slug) {
      return blob.pathname
    }
  }

  return null
}

function extractTitleAndExcerpt(content: string): { title: string | null; excerpt: string | null } {
  // Try to find a markdown heading at the start
  const headingRegex = /^#\s+(.+?)(?:\r?\n|$)/
  const headingMatch = content.match(headingRegex)

  // Try to find emoji title patterns
  const emojiTitleRegex = /^([\p{Emoji}\u200d]+.*?)[\r\n]/u
  const emojiMatch = content.match(emojiTitleRegex)

  // Look for TL;DR section for excerpt
  const tldrRegex = /TL;DR:?\s*(.*?)[\r\n]/
  const excerptMatch = content.match(tldrRegex)

  // Fallback to first paragraph for excerpt
  const firstParagraphRegex = /\n\n(.*?)(?:\n\n|$)/
  const paragraphMatch = !excerptMatch ? content.match(firstParagraphRegex) : null

  return {
    title: headingMatch ? headingMatch[1].trim() : emojiMatch ? emojiMatch[1].trim() : null,
    excerpt: excerptMatch ? excerptMatch[1].trim() : paragraphMatch ? paragraphMatch[1].trim() : null,
  }
}

function removeDuplicateTitle(content: string, title: string): string {
  if (!title || !content) return content

  console.log(`[removeDuplicateTitle] Checking for duplicate title: "${title}"`)

  // Clean the title for comparison (remove emojis and extra whitespace)
  const cleanTitle = title.replace(/[\p{Emoji}\u200d\s]+/gu, "").toLowerCase()

  // Try different heading formats
  const headingPatterns = [
    new RegExp(`^#\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[\r\n]+`, "i"),
    new RegExp(`^##\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[\r\n]+`, "i"),
    new RegExp(`^###\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[\r\n]+`, "i"),
  ]

  // Try to match and remove the duplicate title
  for (const pattern of headingPatterns) {
    if (pattern.test(content)) {
      console.log(`[removeDuplicateTitle] Found duplicate title with exact match, removing...`)
      return content.replace(pattern, "").trim()
    }
  }

  // If no exact match, try a more flexible approach for emoji titles
  const lines = content.split("\n")
  if (lines.length > 0) {
    const firstLine = lines[0].trim()
    if (firstLine.startsWith("#")) {
      const firstLineClean = firstLine
        .replace(/^#+\s*/, "")
        .replace(/[\p{Emoji}\u200d\s]+/gu, "")
        .toLowerCase()
      if (firstLineClean === cleanTitle) {
        console.log(`[removeDuplicateTitle] Found duplicate title via flexible matching, removing...`)
        return lines.slice(1).join("\n").trim()
      }
    }
  }

  console.log(`[removeDuplicateTitle] No duplicate title found`)
  return content
}

async function fetchBlobContent(url: string): Promise<string> {
  console.log(`[fetchBlobContent] Attempting to fetch: ${url}`)

  // Try multiple methods to fetch the content
  const methods = [
    // Method 1: Direct fetch with Bearer token
    () =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${BLOB_TOKEN}`,
        },
      }),

    // Method 2: Direct fetch with token format
    () =>
      fetch(url, {
        headers: {
          Authorization: `token ${BLOB_TOKEN}`,
        },
      }),

    // Method 3: Direct fetch (for public blobs)
    () => fetch(url),
  ]

  for (let i = 0; i < methods.length; i++) {
    try {
      console.log(`[fetchBlobContent] Trying method ${i + 1}...`)
      const response = await methods[i]()

      console.log(`[fetchBlobContent] Method ${i + 1} status: ${response.status}`)

      if (response.ok) {
        const content = await response.text()
        console.log(`[fetchBlobContent] ✅ Success with method ${i + 1}, content length: ${content.length}`)
        return content
      }
    } catch (error) {
      console.log(`[fetchBlobContent] Method ${i + 1} failed: ${error.message}`)
    }
  }

  throw new Error(`Failed to fetch blob content from ${url} with all methods`)
}

export async function getPostSlugs(): Promise<string[]> {
  console.log("[getPostSlugs] Fetching all blog post slugs...")

  if (!BLOB_TOKEN) {
    console.error("[getPostSlugs] No BLOB_TOKEN, cannot fetch posts")
    return []
  }

  try {
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    console.log(`[getPostSlugs] Found ${blobs.length} blobs with prefix ${BLOG_CONTENT_PATH}`)

    const slugs = blobs
      .filter((blob) => blob.pathname.endsWith(".md"))
      .map((blob) => {
        const slug = normalizeSlug(blob.pathname)
        console.log(`[getPostSlugs] Normalized slug: "${slug}" from "${blob.pathname}"`)
        return slug
      })

    console.log(`[getPostSlugs] Found ${slugs.length} slugs from blob storage:`, slugs)
    return slugs
  } catch (error) {
    console.error("[getPostSlugs] Error fetching from blob storage:", error)
    return []
  }
}

export async function getAllPosts(): Promise<BlogPostFrontmatter[]> {
  console.log("[getAllPosts] Fetching all blog posts...")

  if (!BLOB_TOKEN) {
    console.error("[getAllPosts] No BLOB_TOKEN, cannot fetch posts")
    return []
  }

  try {
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    console.log(`[getAllPosts] Found ${blobs.length} blobs with prefix ${BLOG_CONTENT_PATH}`)

    const posts: BlogPostFrontmatter[] = []

    for (const blob of blobs) {
      if (blob.pathname.endsWith(".md")) {
        console.log(`[getAllPosts] Processing blob: ${blob.pathname}`)

        try {
          const fileContents = await fetchBlobContent(blob.url)
          console.log(`[getAllPosts] Fetched content length: ${fileContents.length} chars`)

          const slug = normalizeSlug(blob.pathname)
          console.log(`[getAllPosts] Normalized slug: ${slug}`)

          const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
          console.log(`[getAllPosts] Parsed frontmatter:`, data)

          const extracted = extractTitleAndExcerpt(content)
          console.log(
            `[getAllPosts] Extracted title: "${extracted.title}", excerpt: "${extracted.excerpt?.substring(0, 100)}..."`,
          )

          const title = data.title || extracted.title || `Post: ${slug}`
          const excerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."

          console.log(`[getAllPosts] Processed post - Title: ${title}, Excerpt length: ${excerpt.length}`)

          posts.push({
            title: title,
            date: data.date || new Date().toISOString().split("T")[0],
            category: data.category || "Uncategorized",
            excerpt: excerpt,
            image: data.image || undefined,
            slug: slug,
          })
        } catch (error) {
          console.error(`[getAllPosts] Error processing blob ${blob.pathname}:`, error)
          continue
        }
      }
    }

    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    console.log(`[getAllPosts] Successfully processed ${posts.length} posts from blob storage`)
    return posts
  } catch (error) {
    console.error("[getAllPosts] Error fetching from blob storage:", error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[getPostBySlug] Attempting to fetch post with slug: ${slug}`)

  if (!BLOB_TOKEN) {
    console.error("[getPostBySlug] No BLOB_TOKEN, cannot fetch post")
    return null
  }

  try {
    // First, get all blobs to find the matching one
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    console.log(`[getPostBySlug] Found ${blobs.length} blobs with prefix ${BLOG_CONTENT_PATH}`)

    // Find the blob that matches this slug
    const targetPathname = getPathnameFromSlug(slug, blobs)

    if (!targetPathname) {
      console.warn(`[getPostBySlug] No blob found for slug: ${slug}`)
      console.log(
        `[getPostBySlug] Available blobs:`,
        blobs.map((b) => `${b.pathname} -> ${normalizeSlug(b.pathname)}`),
      )
      return null
    }

    const targetBlob = blobs.find((b) => b.pathname === targetPathname)

    if (!targetBlob) {
      console.warn(`[getPostBySlug] No blob found for pathname: ${targetPathname}`)
      return null
    }

    console.log(`[getPostBySlug] Found blob: ${targetBlob.pathname}, URL: ${targetBlob.url}`)

    const fileContents = await fetchBlobContent(targetBlob.url)
    console.log(`[getPostBySlug] Fetched file contents length: ${fileContents.length} chars`)
    console.log(`[getPostBySlug] Content preview: ${fileContents.substring(0, 200)}...`)

    const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
    console.log(`[getPostBySlug] Frontmatter:`, data)
    console.log(`[getPostBySlug] Content length after frontmatter: ${content.length} chars`)

    const extracted = extractTitleAndExcerpt(content)
    console.log(
      `[getPostBySlug] Extracted title: "${extracted.title}", excerpt: "${extracted.excerpt?.substring(0, 100)}..."`,
    )

    const title = data.title || extracted.title || `Post: ${slug}`

    // Apply the deduplication to blob content
    const contentDeduplicated = removeDuplicateTitle(content, title)
    console.log(`[getPostBySlug] Content after title deduplication: ${contentDeduplicated.length} chars`)

    const excerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."

    console.log(`[getPostBySlug] Final title: "${title}", excerpt: "${excerpt.substring(0, 100)}..."`)

    const serializedContent = await serialize(contentDeduplicated, {
      parseFrontmatter: false,
    })
    console.log("[getPostBySlug] MDX serialized successfully")

    return {
      frontmatter: {
        title: title,
        date: data.date || new Date().toISOString().split("T")[0],
        category: data.category || "Uncategorized",
        excerpt: excerpt,
        image: data.image || undefined,
        slug: slug,
      },
      serializedContent,
      content: contentDeduplicated,
      slug,
    }
  } catch (error) {
    console.error(`[getPostBySlug] Error fetching or processing post ${slug}:`, error)
    return null
  }
}
