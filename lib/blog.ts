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

function removeDuplicateTitle(content: string, title: string): string {
  if (!title || !content) return content

  console.log(`[removeDuplicateTitle] Checking for duplicate title: "${title}"`)

  const cleanTitle = title.replace(/[\p{Emoji}\u200d\s]+/gu, "").toLowerCase()

  const headingPatterns = [
    new RegExp(`^#\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[\r\n]+`, "i"),
    new RegExp(`^##\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[\r\n]+`, "i"),
    new RegExp(`^###\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[\r\n]+`, "i"),
  ]

  for (const pattern of headingPatterns) {
    if (pattern.test(content)) {
      console.log(`[removeDuplicateTitle] Found duplicate title with exact match, removing...`)
      return content.replace(pattern, "").trim()
    }
  }

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
  console.log(`[fetchBlobContent] 🔍 Attempting to fetch: ${url}`)
  console.log(`[fetchBlobContent] 🔑 BLOB_TOKEN available: ${!!BLOB_TOKEN}`)
  console.log(`[fetchBlobContent] 🔑 BLOB_TOKEN length: ${BLOB_TOKEN?.length || 0}`)

  const methods = [
    () => {
      console.log(`[fetchBlobContent] 📡 Method 1: Direct fetch (no auth)`)
      return fetch(url)
    },
    () => {
      console.log(`[fetchBlobContent] 📡 Method 2: Bearer token auth`)
      return fetch(url, {
        headers: {
          Authorization: `Bearer ${BLOB_TOKEN}`,
        },
      })
    },
    () => {
      console.log(`[fetchBlobContent] 📡 Method 3: Token auth`)
      return fetch(url, {
        headers: {
          Authorization: `token ${BLOB_TOKEN}`,
        },
      })
    },
  ]

  for (let i = 0; i < methods.length; i++) {
    try {
      console.log(`[fetchBlobContent] 🚀 Trying method ${i + 1}...`)
      const response = await methods[i]()

      console.log(`[fetchBlobContent] 📊 Method ${i + 1} response:`)
      console.log(`  - Status: ${response.status}`)
      console.log(`  - Status Text: ${response.statusText}`)
      console.log(`  - Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`)

      if (response.ok) {
        const content = await response.text()
        console.log(`[fetchBlobContent] ✅ SUCCESS with method ${i + 1}`)
        console.log(`[fetchBlobContent] 📝 Content length: ${content.length} characters`)
        console.log(`[fetchBlobContent] 📝 Content preview (first 300 chars): ${content.substring(0, 300)}`)
        return content
      } else {
        console.log(`[fetchBlobContent] ❌ Method ${i + 1} failed with status ${response.status}`)
        const errorText = await response.text()
        console.log(`[fetchBlobContent] 📄 Error response body: ${errorText}`)
      }
    } catch (error) {
      console.log(`[fetchBlobContent] 💥 Method ${i + 1} threw error:`, error)
    }
  }

  throw new Error(`Failed to fetch blob content from ${url} with all methods`)
}

