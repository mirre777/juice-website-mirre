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
  },
  {
    title: "📱 How to Get More Clients with a Booking Page",
    date: "2025-02-01",
    excerpt:
      "Still relying on DMs and WhatsApp back-and-forths? You're losing clients while checking your phone. A booking page converts scrolls into sessions while you sleep.",
    category: "Marketing",
    image: "/personal-trainer-booking-page-mobile.png",
    slug: "how-to-get-more-clients-with-booking-page",
  },
  {
    title: "🏆 Top 5 Free Personal Trainer Website Builders (2025)",
    date: "2025-01-31",
    excerpt:
      "Let's cut the fluff. You're a personal trainer, not a web developer. You need a high-converting website that books sessions while you're smashing reps with clients. Here are the 5 best free website builders made for trainers in 2025.",
    category: "Technology",
    image: "/personal-trainer-website-builders-laptops.png",
    slug: "top-5-free-personal-trainer-website-builders-2025",
  },
  {
    title: "🔍 SEO Tips for Fitness Coaches in Europe",
    date: "2025-01-30",
    excerpt:
      "Let's get something straight: SEO isn't for nerds in glasses. It's for smart coaches who want to get found while they're training. Here's how to rank higher, book more, and dominate your local market.",
    category: "Visibility",
    image: "/seo-tips-fitness-coaches-europe.png",
    slug: "seo-tips-for-fitness-coaches-in-europe",
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
  },
  {
    title: "🥗 Nutrition Coaching Trends Taking Over Berlin in 2025",
    date: "2025-01-05",
    excerpt:
      "From personalized meal planning to AI-driven nutrition advice, discover the trends shaping how Berlin's fitness professionals approach nutrition coaching.",
    category: "Nutrition",
    image: "/nutrition-coaching-trends-berlin-woman-phone.png",
    slug: "nutrition-coaching-trends-berlin-2025",
  },
  {
    title: "🏋️ Strength Training Revolution: What's New in Berlin Gyms",
    date: "2024-12-28",
    excerpt:
      "Berlin's gym scene is evolving with new training methodologies, equipment innovations, and coaching techniques that are changing how we build strength.",
    category: "Fitness",
    slug: "strength-training-revolution-berlin-gyms",
  },
  {
    title: "🧠 The Psychology of Fitness: Mental Coaching Techniques",
    date: "2024-12-20",
    excerpt:
      "Explore the mental side of fitness coaching and learn techniques that help clients overcome psychological barriers to achieve their goals.",
    category: "Coaching",
    slug: "psychology-of-fitness-mental-coaching-techniques",
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
  console.log(`[fetchBlobContent] Fetching blob: ${blobPathname}`)

  if (!BLOB_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN not available")
  }

  try {
    // Use Vercel Blob SDK's get method instead of direct HTTP fetch
    const blob = await get(blobPathname, { token: BLOB_TOKEN })

    if (!blob) {
      throw new Error(`Blob not found: ${blobPathname}`)
    }

    // Get the content as text
    const response = await fetch(blob.url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const content = await response.text()
    console.log(`[fetchBlobContent] ✅ Success, content length: ${content.length}`)
    return content
  } catch (error) {
    console.error(`[fetchBlobContent] ❌ Failed to fetch ${blobPathname}:`, error)
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
  console.log("[getAllPosts] Starting blog post fetch...")

  // Always start with hardcoded posts
  const allPosts: BlogPostFrontmatter[] = [
    ...SAMPLE_POSTS.map((post) => ({
      ...post,
      source: "hardcoded" as const,
    })),
  ]
  console.log(`[getAllPosts] Added ${SAMPLE_POSTS.length} hardcoded posts`)

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  console.log("[getAllPosts] BLOB_TOKEN available:", !!blobToken)

  if (blobToken) {
    try {
      console.log("[getAllPosts] Fetching blobs from storage...")
      const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: blobToken })
      console.log(`[getAllPosts] Found ${blobs.length} blobs with prefix ${BLOG_CONTENT_PATH}`)

      let processedCount = 0
      let errorCount = 0

      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i]
        console.log(`[getAllPosts] Processing blob ${i + 1}/${blobs.length}: ${blob.pathname}`)

        if (!blob.pathname.endsWith(".md")) {
          console.log(`[getAllPosts] ⏭️ Skipping non-markdown: ${blob.pathname}`)
          continue
        }

        try {
          console.log(`[getAllPosts] Step 1: Fetching content using SDK for ${blob.pathname}`)
          const fileContents = await fetchBlobContent(blob.pathname)
          console.log(`[getAllPosts] Step 1 ✅: Got ${fileContents.length} characters`)

          const rawSlug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")
          console.log(`[getAllPosts] Step 2: Raw slug from filename: "${rawSlug}"`)

          const cleanSlug = cleanSlugFromFilename(rawSlug)
          console.log(`[getAllPosts] Step 2 ✅: Clean slug: "${cleanSlug}"`)

          // Skip if slug is empty after cleaning
          if (!cleanSlug) {
            console.log(`[getAllPosts] ⏭️ Skipping blob with empty slug: ${blob.pathname}`)
            continue
          }

          // Step 3: Parse frontmatter with better error handling
          console.log(`[getAllPosts] Step 3: Parsing frontmatter...`)
          const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
          console.log(`[getAllPosts] Step 3 ✅: Frontmatter keys: [${Object.keys(data).join(", ")}]`)

          // Step 4: Extract title and excerpt with fallbacks
          const extracted = extractTitleAndExcerpt(content)
          const finalTitle = data.title || extracted.title || `Blog Post: ${cleanSlug.replace(/-/g, " ")}`
          const finalExcerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."
          console.log(`[getAllPosts] Step 4 ✅: Title: "${finalTitle}"`)
          console.log(`[getAllPosts] Step 4 ✅: Excerpt: "${finalExcerpt.substring(0, 50)}..."`)

          // Step 5: Create post object with validation
          const blobPost = {
            title: finalTitle,
            date: data.date || new Date().toISOString().split("T")[0],
            category: data.category || "Technology",
            excerpt: finalExcerpt,
            image: data.image || undefined,
            slug: cleanSlug,
            source: "blob" as const,
          }

          allPosts.push(blobPost)
          processedCount++
          console.log(`[getAllPosts] Step 5 ✅: Successfully added blob post: "${finalTitle}"`)
        } catch (blobError) {
          errorCount++
          console.error(`[getAllPosts] ❌ Failed to process blob ${blob.pathname}:`, blobError)
          console.error(`[getAllPosts] ❌ Blob error details:`, {
            pathname: blob.pathname,
            url: blob.url,
            size: blob.size,
            error: blobError instanceof Error ? blobError.message : String(blobError),
          })
          // Continue with next blob
        }
      }

      console.log(`[getAllPosts] Blob processing complete: ${processedCount} successful, ${errorCount} errors`)
    } catch (listError) {
      console.error("[getAllPosts] ❌ Error listing blobs:", listError)
    }
  }

  // Sort by date
  allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const hardcodedCount = allPosts.filter((p) => p.source === "hardcoded").length
  const blobCount = allPosts.filter((p) => p.source === "blob").length
  console.log(
    `[getAllPosts] Final result: ${allPosts.length} total posts (${hardcodedCount} hardcoded + ${blobCount} blob)`,
  )

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
    const targetPath = `${BLOG_CONTENT_PATH}${slug}.md`
    console.log(`[getPostBySlug] Target blob path: ${targetPath}`)

    const fileContents = await fetchBlobContent(targetPath)
    console.log(`[getPostBySlug] Fetched file contents length: ${fileContents.length} chars`)

    const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
    console.log(`[getPostBySlug] Frontmatter:`, data)

    const extracted = extractTitleAndExcerpt(content)
    const title = data.title || extracted.title || `Post: ${slug}`
    const excerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."

    const serializedContent = await serialize(content, {
      parseFrontmatter: false,
    })

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
