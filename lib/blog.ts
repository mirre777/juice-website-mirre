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
    title: "Fundamentals of Weightlifting: A Grown-Up's Guide to Building Real Strength",
    date: "2025-01-13",
    excerpt:
      "Lifting weights is straightforward—pick heavy things up, put them down again. But if it were that simple, everyone would look like a superhero. Learn the real fundamentals that move you from casual gym-goer to results-driven lifter.",
    category: "Fitness",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/optimusprime07375_httpss.mj.runwQjHnEwDZQI_httpss.mj.runJ2xzh_72f6cc4d-9694-43ad-919b-7b562d884b0a_0-eLUqJaxSwe1bNeVFJhR1VDW10n32n0.png",
    slug: "fundamentals-of-weightlifting-guide-to-building-real-strength",
  },
  {
    title: "Are Wearables Accurate Enough to Track Complex Lifting Movements?",
    date: "2025-02-04",
    excerpt:
      "Wearables are everywhere. But when it comes to heavy squats, Olympic lifts, or deadlifts? Are they legit? Let's break down what they do well and where they fail.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wearables2%20%282%29-cgDTKvKmUaUHv7q9F9kXm4nWJOJz65.png",
    slug: "are-wearables-accurate-enough-to-track-complex-lifting-movements",
  },
  {
    title: "Tracking Biometrics: What Actually Moves the Needle",
    date: "2025-02-03",
    excerpt:
      "Biometrics aren't just numbers—they're accountability. Knowing how often clients sleep, rest, recover, and move can elevate your coaching. Here's how to implement it smartly.",
    category: "Technology",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/optimusprime07375_create_an_image_in_the_same_style_but_of_th_aa77639a-36ef-4fe3-a79e-1d6dd37e1e90_2-petqFiTwRriFbsmO9j4PYsJtF2eXGt.png",
    slug: "tracking-biometrics-what-actually-moves-the-needle",
  },
  {
    title: "Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)",
    date: "2025-02-02",
    excerpt:
      "Let's be real: fancy coaching apps are sexy. But Google Sheets? That's where trainers roll up their sleeves. Customize whatever you want, track everything, and stay lean on cost. But spoiler: it's not always client-friendly.",
    category: "Technology",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gym_woman-WTRGVNMDnOgXsKU3vNuaL1mAUze1Zr.png",
    slug: "google-sheets-for-coaching-trainers-secret-weapon-or-trap",
  },
  {
    title: "How to Get More Clients with a Booking Page",
    date: "2025-02-01",
    excerpt:
      "Still relying on DMs and WhatsApp back-and-forths? You're losing clients while checking your phone. A booking page converts scrolls into sessions while you sleep.",
    category: "Marketing",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/asian%20woman%20gym-yjGZ80lQKAuFqFbDgrG7xqwwx6XNpI.png",
    slug: "how-to-get-more-clients-with-booking-page",
  },
  {
    title: "Top 5 Free Personal Trainer Website Builders (2025)",
    date: "2025-01-31",
    excerpt:
      "Let's cut the fluff. You're a personal trainer, not a web developer. You need a high-converting website that books sessions while you're smashing reps with clients. Here are the 5 best free website builders made for trainers in 2025.",
    category: "Technology",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/boxer_gym-6wlg1r57kNLLkVRoWE8X6aD02l6k6y.png",
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
    title: "Strength Training Revolution: What's New in Berlin Gyms",
    date: "2024-12-28",
    excerpt:
      "Berlin's gym scene is evolving with new training methodologies, equipment innovations, and coaching techniques that are changing how we build strength.",
    category: "Fitness",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/optimusprime07375_httpss.mj.runI9EYUY5MdxQ_show_me_lifting_pl_e3d031ab-6312-4f86-a9ff-3c62d20af746_0-OShS9P2385kOQCCJxI5zHLmYXUPwHr.png",
    slug: "strength-training-revolution-berlin-gyms",
  },
]

