import { getPostBySlug, getPostSlugs } from "@/lib/blog"
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

// Generate metadata for SEO
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

  // Get the appropriate image
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

  return {
    title: `${post.frontmatter.title} | Juice Fitness Blog`,
    description: post.frontmatter.excerpt,
    keywords: [
      "fitness coaching",
      "personal trainer",
      "SEO for fitness",
      "fitness marketing",
      "trainer website",
      "fitness business",
      "Europe fitness",
      "Berlin fitness",
      post.frontmatter.category.toLowerCase(),
    ],
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
      authors: ["Juice Team"],
      section: post.frontmatter.category,
      tags: ["fitness", "coaching", "personal trainer", post.frontmatter.category.toLowerCase()],
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
        follow: true,\
        "max-video
