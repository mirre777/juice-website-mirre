import { getAllPosts, getPostBySlug } from "../lib/blog.js"

async function auditBlogSEO() {
  console.log("🔍 Starting Blog SEO Audit...\n")

  try {
    const posts = await getAllPosts()
    console.log(`Found ${posts.length} blog posts to audit\n`)

    const results = []

    for (const post of posts) {
      console.log(`Auditing: ${post.title}`)

      const fullPost = await getPostBySlug(post.slug)

      if (!fullPost) {
        console.log(`  ⚠️  Could not fetch full post content\n`)
        continue
      }

      const audit = {
        slug: post.slug,
        title: post.title,
        issues: [],
        warnings: [],
      }

      // Check Meta Title
      if (!post.title || post.title.trim().length === 0) {
        audit.issues.push("❌ Missing Meta Title")
      } else if (post.title.length < 30) {
        audit.warnings.push(`⚠️  Meta Title too short (${post.title.length} chars, recommend 50-60)`)
      } else if (post.title.length > 60) {
        audit.warnings.push(`⚠️  Meta Title too long (${post.title.length} chars, recommend 50-60)`)
      } else {
        console.log(`  ✅ Meta Title: "${post.title}" (${post.title.length} chars)`)
      }

      // Check Meta Description
      if (!post.excerpt || post.excerpt.trim().length === 0) {
        audit.issues.push("❌ Missing Meta Description")
      } else if (post.excerpt.length < 120) {
        audit.warnings.push(`⚠️  Meta Description too short (${post.excerpt.length} chars, recommend 150-160)`)
      } else if (post.excerpt.length > 160) {
        audit.warnings.push(`⚠️  Meta Description too long (${post.excerpt.length} chars, recommend 150-160)`)
      } else {
        console.log(`  ✅ Meta Description: ${post.excerpt.length} chars`)
      }

      // Check H1 Heading
      const h1Match = fullPost.rawContent.match(/^#\s+(.+)$/m)
      if (!h1Match) {
        audit.issues.push("❌ Missing H1 heading in content")
      } else {
        const h1Text = h1Match[1].trim()
        console.log(`  ✅ H1 Heading: "${h1Text}"`)

        // Check if H1 matches title
        if (h1Text.toLowerCase() !== post.title.toLowerCase()) {
          audit.warnings.push(`⚠️  H1 ("${h1Text}") doesn't match Meta Title ("${post.title}")`)
        }
      }

      // Check Images and Alt Texts
      const imageRegex = /!\[([^\]]*)\]$$([^)]+)$$/g
      const images = [...fullPost.rawContent.matchAll(imageRegex)]

      if (images.length === 0) {
        audit.warnings.push("⚠️  No images found in content")
      } else {
        console.log(`  📷 Found ${images.length} image(s)`)
        let missingAltCount = 0

        images.forEach((match, index) => {
          const altText = match[1]
          const imageUrl = match[2]

          if (!altText || altText.trim().length === 0) {
            missingAltCount++
            console.log(`    ❌ Image ${index + 1}: Missing alt text (${imageUrl})`)
          } else {
            console.log(`    ✅ Image ${index + 1}: "${altText}"`)
          }
        })

        if (missingAltCount > 0) {
          audit.issues.push(`❌ ${missingAltCount} image(s) missing alt text`)
        }
      }

      // Check featured image
      if (!post.image) {
        audit.warnings.push("⚠️  No featured image set")
      } else {
        console.log(`  ✅ Featured Image: ${post.image}`)
      }

      if (audit.issues.length > 0 || audit.warnings.length > 0) {
        results.push(audit)
      }

      console.log("") // Empty line between posts
    }

    // Summary Report
    console.log("\n" + "=".repeat(80))
    console.log("📊 SEO AUDIT SUMMARY")
    console.log("=".repeat(80) + "\n")

    const postsWithIssues = results.filter((r) => r.issues.length > 0)
    const postsWithWarnings = results.filter((r) => r.warnings.length > 0 && r.issues.length === 0)
    const perfectPosts = posts.length - results.length

    console.log(`Total Posts: ${posts.length}`)
    console.log(`✅ Perfect SEO: ${perfectPosts}`)
    console.log(`⚠️  With Warnings: ${postsWithWarnings.length}`)
    console.log(`❌ With Issues: ${postsWithIssues.length}\n`)

    if (results.length > 0) {
      console.log("POSTS NEEDING ATTENTION:\n")

      results.forEach((result) => {
        console.log(`📄 ${result.title}`)
        console.log(`   Slug: ${result.slug}`)

        if (result.issues.length > 0) {
          console.log(`   Issues:`)
          result.issues.forEach((issue) => console.log(`     ${issue}`))
        }

        if (result.warnings.length > 0) {
          console.log(`   Warnings:`)
          result.warnings.forEach((warning) => console.log(`     ${warning}`))
        }

        console.log("")
      })
    }

    console.log("=".repeat(80))
    console.log("✨ Audit Complete!")
    console.log("=".repeat(80))
  } catch (error) {
    console.error("Error during SEO audit:", error)
    throw error
  }
}

auditBlogSEO()