const SAMPLE_BLOG_CONTENT: Record<string, string> = {
  "fundamentals-of-weightlifting-guide-to-building-real-strength": `# Fundamentals of Weightlifting: A Grown-Up's Guide to Building Real Strength

Lifting weights is straightforward—pick heavy things up, put them down again. But if it were that simple, everyone would look like a superhero. Let's get clear about the real fundamentals that move you from casual gym-goer to results-driven lifter.

## 1. Progressive Overload: The Core of Strength Training

Strength doesn't happen by accident. Progressive overload—the systematic increase of weight, reps, or intensity over time—is the engine driving muscle growth. Without it, you're just spinning your wheels. Start with manageable weight and gradually push yourself. If you're lifting the same dumbbells today that you were six months ago, you're not training—you're maintaining.

**How to do it:**
- Increase weight or reps slightly each session.
- Track your lifts to measure progress.
- Be patient and methodical—gains compound over time.

## 2. Protein: The Muscle-Building Macronutrient

Muscle doesn't grow from thin air. Protein provides amino acids, the building blocks of muscle. Skimp on protein, and you short-circuit your body's ability to repair and grow stronger.

**Protein basics:**
- Aim for 1.6–2.2 grams of protein per kilogram of your body weight daily.
- Spread your protein intake evenly throughout the day.
- Prioritize quality sources: meats, fish, eggs, dairy, legumes, and protein supplements if needed.

## 3. Frequency Matters: Hit Muscle Groups Regularly

Training each muscle group once a week? You're leaving strength gains on the table. Current evidence indicates muscle groups recover faster than once thought. Hitting each major muscle group at least twice per week yields better growth and strength gains.

**Frequency tips:**
- Split routines effectively (e.g., upper/lower splits, push-pull).
- Ensure 48–72 hours recovery between workouts for the same muscle group.
- Keep sessions intense but manageable.

## 4. Recovery Isn't Optional: It's Essential

Training tears muscle fibers down; recovery builds them back up stronger. Neglect recovery, and you'll burn out, plateau, or worse—get injured. Prioritizing recovery means prioritizing your progress.

**Recovery essentials:**
- Sleep 7–9 hours per night.
- Schedule rest days into your training program.
- Consider active recovery: walking, yoga, gentle cycling.
- Listen to your body—fatigue is informative.

## 5. Good Form: Lift Smart, Not Just Heavy

Lifting heavy is crucial, but doing so with poor form is counterproductive. Good form reduces injury risk, maximizes muscle engagement, and supports long-term progress.

**Form pointers:**
- Use controlled movements rather than momentum.
- Maintain neutral spine and stable core.
- Don't sacrifice form for extra weight.

## 6. Rigor and Realism: Separate Hype from Evidence

The fitness world is full of bold claims and quick fixes. Your best filter against wasting time is rigor—an evidence-based approach. Ask if something is supported by solid research or merely flashy marketing.

**Quick rigor checklist:**
- Is it evidence-based (backed by multiple solid studies)?
- Has it been replicated by others?
- Does it follow established science-based principles?

Strength training is a long game. Stick to the fundamentals—progressive overload, protein intake, frequency, recovery, and good form—and your strength gains will be anything but accidental.`,

  "are-wearables-accurate-enough-to-track-complex-lifting-movements": `# Are Wearables Accurate Enough to Track Complex Lifting Movements?

Wearables are everywhere. But when it comes to heavy squats, Olympic lifts, or deadlifts? Are they legit? Let's break down what they do well—and where they fail.

## What Wearables Typically Track Well

- **Heart rate zones** during cardio or metabolic circuits
- **Step counts, distance, stationary exercise metrics**
- **Some devices auto-detect workouts** 10+ mins

## Where They Struggle with Strength Workouts

- **Calorie burn estimates during lifting are often inaccurate:**
  > "Your Garmin cannot accurately determine how many calories a set of 12 bicep curls burned."
- **Logging movements is tedious**; often best to auto-track and log manually.

## What the Research Says

- The Polar V800 has high validity for vertical jump height versus force platforms (ICC ~0.95), but strength lift metrics are outside scope.

## Tips for Trainers Using Wearables

- **Use them for correlative data**—trend heart rate, sleep, readiness—not accurate per-exercise burn.
- **Combine wearable with manual logging**: ask clients to record weights, sets, reps in Sheets or app.
- **Educate clients**: wearables are best for general wellness tracking—not perfect for muscle-building precision.

## Conclusion

Wearables are powerful tools—but they're not your muscle's measure. Use them to support your coaching, not replace your coaching. For now, the best tracker is still a notebook, a Sheet, and an eye for detail.

## Links & Sources

- [Reddit: Be Wary of Calorie Counts for Weightlifting](https://www.reddit.com/r/Garmin/comments/17c9lu8/be_weary_of_calorie_counts_for_weightlifting/)
- [Reddit: Weightlifting on Garmin is by Far its Weakest Feature](https://www.reddit.com/r/Garmin/comments/1cqa26x/weightlifting_on_garmin_is_by_far_its_weakest_and/)
- [Self Magazine: Oura Ring 4 Review](https://www.self.com/review/oura-ring-4)
- [arXiv: Wearable Technology in Sports](https://arxiv.org/abs/2203.16442)`,

  "tracking-biometrics-what-actually-moves-the-needle": `# Tracking Biometrics: What Actually Moves the Needle

Biometrics aren't just numbers—they're accountability. Knowing how often clients sleep, rest, recover, and move can elevate your coaching. Here's how to implement it smartly.

## Key Metrics to Track

- **Resting heart rate (RHR), HR variability (HRV)** = readiness for training
- **Sleep quality & duration** = recovery window
- **Body metrics** = weight, circumference, performance markers (e.g. vertical jump)
- **Perceived effort / soreness** logged daily

## How to Implement with Sheets or Apps

- **Create a daily check-in tab**: client enters sleep hours, mood, readiness.
- **Use tools like Oura Ring** or wellness apps to sync sleep or HRV data into Sheets via CSV.
- **Weight charts with autorange formatting** help both coach and client see progress.

## Real-World Trainer & Client Use Cases

- **Collect baseline RHR** and track weekly changes to anticipate fatigue.
- **After sessions, clients log perceived exertion** (1-10 scale) to help program cycles.
- **One gym's spreadsheet includes jump test outputs** in a filterable database.

## Best Practices

- **Keep daily entries under 3 inputs**—overwhelm kills compliance.
- **Visualize with sparkline charts** or progress bars.
- **Use threshold alerts** (e.g. incomplete sleep three days in a row = coach check-in).

## Conclusion

Biometrics track more than calories—they track human performance. Use Sheets or apps smartly and turn data into decisions, not just data dumps.

## Links & Sources

- [Reddit: Apple Watch Calorie Accuracy](https://www.reddit.com/r/AppleWatch/comments/lql6e6/how_accurate_is_the_active_calories_under/)
- [Self Magazine: Oura Ring 4 Review](https://www.self.com/review/oura-ring-4)
- [Reddit: Why Personal Trainers Still Use Spreadsheets](https://www.reddit.com/r/personaltraining/comments/1m0b65g/why_are_personal_trainers_still_stuck_using/)`,

  "google-sheets-for-coaching-trainers-secret-weapon-or-trap": `# Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)

Let's be real: fancy coaching apps are sexy. But Google Sheets? That's where trainers roll up their sleeves. Customize whatever you want, track everything, and stay lean on cost. But spoiler: it's not always client-friendly.

## Why Google Sheets Can Work for Coaches

- **Zero software cost.** As one Redditor put it:
  > "The price you can spend upwards of $800 every year on a coaching app, whereas Sheets is absolutely free."
- **Custom workflows** to match your programming style. You control formulas, tracking, progression templates, everything.
- **Templates evolve over time.** Like this:
  > "A functional fitness exercise database in Microsoft Excel and Google Sheets updated each month—filter by body region, push/pull, etc."

## Client UX: Where It Breaks Down

- **Sheets on a phone is brutal.** Comment:
  > "A spreadsheet is a great way to enter info but a terrible way to navigate it on a tiny screen."
- **Clients click cell-by-cell, scroll endlessly**—experience feels amateur.
- **Trainers on Reddit said:**
  > "App is significantly more professional. Unless you've got incredibly well designed sheets, you'll come off like some dollar store trainer."

## Pro Tips If You Use Sheets

- **Use workout templates** with embedded coaching cues/videos.
- **Build exercise databases** that link to video demos and filters.
- **Optimize mobile layout**: large buttons/cells, progress trackers, clearly separated weeks.
- **Offer alongside an app** for client-heavy workflows: e.g., use Sheets for personal plans and switch to apps for larger groups.

## Conclusion

For solo or niche athletes, Google Sheets is flexible, free, and powerful. But if you're scaling or want polish, pair it with an app—or hand your spreadsheet workflow off to someone who can style it like a pro.

## Links & Sources

- [Reddit: Google Sheets vs Coaching Apps](https://www.reddit.com/r/personaltraining/comments/1bjgeys/google_sheets_vs_coaching_apps_for_online_coaching/)
- [Reddit: Functional Fitness Exercise Database](https://www.reddit.com/r/personaltraining/comments/1cjxitz/functional_fitness_exercise_database_in_microsoft/)
- [Reddit: Google Sheets vs App](https://www.reddit.com/r/personaltraining/comments/10j13gy/google_sheets_vs_app/)`,

  "how-to-get-more-clients-with-booking-page": `# How to Get More Clients with a Booking Page

Still relying on DMs and WhatsApp back-and-forth? You're losing clients while checking your phone. A **booking page** converts scrolls into sessions while you sleep.

## Why Booking Pages Work (Especially for Fitness Coaches)

- **Removes friction**: no back-and-forth
- **Looks pro**: shows you're serious
- **SEO-friendly**: rank for "book personal training sessions online"

## Step-by-Step: Build a High-Converting Booking Page

### 1. Use a Tool Made for Trainers
Try [juice.fitness](https://juice.fitness/marketplace/personal-trainer-website) built for trainers. SEO-ready. Mobile-friendly. WhatsApp-integrated.

### 2. Show Your Services Clearly
- **Personal Training (1-on-1)**
- **Small Group Training**
- **Online Coaching**

Use phrases like:
- "Train with me in Berlin or online"
- "Flexible session times—book instantly"

### 3. Integrate Payments (or At Least Confirmations)
- **Stripe or PayPal** optional
- **Send confirmations** via WhatsApp or email

## Copywriting that Converts

**Don't say:** "Contact me to train"
**Say:** "Book your free intro session now—no commitment"

Use keywords like:
- fitness coach booking page
- PT website fast
- book fitness session online

## Add Social Proof

- **Client testimonials** with headshots
- **Transformation pics** (with consent)
- **"Trusted by 500+ trainers"** badge (if using Juice)

## Final Rep

You don't need a whole website. You need a **booking machine**.

Get your **fitness coach booking page** live in 10 mins. SEO it. Link it. Let it work while you train.`,

  "top-5-free-personal-trainer-website-builders-2025": `# Top 5 Free Personal Trainer Website Builders (2025)

Let's cut the fluff. You're a personal trainer not a web developer. You need a high-converting website that books sessions while you're smashing reps with clients. So here are the 5 best free website builders made *for trainers* in 2025.

## 1. Juice (Best for Booking + Branding)

**Website:** [juice.fitness/marketplace/personal-trainer-website](https://juice.fitness/marketplace/personal-trainer-website)

- Create your Personal Trainer Website in 10 minutes
- Includes WhatsApp, mobile bookings, and trainer branding
- SEO-optimised for "personal trainer website builder" and "fitness coach online booking"
- No coding. Just fill the form and boom—you're live.

> *"I had a website in 3 minutes. Clients book while I'm coaching." —Laner*

## 2. Wix

- Good for visual design and fitness templates
- Slower load times, weaker on SEO
- Need to manually set up forms + payments

## 3. Carrd

- Simple landing page builder
- No fitness-specific templates
- Great if you just want a link-in-bio with your offer

## 4. Squarespace

- Beautiful templates
- Better for studios than solo trainers
- No WhatsApp or custom automations

## 5. Systeme.io

- Free funnels and lead magnets
- Clunky design for fitness sites
- Solid for email + ebook offers

## Final Rep

Use a tool that *books clients*, not just shows your muscles. Juice is made for trainers in Europe, with SEO baked in. Use keywords like:

- free website for fitness coach
- personal trainer landing page
- book personal training sessions online

and let your site lift the weight.`,

  "seo-tips-for-fitness-coaches-in-europe": `# SEO Tips for Fitness Coaches in Europe

Lets get something straight: SEO isnt for nerds in glasses. Its for **smart coaches** who want to get
found while theyre training.

Heres how to rank higher, book more, and dominate your local market.

---

## What Is SEO, Really?

Search Engine Optimisation = Getting found when someone searches:

- Personal Trainer Berlin
- Online Fitness Coach Munich
- Free website for fitness coach

---

## 1. Nail Your Keywords

Use **1 main keyword** per page/post:
- personal trainer website builder
- book personal training sessions online
- fitness website template

Also sprinkle in:

- PT Website schnell erstellen
- Kostenlose Website fr Fitnesstrainer

Use Google Trends + UberSuggest to verify volume.

---

## 2. Optimise Your Page

- One H1 tag: Create Your Trainer Website in 10 Minutes
- Meta Title: Personal Trainer Website Builder Juice
- Meta Description: Launch a high-converting fitness site. Fast, free, SEO-ready.

---

## 3. Use Local SEO

Say where you train:
- Available in Berlin & Online
- Fitness Coach in Zrich 1:1 and remote

Claim your **Google Business Profile** too.

---

## 4. Link Smarter

- Internal: Blog posts your booking page
- External: Get backlinks from local gyms, fitness blogs, and events

---

## 5. Keep It Fast + Mobile

Use tools like [juice.fitness](https://juice.fitness/marketplace/personal-trainer-website) to make it:
- Mobile-optimised
- Fast-loading
- Clean, no fluff

---

## SEO Slow. SEO = Smart.

Most coaches sleep on SEO.

Not you.

You now know how to:
- Use keywords that matter
- Build a fast personal trainer site
- Get clients while you train

Ready to dominate? Time to publish.`,

  "strength-training-revolution-berlin-gyms": `# Strength Training Revolution: What's New in Berlin Gyms

Berlin's gym scene is evolving with new training methodologies, equipment innovations, and coaching techniques that are changing how we build strength.

## 1. Progressive Overload: The Core of Strength Training

Strength doesn't happen by accident. Progressive overload—the systematic increase of weight, reps, or intensity over time—is the engine driving muscle growth. Without it, you're just spinning your wheels. Start with manageable weight and gradually push yourself. If you're lifting the same dumbbells today that you were six months ago, you're not training—you're maintaining.

**How to do it:**
- Increase weight or reps slightly each session.
- Track your lifts to measure progress.
- Be patient and methodical over time.

## 2. Protein: The Muscle-Building Macronutrient

Muscle doesn't grow from thin air. Protein provides amino acids, the building blocks of muscle. Skimp on protein, and you short-circuit your body's ability to repair and grow stronger.

**Protein basics:**
- Aim for 1.6–2.2 grams of protein per kilogram of your body weight daily.
- Spread your protein intake evenly throughout the day.
- Prioritize quality sources: meats, fish, eggs, dairy, legumes, and protein supplements if needed.

## 3. Frequency Matters: Hit Muscle Groups Regularly

Training each muscle group once a week? You're leaving strength gains on the table. Current evidence indicates muscle groups recover faster than once thought. Hitting each major muscle group at least twice per week yields better growth and strength gains.

**Frequency tips:**
- Split routines effectively (e.g., upper/lower splits, push-pull).
- Ensure 48–72 hours recovery between workouts for the same muscle group.
- Keep sessions intense but manageable.

## 4. Recovery Isn't Optional: It's Essential

Training tears muscle fibers down; recovery builds them back up stronger. Neglect recovery, and you'll burn out, plateau, or worse—get injured. Prioritizing recovery means prioritizing your progress.

**Recovery essentials:**
- Sleep 7–9 hours per night.
- Schedule rest days into your training program.
- Consider active recovery: walking, yoga, gentle cycling.
- Listen to your body—fatigue is informative.

## 5. Good Form: Lift Smart, Not Just Heavy

Lifting heavy is crucial, but doing so with poor form is counterproductive. Good form reduces injury risk, maximizes muscle engagement, and supports long-term progress.

**Form pointers:**
- Use controlled movements rather than momentum.
- Maintain neutral spine and stable core.
- Don't sacrifice form for extra weight.

## 6. Rigor and Realism: Separate Hype from Evidence

The fitness world is full of bold claims and quick fixes. Your best filter against wasting time is rigor—an evidence-based approach. Ask if something is supported by solid research or merely flashy marketing.

**Quick rigor checklist:**
- Is it evidence-based (backed by multiple solid studies)?
- Has it been replicated by others?
- Does it follow established science-based principles?

Strength training is a long game. Stick to the fundamentals—progressive overload, protein intake, frequency, recovery, and good form—and your strength gains will be anything but accidental.`,
}

