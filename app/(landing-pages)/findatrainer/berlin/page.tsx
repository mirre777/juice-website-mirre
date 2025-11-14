import type { Metadata } from "next"
import { TrainerDirectoryLayout } from "@/app/(landing-pages)/components/trainer-directory-layout"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchTrainersForCity, getCityDistricts } from "@/app/(landing-pages)/utils/trainer-directory-utils"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Find a Personal Trainer in Berlin | Verified Fitness Coaches | Juice",
  description:
    "Discover certified personal trainers in Berlin. Connect with verified fitness professionals in Mitte, Friedrichshain, Kreuzberg, and more. Find your perfect trainer today.",
  keywords: [
    "personal trainer Berlin",
    "fitness trainer Berlin",
    "personal training Berlin",
    "certified trainer Berlin",
    "trainer directory Berlin",
    "fitness coach Berlin",
    "personal trainer Mitte",
    "trainer Berlin-Mitte",
    "personal trainer Friedrichshain",
    "trainer Kreuzberg",
    "Personal Trainer fuer Rueckentraining",
    "Personal Trainer fuer Abnehmen",
    "Personal Trainer fuer Muskelaufbau",
    "Personal Trainer Vergleich",
    "Personal Trainer Angebot",
    "Personal Trainer Zuhause",
    "private trainer berlin",
    "personal trainer kosten",
    "personal trainer preise",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/findatrainer/berlin",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/findatrainer/berlin",
    title: "Find a Personal Trainer in Berlin | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in Berlin. Connect with verified fitness professionals in your neighborhood.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-trainer-directory-berlin.jpg",
        width: 1200,
        height: 630,
        alt: "Personal Trainer Directory Berlin - Juice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Personal Trainer in Berlin | Verified Fitness Coaches",
    description: "Discover certified personal trainers in Berlin. Find your perfect trainer today.",
    images: ["/images/og-trainer-directory-berlin.jpg"],
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

export default async function BerlinTrainerDirectoryPage() {
  const trainers = await fetchTrainersForCity("Berlin")
  const districts = getCityDistricts("Berlin")

  const baseUrl = "https://juice.fitness"
  const fullUrl = `${baseUrl}/findatrainer/berlin`

  // JSON-LD structured data for LLM optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": fullUrl, // unique page reference for LLMs
    url: fullUrl, // explicit canonical link
    name: "Find a Personal Trainer in Berlin | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in Berlin. Connect with verified fitness professionals in Mitte, Friedrichshain, Kreuzberg, and more. Find your perfect trainer today.",
    about: "Personal Training Directory, Fitness Coaches, Berlin", // helps topic classification for AI
    keywords: [
      "personal trainer Berlin",
      "fitness trainer Berlin",
      "personal training Berlin",
      "certified trainer Berlin",
      "trainer directory Berlin",
      "fitness coach Berlin",
      "personal trainer Mitte",
      "trainer Berlin-Mitte",
      "personal trainer Friedrichshain",
      "trainer Kreuzberg",
      "Personal Trainer fuer Rueckentraining",
      "Personal Trainer fuer Abnehmen",
      "Personal Trainer fuer Muskelaufbau",
      "Personal Trainer Vergleich",
      "Personal Trainer Angebot",
      "Personal Trainer Zuhause",
      "private trainer berlin",
      "personal trainer kosten",
      "personal trainer preise",
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
      url: `${baseUrl}/images/og-trainer-directory-berlin.jpg`,
      width: 1200,
      height: 630,
      alt: "Personal Trainer Directory Berlin - Juice",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Personal Trainers in Berlin",
      description: "Directory of certified personal trainers in Berlin",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <TrainerDirectoryLayout city="Berlin" districts={districts} trainers={trainers} />
      
      {/* SEO Content Section */}
      <section className="px-4 md:px-6 py-12 md:py-16 max-w-4xl mx-auto">
        <article className="blog-content">
          <h2>
            Personal Trainer Prices in Berlin: What You Can Expect to Pay
          </h2>
          
          <p>
            Berlin has a reputation for cheap rent, strong coffee, and creative chaos. Personal training, however, is not part of the bargain bin. The good news: you can find a trainer for almost any budget, as long as you know what you're paying for.
          </p>
          
          <p>
            This guide breaks down the typical personal training prices in Berlin, explains what affects the cost, and helps you find the best value for your goals.
          </p>

          <hr />

          <h3>
            Single Session (Pay-as-you-go)
          </h3>
          
          <p>
            Most personal trainers or gym trainers in Berlin charge between €80 and €150 for a one-hour individual session. You might also find offers as low as €20–€40 per hour, but while tempting, these ultra-low prices often come with minimal experience, limited personalization, and inconsistent results. If your trainer costs less than your haircut, that's usually a red flag.
          </p>

          <h3>
            Package Deals (10 Sessions)
          </h3>
          
          <p>
            Buying a package lowers the cost per session. A 10-session package usually costs €900 to €1,300, or roughly €90–€130 per session. This is the most common option for clients who train regularly.
          </p>

          <h3>
            Monthly Subscriptions (2x per week)
          </h3>
          
          <p>
            Some Berlin personal trainers offer ongoing monthly coaching plans. For two sessions per week (eight per month), expect to pay €700–€900 per month, depending on the trainer's experience and location.
          </p>

          <hr />

          <h2>
            Factors That Influence the Price of Personal Training in Berlin
          </h2>

          <h3>
            1. Experience and Qualifications
          </h3>
          
          <p>
            Trainers with a sports science degree, advanced certifications, and years of client experience will charge more than newcomers. You're paying for proven expertise and better program design.
          </p>

          <h3>
            2. Location and Setting
          </h3>
          
          <p>
            <strong>Private Studios:</strong> Exclusive, one-on-one environments in central Berlin neighborhoods come at a premium. If you search for a personal trainer near me in Google and turn on location permissions, you will find registered trainers in Berlin. You can also search for personal trainers in Berlin here.
          </p>
          
          <p>
            <strong>Commercial Gyms:</strong> Trainers operating inside large chain gyms (Holmes Place, John Reed, FitX) often charge mid-range rates.
          </p>
          
          <p>
            <strong>In-Home Training:</strong> Expect higher prices since the trainer travels to you and brings equipment.
          </p>

          <h3>
            3. Specialization
          </h3>
          
          <p>
            Trainers who focus on rehabilitation, post-natal fitness, strength performance, or weight-loss coaching may charge more due to niche expertise.
          </p>

          <h3>
            4. Package Size
          </h3>
          
          <p>
            The more sessions you buy, the better the rate. A 20-session package will usually have a lower per-hour price than a 10-session one.
          </p>

          <hr />

          <h2>
            Finding the Right Personal Trainer in Berlin
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
          
          <p>
            A great personal trainer in Berlin will make every euro count by helping you move better, get stronger, and stay consistent long term.
          </p>

          <hr />

          <h2>
            Bottom Line
          </h2>
          
          <p>
            The average cost of a personal trainer in Berlin ranges from €80 to €150 per hour, with discounts for packages and subscriptions. Private studio training costs more, but experience, location, and specialization are what truly drive the price.
          </p>
          
          <p>
            If you're ready to find a trainer who fits your budget and your goals, start by exploring local options, checking their certifications, and booking a trial session.
          </p>
          
          <p>
            <strong>Find your personal trainer in Berlin today to get stronger, move better, and train smarter.</strong>
          </p>
        </article>
      </section>
      
      <Footer />
    </main>
    </>
  )
}

