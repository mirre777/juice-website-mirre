import { list, get } from "@vercel/blob"
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
  source?: "hardcoded" | "blob"
}

export interface BlogPost {
  frontmatter: BlogPostFrontmatter
  serializedContent: any
  content: string
  slug: string
}

const BLOG_CONTENT_PATH = "blog/"

// Sample blog posts for when blob storage is not available (like in v0)
const SAMPLE_POSTS: BlogPostFrontmatter[] = [
  {
    title: "⌚ Are Wearables Accurate Enough to Track Complex Lifting Movements?",
    date: "2025-02-04",
    excerpt:
      "Wearables are everywhere. But when it comes to heavy squats, Olympic lifts, or deadlifts? Are they legit? Let's break down what they do well and where they fail.",
    category: "Technology",
    image: "/wearables-strength-training-squat-gym.png",
    slug: "are-wearables-accurate-enough-to-track-complex-lifting-movements",
    source: "hardcoded",
  },
  {
    title: "📊 Tracking Biometrics: What Actually Moves the Needle",
    date: "2025-02-03",
    excerpt:
      "Biometrics aren't just numbers—they're accountability. Knowing how often clients sleep, rest, recover, and move can elevate your coaching. Here's how to implement it smartly.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tracking%20biometrics%20%281%29-HWabjekyZFyyGIXge16oFoyfWB84nS.png",
    slug: "tracking-biometrics-what-actually-moves-the-needle",
    source: "hardcoded",
  },
  {
    title: "📊 Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)",
    date: "2025-02-02",
    excerpt:
      "Let's be real: fancy coaching apps are sexy. But Google Sheets? That's where trainers roll up their sleeves. Customize whatever you want, track everything, and stay lean on cost. But spoiler: it's not always client-friendly.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/max_LS%20%281%29-xJVZRoneLwWk1GoQiKXIjSrxdTuBWz.png",
    slug: "google-sheets-for-coaching-trainers-secret-weapon-or-trap",
    source: "hardcoded",
  },
  {
    title: "📱 How to Get More Clients with a Booking Page",
    date: "2025-02-01",
    excerpt:
      "Still relying on DMs and WhatsApp back-and-forths? You're losing clients while checking your phone. A booking page converts scrolls into sessions while you sleep.",
    category: "Marketing",
    image: "/personal-trainer-booking-page-mobile.png",
    slug: "how-to-get-more-clients-with-booking-page",
    source: "hardcoded",
  },
  {
    title: "🏆 Top 5 Free Personal Trainer Website Builders (2025)",
    date: "2025-01-31",
    excerpt:
      "Let's cut the fluff. You're a personal trainer, not a web developer. You need a high-converting website that books sessions while you're smashing reps with clients. Here are the 5 best free website builders made for trainers in 2025.",
    category: "Technology",
    image: "/personal-trainer-website-builders-laptops.png",
    slug: "top-5-free-personal-trainer-website-builders-2025",
    source: "hardcoded",
  },
  {
    title: "🔍 SEO Tips for Fitness Coaches in Europe",
    date: "2025-01-30",
    excerpt:
      "Let's get something straight: SEO isn't for nerds in glasses. It's for smart coaches who want to get found while they're training. Here's how to rank higher, book more, and dominate your local market.",
    category: "Visibility",
    image: "/seo-tips-fitness-coaches-europe.png",
    slug: "seo-tips-for-fitness-coaches-in-europe",
    source: "hardcoded",
  },
  {
    title: "🚀 The Best Tools for Personal Trainers in Berlin 2025 Edition",
    date: "2025-01-15",
    excerpt:
      "Discover the cutting-edge tools and apps that are revolutionizing personal training in Berlin. From AI-powered workout planning to client management systems.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dumbbells2%20%281%29-hPgb1H1OGLxgKaz93OKKd1FIFW8a45.png",
    slug: "the-best-tools-for-personal-trainers-in-berlin-2025-edition-rocket",
    source: "hardcoded",
  },
  {
    title: "💻 Top Fitness Software in Berlin 2025 (Because Spreadsheets Are So Last Year)",
    date: "2025-01-10",
    excerpt:
      "Say goodbye to Excel hell! Discover the modern software solutions that Berlin's top fitness professionals are using to streamline their businesses and wow their clients.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee%20%281%29-Ksk4c7bQl0eNUnhGiDUYQGzVhFZJJA.png",
    slug: "top-fitness-software-in-berlin-2025-because-spreadsheets-are-so-last-year",
    source: "hardcoded",
  },
  {
    title: "🥗 Nutrition Coaching Trends Taking Over Berlin in 2025",
    date: "2025-01-05",
    excerpt:
      "From personalized meal planning to AI-driven nutrition advice, discover the trends shaping how Berlin's fitness professionals approach nutrition coaching.",
    category: "Nutrition",
    image: "/nutrition-coaching-trends-berlin-woman-phone.png",
    slug: "nutrition-coaching-trends-berlin-2025",
    source: "hardcoded",
  },
  {
    title: "🏋️ Strength Training Revolution: What's New in Berlin Gyms",
    date: "2024-12-28",
    excerpt:
      "Berlin's gym scene is evolving with new training methodologies, equipment innovations, and coaching techniques that are changing how we build strength.",
    category: "Fitness",
    slug: "strength-training-revolution-berlin-gyms",
    source: "hardcoded",
  },
  {
    title: "🧠 The Psychology of Fitness: Mental Coaching Techniques",
    date: "2024-12-20",
    excerpt:
      "Explore the mental side of fitness coaching and learn techniques that help clients overcome psychological barriers to achieve their goals.",
    category: "Coaching",
    slug: "psychology-of-fitness-mental-coaching-techniques",
    source: "hardcoded",
  },
]

