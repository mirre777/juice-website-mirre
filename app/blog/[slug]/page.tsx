import { getPostBySlug, getPostSlugs } from "@/lib/blog"
import { notFound } from "next/navigation"
import { MdxRenderer } from "@/components/mdx-renderer"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
    coaching: "/placeholder.svg?height=500&width=1200",
    technology: "/placeholder.svg?height=500&width=1200",
    fitness: "/placeholder.svg?height=500&width=1200",
    nutrition: "/placeholder.svg?height=500&width=1200",
    default: "/placeholder.svg?height=500&width=1200",
  }

  const categoryKey = category?.toLowerCase() as keyof typeof placeholders
  return placeholders[categoryKey] || placeholders.default
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  console.log(`[BlogPostPage] Rendering page for slug: ${params.slug}`)
  let post

  try {
    post = await getPostBySlug(params.slug)
  } catch (error) {
    console.error(`[BlogPostPage] Error fetching post for slug ${params.slug}:`, error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    image: post.frontmatter.image
      ? `${baseUrl}${post.frontmatter.image}`
      : `${baseUrl}${getPlaceholderImage(post.frontmatter.category)}`,
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
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar isCoach={true} className="bg-white" />
      <article className="container mx-auto px-4 md:px-6 py-20 pt-32">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Hero Image */}
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={post.frontmatter.image || getPlaceholderImage(post.frontmatter.category)}
            alt={post.frontmatter.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-juice text-black text-sm font-semibold rounded-full">
              {post.frontmatter.category}
            </span>
            <span className="text-gray-500 text-sm">{post.frontmatter.date}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{post.frontmatter.title}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{post.frontmatter.excerpt}</p>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none text-gray-800 prose-headings:text-gray-900 prose-a:text-juice prose-a:no-underline hover:prose-a:underline">
          <MdxRenderer source={post.serializedContent} />
        </div>

        {/* Call to Action */}
        <div className="mt-16 p-8 bg-gray-50 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to elevate your fitness journey?</h3>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Download the Juice app today and start tracking your progress, planning workouts, and achieving your goals
            with the help of certified personal trainers!
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
      </article>
      <Footer />
    </main>
  )
}
