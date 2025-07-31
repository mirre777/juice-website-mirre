import { getAllPosts } from "@/lib/blog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
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

// Fitness-related placeholder images for blog posts
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

export default async function BlogPage() {
  console.log("[BlogPage] Rendering blog page...")

  let posts
  try {
    posts = await getAllPosts()
    console.log(`[BlogPage] Fetched ${posts.length} posts`)
  } catch (error) {
    console.error("[BlogPage] Error fetching posts:", error)
    posts = []
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
        name: post.author || "Juice Team",
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
      keywords: post.keywords || [post.category.toLowerCase(), "fitness", "personal trainer", "coaching"],
    })),
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar isCoach={true} className="bg-white" />

      <div className="container mx-auto px-4 md:px-6 py-20 pt-32">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">Juice Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Insights, tips, and strategies from the world of fitness coaching and technology.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button variant="default" className="bg-juice text-juice-foreground hover:bg-juice/90">
            All Posts
          </Button>
          <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
            Technology
          </Button>
          <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
            Marketing
          </Button>
          <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
            Coaching
          </Button>
          <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
            Nutrition
          </Button>
        </div>

        {/* Blog Posts */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 bg-white h-full cursor-pointer">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={post.image || getPlaceholderImage(post.category)}
                      alt={post.title}
                      width={400}
                      height={240}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={posts.indexOf(post) < 6} // Prioritize first 6 images
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-juice text-juice-foreground">{post.category}</Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readingTime || "5 min read"}</span>
                      </div>
                    </div>

                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-juice transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                    <CardDescription className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</CardDescription>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        className="group/btn p-0 h-auto font-semibold text-juice hover:text-juice/80 hover:bg-transparent"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon!</h3>
              <p className="text-gray-600 mb-8">
                We're working on some amazing content for you. Check back soon for the latest insights on fitness
                coaching and technology.
              </p>
              <Link href="/download-juice-app">
                <Button className="bg-juice text-juice-foreground hover:bg-juice/90">Download the Juice App</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        {posts.length > 0 && (
          <div className="mt-20 bg-gradient-to-r from-juice/10 to-juice/5 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Stay Updated</h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Get the latest fitness insights, coaching tips, and technology updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-juice focus:border-transparent"
              />
              <Button className="bg-juice text-juice-foreground hover:bg-juice/90 px-8">Subscribe</Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