const SAMPLE_BLOG_CONTENT: Record<string, string> = {
  "are-wearables-accurate-enough-to-track-complex-lifting-movements": `
# Are Wearables Accurate Enough to Track Complex Lifting Movements?

Wearables are everywhere. But when it comes to heavy squats, Olympic lifts, or deadlifts? That's where things get interesting. Let's break down what they can and cannot track effectively.

## The Reality Check

Most fitness wearables excel at cardio tracking but struggle with resistance training complexity. Here's why:

- **Movement patterns**: Complex lifts involve multiple planes of motion
- **Load detection**: Wearables can't distinguish between bodyweight and loaded movements
- **Form analysis**: They track movement but not movement quality

## What Actually Works

For strength training tracking, focus on:

1. **Rep counting**: Most devices handle this reasonably well
2. **Workout duration**: Reliable across all devices
3. **Heart rate zones**: Useful for understanding training intensity

## The Bottom Line

Use wearables as one data point, not the complete picture. Your training log and progressive overload matter more than any device metric.
`,
  "tracking-biometrics-what-actually-moves-the-needle": `
# Tracking Biometrics: What Actually Moves the Needle

Biometrics aren't just numbers—they're accountability. Knowing how often clients sleep, rest, recover, and move can elevate your coaching. Here's how to implement it smartly.

## The Essential Metrics

Focus on these key biometrics that actually impact training outcomes:

- **Sleep quality and duration**: The foundation of recovery
- **Heart rate variability**: Stress and recovery indicator  
- **Daily movement**: Beyond just gym sessions
- **Subjective wellness scores**: How clients feel matters

## Implementation Strategy

Start simple and build complexity:

1. **Week 1-2**: Basic sleep and step tracking
2. **Week 3-4**: Add subjective wellness scores
3. **Month 2+**: Introduce HRV if clients are ready

## Making It Actionable

Data without action is just noise. Use biometrics to:

- Adjust training intensity based on recovery
- Identify patterns in performance drops
- Celebrate non-scale victories with clients

Remember: The best biometric system is the one your clients actually use consistently.
`,
  "google-sheets-for-coaching-a-trainers-secret-weapon": `
# Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)

Tables. Are they coaching gold or just spreadsheet hell? But when trainers can use them wisely, track everything, and get organized, it's a game changer. Customize whatever you want, track everything, and get organized.

## Why Trainers Love Sheets

Google Sheets offers unmatched flexibility for fitness professionals:

- **Custom tracking**: Build exactly what you need
- **Real-time collaboration**: Share with clients instantly
- **Cost-effective**: Free with unlimited possibilities
- **Integration friendly**: Connects with most fitness apps

## The Setup That Works

Here's a proven template structure:

1. **Client overview tab**: Basic info and goals
2. **Workout tracking**: Sets, reps, weights, notes
3. **Progress metrics**: Measurements, photos, assessments
4. **Nutrition log**: If you're tracking food intake

## Advanced Features

Take your sheets to the next level:

- **Conditional formatting**: Highlight PRs automatically
- **Charts and graphs**: Visual progress tracking
- **Data validation**: Prevent input errors
- **Automated calculations**: RPE to percentage conversions

## The Reality Check

Sheets work great until they don't. Know when to graduate to dedicated coaching software for better client experience and your sanity.
`,
  // Add more sample content for other posts...
}

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

