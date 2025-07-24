import { list } from "@vercel/blob"

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  readTime: string
  content?: string
}

// Enhanced content extraction with better logging
function extractContentFromMarkdown(content: string, slug: string): Partial<BlogPost> {
  console.log(`🔍 Extracting content for slug: ${slug}`)
  console.log(`📏 Content length: ${content.length}`)

  if (!content || content.trim().length === 0) {
    console.log("⚠️ Empty content provided")
    return {
      title: `Post ${slug}`,
      excerpt: "Coming Soon",
      category: "Uncategorized",
    }
  }

  // Show content preview for debugging
  const preview = content.substring(0, 200).replace(/\n/g, " ")
  console.log(`👀 Content preview: "${preview}..."`)

  let title = "Untitled"
  let excerpt = "Coming Soon"
  let category = "Uncategorized"

  try {
    // Extract frontmatter if present
    if (content.startsWith("---")) {
      const frontmatterEnd = content.indexOf("---", 3)
      if (frontmatterEnd !== -1) {
        const frontmatter = content.slice(3, frontmatterEnd)
        const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/)
        const excerptMatch = frontmatter.match(/excerpt:\s*["']?([^"'\n]+)["']?/)
        const categoryMatch = frontmatter.match(/category:\s*["']?([^"'\n]+)["']?/)

        if (titleMatch) {
          title = titleMatch[1].trim()
          console.log(`📰 Extracted title from frontmatter: "${title}"`)
        }
        if (excerptMatch) {
          excerpt = excerptMatch[1].trim()
          console.log(`📝 Extracted excerpt from frontmatter: "${excerpt.substring(0, 50)}..."`)
        }
        if (categoryMatch) {
          category = categoryMatch[1].trim()
          console.log(`🏷️ Extracted category from frontmatter: "${category}"`)
        }
      }
    }

    // If no frontmatter title, look for markdown headers with emojis
    if (title === "Untitled") {
      const lines = content.split("\n")

      // Look for emoji titles first
      const emojiTitleLine = lines.find((line) => {
        const trimmed = line.trim()
        return (
          (trimmed.startsWith("# ") || trimmed.startsWith("## ")) &&
          /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
            trimmed,
          )
        )
      })

      if (emojiTitleLine) {
        title = emojiTitleLine.replace(/^#+\s*/, "").trim()
        console.log(`🏋️‍♀️ Extracted emoji title: "${title}"`)
      } else {
        // Fallback to first header
        const headerLine = lines.find((line) => line.trim().startsWith("# "))
        if (headerLine) {
          title = headerLine.replace(/^#+\s*/, "").trim()
          console.log(`📰 Extracted header title: "${title}"`)
        }
      }
    }

    // Extract TL;DR as excerpt if no frontmatter excerpt
    if (excerpt === "Coming Soon") {
      const tldrMatch = content.match(/(?:TL;DR|TLDR)[:\s]*([^#\n]+(?:\n(?!#)[^\n]+)*)/i)
      if (tldrMatch) {
        excerpt = tldrMatch[1].trim().replace(/\n+/g, " ").substring(0, 200)
        console.log(`📋 Extracted TL;DR excerpt: "${excerpt.substring(0, 50)}..."`)
      } else {
        // Fallback to first paragraph
        const paragraphs = content
          .split("\n\n")
          .filter((p) => p.trim().length > 0 && !p.trim().startsWith("#") && !p.trim().startsWith("---"))
        if (paragraphs.length > 0) {
          excerpt = paragraphs[0].trim().substring(0, 200)
          console.log(`📄 Extracted first paragraph excerpt: "${excerpt.substring(0, 50)}..."`)
        }
      }
    }

    // Determine category from content or slug
    if (category === "Uncategorized") {
      if (content.toLowerCase().includes("fitness") || content.toLowerCase().includes("workout")) {
        category = "Fitness"
      } else if (content.toLowerCase().includes("technology") || content.toLowerCase().includes("software")) {
        category = "Technology"
      } else if (content.toLowerCase().includes("coaching") || content.toLowerCase().includes("trainer")) {
        category = "Coaching"
      }
      console.log(`🏷️ Determined category: "${category}"`)
    }
  } catch (error) {
    console.error(`❌ Error extracting content for ${slug}:`, error)
  }

  const result = { title, excerpt, category }
  console.log(`✅ Final extracted content:`, result)
  return result
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  console.log("📚 Fetching blog posts from Vercel Blob...")

  try {
    // Check if token exists
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("❌ BLOB_READ_WRITE_TOKEN not found")
      return []
    }

    console.log("🔑 Token found, listing blobs...")
    const { blobs } = await list({ prefix: "blog/" })

    console.log(`📁 Found ${blobs.length} blobs with 'blog/' prefix`)

    // Filter for markdown files
    const markdownBlobs = blobs.filter((blob) => blob.pathname.endsWith(".md"))
    console.log(`📝 Found ${markdownBlobs.length} markdown files`)

    if (markdownBlobs.length === 0) {
      console.log("⚠️ No markdown files found in blog/ directory")
      return []
    }

    const posts: BlogPost[] = []

    for (const blob of markdownBlobs) {
      console.log(`\n📄 Processing: ${blob.pathname}`)

      try {
        const response = await fetch(blob.url)
        if (!response.ok) {
          console.error(`❌ Failed to fetch ${blob.pathname}: ${response.status}`)
          continue
        }

        const content = await response.text()
        console.log(`📏 Content fetched: ${content.length} characters`)

        // Extract slug from pathname
        const slug = blob.pathname.replace("blog/", "").replace(".md", "")
        console.log(`🔗 Extracted slug: "${slug}"`)

        // Extract content
        const extracted = extractContentFromMarkdown(content, slug)

        // Create post object
        const post: BlogPost = {
          slug,
          title: extracted.title || `Post ${slug}`,
          excerpt: extracted.excerpt || "Coming Soon",
          date: new Date().toISOString().split("T")[0],
          category: extracted.category || "Uncategorized",
          image: "/fitness-coaching-session.png", // Default image
          readTime: "3 min read",
          content,
        }

        console.log(`✅ Created post: "${post.title}"`)
        posts.push(post)
      } catch (error) {
        console.error(`❌ Error processing ${blob.pathname}:`, error)
      }
    }

    console.log(`🎉 Successfully processed ${posts.length} blog posts`)
    return posts
  } catch (error) {
    console.error("❌ Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  console.log(`🔍 Fetching single blog post: ${slug}`)

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("❌ BLOB_READ_WRITE_TOKEN not found")
      return null
    }

    // Try to fetch the specific blob
    const blobPath = `blog/${slug}.md`
    console.log(`📁 Looking for blob at: ${blobPath}`)

    const { blobs } = await list({ prefix: "blog/" })
    const targetBlob = blobs.find((blob) => blob.pathname === blobPath)

    if (!targetBlob) {
      console.log(`❌ Blob not found: ${blobPath}`)
      console.log("📋 Available blobs:")
      blobs.forEach((blob) => console.log(`   - ${blob.pathname}`))
      return null
    }

    console.log(`✅ Found blob: ${targetBlob.pathname}`)

    const response = await fetch(targetBlob.url)
    if (!response.ok) {
      console.error(`❌ Failed to fetch content: ${response.status}`)
      return null
    }

    const content = await response.text()
    console.log(`📏 Content fetched: ${content.length} characters`)

    const extracted = extractContentFromMarkdown(content, slug)

    const post: BlogPost = {
      slug,
      title: extracted.title || `Post ${slug}`,
      excerpt: extracted.excerpt || "Coming Soon",
      date: new Date().toISOString().split("T")[0],
      category: extracted.category || "Uncategorized",
      image: "/fitness-coaching-session.png",
      readTime: "3 min read",
      content,
    }

    console.log(`✅ Successfully fetched post: "${post.title}"`)
    return post
  } catch (error) {
    console.error(`❌ Error fetching blog post ${slug}:`, error)
    return null
  }
}
