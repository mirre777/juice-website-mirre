import type { Metadata } from "next"
import { TrainerDirectoryLayout } from "@/app/(landing-pages)/components/trainer-directory-layout"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchTrainersForCity, getCityDistricts } from "@/app/(landing-pages)/utils/trainer-directory-utils"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Find a Personal Trainer in London | Verified Fitness Coaches | Juice",
  description:
    "Discover certified personal trainers in London. Connect with verified fitness professionals in Westminster, Camden, Islington, and more. Find your perfect trainer today.",
  keywords: [
    "personal trainer London",
    "fitness trainer London",
    "personal training London",
    "certified trainer London",
    "trainer directory London",
    "fitness coach London",
    "personal trainer Westminster",
    "trainer London-Camden",
    "personal trainer Islington",
    "trainer Hackney",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/findatrainer/london",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/findatrainer/london",
    title: "Find a Personal Trainer in London | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in London. Connect with verified fitness professionals in your neighborhood.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-trainer-directory-london.jpg",
        width: 1200,
        height: 630,
        alt: "Personal Trainer Directory London - Juice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Personal Trainer in London | Verified Fitness Coaches",
    description: "Discover certified personal trainers in London. Find your perfect trainer today.",
    images: ["/images/og-trainer-directory-london.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default async function LondonTrainerDirectoryPage() {
  const trainers = await fetchTrainersForCity("London")
  const districts = getCityDistricts("London")

  const baseUrl = "https://juice.fitness"
  const fullUrl = `${baseUrl}/findatrainer/london`

  // JSON-LD structured data for LLM optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": fullUrl, // unique page reference for LLMs
    url: fullUrl, // explicit canonical link
    name: "Find a Personal Trainer in London | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in London. Connect with verified fitness professionals in Westminster, Camden, Islington, and more. Find your perfect trainer today.",
    about: "Personal Training Directory, Fitness Coaches, London", // helps topic classification for AI
    keywords: [
      "personal trainer London",
      "fitness trainer London",
      "personal training London",
      "certified trainer London",
      "trainer directory London",
      "fitness coach London",
      "personal trainer Westminster",
      "trainer London-Camden",
      "personal trainer Islington",
      "trainer Hackney",
    ].join(", "), // semantic keywords
    speakable: {
      // for AI voice/summarization models
      "@type": "SpeakableSpecification",
      xpath: ["/html/head/title", "/html/body/main/section/article/h2", "/html/body/main/section/article/p[1]"],
    },
    publisher: {
      "@type": "Organization",
      name: "Juice Fitness",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/juiceNewLogoPrime.png`,
      },
    },
    image: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/og-trainer-directory-london.jpg`,
      width: 1200,
      height: 630,
      alt: "Personal Trainer Directory London - Juice",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Personal Trainers in London",
      description: "Directory of certified personal trainers in London",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <TrainerDirectoryLayout city="London" districts={districts} trainers={trainers} />
      
      {/* SEO Content Section */}
      <section className="px-4 md:px-6 py-12 md:py-16 max-w-4xl mx-auto">
        <article className="blog-content">
          <h2>
            Personal Trainer Prices in London: What You Can Expect to Pay
          </h2>
          
          <p>
            Looking for a personal trainer in London and wondering what the budget should be? Whether you're chasing strength, fat loss, rehab, or general fitness, understanding local pricing helps you make an informed decision. London rates are higher than in many other UK cities, so here's what you should know:
          </p>

          <hr />

          <h2>
            Standard Price Ranges in London
          </h2>

          <h3>
            Single Session (Pay-as-you-go)
          </h3>
          
          <p>
            For a one-hour one-to-one session in London you're typically looking at £70 to £160. Trainers working in premium private studios or with certain specialisations often charge more.
          </p>
          
          <p>
            You might also find offers as low as £40–£60 per hour, but while tempting, these ultra-low prices often come with minimal experience, limited personalization, and inconsistent results. If your trainer costs less than your haircut, that's usually a red flag.
          </p>

          <h3>
            Package Deals (Multiple Sessions)
          </h3>
          
          <p>
            Buying in blocks (e.g., 5 or 10 sessions) offers a lower per-session rate. For example, a 10-session package might give you one or two sessions for free.
          </p>

          <h3>
            Monthly Subscription/Regular Frequency Plans
          </h3>
          
          <p>
            Prices depend on how often you train per week (usually between 2-4 sessions) and prices can start as low as £500 per month and go beyond £1,200 per month, depending on trainer quality, location and extras (nutrition, assessments).
          </p>
          
          <p>
            Some trainers also offer intensive "body transformation" packages, which are all-inclusive monthly plans that can cost from £700 to £2,000+ per month depending on the frequency of training and level of support.
          </p>

          <hr />

          <h2>
            Factors That Influence the Price in London
          </h2>

          <h3>
            Experience & Qualifications
          </h3>
          
          <p>
            More experienced trainers with advanced certifications (strength & conditioning, post-rehab specialism) charge more. For London, this often pushes you towards the higher end of price ranges.
          </p>

          <h3>
            Location & Setting
          </h3>
          
          <p>
            Studio location matters: Central London, trendy postcode, high overheads = higher fees. Training in exclusive private studios will cost more than in big commercial gyms.
          </p>

          <h3>
            Specialisation
          </h3>
          
          <p>
            If the trainer has niche specialism (injury rehab, athletic performance, pre/post-natal) expect higher rates due to added expertise.
          </p>

          <hr />

          <h2>
            Finding the Right Personal Trainer in London
          </h2>
          
          <p>
            When choosing a trainer, don't focus on price alone. Look for someone who:
          </p>
          
          <ul>
            <li>Has verified qualifications and experience with clients like you</li>
            <li>Can explain their training philosophy and progression clearly</li>
            <li>Tracks your progress and adapts sessions to your goals and lifestyle</li>
            <li>Offers transparent pricing and scheduling policies</li>
          </ul>

          <hr />

          <h2>
            Bottom Line
          </h2>
          
          <p>
            In London, one-to-one personal training usually sits in the region of £70 to £150 per hour, though you will find lower or higher depending on context. Packages and frequency plans can offer better per-hour value. Given the cost of operating in London (studio rent, commute, demand) higher rates aren't unusual, but your focus should always be on value, fit, and quality, not just the number.
          </p>
        </article>
      </section>
      
      <Footer />
    </main>
    </>
  )
}

