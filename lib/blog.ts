import { serialize } from "next-mdx-remote/serialize"
import matter from "gray-matter"

export interface BlogPostFrontmatter {
  title: string
  date: string
  excerpt: string
  category: string
  image?: string
  slug: string
}

export interface BlogPost extends BlogPostFrontmatter {
  content: any
  rawContent: string
}

const SAMPLE_POSTS: BlogPostFrontmatter[] = [
  {
    title: "Are Wearables Accurate Enough to Track Complex Lifting Movements?",
    date: "2025-02-04",
    excerpt:
      "Wearables are everywhere. But when it comes to heavy squats, Olympic lifts, or deadlifts? Are they legit? Let's break down what they do well and where they fail.",
    category: "Technology",
    image: "/wearables-strength-training-squat-gym.png",
    slug: "are-wearables-accurate-enough-to-track-complex-lifting-movements",
  },
  {
    title: "Tracking Biometrics: What Actually Moves the Needle",
    date: "2025-02-03",
    excerpt:
      "Biometrics aren't just numbers—they're accountability. Knowing how often clients sleep, rest, recover, and move can elevate your coaching. Here's how to implement it smartly.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tracking%20biometrics%20%281%29-HWabjekyZFyyGIXge16oFoyfWB84nS.png",
    slug: "tracking-biometrics-what-actually-moves-the-needle",
  },
  {
    title: "Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)",
    date: "2025-02-02",
    excerpt:
      "Let's be real: fancy coaching apps are sexy. But Google Sheets? That's where trainers roll up their sleeves. Customize whatever you want, track everything, and stay lean on cost. But spoiler: it's not always client-friendly.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/max_LS%20%281%29-xJVZRoneLwWk1GoQiKXIjSrxdTuBWz.png",
    slug: "google-sheets-for-coaching-trainers-secret-weapon-or-trap",
  },
  {
    title: "How to Get More Clients with a Booking Page",
    date: "2025-02-01",
    excerpt:
      "Still relying on DMs and WhatsApp back-and-forths? You're losing clients while checking your phone. A booking page converts scrolls into sessions while you sleep.",
    category: "Marketing",
    image: "/personal-trainer-booking-page-mobile.png",
    slug: "how-to-get-more-clients-with-booking-page",
  },
  {
    title: "Top 5 Free Personal Trainer Website Builders (2025)",
    date: "2025-01-31",
    excerpt:
      "Let's cut the fluff. You're a personal trainer, not a web developer. You need a high-converting website that books sessions while you're smashing reps with clients. Here are the 5 best free website builders made for trainers in 2025.",
    category: "Technology",
    image: "/personal-trainer-website-builders-laptops.png",
    slug: "top-5-free-personal-trainer-website-builders-2025",
  },
  {
    title: "SEO Tips for Fitness Coaches in Europe",
    date: "2025-01-30",
    excerpt:
      "Let's get something straight: SEO isn't for nerds in glasses. It's for smart coaches who want to get found while they're training. Here's how to rank higher, book more, and dominate your local market.",
    category: "Visibility",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/optimusprime07375_httpss.mj.runwQjHnEwDZQI_httpss.mj.runJ2xzh_89a563be-ee33-4e4b-9446-d2cc6db82549_1-fl8B6QPcHBkfcmbSfZlo1jklJx4Rfr.png",
    slug: "seo-tips-for-fitness-coaches-in-europe",
  },
  {
    title: "The Best Tools For Personal Trainers In Berlin 2025",
    date: "2025-01-15",
    excerpt:
      "Discover the cutting-edge tools and apps that are revolutionizing personal training in Berlin. From AI-powered workout planning to client management systems.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%2015%2C%202025%2C%2002_26_22%20PM-04Fmc86J6RU32SEukCBMpJXIQngz0D.png",
    slug: "the-best-tools-for-personal-trainers-in-berlin-2025",
  },
  {
    title: "Top Fitness Software in Berlin 2025 (Because Spreadsheets Are So Last Year)",
    date: "2025-01-10",
    excerpt:
      "Say goodbye to Excel hell! Discover the modern software solutions that Berlin's top fitness professionals are using to streamline their businesses and wow their clients.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dumbbells2%20%281%29-hPgb1H1OGLxgKaz93OKKd1FIFW8a45.png",
    slug: "top-fitness-software-in-berlin-2025-because-spreadsheets-are-so-last-year",
  },
  {
    title: "Nutrition Coaching Trends Taking Over Berlin in 2025",
    date: "2025-01-05",
    excerpt:
      "From personalized meal planning to AI-driven nutrition advice, discover the trends shaping how Berlin's fitness professionals approach nutrition coaching.",
    category: "Nutrition",
    image: "/nutrition-coaching-trends-berlin-woman-phone.png",
    slug: "nutrition-coaching-trends-berlin-2025",
  },
  {
    title: "Strength Training Revolution: What's New in Berlin Gyms",
    date: "2024-12-28",
    excerpt:
      "Berlin's gym scene is evolving with new training methodologies, equipment innovations, and coaching techniques that are changing how we build strength.",
    category: "Fitness",
    slug: "strength-training-revolution-berlin-gyms",
  },
  {
    title: "The Psychology of Fitness: Mental Coaching Techniques",
    date: "2024-12-20",
    excerpt:
      "Explore the mental side of fitness coaching and learn techniques that help clients overcome psychological barriers to achieve their goals.",
    category: "Coaching",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/optimusprime07375_httpss.mj.runI9EYUY5MdxQ_show_me_lifting_pl_e3d031ab-6312-4f86-a9ff-3c62d20af746_0-OShS9P2385kOQCCJxI5zHLmYXUPwHr.png",
    slug: "psychology-of-fitness-mental-coaching-techniques",
  },
]

