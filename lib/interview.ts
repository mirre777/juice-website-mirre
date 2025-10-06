import { serialize } from "next-mdx-remote/serialize"
import matter from "gray-matter"

export interface InterviewFrontmatter {
  title: string
  date: string
  excerpt: string
  category: string
  image?: string
  slug: string
  trainerName: string // Name of the trainer being interviewed
}

export interface Interview extends InterviewFrontmatter {
  content: any
  rawContent: string
}

const SAMPLE_INTERVIEWS: InterviewFrontmatter[] = [
  {
    title: "PT Spotlight: Lena from Strength Lab Vienna — From Brain to Barbell",
    date: "2025-01-20",
    excerpt:
      "In our latest Juice PT Spotlight, we talk to Lena from Strength Lab Vienna about how she went from brain-focused to body-strong, why resistance training is non-negotiable, and what most trainers underestimate about their clients.",
    category: "Interview",
    image: "/lena-gym-photo.png",
    slug: "lena-strength-lab-vienna",
    trainerName: "Lena from Strength Lab Vienna",
  },
  {
    title: "Building a Successful Personal Training Business in Berlin",
    date: "2025-01-15",
    excerpt:
      "Meet Sarah, a personal trainer who built a thriving business in Berlin. Learn her strategies for client acquisition, retention, and scaling.",
    category: "Interview",
    image: "/fitness-coaching-session.png",
    slug: "building-successful-pt-business-berlin-sarah",
    trainerName: "Sarah Johnson",
  },
]

const SAMPLE_INTERVIEW_CONTENT: Record<string, string> = {
  "lena-strength-lab-vienna": `# PT Spotlight: Lena from Strength Lab Vienna — From Brain to Barbell

In our latest Juice PT Spotlight, we talk to Lena from Strength Lab Vienna about how she went from brain-focused to body-strong, why resistance training is non-negotiable, and what most trainers underestimate about their clients.

## What first made you want to coach people? Was there a specific turning point or frustration that pushed you into it?

**Lena:**

I started coaching because I became obsessed with weightlifting myself. For most of my life, I was very brain-focused and kind of neglected my body. It was just a vessel for my mind.

Over time, I realized how deeply our thinking is embedded in the body — and how important it is to live in a strong, healthy one. Now I can't imagine it being otherwise.

Because I'm quite research-driven, I dove deep into the science behind training. I'd spend hours each week reading studies on hypertrophy, recovery, and programming. After a while, I naturally started training friends. Eventually, I decided to get certified and turn it into my profession.

If my origin story were a headline, it would be something like: **"From brain in a vat to embodied thinker."**

![Lena training at Strength Lab Vienna](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2825_edited-HjKol7kTNQx9l5U9rBRa4HCGL3e1g2.png)

## What's something you believed early on about training that now makes you laugh?

**Lena:**

I used to think that training was optional — something "nice to have" if you happen to enjoy it.

Now I see resistance training as **fundamental to a high-quality life**. Muscle mass naturally declines with age, and the only way to fight that is to use it and train it.

It's not about flashy supplements or longevity hacks. It's the basics: sleep well, manage stress, and lift heavy weights. That's what truly supports aging well.

## Looking back, what did you totally underestimate about being a personal trainer?

**Lena:**

Scheduling chaos. One flaky client can take up more time than three consistent ones.

I definitely underestimated how much mental energy goes into the logistics side of the job.

## Who's the exact person you help best? Picture one client and describe them.

**Lena:**

The people I help best are those who've realized that resistance training isn't optional anymore — they want to make it a consistent part of their lives.

I especially love training people in their 60s and 70s. That's where you can make truly dramatic changes. Someone at that age can still gain a lot of muscle and independence through strength training. It completely changes how they move in the world.

## What do you think most coaches get wrong about helping those clients?

**Lena:**

A lot of coaches set the bar too low. Older clients—or women who don't come in with an athlete mindset—are often treated as if they're fragile. But they're capable of much more than most realize. If you treat people like athletes, they start acting and performing like athletes.

## What's your signature move or principle that your clients often quote back to you?

**Lena:**

I'm very passionate about the science behind weightlifting, so my sessions often turn into friendly debates about research. I'll bring up new studies, or times when I've changed my mind about something. My clients end up learning the why behind what they do, and that makes training a lot more engaging. So I guess my "signature move" is talking about evidence while people are under a barbell.

## What's something you stopped doing that immediately made your clients better?

**Lena:**

I stopped using spreadsheets.

I used to send clients Google Sheets to log their workouts. Now, I use the Juice app. It lets them track progress directly in a clean, structured way — no awkward scrolling in the middle of a workout.

It's just a better experience for them, and I can still design my programs in spreadsheets behind the scenes. It was a small switch that made a big difference.

## If you could give advice to yourself as a brand-new trainer, what would it be?

**Lena:**

Start building your social presence earlier.

I'm not naturally someone who likes self-promotion or brand building, but it's a crucial part of helping people discover you. Word of mouth is great, but if you want to reach those who aren't already convinced about strength training, you need to show up where they are — and that means being visible online.

## What's one popular belief or trend in fitness you think is flat-out wrong—and what should replace it?

**Lena:**

The whole conversation around dieting is too black and white.

Some people act like it's purely a matter of willpower; others say it's all biology. The truth sits in the middle. People have different biological setups, drives, and histories — so what's easy for one person can be incredibly hard for another.

We need to talk about it with more nuance and less judgment.

## If every potential client read one sentence from this interview, what would you want it to be?

**Lena:**

**"Strength isn't a hobby — it's the foundation for living well in your body, at any age."**

---

**Find Lena at:** [Strength Lab Vienna](https://strengthlabvienna.com)

**Want to be featured in our next PT Spotlight?** Apply via crew@juice.fitness`,
  "building-successful-pt-business-berlin-sarah": `# Building a Successful Personal Training Business in Berlin

Meet Sarah Johnson, a personal trainer who built a thriving business in Berlin over the past 5 years. In this interview, she shares her strategies for client acquisition, retention, and scaling.

## Background

**Q: Tell us about your journey into personal training.**

A: I started as a fitness enthusiast and gradually realized I wanted to help others achieve their goals. After getting certified, I began training clients in local gyms before eventually building my own client base.

## Client Acquisition

**Q: What strategies worked best for getting your first clients?**

A: Word of mouth was huge. I also leveraged social media, particularly Instagram, to showcase client transformations and share fitness tips. Offering free consultation sessions helped convert leads into paying clients.

## Business Growth

**Q: How did you scale from solo trainer to running a business?**

A: I focused on systems and processes. Using tools like Juice helped me manage client programs, track progress, and automate scheduling. This freed up time to take on more clients and eventually hire other trainers.

## Advice for New Trainers

**Q: What advice would you give to someone starting out?**

A: Start with a clear niche. Don't try to be everything to everyone. Build genuine relationships with your clients, and invest in tools that make your life easier. Most importantly, never stop learning and improving your craft.`,
}

