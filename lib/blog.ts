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

function extractTitleAndExcerpt(content: string): { title: string | null; excerpt: string | null } {
  const emojiTitleRegex = /^([\p{Emoji}\u200d]+.*?)[\r\n]/u
  const titleMatch = content.match(emojiTitleRegex)

  const tldrRegex = /TL;DR:?\s*(.*?)[\r\n]/
  const excerptMatch = content.match(tldrRegex)

  const firstParagraphRegex = /\n\n(.*?)(?:\n\n|$)/
  const paragraphMatch = !excerptMatch ? content.match(firstParagraphRegex) : null

  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    excerpt: excerptMatch ? excerptMatch[1].trim() : paragraphMatch ? paragraphMatch[1].trim() : null,
  }
}

export async function getPostSlugs(): Promise<string[]> {
  console.log("[getPostSlugs] Fetching all blog post slugs from Vercel Blob...")

  if (!BLOB_TOKEN) {
    console.error("[getPostSlugs] BLOB_READ_WRITE_TOKEN is not set")
    return []
  }

  try {
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    const slugs = blobs
      .filter((blob) => blob.pathname.endsWith(".md"))
      .map((blob) => blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, ""))
    console.log(`[getPostSlugs] Found ${slugs.length} slugs:`, slugs)
    return slugs
  } catch (error) {
    console.error("[getPostSlugs] Error fetching blog post slugs:", error)
    return []
  }
}

export async function getAllPosts(): Promise<BlogPostFrontmatter[]> {
  console.log("[getAllPosts] Fetching all blog posts from Vercel Blob...")

  if (!BLOB_TOKEN) {
    console.error("[getAllPosts] BLOB_READ_WRITE_TOKEN is not set")
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
          const response = await fetch(blob.url)
          if (!response.ok) {
            console.error(`[getAllPosts] Failed to fetch ${blob.pathname}: ${response.status}`)
            continue
          }

          const fileContents = await response.text()
          console.log(`[getAllPosts] Fetched content length: ${fileContents.length} chars`)

          const slug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")

          console.log(`[getAllPosts] Extracted slug: ${slug}`)

          const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })

          const extracted = extractTitleAndExcerpt(content)

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

    console.log(`[getAllPosts] Successfully processed ${posts.length} posts`)
    return posts
  } catch (error) {
    console.error("[getAllPosts] Error fetching or processing blog posts:", error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[getPostBySlug] Attempting to fetch post with slug: ${slug}`)

  if (!BLOB_TOKEN) {
    console.error("[getPostBySlug] BLOB_READ_WRITE_TOKEN is not set")
    return null
  }

  try {
    const targetPath = `${BLOG_CONTENT_PATH}${slug}.md`
    console.log(`[getPostBySlug] Target blob path: ${targetPath}`)

    const { blobs } = await list({ prefix: targetPath, token: BLOB_TOKEN })
    const targetBlob = blobs.find((b) => b.pathname === targetPath)

    if (!targetBlob) {
      console.warn(`[getPostBySlug] No blob found for path: ${targetPath}`)
      console.log(
        `[getPostBySlug] Available blobs:`,
        blobs.map((b) => b.pathname),
      )
      return null
    }

    console.log(`[getPostBySlug] Found blob: ${targetBlob.pathname}, URL: ${targetBlob.url}`)

    const response = await fetch(targetBlob.url)
    if (!response.ok) {
      console.error(`[getPostBySlug] Failed to fetch content: ${response.status}`)
      return null
    }

    const fileContents = await response.text()
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
    const excerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."

    console.log(`[getPostBySlug] Final title: "${title}", excerpt: "${excerpt.substring(0, 100)}..."`)

    const serializedContent = await serialize(content, {
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
      content,
      slug,
    }
  } catch (error) {
    console.error(`[getPostBySlug] Error fetching or processing post ${slug}:`, error)
    return null
  }
}