const SAMPLE_BLOG_CONTENT: Record<string, string> = {
  "are-wearables-accurate-enough-to-track-complex-lifting-movements": `# Are Wearables Accurate Enough to Track Complex Lifting Movements?

**TL;DR:** Wearables are everywhere. But when it comes to heavy squats, Olympic lifts, or deadlifts? Are they legit? Let's break down what they do well and where they fail.

---

## The Wearable Revolution in Strength Training

Walk into any gym today and you'll see them: Apple Watches tracking workouts, Garmin devices monitoring heart rates, WHOOP bands measuring strain. The fitness wearable market is booming, with devices promising to track everything from your morning run to your evening deadlift session.

But here's the million-dollar question: **Are these devices actually accurate enough to track complex lifting movements?**

The short answer? It's complicated.

---

## What Wearables Actually Track Well

### ✅ Cardiovascular Metrics
Wearables excel at monitoring:

- **Heart rate zones** during cardio or metabolic circuits
- **Heart rate variability** for recovery assessment
- **Workout duration** and basic timing
- **Calorie burn estimates** for steady-state cardio

### ✅ Basic Movement Patterns
Most devices can reliably detect:

- **Step counts** and distance for walking/running
- **Stationary exercise metrics** like cycling
- **Workout start/stop** with auto-detection (usually after 10+ minutes)
- **Sleep patterns** and recovery metrics

### ✅ General Activity Levels
They're solid for:

- **Daily activity tracking** and movement goals
- **Sedentary time** monitoring
- **Overall energy expenditure** trends
- **Long-term activity patterns**

---

## Where They Struggle with Strength Training

### ❌ Calorie Burn Accuracy

**The Reality Check:**
Your Garmin cannot accurately determine how many calories a set of 12 bicep curls burned.

**Why it fails:**
- **Complex energy systems**: Strength training uses different metabolic pathways than cardio
- **Individual variation**: Muscle mass, efficiency, and technique affect calorie burn
- **Recovery periods**: Rest between sets creates irregular energy expenditure patterns
- **Load variations**: 5 reps at 85% 1RM burns differently than 15 reps at 60% 1RM

**Real user experience:**
> *"My Apple Watch says I burned 400 calories during my powerlifting session. I did 5 sets of squats, 5 sets of bench, and 3 sets of deadlifts in 90 minutes. There's no way that's accurate."*
> 
> **— Reddit user on r/Garmin**

### ❌ Movement Quality Assessment

**What's missing:**
- **Range of motion** tracking
- **Movement velocity** during lifts
- **Form breakdown** detection
- **Eccentric vs. concentric** phase differentiation

**The problem:**
A wearable can't tell the difference between a perfect squat and a quarter-rep. It can't detect if you're compensating with your back during a deadlift or if your bench press bar path is optimal.

### ❌ Load and Intensity Tracking

**Manual input required:**
- **Weight lifted** must be logged separately
- **Sets and reps** need manual entry
- **RPE (Rate of Perceived Exertion)** requires subjective input
- **Rest periods** between sets aren't automatically tracked

**The tedious reality:**
Logging movements is tedious; often best to auto-track basic metrics and log the important stuff manually.

---

## The Bottom Line

**Wearables are powerful tools—but they're not your muscle's measure.**

**What they do well:**
- ✅ General activity and health monitoring
- ✅ Heart rate and basic cardiovascular metrics
- ✅ Sleep and recovery tracking
- ✅ Motivation and consistency support

**What they don't do well:**
- ❌ Accurate calorie burn for strength training
- ❌ Movement quality assessment
- ❌ Load and intensity tracking
- ❌ Complex exercise recognition

**The smart approach:**
Use wearables to support your coaching and training, not replace good fundamentals. The best tracker for strength training is still a combination of:

1. **A notebook or app** for weights, sets, and reps
2. **A spreadsheet** for trend analysis
3. **An experienced eye** for form and technique assessment
4. **Wearable data** for recovery and general health metrics

**For trainers:** Educate your clients about what the data means and doesn't mean. Use wearables as engagement tools and trend indicators, not precision instruments.

**For athletes:** Focus on performance metrics that matter—progressive overload, form quality, and how you feel. Let the wearable handle the background health monitoring.

The future will bring better integration and accuracy, but for now, the most important sensor is still the one between your ears.

---

## Sources and Further Reading

- [Reddit: Be Wary of Calorie Counts for Weightlifting](https://www.reddit.com/r/Garmin/comments/17c9lu8/be_weary_of_calorie_counts_for_weightlifting/)
- [Reddit: Weightlifting on Garmin is by Far its Weakest Feature](https://www.reddit.com/r/Garmin/comments/1cqa26x/weightlifting_on_garmin_is_by_far_its_weakest_and/)
- [Self Magazine: Oura Ring 4 Review](https://www.self.com/review/oura-ring-4)
- [arXiv: Wearable Technology in Sports](https://arxiv.org/abs/2203.16442)`,
}