const BLOG_CONTENT_PATH = "blog/"

function cleanSlugFromFilename(filename: string): string {
  return filename
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/g, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}

function enhanceMarkdownContent(content: string): string {
  content = content.replace(/^- \*\*(.*?)\*\*/gm, "• **$1**")
  content = content.replace(/^(\d+)\. \*\*(.*?)\*\*/gm, "$1. 🎯 **$2**")
  return content
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

function extractTitleFromContent(content: string, filename: string): string {
  const { data: frontmatter, content: markdownContent } = matter(content)
  if (frontmatter.title) {
    return cleanTitle(frontmatter.title)
  }

  const headingMatch = markdownContent.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return cleanTitle(headingMatch[1].trim())
  }

  const cleanName = filename
    .replace(/\.md$/, "")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/\s*$$[^)]*$$\s*/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim()

  return cleanTitle(cleanName) || "Untitled"
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

  return "Discover insights from the world of fitness coaching and technology."
}

function getImageForBlobPost(title: string, frontmatter: any): string {
  if (frontmatter.image) {
    return frontmatter.image
  }

  const titleLower = title.toLowerCase()

  if (
    titleLower.includes("strength training myths") ||
    titleLower.includes("myths busted") ||
    titleLower.includes("myths")
  ) {
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

  return "/fitness-blog-post.png"
}

function cleanTitle(title: string): string {
  return title
    .replace(
      /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]\s*/gu,
      "",
    )
    .replace(/^Number\s+\d+\s*/i, "")
    .replace(/\s*Effects?\s*Of\d*[a-z]*\s*$/i, "")
    .replace(/\s*\.(pdf|doc|docx|txt)\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\bai\b/gi, "AI")
    .replace(/\bbffs?\b/gi, (match) => (match.toLowerCase() === "bff" ? "BFF" : "BFFs"))
}

