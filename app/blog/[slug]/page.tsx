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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness" // Use your actual domain

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    image: post.frontmatter.image
      ? `${baseUrl}${post.frontmatter.image}`
      : `${baseUrl}/placeholder.svg?height=500&width=1200&query=blog post hero image`,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date, // Assuming date is also the last modified date, adjust if you have a separate modified date
    author: {
      "@type": "Person",
      name: post.frontmatter.author || "Juice Team", // Default author if not specified
    },
    publisher: {
      "@type": "Organization",
      name: "Juice Fitness",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/juiceNewLogoPrime.png`, // Path to your logo
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
      {/* Set isCoach to true for light theme, and pass className for Navbar's outer container */}
      <Navbar isCoach={true} className="bg-white" />
      <article className="container mx-auto px-4 md:px-6 py-20 pt-32">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {post.frontmatter.image && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.frontmatter.image || "/placeholder.svg?height=500&width=1200&query=blog post hero image"}
              alt={post.frontmatter.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{post.frontmatter.title}</h1>
        <p className="text-gray-600 text-lg mb-8">
          {post.frontmatter.date} | {post.frontmatter.category}
        </p>
        <div className="prose max-w-none text-gray-800">
          {/* Removed prose-invert for light theme */}
          {console.log(`[BlogPostPage] Content before MdxRenderer:`, post.serializedContent)}
          <MdxRenderer source={post.serializedContent} />
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to elevate your fitness journey?</h3>
          <p className="text-lg text-gray-700 mb-6">
            Download the Juice app today and start tracking your progress, planning workouts, and achieving your goals!
          </p>
          <Link href="/download-juice-app">
            <Button className="bg-juice text-juice-foreground hover:bg-juice/90">Download the Juice App</Button>
          </Link>
        </div>
      </article>
      <Footer />
    </main>
  )
}
