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
  author?: string
  keywords?: string[]
  readingTime?: string
}

export interface BlogPost {
  frontmatter: BlogPostFrontmatter
  serializedContent: any
  content: string
  slug: string
}

const BLOG_CONTENT_PATH = "blog/"

// Import all blog posts from separate files
const importBlogPosts = async () => {
  const posts = [
    (await import("@/content/blog/are-wearables-accurate-enough-to-track-complex-lifting-movements")).post,
    (await import("@/content/blog/tracking-biometrics-what-actually-moves-the-needle")).post,
    (await import("@/content/blog/google-sheets-for-coaching-trainers-secret-weapon-or-trap")).post,
    (await import("@/content/blog/how-to-get-more-clients-with-booking-page")).post,
    (await import("@/content/blog/top-5-free-personal-trainer-website-builders-2025")).post,
    (await import("@/content/blog/seo-tips-for-fitness-coaches-in-europe")).post,
  ]

  return posts
}

// Additional blog posts metadata (for posts without full content yet)
const ADDITIONAL_POSTS: BlogPostFrontmatter[] = [
  {
    title: "🚀 The Best Tools for Personal Trainers in Berlin 2025 Edition",
    date: "2025-01-15",
    excerpt:
      "Discover the cutting-edge tools and apps that are revolutionizing personal training in Berlin. From AI-powered workout planning to client management systems.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dumbbells2%20%281%29-hPgb1H1OGLxgKaz93OKKd1FIFW8a45.png",
    slug: "the-best-tools-for-personal-trainers-in-berlin-2025-edition-rocket",
    author: "Juice Team",
    keywords: [
      "personal trainer tools",
      "Berlin fitness",
      "fitness technology",
      "trainer apps",
      "fitness software",
      "Berlin personal training",
      "fitness business tools",
      "trainer productivity",
      "fitness coaching tools",
      "Berlin fitness industry",
    ],
    readingTime: "8 min read",
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
    author: "Juice Team",
    keywords: [
      "fitness software",
      "Berlin fitness tech",
      "trainer software",
      "fitness business software",
      "gym management software",
      "personal training software",
      "fitness apps Berlin",
      "trainer productivity tools",
      "fitness technology",
      "Berlin fitness industry",
    ],
    readingTime: "7 min read",
  },
  {
    title: "🥗 Nutrition Coaching Trends Taking Over Berlin in 2025",
    date: "2025-01-05",
    excerpt:
      "From personalized meal planning to AI-driven nutrition advice, discover the trends shaping how Berlin's fitness professionals approach nutrition coaching.",
    category: "Nutrition",
    image: "/nutrition-coaching-trends-berlin-woman-phone.png",
    slug: "nutrition-coaching-trends-berlin-2025",
    author: "Juice Team",
    keywords: [
      "nutrition coaching",
      "Berlin nutrition trends",
      "meal planning",
      "nutrition technology",
      "fitness nutrition",
      "Berlin fitness",
      "nutrition coaching software",
      "healthy eating Berlin",
      "nutrition coaching business",
      "fitness nutrition trends",
    ],
    readingTime: "6 min read",
  },
  {
    title: "🏋️ Strength Training Revolution: What's New in Berlin Gyms",
    date: "2024-12-28",
    excerpt:
      "Berlin's gym scene is evolving with new training methodologies, equipment innovations, and coaching techniques that are changing how we build strength.",
    category: "Fitness",
    image: "/strength-training-barbell-gym.png",
    slug: "strength-training-revolution-berlin-gyms",
    author: "Juice Team",
    keywords: [
      "strength training",
      "Berlin gyms",
      "fitness trends",
      "gym equipment",
      "strength coaching",
      "Berlin fitness scene",
      "powerlifting Berlin",
      "strength training techniques",
      "gym innovations",
      "fitness technology",
    ],
    readingTime: "5 min read",
  },
  {
    title: "🧠 The Psychology of Fitness: Mental Coaching Techniques",
    date: "2024-12-20",
    excerpt:
      "Explore the mental side of fitness coaching and learn techniques that help clients overcome psychological barriers to achieve their goals.",
    category: "Coaching",
    image: "/fitness-coaching-session.png",
    slug: "psychology-of-fitness-mental-coaching-techniques",
    author: "Juice Team",
    keywords: [
      "fitness psychology",
      "mental coaching",
      "fitness mindset",
      "coaching techniques",
      "fitness motivation",
      "sports psychology",
      "mental health fitness",
      "coaching psychology",
      "fitness behavior change",
      "personal training psychology",
    ],
    readingTime: "7 min read",
  },
]

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
async function fetchBlobContent(url: string): Promise<string> {
  console.log(`[fetchBlobContent] Attempting to fetch: ${url}`)

  // Try multiple methods to fetch the content
  const methods = [
    // Method 1: Direct fetch (for public blobs)
    () => fetch(url),

    // Method 2: Fetch with authorization header
    () =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${BLOB_TOKEN}`,
        },
      }),

    // Method 3: Fetch with different auth format
    () =>
      fetch(url, {
        headers: {
          Authorization: `token ${BLOB_TOKEN}`,
        },
      }),
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

  // Get slugs from local content files
  const localPosts = await importBlogPosts()
  const localSlugs = localPosts.map((post) => post.frontmatter.slug)

  // Add additional post slugs
  const additionalSlugs = ADDITIONAL_POSTS.map((post) => post.slug)

  const allSlugs = [...localSlugs, ...additionalSlugs]

  if (!BLOB_TOKEN) {
    console.log("[getPostSlugs] No BLOB_TOKEN, using local posts")
    return allSlugs
  }

  try {
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    const blobSlugs = blobs
      .filter((blob) => blob.pathname.endsWith(".md"))
      .map((blob) => blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, ""))

    // Combine and deduplicate
    const combinedSlugs = [...new Set([...allSlugs, ...blobSlugs])]
    console.log(`[getPostSlugs] Found ${combinedSlugs.length} total slugs`)
    return combinedSlugs
  } catch (error) {
    console.error("[getPostSlugs] Error fetching from blob storage, using local posts:", error)
    return allSlugs
  }
}

export async function getAllPosts(): Promise<BlogPostFrontmatter[]> {
  console.log("[getAllPosts] Fetching all blog posts...")

  // Get posts from local content files
  const localPosts = await importBlogPosts()
  const localPostsMetadata = localPosts.map((post) => post.frontmatter)

  // Combine with additional posts
  const allPosts = [...localPostsMetadata, ...ADDITIONAL_POSTS]

  if (!BLOB_TOKEN) {
    console.log("[getAllPosts] No BLOB_TOKEN, using local posts")
    return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  try {
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    console.log(`[getAllPosts] Found ${blobs.length} blobs with prefix ${BLOG_CONTENT_PATH}`)

    const blobPosts: BlogPostFrontmatter[] = []

    for (const blob of blobs) {
      if (blob.pathname.endsWith(".md")) {
        console.log(`[getAllPosts] Processing blob: ${blob.pathname}`)

        try {
          const fileContents = await fetchBlobContent(blob.url)
          const slug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")

          // Skip if we already have this post locally
          if (allPosts.some((post) => post.slug === slug)) {
            continue
          }

          const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
          const extracted = extractTitleAndExcerpt(content)

          const title = data.title || extracted.title || `Post: ${slug}`
          const excerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."

          blobPosts.push({
            title: title,
            date: data.date || new Date().toISOString().split("T")[0],
            category: data.category || "Uncategorized",
            excerpt: excerpt,
            image: data.image || undefined,
            slug: slug,
            author: data.author || "Juice Team",
            keywords: data.keywords || [],
            readingTime: data.readingTime || "5 min read",
          })
        } catch (error) {
          console.error(`[getAllPosts] Error processing blob ${blob.pathname}:`, error)
          continue
        }
      }
    }

    const combinedPosts = [...allPosts, ...blobPosts]
    combinedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    console.log(`[getAllPosts] Successfully processed ${combinedPosts.length} total posts`)
    return combinedPosts
  } catch (error) {
    console.error("[getAllPosts] Error fetching from blob storage, using local posts:", error)
    return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[getPostBySlug] Attempting to fetch post with slug: ${slug}`)

  // Check local content files first
  try {
    const localPosts = await importBlogPosts()
    const localPost = localPosts.find((post) => post.frontmatter.slug === slug)

    if (localPost) {
      console.log(`[getPostBySlug] Found local post for slug: ${slug}`)

      const serializedContent = await serialize(localPost.content, {
        parseFrontmatter: false,
      })

      return {
        frontmatter: localPost.frontmatter,
        serializedContent,
        content: localPost.content,
        slug: slug,
      }
    }
  } catch (error) {
    console.error(`[getPostBySlug] Error loading local post ${slug}:`, error)
  }

  // Check if it's in additional posts (metadata only)
  const additionalPost = ADDITIONAL_POSTS.find((post) => post.slug === slug)
  if (additionalPost) {
    console.log(`[getPostBySlug] Found additional post metadata for slug: ${slug}`)

    // Create placeholder content for posts without full content
    const placeholderContent = `# ${additionalPost.title}

${additionalPost.excerpt}

---

*This article is coming soon. Check back later for the full content.*

In the meantime, explore our other articles or [contact us](mailto:hello@juice.fitness) if you have specific questions about this topic.`

    const serializedContent = await serialize(placeholderContent, {
      parseFrontmatter: false,
    })

    return {
      frontmatter: additionalPost,
      serializedContent,
      content: placeholderContent,
      slug: slug,
    }
  }

  // Try blob storage if available
  if (!BLOB_TOKEN) {
    console.error("[getPostBySlug] BLOB_READ_WRITE_TOKEN is not set and no local content found")
    return null
  }

  try {
    const targetPath = `${BLOG_CONTENT_PATH}${slug}.md`
    console.log(`[getPostBySlug] Target blob path: ${targetPath}`)

    const { blobs } = await list({ prefix: targetPath, token: BLOB_TOKEN })
    const targetBlob = blobs.find((b) => b.pathname === targetPath)

    if (!targetBlob) {
      console.warn(`[getPostBySlug] No blob found for path: ${targetPath}`)
      return null
    }

    const fileContents = await fetchBlobContent(targetBlob.url)
    const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
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
        author: data.author || "Juice Team",
        keywords: data.keywords || [],
        readingTime: data.readingTime || "5 min read",
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