// Helper function to fetch blob content with proper authentication
async function fetchBlobContent(blobPathname: string): Promise<string> {
  console.log(`[fetchBlobContent] Starting fetch for: ${blobPathname}`)

  if (!BLOB_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN not available")
  }

  try {
    console.log(`[fetchBlobContent] Step 1: Getting blob object using SDK...`)
    const blob = await get(blobPathname, { token: BLOB_TOKEN })
    console.log(`[fetchBlobContent] Step 1 result:`, {
      exists: !!blob,
      url: blob?.url,
      size: blob?.size,
      contentType: blob?.contentType,
    })

    if (!blob) {
      throw new Error(`Blob not found: ${blobPathname}`)
    }

    console.log(`[fetchBlobContent] Step 2: Attempting to fetch content from URL...`)
    console.log(`[fetchBlobContent] Step 2: URL being fetched: ${blob.url}`)

    // Try fetching with different approaches
    let content: string

    try {
      // Approach 1: Direct fetch from blob URL
      console.log(`[fetchBlobContent] Step 2a: Direct fetch attempt...`)
      const response = await fetch(blob.url)
      console.log(`[fetchBlobContent] Step 2a response:`, {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      content = await response.text()
      console.log(`[fetchBlobContent] Step 2a ✅: Got content, length: ${content.length}`)
    } catch (fetchError) {
      console.log(`[fetchBlobContent] Step 2a ❌: Direct fetch failed:`, fetchError)

      // Approach 2: Try with authentication headers
      console.log(`[fetchBlobContent] Step 2b: Fetch with auth headers...`)
      const authResponse = await fetch(blob.url, {
        headers: {
          Authorization: `Bearer ${BLOB_TOKEN}`,
          "Content-Type": "text/markdown",
        },
      })

      console.log(`[fetchBlobContent] Step 2b response:`, {
        ok: authResponse.ok,
        status: authResponse.status,
        statusText: authResponse.statusText,
      })

      if (!authResponse.ok) {
        throw new Error(`Auth fetch failed: HTTP ${authResponse.status}: ${authResponse.statusText}`)
      }

      content = await authResponse.text()
      console.log(`[fetchBlobContent] Step 2b ✅: Got content with auth, length: ${content.length}`)
    }

    console.log(`[fetchBlobContent] Step 3: Content preview:`, content.substring(0, 200) + "...")
    console.log(`[fetchBlobContent] ✅ Success for ${blobPathname}, final content length: ${content.length}`)
    return content
  } catch (error) {
    console.error(`[fetchBlobContent] ❌ Complete failure for ${blobPathname}:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      blobPathname,
    })
    throw error
  }
}

function cleanSlugFromFilename(rawSlug: string): string {
  return rawSlug
    .replace(/^-+/, "") // Remove leading dashes
    .replace(/-+$/, "") // Remove trailing dashes
    .replace(/\s*$$\d+$$.*$/, "") // Remove "(1)" and everything after
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace special chars with dashes
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-|-$/g, "") // Remove leading/trailing dashes again
    .toLowerCase()
}

export async function getPostSlugs(): Promise<string[]> {
  console.log("[getPostSlugs] Fetching all blog post slugs...")

  if (!BLOB_TOKEN) {
    console.log("[getPostSlugs] No BLOB_TOKEN, using sample posts")
    return SAMPLE_POSTS.map((post) => post.slug)
  }

  try {
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    const slugs = blobs
      .filter((blob) => blob.pathname.endsWith(".md"))
      .map((blob) => blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, ""))
    console.log(`[getPostSlugs] Found ${slugs.length} slugs from blob storage:`, slugs)
    return slugs
  } catch (error) {
    console.error("[getPostSlugs] Error fetching from blob storage, falling back to samples:", error)
    return SAMPLE_POSTS.map((post) => post.slug)
  }
}

export async function getAllPosts(): Promise<BlogPostFrontmatter[]> {
  console.log("[getAllPosts] ==================== STARTING BLOG FETCH ====================")

  // Always start with hardcoded posts
  const allPosts: BlogPostFrontmatter[] = [...SAMPLE_POSTS]
  console.log(`[getAllPosts] ✅ Added ${SAMPLE_POSTS.length} hardcoded posts`)

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  console.log("[getAllPosts] Environment check:", {
    hasBlobToken: !!blobToken,
    tokenLength: blobToken?.length,
    tokenPrefix: blobToken?.substring(0, 20) + "...",
  })

  if (blobToken) {
    try {
      console.log("[getAllPosts] 🔍 BLOB PROCESSING PHASE STARTING...")
      const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: blobToken })
      console.log(`[getAllPosts] 📁 Found ${blobs.length} total blobs with prefix "${BLOG_CONTENT_PATH}"`)

      const markdownBlobs = blobs.filter((blob) => blob.pathname.endsWith(".md"))
      console.log(`[getAllPosts] 📝 Filtered to ${markdownBlobs.length} markdown files`)

      for (let i = 0; i < markdownBlobs.length; i++) {
        const blob = markdownBlobs[i]
        console.log(`[getAllPosts] 🔄 Processing blob ${i + 1}/${markdownBlobs.length}: ${blob.pathname}`)

        try {
          console.log(`[getAllPosts] Using downloadUrl: ${blob.downloadUrl}`)

          const response = await fetch(blob.downloadUrl)
          console.log(`[getAllPosts] Response status: ${response.status} ${response.statusText}`)

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const fileContents = await response.text()
          console.log(`[getAllPosts] ✅ Got content! Length: ${fileContents.length}`)

          const rawSlug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")
          const cleanSlug = cleanSlugFromFilename(rawSlug)
          console.log(`[getAllPosts] Slug: "${rawSlug}" -> "${cleanSlug}"`)

          if (cleanSlug) {
            const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
            const extracted = extractTitleAndExcerpt(content)

            const blobPost: BlogPostFrontmatter = {
              title: data.title || extracted.title || `Blog Post: ${cleanSlug.replace(/-/g, " ")}`,
              date: data.date || new Date().toISOString().split("T")[0],
              category: data.category || "Technology",
              excerpt: data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available.",
              image: data.image || undefined,
              slug: cleanSlug,
              source: "blob",
            }

            allPosts.push(blobPost)
            console.log(`[getAllPosts] 🎉 SUCCESS! Added blob post: "${blobPost.title}"`)
          } else {
            console.log(`[getAllPosts] ⚠️ Skipped blob with empty slug: ${blob.pathname}`)
          }
        } catch (blobError) {
          console.error(`[getAllPosts] ❌ Failed to process blob ${blob.pathname}:`, {
            pathname: blob.pathname,
            downloadUrl: blob.downloadUrl,
            error: blobError instanceof Error ? blobError.message : String(blobError),
          })
        }
      }
    } catch (listError) {
      console.error("[getAllPosts] ❌ CRITICAL ERROR: Failed to list blobs:", listError)
    }
  }

  // Sort by date
  allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const hardcodedCount = allPosts.filter((p) => !p.source || p.source === "hardcoded").length
  const blobCount = allPosts.filter((p) => p.source === "blob").length

  console.log(`[getAllPosts] ==================== FINAL RESULTS ====================`)
  console.log(`[getAllPosts] 📊 Total posts: ${allPosts.length}`)
  console.log(`[getAllPosts] 📝 Hardcoded: ${hardcodedCount}`)
  console.log(`[getAllPosts] 💾 Blob: ${blobCount}`)
  console.log(`[getAllPosts] ==================== END BLOG FETCH ====================`)

  return allPosts
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[getPostBySlug] Attempting to fetch post with slug: ${slug}`)

  const samplePost = SAMPLE_POSTS.find((post) => post.slug === slug)
  if (samplePost) {
    console.log(`[getPostBySlug] Found sample post for slug: ${slug}`)

    // Use sample content if available, otherwise generate basic content
    const sampleContent =
      SAMPLE_BLOG_CONTENT[slug] ||
      `
# ${samplePost.title}

${samplePost.excerpt}

This is a sample blog post. The full content would be available in a production environment.

## Key Points

- Professional fitness coaching insights
- Evidence-based training approaches  
- Practical implementation strategies

*This content is part of our sample blog system.*
`

    try {
      const serializedContent = await serialize(sampleContent, {
        parseFrontmatter: false,
      })

      return {
        frontmatter: samplePost,
        serializedContent,
        content: sampleContent,
        slug: slug,
      }
    } catch (error) {
      console.error(`[getPostBySlug] Error serializing sample content for ${slug}:`, error)
      return null
    }
  }

  if (!BLOB_TOKEN) {
    console.error("[getPostBySlug] BLOB_READ_WRITE_TOKEN is not set and no sample content found")
    return null
  }

  try {
    console.log(`[getPostBySlug] Searching blob storage for slug: ${slug}`)

    // List all markdown blobs to find the one that matches our cleaned slug
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    const markdownBlobs = blobs.filter((blob) => blob.pathname.endsWith(".md"))

    console.log(`[getPostBySlug] Found ${markdownBlobs.length} markdown blobs to search`)

    // Find the blob whose cleaned slug matches our target slug
    let targetBlob = null
    for (const blob of markdownBlobs) {
      const rawSlug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")
      const cleanSlug = cleanSlugFromFilename(rawSlug)

      console.log(`[getPostBySlug] Checking blob: ${blob.pathname} -> slug: ${cleanSlug}`)

      if (cleanSlug === slug) {
        targetBlob = blob
        console.log(`[getPostBySlug] ✅ Found matching blob: ${blob.pathname}`)
        break
      }
    }

    if (!targetBlob) {
      console.log(`[getPostBySlug] ❌ No blob found with matching slug: ${slug}`)
      return null
    }

    console.log(`[getPostBySlug] Fetching content from: ${targetBlob.downloadUrl}`)

    const response = await fetch(targetBlob.downloadUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const fileContents = await response.text()
    console.log(`[getPostBySlug] Fetched file contents length: ${fileContents.length} chars`)

    const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
    console.log(`[getPostBySlug] Frontmatter:`, data)

    const extracted = extractTitleAndExcerpt(content)
    const title = data.title || extracted.title || `Blog Post: ${slug.replace(/-/g, " ")}`
    const excerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."

    const serializedContent = await serialize(content, {
      parseFrontmatter: false,
    })

    return {
      frontmatter: {
        title: title,
        date: data.date || new Date().toISOString().split("T")[0],
        category: data.category || "Technology",
        excerpt: excerpt,
        image: data.image || undefined,
        slug: slug,
        source: "blob",
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
