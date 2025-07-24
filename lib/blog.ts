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

// Sample blog posts for when blob storage is not available (like in v0)
const SAMPLE_POSTS: BlogPostFrontmatter[] = [
  {
    title: "🚀 The Best Tools for Personal Trainers in Berlin 2025 Edition",
    date: "2025-01-15",
    excerpt:
      "Discover the cutting-edge tools and apps that are revolutionizing personal training in Berlin. From AI-powered workout planning to client management systems.",
    category: "Technology",
    slug: "the-best-tools-for-personal-trainers-in-berlin-2025-edition-rocket",
  },
  {
    title: "💻 Top Fitness Software in Berlin 2025 (Because Spreadsheets Are So Last Year)",
    date: "2025-01-10",
    excerpt:
      "Say goodbye to Excel hell! Discover the modern software solutions that Berlin's top fitness professionals are using to streamline their businesses and wow their clients.",
    category: "Technology",
    slug: "top-fitness-software-in-berlin-2025-because-spreadsheets-are-so-last-year",
  },
  {
    title: "🥗 Nutrition Coaching Trends Taking Over Berlin in 2025",
    date: "2025-01-05",
    excerpt:
      "From personalized meal planning to AI-driven nutrition advice, discover the trends shaping how Berlin's fitness professionals approach nutrition coaching.",
    category: "Nutrition",
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

const SAMPLE_BLOG_CONTENT = {
  "the-best-tools-for-personal-trainers-in-berlin-2025-edition-rocket": `# 🚀 The Best Tools for Personal Trainers in Berlin 2025 Edition

**TL;DR:** The fitness industry in Berlin is embracing technology like never before. Here are the essential tools every personal trainer needs to stay competitive in 2025.

## The Digital Revolution in Fitness

Berlin's fitness scene has always been innovative, but 2025 marks a turning point. Personal trainers are no longer just fitness experts—they're tech-savvy professionals leveraging cutting-edge tools to deliver exceptional client experiences.

## Essential Tools for Modern Trainers

### 1. AI-Powered Workout Planning
- **Juice App**: The leading platform for personalized workout creation
- **FitBot AI**: Automated program adjustments based on client progress
- **TrainerGPT**: Natural language workout planning assistant

### 2. Client Management Systems
- **MyFitnessPal Pro**: Comprehensive nutrition and workout tracking
- **Trainerize**: All-in-one client management platform
- **TrueCoach**: Professional-grade coaching software

### 3. Virtual Training Platforms
- **Zoom Fitness**: Specialized video conferencing for trainers
- **Mirror Home**: Interactive home workout experiences
- **Peloton Digital**: Corporate wellness partnerships

## The Berlin Advantage

Berlin's tech ecosystem provides unique opportunities for fitness professionals. The city's startup culture has produced innovative solutions specifically designed for the European market.

### Local Success Stories
- **Urban Sports Club**: Flexible gym memberships
- **Freeletics**: Bodyweight training app
- **8fit**: Personalized fitness and nutrition

## Implementation Strategy

1. **Start Small**: Choose one primary tool and master it
2. **Client Feedback**: Let your clients guide your tech adoption
3. **Continuous Learning**: Stay updated with the latest features
4. **Integration**: Ensure your tools work together seamlessly

## ROI Analysis

Trainers using these tools report:
- 40% increase in client retention
- 60% reduction in administrative time
- 25% growth in revenue per client

## Conclusion

The future of personal training in Berlin is digital. Trainers who embrace these tools now will lead the industry tomorrow. The investment in technology pays dividends in client satisfaction, business efficiency, and professional growth.

*Ready to upgrade your training business? Start with the Juice App and experience the difference technology can make.*`,

  "top-fitness-software-in-berlin-2025-because-spreadsheets-are-so-last-year": `# 💻 Top Fitness Software in Berlin 2025 (Because Spreadsheets Are So Last Year)

**TL;DR:** If you're still managing your fitness business with spreadsheets, you're living in the past. Here's the software that's actually worth your time and money in 2025.

## Why Spreadsheets Don't Cut It Anymore

Let's be honest—we've all been there. Rows and columns of client data, workout plans scattered across multiple tabs, and that sinking feeling when you realize you've been working with outdated information for weeks.

Berlin's fitness industry has evolved beyond the spreadsheet era. Here's what the pros are actually using.

## The Software Revolution

### Business Management
**Juice Platform** - The all-in-one solution
- Client management that actually makes sense
- Automated billing (no more chasing payments!)
- Real-time analytics that matter
- German GDPR compliance built-in

**Mindbody** - The established player
- Comprehensive booking system
- Payment processing
- Marketing automation
- Mobile app for clients

### Workout Programming
**TrainerRoad** - For cycling specialists
- Structured training plans
- Power-based workouts
- Performance analytics

**MyLift** - Strength training focus
- Exercise database with video demos
- Progress tracking
- Custom program builder

### Nutrition Coaching
**Cronometer** - Precision nutrition
- Detailed micronutrient tracking
- Professional dashboard
- Client progress monitoring

**Precision Nutrition** - Education + software
- Coaching certification
- Client management tools
- Habit-based approach

## The Berlin Ecosystem

What makes Berlin special? The city's tech scene has produced fitness software that actually understands European business needs:

- **GDPR compliance** isn't an afterthought
- **Multi-language support** for Berlin's diverse population
- **Local payment methods** (SEPA, Sofort, etc.)
- **European business practices** built into workflows

## Cost-Benefit Analysis

| Software Type | Monthly Cost | Time Saved | ROI Timeline |
|---------------|-------------|------------|--------------|
| All-in-one Platform | €50-200 | 15 hours | 2 months |
| Specialized Tools | €20-80 each | 5-10 hours | 3-4 months |
| DIY Spreadsheets | €0 | -20 hours | Never |

## Implementation Roadmap

### Month 1: Foundation
- Choose your primary business management platform
- Migrate client data (do this carefully!)
- Set up basic workflows

### Month 2: Optimization  
- Add specialized tools for your niche
- Train your team on new systems
- Gather client feedback

### Month 3: Scaling
- Automate repetitive tasks
- Analyze performance data
- Plan for growth

## Red Flags to Avoid

❌ **Software that promises everything** - Jack of all trades, master of none
❌ **No mobile app** - Your clients live on their phones
❌ **Poor customer support** - You'll need help, trust me
❌ **No data export** - Don't get locked in
❌ **Ignores GDPR** - Legal nightmare waiting to happen

## The Bottom Line

Your time is worth more than the cost of good software. While your competitors are still wrestling with Excel formulas, you could be focusing on what actually matters: helping your clients achieve their goals.

The fitness industry in Berlin is competitive. The trainers who win are the ones who work smarter, not harder.

*Ready to ditch the spreadsheets? Start with a free trial of the Juice Platform and see what modern fitness business management looks like.*`,

  "nutrition-coaching-trends-berlin-2025": `# 🥗 Nutrition Coaching Trends Taking Over Berlin in 2025

**TL;DR:** Berlin's nutrition coaching scene is evolving rapidly. Here are the trends that are actually making a difference for clients and coaches alike.

## The New Nutrition Landscape

Gone are the days of one-size-fits-all meal plans. Berlin's diverse population demands personalized, culturally-aware nutrition coaching that goes beyond basic calorie counting.

## Trend #1: Personalized Nutrition Technology

### AI-Powered Meal Planning
- **Nutrigenomics integration**: DNA-based dietary recommendations
- **Real-time adjustments**: Plans that adapt to client progress
- **Cultural preferences**: Algorithms that understand Berlin's multicultural food scene

### Popular Tools
- **Cronometer Pro**: Micronutrient precision
- **MyFitnessPal Premium**: Enhanced coaching features  
- **Nutrition.ai**: AI-powered meal suggestions

## Trend #2: Sustainable Eating Practices

Berlin's environmental consciousness is reshaping nutrition coaching:

### Plant-Forward Approaches
- **Flexitarian protocols**: Reducing meat without elimination
- **Local sourcing**: Emphasis on regional, seasonal foods
- **Waste reduction**: Meal planning that minimizes food waste

### Impact Metrics
- 30% reduction in client food waste
- 25% increase in plant protein consumption
- 40% improvement in meal satisfaction scores

## Trend #3: Mental Health Integration

### Mindful Eating Practices
- **Stress-eating management**: Techniques for emotional regulation
- **Body image work**: Positive relationship with food
- **Habit psychology**: Understanding the 'why' behind eating patterns

### Coaching Techniques
- **Motivational interviewing**: Client-centered approach
- **Cognitive behavioral strategies**: Changing thought patterns
- **Mindfulness training**: Present-moment awareness

## Trend #4: Precision Nutrition

### Biomarker-Based Coaching
- **Continuous glucose monitoring**: Real-time metabolic feedback
- **Microbiome analysis**: Gut health optimization
- **Hormone testing**: Personalized macronutrient ratios

### Technology Integration
- **Wearable devices**: Sleep, stress, and activity correlation
- **Lab partnerships**: Regular biomarker tracking
- **Data visualization**: Making complex data actionable

## The Berlin Advantage

### Cultural Diversity
Berlin's international population creates unique opportunities:
- **Multi-cultural meal planning**: Respecting diverse food traditions
- **Language accessibility**: Coaching in multiple languages
- **Community building**: Group coaching across cultures

### Local Food Scene
- **Farmer's market partnerships**: Fresh, local ingredients
- **Restaurant collaborations**: Healthy dining options
- **Cooking classes**: Practical skill development

## Implementation for Coaches

### Getting Started
1. **Assess your current approach**: What's working, what isn't?
2. **Choose your focus**: Pick 1-2 trends to implement first
3. **Invest in education**: Stay current with certifications
4. **Technology adoption**: Start with one new tool

### Client Communication
- **Explain the 'why'**: Help clients understand the science
- **Set realistic expectations**: Change takes time
- **Celebrate small wins**: Acknowledge progress
- **Provide ongoing support**: Be available for questions

## Measuring Success

### Key Performance Indicators
- **Client adherence rates**: Are they following the plan?
- **Health improvements**: Biomarker changes
- **Satisfaction scores**: Client feedback
- **Retention rates**: Long-term engagement

### Tools for Tracking
- **Progress photos**: Visual documentation
- **Body composition analysis**: Beyond the scale
- **Energy level assessments**: Subjective wellness measures
- **Sleep quality metrics**: Recovery indicators

## Common Pitfalls to Avoid

❌ **Over-complicating**: Keep it simple and actionable
❌ **Ignoring preferences**: Respect client food choices
❌ **Lack of flexibility**: Plans must adapt to real life
❌ **Poor follow-up**: Consistent check-ins are crucial

## The Future of Nutrition Coaching

Looking ahead, we can expect:
- **More personalization**: Individual genetic profiles
- **Better integration**: Seamless tech ecosystems
- **Preventive focus**: Health optimization vs. problem-solving
- **Community emphasis**: Group support systems

## Conclusion

The nutrition coaching landscape in Berlin is more exciting than ever. Coaches who embrace these trends while maintain a client-centered approach will thrive in 2025 and beyond.

The key is balance: leverage technology and science while never forgetting that nutrition is deeply personal and cultural.

*Ready to elevate your nutrition coaching? Start by implementing one trend that resonates with your coaching style and client needs.*`,
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
  console.log("[getAllPosts] Fetching all blog posts...")

  if (!BLOB_TOKEN) {
    console.log("[getAllPosts] No BLOB_TOKEN, using sample posts")
    return SAMPLE_POSTS
  }

  try {
    const { blobs } = await list({ prefix: BLOG_CONTENT_PATH, token: BLOB_TOKEN })
    console.log(`[getAllPosts] Found ${blobs.length} blobs with prefix ${BLOG_CONTENT_PATH}`)

    const posts: BlogPostFrontmatter[] = []

    for (const blob of blobs) {
      if (blob.pathname.endsWith(".md")) {
        console.log(`[getAllPosts] Processing blob: ${blob.pathname}`)

        try {
          const fileContents = await fetchBlobContent(blob.url)
          console.log(`[getAllPosts] Fetched content length: ${fileContents.length} chars`)

          const slug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")

          console.log(`[getAllPosts] Extracted slug: ${slug}`)

          const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })

          const extracted = extractTitleAndExcerpt(content)

          const title = data.title || extracted.title || `Post: ${slug}`
          const excerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."

          console.log(`[getAllPosts] Processed post - Title: ${title}, Excerpt length: ${excerpt.length}`)

          posts.push({
            title: title,
            date: data.date || new Date().toISOString().split("T")[0],
            category: data.category || "Uncategorized",
            excerpt: excerpt,
            image: data.image || undefined,
            slug: slug,
          })
        } catch (error) {
          console.error(`[getAllPosts] Error processing blob ${blob.pathname}:`, error)
          continue
        }
      }
    }

    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    console.log(`[getAllPosts] Successfully processed ${posts.length} posts from blob storage`)
    return posts.length > 0 ? posts : SAMPLE_POSTS
  } catch (error) {
    console.error("[getAllPosts] Error fetching from blob storage, falling back to samples:", error)
    return SAMPLE_POSTS
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[getPostBySlug] Attempting to fetch post with slug: ${slug}`)

  // Check if we have sample content for this slug
  if (!BLOB_TOKEN || SAMPLE_BLOG_CONTENT[slug]) {
    console.log(`[getPostBySlug] Using sample content for slug: ${slug}`)

    const samplePost = SAMPLE_POSTS.find((post) => post.slug === slug)
    const sampleContent = SAMPLE_BLOG_CONTENT[slug]

    if (samplePost && sampleContent) {
      const serializedContent = await serialize(sampleContent, {
        parseFrontmatter: false,
      })

      return {
        frontmatter: samplePost,
        serializedContent,
        content: sampleContent,
        slug: slug,
      }
    }
  }

  if (!BLOB_TOKEN) {
    console.error("[getPostBySlug] BLOB_READ_WRITE_TOKEN is not set and no sample content found")
    return null
  }

  try {
    const targetPath = `${BLOG_CONTENT_PATH}${slug}.md`
    console.log(`[getPostBySlug] Target blob path: ${targetPath}`)

    const { blobs } = await list({ prefix: targetPath, token: BLOB_TOKEN })
    const targetBlob = blobs.find((b) => b.pathname === targetPath)

    if (!targetBlob) {
      console.warn(`[getPostBySlug] No blob found for path: ${targetPath}`)
      console.log(
        `[getPostBySlug] Available blobs:`,
        blobs.map((b) => b.pathname),
      )
      return null
    }

    console.log(`[getPostBySlug] Found blob: ${targetBlob.pathname}, URL: ${targetBlob.url}`)

    const fileContents = await fetchBlobContent(targetBlob.url)
    console.log(`[getPostBySlug] Fetched file contents length: ${fileContents.length} chars`)
    console.log(`[getPostBySlug] Content preview: ${fileContents.substring(0, 200)}...`)

    const { data, content, excerpt: matterExcerpt } = matter(fileContents, { excerpt: true })
    console.log(`[getPostBySlug] Frontmatter:`, data)
    console.log(`[getPostBySlug] Content length after frontmatter: ${content.length} chars`)

    const extracted = extractTitleAndExcerpt(content)
    console.log(
      `[getPostBySlug] Extracted title: "${extracted.title}", excerpt: "${extracted.excerpt?.substring(0, 100)}..."`,
    )

    const title = data.title || extracted.title || `Post: ${slug}`
    const excerpt = data.excerpt || matterExcerpt || extracted.excerpt || "No excerpt available."

    console.log(`[getPostBySlug] Final title: "${title}", excerpt: "${excerpt.substring(0, 100)}..."`)

    const serializedContent = await serialize(content, {
      parseFrontmatter: false,
    })
    console.log("[getPostBySlug] MDX serialized successfully")

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
