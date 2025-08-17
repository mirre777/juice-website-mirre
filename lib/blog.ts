import type { BlogPostFrontmatter } from "./types" // Assuming BlogPostFrontmatter is declared in a types file

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
]

const SAMPLE_BLOG_CONTENT: Record<string, string> = {}