const BLOG_CONTENT_PATH = "blog/"

// Function to clean slug from filename
function cleanSlugFromFilename(filename: string): string {
  return filename
    .replace(/^-+/, "") // Remove leading dashes
    .replace(/-+$/, "") // Remove trailing dashes
    .replace(/\s*$$[^)]*$$\s*/g, "") // Remove content in parentheses
    .replace(/[^a-z0-9-]/gi, "-") // Replace non-alphanumeric with dashes
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .toLowerCase()
}

// Function to enhance markdown content for consistent formatting
function enhanceMarkdownContent(content: string): string {
  // Enhance key points and lists
  content = content.replace(/^- \*\*(.*?)\*\*/gm, "• **$1**")
  content = content.replace(/^(\d+)\. \*\*(.*?)\*\*/gm, "$1. 🎯 **$2**")

  return content
}

// Function to fetch blob content
async function fetchBlobContent(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    console.error("Error fetching blob content:", error)
    return ""
  }
}

function extractTitleFromContent(content: string, filename: string): string {
  // First try to get title from frontmatter
  const { data: frontmatter, content: markdownContent } = matter(content)
  if (frontmatter.title) {
    return cleanTitle(frontmatter.title)
  }

  // If no frontmatter title, try to extract from first heading
  const headingMatch = markdownContent.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return cleanTitle(headingMatch[1].trim())
  }

  // If no heading, try to generate from filename
  const cleanName = filename
    .replace(/\.md$/, "")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/g, "") // Remove parentheses content
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim()

  return cleanTitle(cleanName) || "Untitled"
}

function extractExcerptFromContent(content: string, frontmatter: any): string {
  if (frontmatter.excerpt || frontmatter.description) {
    return frontmatter.excerpt || frontmatter.description
  }

  // Extract first paragraph after title
  const { content: markdownContent } = matter(content)
  const paragraphs = markdownContent
    .replace(/^#.+$/gm, "") // Remove headings
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 50) // Only substantial paragraphs

  if (paragraphs.length > 0) {
    const excerpt = paragraphs[0].substring(0, 200)
    return excerpt.length < paragraphs[0].length ? excerpt + "..." : excerpt
  }

  return "Discover insights from the world of fitness coaching and technology."
}