const INTERVIEW_CONTENT_PATH = "interviews/"

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

function extractTitleFromContent(content: string, filename: string): string {
  const { data: frontmatter, content: markdownContent } = matter(content)
  if (frontmatter.title) {
    return frontmatter.title.trim()
  }

  const headingMatch = markdownContent.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return headingMatch[1].trim()
  }

  const cleanName = filename
    .replace(/\.md$/, "")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim()

  return cleanName || "Untitled Interview"
}

function extractExcerptFromContent(content: string, frontmatter: any): string {
  if (frontmatter.excerpt || frontmatter.description) {
    return frontmatter.excerpt || frontmatter.description
  }

  const { content: markdownContent } = matter(content)
  const paragraphs = markdownContent
    .replace(/^#.+$/gm, "")
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 50)

  if (paragraphs.length > 0) {
    const excerpt = paragraphs[0].substring(0, 200)
    return excerpt.length < paragraphs[0].length ? excerpt + "..." : excerpt
  }

  return "Discover insights from successful fitness professionals."
}

function getImageForInterview(title: string, frontmatter: any): string {
  if (title.includes("Lena") && title.includes("Strength Lab Vienna")) {
    return "/lena-gym-photo.png"
  }

  if (frontmatter.image) {
    return frontmatter.image
  }
  return "/fitness-coaching-session.png"
}

