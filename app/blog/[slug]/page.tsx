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

  const post = await getPostBySlug(params.slug)

  if (!post) {
    console.log(`[BlogPostPage] Post not found for slug: ${params.slug}`)
    notFound()
  }

  console.log(`[BlogPostPage] Successfully loaded post: ${post.frontmatter.title}`)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"
  const fullUrl = `${baseUrl}/blog/${params.slug}`

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

  const imageUrl = post.frontmatter.image || getPlaceholderImage(post.frontmatter.category)

  // JSON-LD structured data for this specific article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    image: {
      "@type": "ImageObject",
      url: `${baseUrl}${imageUrl}`,
      width: 1200,
      height: 630,
    },
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: "Juice Team",
      url: `${baseUrl}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Juice Fitness",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/juiceNewLogoPrime.png`,
        width: 200,
        height: 60,
      },
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    articleSection: post.frontmatter.category,
    keywords: [
      post.frontmatter.category.toLowerCase(),
      "fitness",
      "personal trainer",
      "coaching",
      "business growth",
      "marketing",
      "SEO",
      "Europe",
    ].join(", "),
    wordCount: post.content.split(" ").length,
    copyrightHolder: {
      "@type": "Organization",
      name: "Juice Fitness",
    },
    copyrightYear: new Date(post.frontmatter.date).getFullYear(),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress />
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-20">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back to Blog */}
            <div className="mb-8">
              <Link href="/blog">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 p-0">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.frontmatter.date}>
                    {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span className="bg-lime-100 text-lime-800 px-2 py-1 rounded-full text-xs font-medium">
                    {post.frontmatter.category}
                  </span>
                </div>
                <ReadingTime content={post.content} />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.frontmatter.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">{post.frontmatter.excerpt}</p>

              {/* Social Share */}
              <SocialShare url={fullUrl} title={post.frontmatter.title} />
            </header>

            {/* Featured Image */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={post.frontmatter.title}
                width={1200}
                height={630}
                className="w-full h-64 md:h-96 object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>

            {/* Article Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Table of Contents - Desktop */}
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24">
                  <TableOfContents content={post.content} />
                </div>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-lime-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-lime-600 prose-code:bg-lime-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                  <MdxRenderer source={post.serializedContent} />
                </div>

                {/* Article Footer */}
                <footer className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <p className="text-sm text-gray-600">
                        Published on{" "}
                        <time dateTime={post.frontmatter.date}>
                          {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </p>
                      <p className="text-sm text-gray-600">
                        Category:{" "}
                        <span className="bg-lime-100 text-lime-800 px-2 py-1 rounded-full text-xs font-medium">
                          {post.frontmatter.category}
                        </span>
                      </p>
                    </div>
                    <SocialShare url={fullUrl} title={post.frontmatter.title} />
                  </div>

                  {/* Call to Action */}
                  <div className="bg-gradient-to-r from-lime-50 to-green-50 p-8 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Grow Your Fitness Business?</h3>
                    <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                      Get a professional website that books clients while you train. No coding required, SEO-optimized,
                      and ready in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/marketplace/personal-trainer-website">
                        <Button className="bg-lime-600 hover:bg-lime-700">Create Your Trainer Website</Button>
                      </Link>
                      <Link href="/findatrainer">
                        <Button
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent"
                        >
                          Find a Trainer
                        </Button>
                      </Link>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  )
}
