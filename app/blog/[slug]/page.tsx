import { getPostBySlug, getPostSlugs } from "@/lib/blog"
import { notFound } from "next/navigation"
import { MdxRenderer } from "@/components/mdx-renderer"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { SocialShare } from "@/components/blog/social-share"
import { ReadingTime } from "@/components/blog/reading-time"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import type { Metadata } from "next"

// Force dynamic rendering to ensure content is always fresh and logs appear
export const dynamic = "force-dynamic"

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
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

// Generate metadata for SEO - applies to ALL blog posts
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found | Juice Fitness Blog",
      description: "The requested blog post could not be found.",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"
  const fullUrl = `${baseUrl}/blog/${params.slug}`

  const imageUrl = post.frontmatter.image
    ? `${baseUrl}${post.frontmatter.image}`
    : `${baseUrl}${getPlaceholderImage(post.frontmatter.category)}`

  // Generate SEO-optimized keywords based on post content and category
  const generateKeywords = (title: string, category: string, excerpt: string) => {
    const baseKeywords = [
      "fitness coaching",
      "personal trainer",
      "fitness business",
      "trainer marketing",
      "fitness SEO",
      "personal training",
      "fitness coach",
      "trainer website",
      "fitness industry",
      "Europe fitness",
      "Berlin fitness",
      category.toLowerCase(),
    ]

    // Add specific keywords based on title content
    const titleLower = title.toLowerCase()
    if (titleLower.includes("seo")) baseKeywords.push("SEO for fitness", "fitness SEO tips", "trainer SEO")
    if (titleLower.includes("website")) baseKeywords.push("trainer website", "fitness website", "website builder")
    if (titleLower.includes("booking")) baseKeywords.push("online booking", "fitness booking", "trainer booking")
    if (titleLower.includes("marketing"))
      baseKeywords.push("fitness marketing", "trainer marketing", "digital marketing")
    if (titleLower.includes("tools")) baseKeywords.push("fitness tools", "trainer tools", "fitness software")
    if (titleLower.includes("berlin")) baseKeywords.push("Berlin fitness", "Berlin trainer", "Germany fitness")
    if (titleLower.includes("nutrition")) baseKeywords.push("nutrition coaching", "fitness nutrition", "meal planning")

    return baseKeywords.slice(0, 15) // Limit to 15 keywords
  }

  return {
    title: `${post.frontmatter.title} | Juice Fitness Blog`,
    description: post.frontmatter.excerpt,
    keywords: generateKeywords(post.frontmatter.title, post.frontmatter.category, post.frontmatter.excerpt),
    authors: [{ name: "Juice Team" }],
    creator: "Juice Fitness",
    publisher: "Juice Fitness",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      url: fullUrl,
      siteName: "Juice Fitness",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.date,
      authors: ["Juice Team"],
      section: post.frontmatter.category,
      tags: [
        "fitness",
        "coaching",
        "personal trainer",
        post.frontmatter.category.toLowerCase(),
        "business growth",
        "marketing",
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: [imageUrl],
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
    other: {
      "article:author": "Juice Team",
      "article:publisher": "Juice Fitness",
      "article:section": post.frontmatter.category,
      "article:tag": post.frontmatter.category.toLowerCase(),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  console.log(`[BlogPostPage] Rendering page for slug: ${params.slug}`)
  let post

  try {
    post = await getPostBySlug(params.slug)
    console.log(`[BlogPostPage] Post fetched:`, post ? "SUCCESS" : "NOT FOUND")
  } catch (error) {
    console.error(`[BlogPostPage] Error fetching post for slug ${params.slug}:`, error)
    notFound()
  }

  if (!post) {
    console.log(`[BlogPostPage] Post not found for slug: ${params.slug}`)
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"
  const fullUrl = `${baseUrl}/blog/${params.slug}`

  // JSON-LD structured data for this specific article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    image: {
      "@type": "ImageObject",
      url: post.frontmatter.image
        ? `${baseUrl}${post.frontmatter.image}`
        : `${baseUrl}${getPlaceholderImage(post.frontmatter.category)}`,
      width: 1200,
      height: 630,
    },
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: post.frontmatter.author || "Juice Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Juice Fitness",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/juiceNewLogoPrime.png`,
      },
    },
    description: post.frontmatter.excerpt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress />
      <main className="min-h-screen bg-white text-black">
        <Navbar isCoach={true} className="bg-white" />

        <article className="container mx-auto px-4 md:px-6 py-20 pt-32 max-w-4xl">
          {/* Back to Blog */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-juice transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{post.frontmatter.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="px-3 py-1 bg-juice text-black text-sm font-semibold rounded-full">
                  {post.frontmatter.category}
                </span>
              </div>

              <ReadingTime content={post.content || ""} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              {post.frontmatter.title}
            </h1>

            {post.frontmatter.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed mb-6">{post.frontmatter.excerpt}</p>
            )}

            <SocialShare title={post.frontmatter.title} url={fullUrl} excerpt={post.frontmatter.excerpt} />
          </header>

          {/* Hero Image */}
          {(post.frontmatter.image || post.frontmatter.category) && (
            <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={post.frontmatter.image || getPlaceholderImage(post.frontmatter.category)}
                alt={post.frontmatter.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          )}

          {/* Article Content */}
          <div className="relative">
            <div className="prose prose-lg max-w-none">
              <MdxRenderer source={post.serializedContent} />
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="mb-8">
              <SocialShare title={post.frontmatter.title} url={fullUrl} excerpt={post.frontmatter.excerpt} />
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-juice/10 to-juice/5 p-8 rounded-2xl text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to elevate your fitness journey?</h3>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                Download the Juice app today and start tracking your progress, planning workouts, and achieving your
                goals with the help of certified personal trainers!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/download-juice-app">
                  <Button className="bg-juice text-juice-foreground hover:bg-juice/90">Download the Juice App</Button>
                </Link>
                <Link href="/findatrainer">
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
                    Find a Trainer
                  </Button>
                </Link>
              </div>
            </div>
          </footer>
        </article>

        <TableOfContents />
      </main>
      <Footer />
    </>
  )
}