export async function getAllInterviews(): Promise<InterviewFrontmatter[]> {
  const interviews: InterviewFrontmatter[] = [...SAMPLE_INTERVIEWS]
  const errors: string[] = []

  const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"
  const hasBlobToken = process.env.BLOB_READ_WRITE_TOKEN

  if (isBuildTime && !hasBlobToken) {
    console.log("Build time detected without blob token - returning sample interviews only")
    return interviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  if (!hasBlobToken) {
    console.log("No BLOB_READ_WRITE_TOKEN available - returning sample interviews only")
    return interviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  console.log(`[v0] getAllInterviews: Starting blob fetch at ${new Date().toISOString()}`)

  try {
    const { list } = await import("@vercel/blob")
    const blobs = await list({ prefix: INTERVIEW_CONTENT_PATH })

    console.log(`[v0] getAllInterviews: Found ${blobs.blobs.length} interview blobs in storage`)

    for (const blob of blobs.blobs) {
      try {
        const content = await fetchBlobContent(blob.downloadUrl)
        if (content) {
          const { data: frontmatter } = matter(content)
          const rawSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
          const cleanSlug = cleanSlugFromFilename(rawSlug)
          const extractedTitle = extractTitleFromContent(content, rawSlug)
          const extractedExcerpt = extractExcerptFromContent(content, frontmatter)

          const interview: InterviewFrontmatter = {
            title: extractedTitle,
            date: frontmatter.date || new Date().toISOString().split("T")[0],
            excerpt: extractedExcerpt,
            category: "Interview",
            image: getImageForInterview(extractedTitle, frontmatter),
            slug: cleanSlug,
            trainerName: frontmatter.trainerName || extractedTitle.split(" ")[0],
          }

          interviews.push(interview)
          console.log(`[v0] getAllInterviews: Added interview "${extractedTitle}" with slug "${cleanSlug}"`)
        }
      } catch (error) {
        const errorMessage = `Error processing interview blob ${blob.pathname}: ${error instanceof Error ? error.message : "Unknown error"}`
        console.error(errorMessage)
        errors.push(errorMessage)
      }
    }
  } catch (error) {
    const errorMessage = `Error fetching interviews from blob storage: ${error instanceof Error ? error.message : "Unknown error"}`
    console.error(errorMessage)
    errors.push(errorMessage)
  }

  return interviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getInterviewBySlug(slug: string): Promise<Interview | null> {
  console.log("[v0] getInterviewBySlug called with slug:", slug)

  const hasBlobToken = process.env.BLOB_READ_WRITE_TOKEN

  if (hasBlobToken) {
    try {
      const { list } = await import("@vercel/blob")
      const blobs = await list({ prefix: INTERVIEW_CONTENT_PATH })

      for (const blob of blobs.blobs) {
        const rawSlug = blob.pathname.replace(INTERVIEW_CONTENT_PATH, "").replace(/\.md$/, "")
        const cleanSlug = cleanSlugFromFilename(rawSlug)

        if (cleanSlug === slug) {
          console.log("[v0] Found interview blob for slug:", slug)
          const content = await fetchBlobContent(blob.downloadUrl)
          if (content) {
            const { data: frontmatter, content: markdownContent } = matter(content)
            const extractedTitle = extractTitleFromContent(content, rawSlug)
            const extractedExcerpt = extractExcerptFromContent(content, frontmatter)
            const mdxSource = await serialize(markdownContent)

            return {
              title: extractedTitle,
              date: frontmatter.date || new Date().toISOString().split("T")[0],
              excerpt: extractedExcerpt,
              category: "Interview",
              image: getImageForInterview(extractedTitle, frontmatter),
              slug: cleanSlug,
              trainerName: frontmatter.trainerName || extractedTitle.split(" ")[0],
              content: mdxSource,
              rawContent: markdownContent,
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching interview from blob storage for slug "${slug}":`, error)
    }
  }

  const sampleInterview = SAMPLE_INTERVIEWS.find((interview) => interview.slug === slug)
  if (sampleInterview) {
    const content = SAMPLE_INTERVIEW_CONTENT[slug]
    if (content) {
      const mdxSource = await serialize(content)
      return {
        ...sampleInterview,
        content: mdxSource,
        rawContent: content,
      }
    }
  }

  return null
}

export async function getInterviewSlugs(): Promise<string[]> {
  const interviews = await getAllInterviews()
  return interviews.map((interview) => interview.slug)
}

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
