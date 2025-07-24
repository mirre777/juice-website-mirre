import { getAllPosts } from "@/lib/blog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Tag, ArrowRight } from "lucide-react"

// Force dynamic rendering to ensure fresh content
export const dynamic = "force-dynamic"

// Fitness-related placeholder images for blog posts
const getPlaceholderImage = (category: string) => {
  const placeholders = {
    coaching: "/fitness-coaching-session.png",
    technology: "/fitness-tech-digital-health.png",
    fitness: "/gym-dumbbells.png",
    nutrition: "/healthy-meal-prep.png",
    default: "/fitness-equipment.png",
  }

  const categoryKey = category?.toLowerCase() as keyof typeof placeholders
  return placeholders[categoryKey] || placeholders.default
}

export default async function BlogPage() {
  console.log("[BlogPage] Starting to render blog page...")

  const posts = await getAllPosts()
  console.log(`[BlogPage] Got ${posts.length} posts`)

  // Get featured posts (first 2 posts)
  const featuredPosts = posts.slice(0, 2)
  const remainingPosts = posts.slice(2)

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar isCoach={true} className="bg-white" />

      {/* Hero Section - Reduced padding */}
      <section className="container mx-auto px-4 md:px-6 pt-24 pb-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Juice Blog</h1>
          <p className="text-xl text-gray-600">
            Insights, tips, and stories from the world of fitness coaching and technology.
          </p>
        </div>
      </section>

      {/* Featured Posts Section - Two side by side */}
      {featuredPosts.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <article key={post.slug} className="group relative">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={post.frontmatter.image || getPlaceholderImage(post.frontmatter.category)}
                      alt={post.frontmatter.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-juice text-black text-sm font-bold rounded-full">FEATURED</span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.frontmatter.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          <span>{post.frontmatter.category}</span>
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold mb-2 line-clamp-2">{post.frontmatter.title}</h2>

                      <p className="text-gray-200 line-clamp-2 mb-4">{post.frontmatter.excerpt}</p>

                      <Button className="bg-juice text-black hover:bg-juice/90 font-semibold" size="sm">
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles Section - Reduced padding */}
      <section className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>

          {/* Category Filter */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-juice text-black border-juice">
              All
            </Button>
            <Button variant="outline" size="sm">
              Coaching
            </Button>
            <Button variant="outline" size="sm">
              Technology
            </Button>
            <Button variant="outline" size="sm">
              Fitness
            </Button>
            <Button variant="outline" size="sm">
              Nutrition
            </Button>
          </div>
        </div>

        {/* Blog Grid */}
        {remainingPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={post.frontmatter.image || getPlaceholderImage(post.frontmatter.category)}
                        alt={post.frontmatter.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {post.frontmatter.category}
                        </span>
                        <span>{post.frontmatter.date}</span>
                      </div>

                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-juice transition-colors line-clamp-2">
                        {post.frontmatter.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-3 mb-4">{post.frontmatter.excerpt}</p>

                      <div className="flex items-center text-juice font-semibold text-sm">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          // Empty state when no posts are found
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Tag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                We're working on some amazing content for you. Check back soon for the latest insights on fitness
                coaching and technology!
              </p>
              <Link href="/">
                <Button className="bg-juice text-black hover:bg-juice/90">Back to Home</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {remainingPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="border-gray-300 hover:bg-gray-100 bg-transparent">
              Load More Articles
            </Button>
          </div>
        )}
      </section>

      {/* Newsletter Section - Reduced padding */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-8">
              Get the latest articles, resources, and insights on fitness coaching and technology delivered straight to
              your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-juice focus:border-transparent"
              />
              <Button className="bg-juice text-black hover:bg-juice/90 px-8">Subscribe</Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>

            <div className="mt-6">
              <Link href="/download-juice-app" className="text-juice hover:underline font-semibold">
                Download the Juice App
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