function getImageForBlobPost(title: string, frontmatter: any): string {
  // If frontmatter has an image, use it
  if (frontmatter.image) {
    return frontmatter.image
  }

  console.log(`[v0] getImageForBlobPost: Processing title: "${title}"`)

  // Assign images based on title content
  const titleLower = title.toLowerCase()
  console.log(`[v0] getImageForBlobPost: Title lowercase: "${titleLower}"`)

  if (
    titleLower.includes("strength training myths") ||
    titleLower.includes("myths busted") ||
    titleLower.includes("myths")
  ) {
    console.log(`[v0] getImageForBlobPost: Matched myths pattern, using optimusprime image`)
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/optimusprime07375_httpss.mj.runwQjHnEwDZQI_httpss.mj.runJ2xzh_72f6cc4d-9694-43ad-919b-7b562d884b0a_0-eLUqJaxSwe1bNeVFJhR1VDW10n32n0.png"
  }

  if (
    titleLower.includes("resistance training") ||
    titleLower.includes("medicine") ||
    titleLower.includes("number 2")
  ) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/optimusprime07375_create_an_image_in_the_same_style_but_of_th_aa77639a-36ef-4fe3-a79e-1d6dd37e1e90_2-petqFiTwRriFbsmO9j4PYsJtF2eXGt.png"
  }

  if (titleLower.includes("grannies") || titleLower.includes("pump iron") || titleLower.includes("stop the clock")) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/asian%20woman%20gym-yjGZ80lQKAuFqFbDgrG7xqwwx6XNpI.png"
  }

  if (titleLower.includes("ai") && titleLower.includes("personal training")) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gym_woman-WTRGVNMDnOgXsKU3vNuaL1mAUze1Zr.png"
  }

  if (titleLower.includes("berlin") && (titleLower.includes("software") || titleLower.includes("tools"))) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/boxer_gym-6wlg1r57kNLLkVRoWE8X6aD02l6k6y.png"
  }

  // Default fallback
  return "/fitness-blog-post.png"
}

function cleanTitle(title: string): string {
  return (
    title
      .replace(
        /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]\s*/gu,
        "",
      )
      // Remove "Number X" prefixes
      .replace(/^Number\s+\d+\s*/i, "")
      // Remove file extensions and codes
      .replace(/\s*Effects?\s*Of\d*[a-z]*\s*$/i, "")
      .replace(/\s*\.(pdf|doc|docx|txt)\s*$/i, "")
      // Clean up extra whitespace
      .replace(/\s+/g, " ")
      .trim()
  )
}

