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
  content: string
  slug: string
}

const BLOG_CONTENT_PATH = "blog/"

// Sample blog posts for when blob storage is not available
const SAMPLE_POSTS: BlogPostFrontmatter[] = [
  {
    title: "📊 Tracking Biometrics: What Actually Moves the Needle",
    date: "2025-02-03",
    excerpt:
      "Biometrics aren't just numbers—they're accountability. Knowing how often clients sleep, rest, recover, and move can elevate your coaching. Here's how to implement it smartly.",
    category: "Technology",
    image: "/biometric-tracking-fitness-coach-phone.png",
    slug: "tracking-biometrics-what-actually-moves-the-needle",
  },
  {
    title: "📊 Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)",
    date: "2025-02-02",
    excerpt:
      "Let's be real: fancy coaching apps are sexy. But Google Sheets? That's where trainers roll up their sleeves. Customize whatever you want, track everything, and stay lean on cost. But spoiler: it's not always client-friendly.",
    category: "Technology",
    image: "/google-sheets-coaching-trainer-gym.png",
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
    category: "Marketing",
    image: "/seo-tips-fitness-coaches-europe.png",
    slug: "seo-tips-for-fitness-coaches-in-europe",
  },
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
  "tracking-biometrics-what-actually-moves-the-needle": `
    <h1>📊 Tracking Biometrics: What Actually Moves the Needle</h1>
    <p><strong>TL;DR:</strong> Biometrics aren't just numbers—they're accountability. Knowing how often clients sleep, rest, recover, and move can elevate your coaching. Here's how to implement it smartly.</p>
    <hr>
    <h2>The Biometric Revolution in Coaching</h2>
    <p>Walk into any modern gym and you'll see it: clients obsessing over step counts, trainers analyzing heart rate zones, and everyone wearing some form of tracking device. But here's the thing—<strong>most people are tracking the wrong metrics</strong>.</p>
    <p>The fitness industry is drowning in data but starving for insights. Your client's Apple Watch says they burned 847 calories, but are they actually recovering? Their sleep app shows 7 hours, but was it quality sleep? Their scale went up 2 pounds—is that muscle or water retention?</p>
    <p><strong>Smart coaches track what matters. Average coaches track everything.</strong></p>
    <p><em>Want to dive deeper into coaching technology? Check out our guides on <a href="/blog/google-sheets-for-coaching-trainers-secret-weapon-or-trap">Google Sheets for coaching</a> and <a href="/blog/top-fitness-software-in-berlin-2025-because-spreadsheets-are-so-last-year">fitness software solutions</a>.</em></p>
  `,
  "google-sheets-for-coaching-trainers-secret-weapon-or-trap": `
    <h1>📊 Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)</h1>
    <p><strong>TL;DR:</strong> Let's be real: fancy coaching apps are sexy. But Google Sheets? That's where trainers roll up their sleeves. Customize whatever you want, track everything, and stay lean on cost. But spoiler: it's not always client-friendly.</p>
    <hr>
    <h2>The Great Coaching Software Debate</h2>
    <p>Walk into any gym and you'll hear trainers debating: <strong>MyFitnessPal vs. Trainerize</strong>, <strong>TrueCoach vs. TrainerRoad</strong>. But there's a silent majority using something else entirely—<strong>Google Sheets</strong>.</p>
    <p>While everyone's chasing the latest coaching app, seasoned trainers are quietly building empires on spreadsheets. Here's why (and when it backfires).</p>
    <p><em>Want more strategies for growing your fitness business? Check out our guides on <a href="/blog/top-5-free-personal-trainer-website-builders-2025">website builders for trainers</a> and <a href="/blog/seo-tips-for-fitness-coaches-in-europe">SEO for fitness coaches</a>.</em></p>
  `,
  "how-to-get-more-clients-with-booking-page": `
    <h1>📱 How to Get More Clients with a Booking Page</h1>
    <p><strong>TL;DR:</strong> Still relying on DMs and WhatsApp back-and-forths? You're losing clients while checking your phone. A <strong>booking page</strong> converts scrolls into sessions while you sleep.</p>
    <hr>
    <h2>Why Booking Pages Work (Especially for Fitness Coaches)</h2>
    <h3>The Problem with Manual Booking</h3>
    <ul>
      <li><strong>Endless back-and-forth</strong>: "What times work?" "How about Tuesday?" "Actually, Wednesday is better..."</li>
      <li><strong>Missed opportunities</strong>: Clients book with competitors while you're training</li>
      <li><strong>Unprofessional appearance</strong>: DMs make you look like a side hustle, not a business</li>
      <li><strong>Time vampire</strong>: Hours spent on scheduling instead of coaching</li>
    </ul>
    <h3>The Booking Page Solution</h3>
    <p>✅ <strong>Removes friction</strong>: No back-and-forth messaging<br>
    ✅ <strong>Looks professional</strong>: Shows you're serious about your business<br>
    ✅ <strong>SEO-friendly</strong>: Rank for "book personal training sessions online"<br>
    ✅ <strong>Works 24/7</strong>: Converts clients while you sleep<br>
    ✅ <strong>Mobile-optimized</strong>: 73% of bookings happen on phones</p>
    <p><em>Want more strategies for growing your fitness business? Check out our guides on <a href="/blog/top-5-free-personal-trainer-website-builders-2025">website builders for trainers</a> and <a href="/blog/seo-tips-for-fitness-coaches-in-europe">SEO for fitness coaches</a>.</em></p>
  `,
  "top-5-free-personal-trainer-website-builders-2025": `
    <h1>🏆 Top 5 Free Personal Trainer Website Builders (2025)</h1>
    <p><strong>TL;DR:</strong> Let's cut the fluff. You're a personal trainer, not a web developer. You need a <strong>high-converting website</strong> that books sessions while you're smashing reps with clients. So here are the 5 best free website builders made <em>for trainers</em> in 2025.</p>
    <hr>
    <h2>1. Juice (🥇 Best for Booking + Branding)</h2>
    <p><strong>Website:</strong> <a href="https://juice.fitness/marketplace/personal-trainer-website">juice.fitness/marketplace/personal-trainer-website</a></p>
    <p>✅ <strong>What makes it special:</strong></p>
    <ul>
      <li>Create your Personal Trainer Website in <strong>10 minutes</strong></li>
      <li>Includes WhatsApp, mobile bookings, and trainer branding</li>
      <li>SEO-optimised for "personal trainer website builder" and "fitness coach online booking"</li>
      <li>No coding. Just fill the form and boom—you're live.</li>
    </ul>
    <blockquote>
      <p><em>"I had a website in 3 minutes. Clients book while I'm coaching."</em></p>
      <p><strong>— Laner, Personal Trainer</strong></p>
    </blockquote>
    <p><strong>Perfect for:</strong> European trainers who want bookings, not just a pretty site.</p>
    <p><em>Want more tips on growing your fitness business online? Check out our other guides on <a href="/blog/seo-tips-for-fitness-coaches-in-europe">SEO for fitness coaches</a> and <a href="/blog/">fitness marketing strategies</a>.</em></p>
  `,
  "seo-tips-for-fitness-coaches-in-europe": `
    <h1>🔍 SEO Tips for Fitness Coaches in Europe</h1>
    <p><strong>TL;DR:</strong> Let's get something straight: SEO isn't for nerds in glasses. It's for <strong>smart coaches</strong> who want to get found while they're training. Here's how to rank higher, book more, and dominate your local market.</p>
    <hr>
    <h2>What Is SEO, Really?</h2>
    <p>Search Engine Optimisation = Getting found when someone searches:</p>
    <ul>
      <li>Personal Trainer Berlin</li>
      <li>Online Fitness Coach Munich</li>
      <li>Free website for fitness coach</li>
    </ul>
    <hr>
    <h2>1. Nail Your Keywords</h2>
    <p>Use <strong>1 main keyword</strong> per page/post:</p>
    <ul>
      <li>personal trainer website builder</li>
      <li>book personal training sessions online</li>
      <li>fitness website template</li>
    </ul>
    <p>Also sprinkle in:</p>
    <ul>
      <li>PT Website schnell erstellen</li>
      <li>Kostenlose Website für Fitnesstrainer</li>
    </ul>
    <p>Use Google Trends + UberSuggest to verify volume.</p>
    <p><em>Want a website that's already SEO-optimized? Check out the <a href="https://juice.fitness/marketplace/personal-trainer-website">Juice Personal Trainer Website Builder</a> and get found by more clients.</em></p>
  `,
  "the-best-tools-for-personal-trainers-in-berlin-2025-edition-rocket": `
    <h1>🚀 The Best Tools for Personal Trainers in Berlin 2025 Edition</h1>
    <p><strong>TL;DR:</strong> The fitness industry in Berlin is embracing technology like never before. Here are the essential tools every personal trainer needs to stay competitive in 2025.</p>
    <h2>The Digital Revolution in Fitness</h2>
    <p>Berlin's fitness scene has always been innovative, but 2025 marks a turning point. Personal trainers are no longer just fitness experts—they're tech-savvy professionals leveraging cutting-edge tools to deliver exceptional client experiences.</p>
    <p><em>Ready to upgrade your training business? Start with the Juice App and experience the difference technology can make.</em></p>
  `,
  "top-fitness-software-in-berlin-2025-because-spreadsheets-are-so-last-year": `
    <h1>💻 Top Fitness Software in Berlin 2025 (Because Spreadsheets Are So Last Year)</h1>
    <p><strong>TL;DR:</strong> If you're still managing your fitness business with spreadsheets, you're living in the past. Here's the software that's actually worth your time and money in 2025.</p>
    <h2>Why Spreadsheets Don't Cut It Anymore</h2>
    <p>Let's be honest—we've all been there. Rows and columns of client data, workout plans scattered across multiple tabs, and that sinking feeling when you realize you've been working with outdated information for weeks.</p>
    <p>Berlin's fitness industry has evolved beyond the spreadsheet era. Here's what the pros are actually using.</p>
    <p><em>Ready to ditch the spreadsheets? Start with a free trial of the Juice Platform and see what modern fitness business management looks like.</em></p>
  `,
  "nutrition-coaching-trends-berlin-2025": `
    <h1>🥗 Nutrition Coaching Trends Taking Over Berlin in 2025</h1>
    <p><strong>TL;DR:</strong> Berlin's nutrition coaching scene is evolving rapidly. Here are the trends that are actually making a difference for clients and coaches alike.</p>
    <h2>The New Nutrition Landscape</h2>
    <p>Gone are the days of one-size-fits-all meal plans. Berlin's diverse population demands personalized, culturally-aware nutrition coaching that goes beyond basic calorie counting.</p>
    <p><em>Ready to elevate your nutrition coaching? Start by implementing one trend that resonates with your coaching style and client needs.</em></p>
  `,
  "strength-training-revolution-berlin-gyms": `
    <h1>🏋️ Strength Training Revolution: What's New in Berlin Gyms</h1>
    <p><strong>TL;DR:</strong> Berlin's gym scene is undergoing a massive transformation. New training methodologies, cutting-edge equipment, and innovative coaching techniques are changing how we build strength.</p>
    <h2>The Evolution of Strength Training</h2>
    <p>Berlin has always been a city of innovation, and its fitness scene is no exception. The traditional "lift heavy, go home" mentality is giving way to a more scientific, personalized approach to strength development.</p>
    <p><em>Ready to join the revolution? Find a gym that embraces these new methodologies and experience the difference science-based strength training can make.</em></p>
  `,
  "psychology-of-fitness-mental-coaching-techniques": `
    <h1>🧠 The Psychology of Fitness: Mental Coaching Techniques</h1>
    <p><strong>TL;DR:</strong> Physical transformation starts in the mind. Here are the psychological techniques that separate successful fitness journeys from failed attempts.</p>
    <h2>The Mental Game of Fitness</h2>
    <p>We've all seen it: two people with identical workout plans and nutrition protocols, but completely different results. The difference isn't physical—it's mental. Understanding the psychology of fitness is the key to unlocking sustainable transformation.</p>
    <p><em>Ready to strengthen your mental game? Start with one psychological technique that resonates with you and practice it consistently. Your future self will thank you.</em></p>
  `,
}

export async function getAllPosts(): Promise<BlogPostFrontmatter[]> {
  console.log("[getAllPosts] Fetching all blog posts...")

  // Always return sample posts for now to avoid blob access issues
  console.log("[getAllPosts] Using sample posts")
  return SAMPLE_POSTS
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[getPostBySlug] Attempting to fetch post with slug: ${slug}`)

  const samplePost = SAMPLE_POSTS.find((post) => post.slug === slug)
  const sampleContent = SAMPLE_BLOG_CONTENT[slug]

  if (samplePost && sampleContent) {
    console.log(`[getPostBySlug] Using sample content for slug: ${slug}`)
    return {
      frontmatter: samplePost,
      content: sampleContent,
      slug: slug,
    }
  }

  console.log(`[getPostBySlug] No sample content found for slug: ${slug}`)
  return null
}
