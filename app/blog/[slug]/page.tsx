import { getPostBySlug, getPostSlugs, getAllPosts, getRelatedArticles } from "@/lib/blog"
import { RelatedArticles } from "@/components/related-articles"
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
import type { BlogPostFrontmatter } from "@/lib/blog"

// Force dynamic rendering to ensure content is always fresh and logs appear
export const dynamic = "force-dynamic"

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Fitness-related placeholder images for blog posts (used in metadata)
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

// Helper function to normalize image URL - handles both full URLs and relative paths
// This ensures LinkedIn and other social platforms get the correct image URL
const getImageUrl = (image: string | undefined, category: string, baseUrl: string): string => {
  if (!image) {
    return `${baseUrl}${getPlaceholderImage(category)}`
  }
  // If image is already a full URL (starts with http:// or https://), use it as-is
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }
  // Otherwise, prepend baseUrl for relative paths
  return `${baseUrl}${image}`
}

// Generate SEO-optimized keywords based on post content and category
// Moved outside generateMetadata so it can be reused in both metadata and JSON-LD
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

// Generate metadata for SEO - applies to ALL blog posts
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found | Juice Fitness Blog",
      description: "The requested blog post could not be found.",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"
  const fullUrl = `${baseUrl}/blog/${slug}`

  const imageUrl = getImageUrl(post.image, post.category, baseUrl)

  return {
    title: `${post.title} | Juice Fitness Blog`,
    description: post.excerpt,
    keywords: generateKeywords(post.title, post.category, post.excerpt),
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
      title: post.title,
      description: post.excerpt,
      url: fullUrl,
      siteName: "Juice Fitness",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ["Juice Team"],
      section: post.category,
      tags: ["fitness", "coaching", "personal trainer", post.category.toLowerCase(), "business growth", "marketing"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
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
      "article:section": post.category,
      "article:tag": post.category.toLowerCase(),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  console.log(`[v0] BlogPostPage: Starting to render page for slug: "${slug}"`)
  let post

  try {
    post = await getPostBySlug(slug)
    console.log(`[v0] BlogPostPage: Post fetch result:`, post ? "SUCCESS" : "NOT FOUND")
    if (post) {
      console.log(`[v0] BlogPostPage: Post details:`, {
        title: post.title,
        slug: post.slug,
        category: post.category,
        date: post.date,
        hasContent: !!post.content,
        hasRawContent: !!post.rawContent,
        excerpt: post.excerpt?.substring(0, 100) + "...",
      })
    }
  } catch (error) {
    console.error(`[v0] BlogPostPage: Error fetching post for slug "${slug}":`, error)
    notFound()
  }

  if (!post) {
    console.log(`[v0] BlogPostPage: Post not found for slug: "${slug}", calling notFound()`)
    notFound()
  }

  console.log(`[v0] BlogPostPage: Successfully loaded post "${post.title}", proceeding with render`)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"
  const fullUrl = `${baseUrl}/blog/${slug}`

  // Get related articles
  const relatedArticles = await getRelatedArticles(slug, 2)

  // Calculate image URL for JSON-LD (same logic as in generateMetadata)
  const imageUrl = getImageUrl(post.image, post.category, baseUrl)

  // JSON-LD structured data for this specific article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": fullUrl, // ✅ unique page reference for LLMs
    url: fullUrl,   // ✅ explicit canonical link
    headline: post.title,
    description: post.excerpt,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
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
        url: `${baseUrl}/images/juiceNewLogoPrime.png`,
      },
    },
    about: post.category, // ✅ helps topic classification for AI
    keywords: generateKeywords(post.title, post.category, post.excerpt).join(", "), // ✅ semantic keywords
    speakable: { // ✅ for AI voice/summarization models
      "@type": "SpeakableSpecification",
      "xpath": ["/html/head/title", "/html/body/article/h1", "/html/body/article/p[1]"],
    },
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
        <Navbar />

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
                <span>{post.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="px-3 py-1 bg-juice text-black text-sm font-semibold rounded-full">
                  {post.category}
                </span>
              </div>

              <ReadingTime content={post.rawContent || ""} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">{post.title}</h1>

            {post.excerpt && <p className="text-xl text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>}

            <SocialShare title={post.title} url={fullUrl} excerpt={post.excerpt} />
          </header>

          {/* Hero Image */}
          {(post.image || post.category) && (
            <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={post.image || getPlaceholderImage(post.category)}
                alt={post.title}
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
              <MdxRenderer source={post.rawContent || ""} />
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="mb-8">
              <SocialShare title={post.title} url={fullUrl} excerpt={post.excerpt} />
            </div>

            {/* Related Articles */}
            <RelatedArticles articles={relatedArticles} />

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
