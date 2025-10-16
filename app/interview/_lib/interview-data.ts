import { list } from "@vercel/blob"
import matter from "gray-matter"

export interface InterviewFrontmatter {
  title: string
  date: string
  excerpt: string
  category: string
  image?: string
  slug: string
  trainerName: string
  readTime?: number
  featured?: boolean
  tags?: string[]
}

export interface Interview extends InterviewFrontmatter {
  content: string // Changed from any to string to hold raw markdown source
  rawContent: string
}

const sampleInterviews: Interview[] = [
  {
    slug: "lena-strength-lab-vienna",
    title: "PT Spotlight: Lena from Strength Lab Vienna",
    date: "2024-12-15",
    excerpt:
      "Meet Lena, a personal trainer from Vienna who specializes in strength training and functional fitness. Learn about her journey and training philosophy.",
    category: "Interview",
    trainerName: "Lena",
    image: "/lena-gym-photo.png",
    readTime: 8,
    featured: true,
    tags: ["Strength Training", "Functional Fitness"],
    content: "# PT Spotlight: Lena from Strength Lab Vienna\n\nSample interview content...",
    rawContent: "# PT Spotlight: Lena from Strength Lab Vienna\n\nSample interview content...",
  },
]

export async function getAllInterviews(): Promise<InterviewFrontmatter[]> {
  try {
    const { blobs } = await list({
      prefix: "interviews/",
    })

    if (blobs.length === 0) {
      console.log("[v0] No interviews found in Blob storage, using sample data")
      return sampleInterviews.map(({ content, rawContent, ...frontmatter }) => frontmatter)
    }

    const interviews = await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" })
        const text = await response.text()
        const { data } = matter(text)

        const slug = blob.pathname.replace("interviews/", "").replace(".md", "")

        return {
          slug,
          title: data.title || "Untitled Interview",
          date: data.date || new Date().toISOString().split("T")[0],
          excerpt: data.excerpt || "",
          category: data.category || "Interview",
          image: data.image,
          trainerName: data.trainerName || "Unknown Trainer",
          readTime: data.readTime,
          featured: data.featured,
          tags: data.tags,
        } as InterviewFrontmatter
      }),
    )

    return interviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("[v0] Error fetching interviews from Blob:", error)
    return sampleInterviews.map(({ content, rawContent, ...frontmatter }) => frontmatter)
  }
}

// Function to clean slug from filename (same as admin API)
function cleanSlugFromFilename(filename: string): string {
  return filename
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/g, "")
    .replace(/-\d{10,}/g, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}

export async function getInterviewBySlug(slug: string): Promise<Interview | null> {
  try {
    console.log(`[v0] Fetching interview: ${slug}`)

    // First try exact match (for backward compatibility)
    let { blobs } = await list({
      prefix: `interviews/${slug}.md`,
    })

    console.log(`[v0] Found ${blobs.length} blobs for exact match: ${slug}`)

    // If no exact match, try flexible matching like admin API
    if (blobs.length === 0) {
      const allBlobs = await list({ prefix: "interviews/" })
      console.log(`[v0] Trying flexible matching for ${slug}`)
      
      const matchingBlob = allBlobs.blobs.find((blob) => {
        if (!blob.pathname.endsWith(".md")) return false
        
        const rawSlug = blob.pathname.replace("interviews/", "").replace(/\.md$/, "")
        const cleanedSlug = cleanSlugFromFilename(rawSlug)
        
        console.log(`[v0] Comparing "${cleanedSlug}" with "${slug}"`)
        
        return (
          cleanedSlug === slug ||
          rawSlug === slug ||
          blob.pathname.includes(slug) ||
          rawSlug.includes(slug) ||
          slug.includes(cleanedSlug) ||
          slug.includes(rawSlug)
        )
      })
      
      if (matchingBlob) {
        blobs = [matchingBlob]
        console.log(`[v0] Found matching blob: ${matchingBlob.pathname}`)
      }
    }
    
    if (blobs.length === 0) {
      console.log(`[v0] Interview not found in Blob: ${slug}, checking sample data`)
      const sampleInterview = sampleInterviews.find((i) => i.slug === slug)
      return sampleInterview || null
    }

    const blob = blobs[0]
    console.log(`[v0] Fetching blob from URL: ${blob.url}`)

    const response = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" })
    const text = await response.text()

    console.log(`[v0] Fetched text length: ${text.length}`)

    const { data, content } = matter(text)

    console.log(`[v0] Parsed frontmatter:`, data)
    console.log(`[v0] Content length: ${content.length}`)

    return {
      slug,
      title: data.title || "Untitled Interview",
      date: data.date || new Date().toISOString().split("T")[0],
      excerpt: data.excerpt || "",
      category: data.category || "Interview",
      image: data.image,
      trainerName: data.trainerName || "Unknown Trainer",
      readTime: data.readTime,
      featured: data.featured,
      tags: data.tags,
      content: content, // Passing raw markdown string
      rawContent: content,
    }
  } catch (error) {
    console.error(`[v0] Error fetching interview ${slug}:`, error)
    const sampleInterview = sampleInterviews.find((i) => i.slug === slug)
    return sampleInterview || null
  }
}

export async function getInterviewSlugs(): Promise<string[]> {
  try {
    const { blobs } = await list({
      prefix: "interviews/",
    })

    if (blobs.length === 0) {
      return sampleInterviews.map((i) => i.slug)
    }

    return blobs.map((blob) => blob.pathname.replace("interviews/", "").replace(".md", ""))
  } catch (error) {
    console.error("[v0] Error fetching interview slugs:", error)
    return sampleInterviews.map((i) => i.slug)
  }
}
