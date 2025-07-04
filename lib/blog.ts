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
  slug: string // Ensure slug is part of the type
}

export interface BlogPost {
  frontmatter: BlogPostFrontmatter
  serializedContent: any // MDXRemoteSerializeResult
}

const BLOG_CONTENT_PATH = "blog/" // Corrected prefix for Vercel Blob

export async function getPostSlugs(): Promise<string[]> {
  console.log("[getPostSlugs] Fetching all blog post slugs from Vercel Blob...")
  try {
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    const slugs = blobs
      .filter((blob) => blob.pathname.endsWith(".md"))
      .map((blob) => blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, ""))
    console.log(`[getPostSlugs] Found ${slugs.length} slugs:`, slugs) // Log the slugs
    return slugs
  } catch (error) {
    console.error("[getPostSlugs] Error fetching blog post slugs:", error)
    return []
  }
}

export async function getAllPosts(): Promise<BlogPostFrontmatter[]> {
  console.log("[getAllPosts] Fetching all blog posts from Vercel Blob...")
  try {
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    console.log(`[getAllPosts] Found ${blobs.length} blobs.`)

    const posts: BlogPostFrontmatter[] = []

    for (const blob of blobs) {
      if (blob.pathname.endsWith(".md")) {
        const fileContents = await fetch(blob.url).then((res) => res.text())
        const { data, excerpt } = matter(fileContents, { excerpt: true })

        // Extract slug from the pathname
        const slug = blob.pathname
          .replace(BLOG_CONTENT_PATH, "") // Remove the content path prefix
          .replace(/\.md$/, "") // Remove the .md extension

        console.log(`[getAllPosts] Processing blob: ${blob.pathname}, Extracted slug: ${slug}`)

        posts.push({
          title: data.title || "Untitled",
          date: data.date || "No Date",
          category: data.category || "Uncategorized",
          excerpt: excerpt || "No excerpt available.",
          image: data.image || undefined,
          slug: slug, // Assign the extracted slug
        })
      }
    }

    // Sort posts by date, newest first
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    console.log(
      `[getAllPosts] Successfully processed ${posts.length} posts. Slugs:`,
      posts.map((p) => p.slug),
    ) // Log all processed slugs
    return posts
  } catch (error) {
    console.error("[getAllPosts] Error fetching or processing blog posts:", error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[getPostBySlug] Attempting to fetch post with slug: ${slug}`)
  try {
    const targetPath = `${BLOG_CONTENT_PATH}${slug}.md`
    console.log(`[getPostBySlug] Target blob path: ${targetPath}`)

    // List blobs to find the exact one, as 'get' requires a URL or ID
    const { blobs } = await list({ prefix: targetPath, token: BLOB_TOKEN })
    const targetBlob = blobs.find((b) => b.pathname === targetPath)

    if (!targetBlob) {
      console.warn(`[getPostBySlug] No blob found for path: ${targetPath}`)
      return null
    }

    console.log(`[getPostBySlug] Found blob: ${targetBlob.pathname}, URL: ${targetBlob.url}`)
    const fileContents = await fetch(targetBlob.url).then((res) => res.text())
    console.log(`[getPostBySlug] Fetched file contents (first 200 chars): ${fileContents.substring(0, 200)}...`)

    const { data, content, excerpt } = matter(fileContents, { excerpt: true })
    console.log(`[getPostBySlug] Gray-matter parsed. Frontmatter data:`, data)
    console.log(`[getPostBySlug] Content before serialization (first 200 chars): ${content.substring(0, 200)}...`)

    const serializedContent = await serialize(content, {
      parseFrontmatter: false, // Frontmatter already parsed by gray-matter
    })
    console.log("[getPostBySlug] MDX serialized successfully. Result:", serializedContent)

    return {
      frontmatter: {
        title: data.title || "Untitled",
        date: data.date || "No Date",
        category: data.category || "Uncategorized",
        excerpt: excerpt || "No excerpt available.",
        image: data.image || undefined,
        slug: slug, // Ensure slug is passed here
      },
      serializedContent,
    }
  } catch (error) {
    console.error(`[getPostBySlug] Error fetching or processing post ${slug}:`, error)
    return null
  }
}
