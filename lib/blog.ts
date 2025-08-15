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
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/optimusprime07375_httpss.mj.runwQjHnEwDZQI_httpss.mj.runJ2xzh_89a563be-ee33-4e4b-9446-d2cc6db82549_1-fl8B6QPcHBkfcmbSfZlo1jklJx4Rfr.png",
    slug: "seo-tips-for-fitness-coaches-in-europe",
  },
  {
    title: "🚀 The Best Tools for Personal Trainers in Berlin 2025 Edition",
    date: "2025-01-15",
    excerpt:
      "Discover the cutting-edge tools and apps that are revolutionizing personal training in Berlin. From AI-powered workout planning to client management systems.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%2015%2C%202025%2C%2002_26_22%20PM-04Fmc86J6RU32SEukCBMpJXIQngz0D.png",
    slug: "the-best-tools-for-personal-trainers-in-berlin-2025-edition-rocket",
  },
  {
    title: "💻 Top Fitness Software in Berlin 2025 (Because Spreadsheets Are So Last Year)",
    date: "2025-01-10",
    excerpt:
      "Say goodbye to Excel hell! Discover the modern software solutions that Berlin's top fitness professionals are using to streamline their businesses and wow their clients.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dumbbells2%20%281%29-hPgb1H1OGLxgKaz93OKKd1FIFW8a45.png",
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
  "are-wearables-accurate-enough-to-track-complex-lifting-movements": `# ⌚ Are Wearables Accurate Enough to Track Complex Lifting Movements?

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

  "tracking-biometrics-what-actually-moves-the-needle": `# 📊 Tracking Biometrics: What Actually Moves the Needle

**TL;DR:** Biometrics aren't just numbers—they're accountability. Knowing how often clients sleep, rest, recover, and move can elevate your coaching. Here's how to implement it smartly.

---

## Key Metrics to Track

### Resting Heart Rate (RHR) & Heart Rate Variability (HRV)
Your body's honest report card for training readiness. RHR and HRV give you real-time feedback on recovery status and whether your client is ready for intense training or needs a lighter day.

### Sleep Quality & Duration
The recovery window that makes or breaks progress. Sleep is when the magic happens—muscle repair, hormone regulation, and mental recovery all depend on quality rest.

### Body Metrics
- **Weight tracking**: Weekly averages, not daily fluctuations
- **Circumference measurements**: Waist, hips, arms, thighs
- **Performance markers**: Vertical jump, push-ups, plank hold times

### Perceived Effort & Soreness
Daily subjective feedback that complements objective data. How clients feel often tells you more than any device can measure.

---

## How to Implement with Sheets or Apps

### The Daily Check-In System
Create a simple daily check-in tab where clients enter:
- Sleep hours and quality rating
- Morning energy/mood levels
- Readiness to train (1-10 scale)

### Technology Integration
- **Oura Ring or wellness apps**: Sync sleep and HRV data into Sheets via CSV export
- **Weight charts**: Use autorange formatting so both coach and client can see progress trends
- **Automated data flows**: Connect apps to spreadsheets for seamless tracking

### Visualization That Works
Make data meaningful with:
- Sparkline charts for quick trend visualization
- Progress bars for goal tracking
- Color-coded cells for at-a-glance status updates

---

## Real-World Trainer & Client Use Cases

### Baseline Tracking for Fatigue Prevention
Collect baseline RHR and track weekly changes to anticipate fatigue before it becomes overtraining. A 5+ bpm increase in resting heart rate often signals the need for a recovery day.

### Post-Session Feedback Loop
After sessions, clients log perceived exertion (1-10 scale) to help program future training cycles. This subjective data helps coaches understand individual response patterns.

### Performance Database Management
One gym's spreadsheet includes jump test outputs in a filterable database, allowing coaches to track power development across multiple clients and identify trends.

---

## Best Practices for Implementation

### Keep It Simple
- **Limit daily entries to under 3 inputs**—overwhelm kills compliance
- Focus on metrics that actually influence your programming decisions
- Make data entry as quick and painless as possible

### Visual Feedback Systems
- Use sparkline charts for trend visualization
- Create progress bars for motivation
- Implement color coding for quick status assessment

### Smart Alert Systems
Set up threshold alerts for concerning patterns:
- Incomplete sleep three days in a row = automatic coach check-in
- RHR elevated 10+ bpm = recovery day recommendation
- Consistently low readiness scores = program adjustment needed

---

## Turning Data Into Decisions

The goal isn't to collect data—it's to make better coaching decisions. Use biometric trends to:

- **Adjust training intensity** based on recovery markers
- **Time deload weeks** when multiple metrics show fatigue
- **Personalize programs** based on individual response patterns
- **Prevent overtraining** by catching early warning signs

---

## Conclusion

Biometrics track more than calories—they track human performance. Use Sheets or apps smartly and turn data into decisions, not just data dumps.

The most successful coaches aren't drowning in data; they're using the right metrics to make their clients' training more effective and sustainable.

---

## Sources and Further Reading

- [Reddit: Apple Watch Active Calories Accuracy](https://www.reddit.com/r/AppleWatch/comments/lql6e6/how_accurate_is_the_active_calories_under/)
- [Self.com: Oura Ring 4 Review](https://www.self.com/review/oura-ring-4)
- [Reddit: Why Personal Trainers Still Use Outdated Methods](https://www.reddit.com/r/personaltraining/comments/1m0b65g/why_are_personal_trainers_still_stuck_using/)
- [Reddit: Google Sheets vs Apps for Personal Training](https://www.reddit.com/r/personaltraining/comments/10j13gy/google_sheets_vs_app/)`,

  "google-sheets-for-coaching-trainers-secret-weapon-or-trap": `# 📊 Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)

**TL;DR:** Let's be real: fancy coaching apps are sexy. But Google Sheets? That's where trainers roll up their sleeves. Customize whatever you want, track everything, and stay lean on cost. But spoiler: it's not always client-friendly.

---

## Why Google Sheets Can Work for Coaches

### Zero Software Cost
As one Reddit trainer put it:
> *"The price you can spend upwards of $800 every year on a coaching app, whereas Sheets is absolutely free."*

For solo trainers or those just starting out, that's significant money that can go toward certifications, equipment, or marketing instead of monthly software subscriptions.

### Custom Workflows That Match Your Style
You control everything:
- **Custom formulas** for 1RM calculations, volume tracking, RPE progression
- **Your own tracking systems** that match your exact programming methodology
- **Progression templates** that evolve with your coaching experience
- **Complete data ownership** - no vendor lock-in or subscription cancellations

### Templates That Evolve Over Time
Like this trainer shared:
> *"A functional fitness exercise database in Microsoft Excel and Google Sheets updated each month—filter by body region, push/pull, etc."*

Your spreadsheets grow with your expertise. Add new exercises, refine formulas, build better tracking systems as you learn what works.

---

## Client UX: Where It Breaks Down

### Mobile Experience is Brutal
The harsh reality from trainers:
> *"A spreadsheet is a great way to enter info but a terrible way to navigate it on a tiny screen."*

**The problems:**
- Clients click cell-by-cell, scroll endlessly
- Tiny text, accidental edits, formula breaks
- Experience feels amateur compared to polished apps

### Professional Perception Issues
Reddit trainers were blunt:
> *"App is significantly more professional. Unless you've got incredibly well designed sheets, you'll come off like some dollar store trainer."*

**Client expectations in 2025:**
- Sleek interfaces with progress photos
- Push notifications for workouts
- Social features and community aspects
- Video exercise demonstrations built-in

---

## Pro Tips If You Stick with Sheets

### Optimize for Mobile Experience
**Design for thumbs, not mice:**
- **Large buttons/cells**: Minimum 44px touch targets
- **Clear visual hierarchy**: Bold headers, color coding
- **Separate sheets by week**: Reduce scrolling
- **Dropdown menus**: For exercise selection, RPE ratings

### Build Rich Exercise Databases
**Make it interactive:**
- **Exercise video links**: YouTube embeds or links to form demos
- **Coaching cues**: Text boxes with technique reminders
- **Progress photos**: Google Drive integration for visual tracking
- **Filterable databases**: By body region, equipment, difficulty level

### Create Professional Templates
**Workout templates with:**
- Embedded coaching cues and video links
- Clear progression tracking
- Visual progress indicators
- Professional formatting and branding

### Hybrid Approach Strategy
**Use Sheets for what it does best:**
- Personal training plans and detailed programming
- Complex data analysis and trend tracking
- Custom formulas and calculations

**Switch to apps for:**
- Client-facing interfaces
- Group coaching and community features
- Mobile-first experiences
- Professional presentation

---

## Conclusion

For solo or niche athletes, Google Sheets is flexible, free, and powerful. But if you're scaling or want polish, pair it with an app—or hand your spreadsheet workflow off to someone who can style it like a pro.

The best system is the one you'll actually use consistently. Whether that's Sheets, apps, or a combination depends on your skills, client base, and business goals.

---

## Sources and Further Reading

- [Reddit: Google Sheets vs Coaching Apps for Online Coaching](https://www.reddit.com/r/personaltraining/comments/1bjgeys/google_sheets_vs_coaching_apps_for_online_coaching/)
- [Reddit: Functional Fitness Exercise Database in Excel/Sheets](https://www.reddit.com/r/personaltraining/comments/1cjxitz/functional_fitness_exercise_database_in_microsoft/)
- [Reddit: Google Sheets vs App Discussion](https://www.reddit.com/r/personaltraining/comments/10j13gy/google_sheets_vs_app/)
- [Reddit: Why Personal Trainers Still Use Outdated Methods](https://www.reddit.com/r/personaltraining/comments/1m0b65g/why_are_personal_trainers_still_stuck_using/)
- [Reddit: Apple Watch Calorie Accuracy](https://www.reddit.com/r/AppleWatch/comments/lql6e6/how_accurate_is_the_active_calories_under/)
- [Reddit: Online Coaching with Just Google Sheets](https://www.reddit.com/r/personaltraining/comments/13c9cga/has_anyone_done_online_coaching_with_just_google/)`,
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
  // Add emojis to headers if they don't already have them
  content = content.replace(/^(#{1,6})\s*([^#\n]*?)$/gm, (match, hashes, title) => {
    if (title.trim() && !title.match(/^[🎯📊💡⚡🔥💪🏆🚀📈✨🎪]/u)) {
      const emojiMap: { [key: string]: string } = {
        introduction: "🎯",
        overview: "📊",
        key: "💡",
        important: "⚡",
        benefits: "🔥",
        results: "💪",
        success: "🏆",
        future: "🚀",
        trends: "📈",
        conclusion: "✨",
        tips: "🎪",
      }

      const titleLower = title.toLowerCase()
      for (const [keyword, emoji] of Object.entries(emojiMap)) {
        if (titleLower.includes(keyword)) {
          return `${hashes} ${emoji} ${title.trim()}`
        }
      }
      return `${hashes} 💡 ${title.trim()}`
    }
    return match
  })

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
    return frontmatter.title
  }

  // If no frontmatter title, try to extract from first heading
  const headingMatch = markdownContent.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return headingMatch[1].trim()
  }

  // If no heading, try to generate from filename
  const cleanName = filename
    .replace(/\.md$/, "")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s/g, "") // Remove parentheses content
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim()

  return cleanName || "Untitled"
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

  // Assign images based on title content
  const titleLower = title.toLowerCase()

  if (
    titleLower.includes("strength training myths") ||
    titleLower.includes("myths busted") ||
    titleLower.includes("myths")
  ) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/optimusprime07375_httpss.mj.runuYrsMWWsn10_put_a_piece_of_grill_c00ac71c-6ec0-406d-a8e4-163f78770b2e.png-6D1BzuCHEwkBGMH4OgDLEotab58zIb.jpeg"
  }

  if (
    titleLower.includes("resistance training") ||
    titleLower.includes("medicine") ||
    titleLower.includes("number 2")
  ) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/optimusprime07375_create_an_image_in_the_same_style_but_of_th_aa77639a-36ef-4fe3-a79e-1d6dd37e1e90_2-petqFiTwRriFbsmO9j4PYsJtF2eXGt.png"
  }

  if (titleLower.includes("grannies") || titleLower.includes("pump iron") || titleLower.includes("stop the clock")) {
    return "/asian-woman-gym.png"
  }

  if (titleLower.includes("ai") && titleLower.includes("personal training")) {
    return "/gym-woman.png"
  }

  if (titleLower.includes("berlin") && (titleLower.includes("software") || titleLower.includes("tools"))) {
    return "/boxer-gym.png"
  }

  // Default fallback
  return "/fitness-blog-post.png"
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