export async function getAllPosts(): Promise<BlogPostFrontmatter[]> {
  console.log("[v0] getAllPosts: Starting to fetch all posts...")
  const posts: BlogPostFrontmatter[] = [...SAMPLE_POSTS]
  console.log(`[v0] getAllPosts: Added ${SAMPLE_POSTS.length} hardcoded sample posts`)

  try {
    // Fetch blob storage content
    const { list } = await import("@vercel/blob")
    const blobs = await list({ prefix: BLOG_CONTENT_PATH })
    console.log(`[v0] getAllPosts: Found ${blobs.blobs.length} blob files`)

    for (const blob of blobs.blobs) {
      console.log(`[v0] getAllPosts: Processing blob: ${blob.pathname}`)
      try {
        const content = await fetchBlobContent(blob.downloadUrl)
        if (content) {
          const { data: frontmatter } = matter(content)
          console.log(`[v0] getAllPosts: Raw frontmatter for ${blob.pathname}:`, frontmatter)

          // Generate slug from filename
          const rawSlug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")
          const cleanSlug = cleanSlugFromFilename(rawSlug)

          const extractedTitle = extractTitleFromContent(content, rawSlug)
          const extractedExcerpt = extractExcerptFromContent(content, frontmatter)

          console.log(`[v0] getAllPosts: Extracted title: "${extractedTitle}" from ${blob.pathname}`)
          console.log(`[v0] getAllPosts: Extracted excerpt: "${extractedExcerpt.substring(0, 100)}..."`)

          const post: BlogPostFrontmatter = {
            title: extractedTitle,
            date: frontmatter.date || new Date().toISOString().split("T")[0],
            excerpt: extractedExcerpt,
            category: frontmatter.category || "General",
            image: getImageForBlobPost(extractedTitle, frontmatter),
            slug: cleanSlug,
          }

          console.log(`[v0] getAllPosts: Created post object:`, post)
          posts.push(post)
        } else {
          console.log(`[v0] getAllPosts: No content found for blob: ${blob.pathname}`)
        }
      } catch (error) {
        console.error(`[v0] getAllPosts: Error processing blob ${blob.pathname}:`, error)
      }
    }
  } catch (error) {
    console.error("[v0] getAllPosts: Error fetching from blob storage:", error)
  }

  console.log(`[v0] getAllPosts: Total posts before sorting: ${posts.length}`)
  // Sort by date (newest first)
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  console.log(`[v0] getAllPosts: Returning ${sortedPosts.length} sorted posts`)
  return sortedPosts
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[v0] getPostBySlug: Looking for post with slug: "${slug}"`)

  try {
    // First, try to find in blob storage
    const { list } = await import("@vercel/blob")
    const blobs = await list({ prefix: BLOG_CONTENT_PATH })
    console.log(`[v0] getPostBySlug: Searching through ${blobs.blobs.length} blob files`)

    for (const blob of blobs.blobs) {
      const rawSlug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")
      const cleanSlug = cleanSlugFromFilename(rawSlug)
      console.log(`[v0] getPostBySlug: Checking blob "${blob.pathname}" with clean slug "${cleanSlug}"`)

      if (cleanSlug === slug) {
        console.log(`[v0] getPostBySlug: Found matching blob for slug "${slug}"`)
        const content = await fetchBlobContent(blob.downloadUrl)
        if (content) {
          const { data: frontmatter, content: markdownContent } = matter(content)
          console.log(`[v0] getPostBySlug: Parsed blob content, frontmatter:`, frontmatter)

          const extractedTitle = extractTitleFromContent(content, rawSlug)
          const extractedExcerpt = extractExcerptFromContent(content, frontmatter)

          // Enhance the markdown content for consistent formatting
          const enhancedContent = enhanceMarkdownContent(markdownContent)
          const mdxSource = await serialize(enhancedContent)

          const post = {
            title: extractedTitle,
            date: frontmatter.date || new Date().toISOString().split("T")[0],
            excerpt: extractedExcerpt,
            category: frontmatter.category || "General",
            image: getImageForBlobPost(extractedTitle, frontmatter),
            slug: cleanSlug,
            content: mdxSource,
            rawContent: enhancedContent,
          }
          console.log(`[v0] getPostBySlug: Created blob post object with title: "${extractedTitle}"`)
          return post
        }
      }
    }
  } catch (error) {
    console.error(`[v0] getPostBySlug: Error fetching from blob storage for slug "${slug}":`, error)
  }

  // Fallback to hardcoded sample posts
  console.log(`[v0] getPostBySlug: Checking hardcoded sample posts for slug "${slug}"`)
  const samplePost = SAMPLE_POSTS.find((post) => post.slug === slug)
  if (samplePost) {
    console.log(`[v0] getPostBySlug: Found hardcoded sample post:`, samplePost)
    const content = SAMPLE_BLOG_CONTENT[slug]
    if (content) {
      console.log(`[v0] getPostBySlug: Found full content for hardcoded post "${slug}"`)
      const mdxSource = await serialize(content)
      const post = {
        ...samplePost,
        content: mdxSource,
        rawContent: content,
      }
      console.log(`[v0] getPostBySlug: Created hardcoded post object with full content`)
      return post
    } else {
      console.log(`[v0] getPostBySlug: No full content found for hardcoded post "${slug}", using generic content`)
      // Return sample post with generic content
      const genericContent = `# ${samplePost.title}

${samplePost.excerpt}

This is a sample blog post. The full content would be available in a production environment.

## Key Points

- Professional fitness coaching insights
- Evidence-based training approaches  
- Practical implementation strategies

*This content is part of our sample blog system.*`

      const mdxSource = await serialize(genericContent)
      const post = {
        ...samplePost,
        content: mdxSource,
        rawContent: genericContent,
      }
      console.log(`[v0] getPostBySlug: Created hardcoded post object with generic content`)
      return post
    }
  }

  console.log(`[v0] getPostBySlug: No post found for slug "${slug}"`)
  return null
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts()
  return posts.map((post) => post.slug)
}
