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
    image: "/strength-training-barbell-gym.png",
    slug: "strength-training-revolution-berlin-gyms",
  },
  {
    title: "🧠 The Psychology of Fitness: Mental Coaching Techniques",
    date: "2024-12-20",
    excerpt:
      "Explore the mental side of fitness coaching and learn techniques that help clients overcome psychological barriers to achieve their goals.",
    category: "Coaching",
    image: "/fitness-coaching-session.png",
    slug: "psychology-of-fitness-mental-coaching-techniques",
  },
]

const SAMPLE_BLOG_CONTENT = {
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

// Function to generate placeholder content for posts without full content
function generatePlaceholderContent(post: BlogPostFrontmatter): string {
  return `# ${post.title}

${post.excerpt}

---

## Coming Soon!

This article is currently being written and will be available soon. We're working hard to bring you high-quality, actionable content that will help you grow your fitness business.

### What to Expect

Based on the topic, this article will cover:

${
  post.category === "Technology"
    ? `
- **Latest tools and software** for fitness professionals
- **Practical implementation tips** you can use immediately  
- **Real-world examples** from successful trainers
- **Cost-benefit analysis** to help you make smart decisions
`
    : post.category === "Marketing"
      ? `
- **Proven marketing strategies** that actually work
- **Step-by-step implementation guides**
- **Real case studies** from successful fitness businesses
- **Budget-friendly tactics** for growing your client base
`
      : post.category === "Nutrition"
        ? `
- **Evidence-based nutrition strategies**
- **Practical meal planning tips**
- **Client communication techniques**
- **Tools and resources** for nutrition coaching
`
        : post.category === "Coaching"
          ? `
- **Advanced coaching techniques**
- **Client psychology insights**
- **Communication strategies** that build trust
- **Methods to improve client results**
`
          : post.category === "Fitness"
            ? `
- **Latest training methodologies**
- **Equipment recommendations**
- **Program design principles**
- **Injury prevention strategies**
`
            : `
- **Actionable strategies** you can implement today
- **Expert insights** from industry professionals
- **Practical tips** for your fitness business
- **Real-world examples** and case studies
`
}

### In the Meantime

While you wait for this article, check out our other popular posts:

- [⌚ Are Wearables Accurate Enough to Track Complex Lifting Movements?](/blog/are-wearables-accurate-enough-to-track-complex-lifting-movements)
- [📊 Tracking Biometrics: What Actually Moves the Needle](/blog/tracking-biometrics-what-actually-moves-the-needle)
- [📊 Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)](/blog/google-sheets-for-coaching-trainers-secret-weapon-or-trap)

### Stay Updated

Want to be notified when this article is published? [Contact us](mailto:hello@juice.fitness) or follow us on social media for the latest updates.

---

*This article is part of our ongoing series to help fitness professionals grow their businesses with practical, actionable advice.*`
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

  // First, check if we have full content for this slug
  if (SAMPLE_BLOG_CONTENT[slug]) {
    console.log(`[getPostBySlug] Using full content for slug: ${slug}`)

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

  // If no full content, check if we have metadata for this slug
  const samplePost = SAMPLE_POSTS.find((post) => post.slug === slug)
  if (samplePost) {
    console.log(`[getPostBySlug] Using placeholder content for slug: ${slug}`)

    const placeholderContent = generatePlaceholderContent(samplePost)
    const serializedContent = await serialize(placeholderContent, {
      parseFrontmatter: false,
    })

    return {
      frontmatter: samplePost,
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
