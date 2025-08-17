// Script to promote a blog post from Blob storage to hardcoded status
// Usage: node scripts/promote-blog-post.js <slug>

const { list, del } = require("@vercel/blob")
const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

async function promoteBlogPost(slug) {
  if (!slug) {
    console.log("Usage: node scripts/promote-blog-post.js <slug>")
    process.exit(1)
  }

  console.log(`🔍 Looking for blog post with slug: ${slug}`)

  try {
    // Find the post in Blob storage
    const { blobs } = await list({ prefix: "blog/" })
    const targetBlob = blobs.find((blob) => {
      const filename = blob.pathname.replace("blog/", "").replace(".md", "")
      return filename === slug
    })

    if (!targetBlob) {
      console.log(`❌ No blog post found with slug: ${slug}`)
      return
    }

    // Fetch the content
    const response = await fetch(targetBlob.url)
    const content = await response.text()
    const { data: frontmatter, content: markdownContent } = matter(content)

    // Extract post data
    const postData = {
      title: frontmatter.title || extractTitleFromContent(content),
      date: frontmatter.date || new Date().toISOString().split("T")[0],
      excerpt: frontmatter.excerpt || extractExcerpt(markdownContent),
      category: frontmatter.category || "General",
      image: frontmatter.image || "/fitness-blog-post.png",
      slug: slug,
    }

    console.log("📝 Post data to promote:")
    console.log(JSON.stringify(postData, null, 2))

    // Read current lib/blog.ts
    const blogPath = path.join(process.cwd(), "lib", "blog.ts")
    let blogContent = fs.readFileSync(blogPath, "utf8")

    // Add to SAMPLE_POSTS array (before the closing bracket)
    const samplePostsMatch = blogContent.match(/(const SAMPLE_POSTS: BlogPostFrontmatter\[\] = \[)([\s\S]*?)(\])/s)
    if (samplePostsMatch) {
      const newPost = `  {
    title: "${postData.title}",
    date: "${postData.date}",
    excerpt: "${postData.excerpt}",
    category: "${postData.category}",
    image: "${postData.image}",
    slug: "${postData.slug}",
  },`

      const updatedSamplePosts = samplePostsMatch[1] + samplePostsMatch[2] + newPost + "\n" + samplePostsMatch[3]
      blogContent = blogContent.replace(samplePostsMatch[0], updatedSamplePosts)
    }

    // Add to SAMPLE_BLOG_CONTENT object (before the closing brace)
    const contentMatch = blogContent.match(/(const SAMPLE_BLOG_CONTENT: Record<string, string> = \{)([\s\S]*?)(\})/s)
    if (contentMatch) {
      const newContent = `  "${slug}": \`${markdownContent.replace(/`/g, "\\`")}\`,`

      const updatedContent = contentMatch[1] + contentMatch[2] + "\n" + newContent + "\n" + contentMatch[3]
      blogContent = blogContent.replace(contentMatch[0], updatedContent)
    }

    // Write updated file
    fs.writeFileSync(blogPath, blogContent)
    console.log("✅ Added to hardcoded posts in lib/blog.ts")

    // Delete from Blob storage
    await del(targetBlob.url)
    console.log("🗑️ Deleted from Blob storage")

    console.log(`🎉 Successfully promoted "${postData.title}" to hardcoded status!`)
  } catch (error) {
    console.error("❌ Error promoting blog post:", error)
  }
}

function extractTitleFromContent(content) {
  const { content: markdownContent } = matter(content)
  const headingMatch = markdownContent.match(/^#\s+(.+)$/m)
  return headingMatch ? headingMatch[1].trim() : "Untitled"
}

function extractExcerpt(content) {
  const paragraphs = content
    .replace(/^#.+$/gm, "")
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 50)

  if (paragraphs.length > 0) {
    const excerpt = paragraphs[0].substring(0, 200)
    return excerpt.length < paragraphs[0].length ? excerpt + "..." : excerpt
  }

  return "Discover insights from the world of fitness coaching and technology."
}

// Run the promotion
const slug = process.argv[2]
promoteBlogPost(slug)
