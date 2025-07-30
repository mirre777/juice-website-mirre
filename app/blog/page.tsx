import { getAllPosts } from "@/lib/blog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { ReadingTime } from "@/components/blog/reading-time"
import type { Metadata } from "next"

// Force dynamic rendering to ensure fresh content
export const dynamic = "force-dynamic"

// SEO Metadata for blog listing page
export const metadata: Metadata = {
  title: "Fitness Blog | SEO Tips, Marketing & Business Growth for Personal Trainers",
  description:
    "Discover proven strategies for fitness coaches and personal trainers. Learn SEO, marketing, client booking, and business growth tactics that actually work in Europe.",
  keywords: [
    "fitness blog",
    "personal trainer marketing",
    "SEO for fitness coaches",
    "trainer website tips",
    "fitness business growth",
    "personal trainer SEO",
    "fitness coach marketing",
    "trainer booking system",
    "fitness industry trends",
    "Berlin fitness coaching",
    "Europe personal training",
  ],
  authors: [{ name: "Juice Team" }],
  creator: "Juice Fitness",
  publisher: "Juice Fitness",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"),
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Fitness Blog | Marketing & SEO Tips for Personal Trainers",
    description:
      "Proven strategies for fitness coaches and personal trainers. Learn SEO, marketing, and business growth tactics that work.",
    url: "/blog",
    siteName: "Juice Fitness",
    images: [
      {
        url: "/fitness-coaching-motivation-gym.png",
        width: 1200,
        height: 630,
        alt: "Fitness Blog - Marketing and SEO Tips for Personal Trainers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitness Blog | Marketing & SEO Tips for Personal Trainers",
    description:
      "Proven strategies for fitness coaches and personal trainers. Learn SEO, marketing, and business growth tactics that work.",
    images: ["/fitness-coaching-motivation-gym.png"],
    creator: "@JuiceFitness",
    site: "@JuiceFitness",
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

export default async function BlogPage() {
  console.log("[BlogPage] Fetching all blog posts...")

  const posts = await getAllPosts()
  console.log(`[BlogPage] Loaded ${posts.length} posts`)

  // Get the appropriate image for each category
  const getPlaceholderImage = (category: string) => {
    const placeholders = {
      coaching: "/fitness-coaching-session.png",
      technology: "/fitness-tech-digital-health.png",
      fitness: "/gym-dumbbells.png",
      nutrition: "/healthy-meal-prep.png",
      visibility: "/seo-tips-fitness-coaches-europe.png",
      marketing: "/personal-trainer-booking-page-mobile.png",
      default: "/fitness-equipment.png",
    }
    const categoryKey = category?.toLowerCase() as keyof typeof placeholders
    return placeholders[categoryKey] || placeholders.default
  }

  // JSON-LD structured data for blog listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Juice Fitness Blog",
    description:
      "Proven strategies for fitness coaches and personal trainers. Learn SEO, marketing, and business growth tactics that work.",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Juice Fitness",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"}/images/juiceNewLogoPrime.png`,
      },
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: post.image
        ? `${process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"}${post.image}`
        : `${process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"}${getPlaceholderImage(post.category)}`,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        "@type": "Person",
        name: "Juice Team",
      },
      publisher: {
        "@type": "Organization",
        name: "Juice Fitness",
        logo: {
          "@type": "ImageObject",
          url: `${process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"}/images/juiceNewLogoPrime.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"}/blog/${post.slug}`,
      },
      keywords: [post.category.toLowerCase(), "fitness", "personal trainer", "coaching"],
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-lime-50 to-green-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Fitness Business <span className="text-lime-600">Blog</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Proven strategies for fitness coaches and personal trainers. Learn SEO, marketing, client booking, and
                business growth tactics that actually work in Europe.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-white px-4 py-2 rounded-full text-gray-700 shadow-sm">
                  🔍 SEO for Fitness Coaches
                </span>
                <span className="bg-white px-4 py-2 rounded-full text-gray-700 shadow-sm">
                  📱 Website & Booking Tips
                </span>
                <span className="bg-white px-4 py-2 rounded-full text-gray-700 shadow-sm">💪 Business Growth</span>
                <span className="bg-white px-4 py-2 rounded-full text-gray-700 shadow-sm">🇪🇺 Europe-Focused</span>
              </div>
            </div>
          </section>

          {/* Blog Posts Grid */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No blog posts found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => {
                    const imageUrl = post.image || getPlaceholderImage(post.category)

                    return (
                      <article
                        key={post.slug}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                      >
                        {/* Featured Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-lime-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Meta Information */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <time dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </time>
                            </div>
                            <ReadingTime content={post.excerpt} />
                          </div>

                          {/* Title */}
                          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-lime-600 transition-colors">
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h2>

                          {/* Excerpt */}
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                          {/* Read More Button */}
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="outline" className="group/btn bg-transparent">
                              Read More
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Grow Your Fitness Business?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Get a professional website that books clients while you train. No coding required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/marketplace/personal-trainer-website">
                  <Button size="lg" className="bg-lime-600 hover:bg-lime-700">
                    Create Your Trainer Website
                  </Button>
                </Link>
                <Link href="/findatrainer">
                  <Button variant="outline" size="lg">
                    Find a Trainer
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