export async function getPostSlugs(): Promise<string[]> {
  console.log("[getPostSlugs] 🔍 Starting to fetch all blog post slugs...")
  console.log(`[getPostSlugs] 🔑 BLOB_TOKEN check: ${!!BLOB_TOKEN ? "AVAILABLE" : "MISSING"}`)
  console.log(`[getPostSlugs] 📁 Looking for files with prefix: ${BLOG_CONTENT_PATH}`)

  if (!BLOB_TOKEN) {
    console.error("[getPostSlugs] ❌ BLOB_READ_WRITE_TOKEN is not set")
    return []
  }

  try {
    console.log("[getPostSlugs] 📡 Calling list() function...")
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    console.log(`[getPostSlugs] 📊 Raw blob response: ${blobs.length} total blobs found`)

    blobs.forEach((blob, index) => {
      console.log(`[getPostSlugs] 📄 Blob ${index + 1}: ${blob.pathname} (${blob.size} bytes)`)
    })

    const markdownBlobs = blobs.filter((blob) => blob.pathname.endsWith(".md"))
    console.log(`[getPostSlugs] 📝 Markdown files found: ${markdownBlobs.length}`)

    const slugs = markdownBlobs.map((blob) => {
      const slug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")
      console.log(`[getPostSlugs] 🏷️ Extracted slug: "${slug}" from "${blob.pathname}"`)
      return slug
    })

    console.log(`[getPostSlugs] ✅ Final slugs array: [${slugs.join(", ")}]`)
    return slugs
  } catch (error) {
    console.error("[getPostSlugs] 💥 Error fetching from blob storage:", error)
    console.error("[getPostSlugs] 📊 Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    return []
  }
}

export async function getAllPosts(): Promise<BlogPostFrontmatter[]> {
  console.log("[getAllPosts] 🔍 Starting to fetch all blog posts...")
  console.log(`[getAllPosts] 🔑 BLOB_TOKEN check: ${!!BLOB_TOKEN ? "AVAILABLE" : "MISSING"}`)

  if (!BLOB_TOKEN) {
    console.error("[getAllPosts] ❌ BLOB_READ_WRITE_TOKEN is not set")
    return []
  }

  try {
    console.log("[getAllPosts] 📡 Calling list() function...")
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    console.log(`[getAllPosts] 📊 Found ${blobs.length} blobs with prefix ${BLOG_CONTENT_PATH}`)

    const posts: BlogPostFrontmatter[] = []

    for (const blob of blobs) {
      if (blob.pathname.endsWith(".md")) {
        console.log(`[getAllPosts] 📝 Processing markdown blob: ${blob.pathname}`)
        console.log(`[getAllPosts] 📊 Blob details: size=${blob.size}, url=${blob.url}`)

        try {
          console.log(`[getAllPosts] 🚀 Fetching content for: ${blob.pathname}`)
          const fileContents = await fetchBlobContent(blob.url)
          console.log(`[getAllPosts] ✅ Successfully fetched content: ${fileContents.length} chars`)

          const slug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")
          console.log(`[getAllPosts] 🏷️ Extracted slug: ${slug}`)

          console.log(`[getAllPosts] 📄 Parsing frontmatter and content...`)
          const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
          console.log(`[getAllPosts] 📊 Frontmatter data:`, data)
          console.log(`[getAllPosts] 📝 Content length: ${content.length} chars`)
          console.log(`[getAllPosts] 📝 Matter excerpt: ${matterExcerpt?.substring(0, 100) || "none"}`)

          const extracted = extractTitleAndExcerpt(content)
          console.log(`[getAllPosts] 🔍 Extracted title: "${extracted.title}"`)
          console.log(`[getAllPosts] 🔍 Extracted excerpt: "${extracted.excerpt?.substring(0, 100) || "none"}"`)

          const title = data.title || extracted.title || `Post: ${slug}`
          const excerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."

          console.log(`[getAllPosts] ✅ Final processed post:`)
          console.log(`  - Title: ${title}`)
          console.log(`  - Date: ${data.date || "auto-generated"}`)
          console.log(`  - Category: ${data.category || "Uncategorized"}`)
          console.log(`  - Excerpt: ${excerpt.substring(0, 100)}...`)

          posts.push({
            title: title,
            date: data.date || new Date().toISOString().split("T")[0],
            category: data.category || "Uncategorized",
            excerpt: excerpt,
            image: data.image || undefined,
            slug: slug,
          })
        } catch (error) {
          console.error(`[getAllPosts] 💥 Error processing blob ${blob.pathname}:`, error)
          continue
        }
      } else {
        console.log(`[getAllPosts] ⏭️ Skipping non-markdown file: ${blob.pathname}`)
      }
    }

    console.log(`[getAllPosts] 📊 Sorting ${posts.length} posts by date...`)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    console.log(`[getAllPosts] ✅ Successfully processed ${posts.length} posts from blob storage`)
    posts.forEach((post, index) => {
      console.log(`[getAllPosts] 📄 Post ${index + 1}: "${post.title}" (${post.slug})`)
    })

    return posts
  } catch (error) {
    console.error("[getAllPosts] 💥 Error fetching from blob storage:", error)
    console.error("[getAllPosts] 📊 Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[getPostBySlug] 🔍 Starting to fetch post with slug: "${slug}"`)
  console.log(`[getPostBySlug] 🔑 BLOB_TOKEN check: ${!!BLOB_TOKEN ? "AVAILABLE" : "MISSING"}`)

  if (!BLOB_TOKEN) {
    console.error("[getPostBySlug] ❌ BLOB_READ_WRITE_TOKEN is not set")
    return null
  }

  try {
    const targetPath = `${BLOG_CONTENT_PATH}${slug}.md`
    console.log(`[getPostBySlug] 🎯 Target blob path: ${targetPath}`)

    console.log(`[getPostBySlug] 📡 Calling list() to find target blob...`)
    const { blobs } = await list({ prefix: targetPath, token: BLOB_TOKEN })
    console.log(`[getPostBySlug] 📊 List response: ${blobs.length} blobs found`)

    blobs.forEach((blob, index) => {
      console.log(`[getPostBySlug] 📄 Blob ${index + 1}: ${blob.pathname}`)
    })

    const targetBlob = blobs.find((b) => b.pathname === targetPath)

    if (!targetBlob) {
      console.warn(`[getPostBySlug] ❌ No blob found for exact path: ${targetPath}`)
      console.log(
        `[getPostBySlug] 📊 Available blobs:`,
        blobs.map((b) => b.pathname),
      )
      return null
    }

    console.log(`[getPostBySlug] ✅ Found target blob:`)
    console.log(`  - Path: ${targetBlob.pathname}`)
    console.log(`  - URL: ${targetBlob.url}`)
    console.log(`  - Size: ${targetBlob.size} bytes`)

    console.log(`[getPostBySlug] 🚀 Fetching blob content...`)
    const fileContents = await fetchBlobContent(targetBlob.url)
    console.log(`[getPostBySlug] ✅ Successfully fetched file contents: ${fileContents.length} chars`)
    console.log(`[getPostBySlug] 📝 Content preview (first 500 chars): ${fileContents.substring(0, 500)}`)

    console.log(`[getPostBySlug] 📄 Parsing frontmatter and content...`)
    const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
    console.log(`[getPostBySlug] 📊 Parsed frontmatter:`, data)
    console.log(`[getPostBySlug] 📝 Content length after frontmatter removal: ${content.length} chars`)

    const extracted = extractTitleAndExcerpt(content)
    console.log(`[getPostBySlug] 🔍 Extracted from content:`)
    console.log(`  - Title: "${extracted.title}"`)
    console.log(`  - Excerpt: "${extracted.excerpt?.substring(0, 100)}..."`)

    const title = data.title || extracted.title || `Post: ${slug}`
    console.log(`[getPostBySlug] 🏷️ Final title: "${title}"`)

    console.log(`[getPostBySlug] 🔧 Removing duplicate title from content...`)
    const contentDeduplicated = removeDuplicateTitle(content, title)
    console.log(`[getPostBySlug] ✅ Content after deduplication: ${contentDeduplicated.length} chars`)

    const excerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."
    console.log(`[getPostBySlug] 📝 Final excerpt: "${excerpt.substring(0, 100)}..."`)

    console.log(`[getPostBySlug] ⚙️ Serializing MDX content...`)
    const serializedContent = await serialize(contentDeduplicated, {
      parseFrontmatter: false,
    })
    console.log("[getPostBySlug] ✅ MDX serialized successfully")

    const finalPost = {
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

    console.log(`[getPostBySlug] ✅ Final post object created:`)
    console.log(`  - Title: ${finalPost.frontmatter.title}`)
    console.log(`  - Date: ${finalPost.frontmatter.date}`)
    console.log(`  - Category: ${finalPost.frontmatter.category}`)
    console.log(`  - Slug: ${finalPost.slug}`)

    return finalPost
  } catch (error) {
    console.error(`[getPostBySlug] 💥 Error fetching or processing post ${slug}:`, error)
    console.error(`[getPostBySlug] 📊 Error details:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
    return null
  }
}