export async function getAllPosts(): Promise<BlogPostFrontmatter[]> {
  const posts: BlogPostFrontmatter[] = [...SAMPLE_POSTS]

  try {
    const { list } = await import("@vercel/blob")
    const blobs = await list({ prefix: BLOG_CONTENT_PATH })

    for (const blob of blobs.blobs) {
      try {
        const content = await fetchBlobContent(blob.downloadUrl)
        if (content) {
          const { data: frontmatter } = matter(content)
          const rawSlug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")
          const cleanSlug = cleanSlugFromFilename(rawSlug)
          const extractedTitle = extractTitleFromContent(content, rawSlug)
          const extractedExcerpt = extractExcerptFromContent(content, frontmatter)

          const post: BlogPostFrontmatter = {
            title: extractedTitle,
            date: frontmatter.date || new Date().toISOString().split("T")[0],
            excerpt: extractedExcerpt,
            category: frontmatter.category || "General",
            image: getImageForBlobPost(extractedTitle, frontmatter),
            slug: cleanSlug,
          }

          posts.push(post)
        }
      } catch (error) {
        console.error(`Error processing blob ${blob.pathname}:`, error)
      }
    }
  } catch (error) {
    console.error("Error fetching from blob storage:", error)
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log("[v0] getPostBySlug called with slug:", slug)

  try {
    const { list } = await import("@vercel/blob")
    const blobs = await list({ prefix: BLOG_CONTENT_PATH })

    for (const blob of blobs.blobs) {
      const rawSlug = blob.pathname.replace(BLOG_CONTENT_PATH, "").replace(/\.md$/, "")
      const cleanSlug = cleanSlugFromFilename(rawSlug)

      if (cleanSlug === slug) {
        console.log("[v0] Found blob post for slug:", slug)
        const content = await fetchBlobContent(blob.downloadUrl)
        if (content) {
          const { data: frontmatter, content: markdownContent } = matter(content)
          const extractedTitle = extractTitleFromContent(content, rawSlug)
          const extractedExcerpt = extractExcerptFromContent(content, frontmatter)
          const enhancedContent = enhanceMarkdownContent(markdownContent)
          const mdxSource = await serialize(enhancedContent)

          return {
            title: extractedTitle,
            date: frontmatter.date || new Date().toISOString().split("T")[0],
            excerpt: extractedExcerpt,
            category: frontmatter.category || "General",
            image: getImageForBlobPost(extractedTitle, frontmatter),
            slug: cleanSlug,
            content: mdxSource,
            rawContent: enhancedContent,
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching from blob storage for slug "${slug}":`, error)
  }

  const samplePost = SAMPLE_POSTS.find((post) => post.slug === slug)
  if (samplePost) {
    const content = SAMPLE_BLOG_CONTENT[slug]
    if (content) {
      const mdxSource = await serialize(content)
      return {
        ...samplePost,
        content: mdxSource,
        rawContent: content,
      }
    } else {
      const genericContent = `# ${samplePost.title}

${samplePost.excerpt}

This is a sample blog post. The full content would be available in a production environment.

## Key Points

- Professional fitness coaching insights
- Evidence-based training approaches  
- Practical implementation strategies

*This content is part of our sample blog system.*`

      const mdxSource = await serialize(genericContent)
      return {
        ...samplePost,
        content: mdxSource,
        rawContent: genericContent,
      }
    }
  }

  return null
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts()
  return posts.map((post) => post.slug)
}
