import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

import { getAllPosts, type BlogPostFrontmatter } from "@/lib/blog"

// This line ensures the page always fetches the latest data from Vercel Blob
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Juice Blog | Insights for Fitness Coaches & Enthusiasts",
  description:
    "Explore articles, tips, and stories on fitness coaching, technology, and personal training. Stay updated with the latest trends from Juice.",
  openGraph: {
    images: "/images/og-feature-graphic.png", // Specific image for blog page
  },
}

// Fitness-related placeholder images
const getPlaceholderImage = (category: string, index = 0) => {
  const placeholders = {
    coaching: [
      "/fitness-coaching-session.png",
      "/personal-trainer-workout-clipboard.png",
      "/fitness-coaching-motivation-gym.png",
    ],
    technology: ["/fitness-app-tracking.png", "/placeholder-oiv1i.png", "/fitness-tech-digital-health.png"],
    fitness: ["/gym-dumbbells.png", "/fitness-equipment.png", "/strength-training-barbell-gym.png"],
    nutrition: ["/healthy-meal-prep.png", "/healthy-meal-prep.png", "/nutrition-planning.png"],
    default: ["/diverse-fitness-training.png", "/gym-equipment-variety.png", "/workout-plan.png"],
  }

  const categoryKey = category.toLowerCase() as keyof typeof placeholders
  const images = placeholders[categoryKey] || placeholders.default
  return images[index % images.length]
}

export default async function BlogPage() {
  console.log("[BlogPage] Starting to fetch posts...")
  const posts: BlogPostFrontmatter[] = await getAllPosts()
  console.log(`[BlogPage] Fetched ${posts.length} posts from blob storage`)

  // Only show posts if we actually have them from blob storage
  // Don't fall back to sample posts - this ensures we only show real content
  if (posts.length === 0) {
    return (
      <main className="min-h-screen bg-white text-black">
        <Navbar isCoach={true} />

        {/* Hero Section */}
        <section className="pt-24 pb-8">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Juice Blog</h1>
              <p className="text-xl text-gray-600 max-w-3xl mb-6">
                Insights, tips, and stories from the world of fitness coaching and technology.
              </p>
            </div>
          </div>
        </section>

        {/* No Posts Message */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Coming Soon!</h2>
              <p className="text-gray-600 mb-8">
                We're working on some amazing content for you. Check back soon for the latest insights on fitness
                coaching and technology.
              </p>
              <Link href="/download-juice-app">
                <Button className="bg-juice text-juice-foreground hover:bg-juice/90">Download the Juice App</Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  const featuredPosts = posts.slice(0, 2)
  const otherPosts = posts.slice(2)

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar isCoach={true} />

      {/* Hero Section - Reduced padding */}
      <section className="pt-24 pb-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Juice Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mb-6">
              Insights, tips, and stories from the world of fitness coaching and technology.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts - Two side by side */}
      {featuredPosts.length > 0 && (
        <section className="py-6">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post, index) => (
                <Link
                  key={index}
                  href={`/blog/${post.slug}`}
                  className="relative rounded-xl overflow-hidden block shadow-lg group"
                >
                  <div className="relative h-[300px]">
                    <Image
                      src={post.image || getPlaceholderImage(post.category, index)}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-juice text-black text-xs font-semibold rounded-full">
                          FEATURED
                        </span>
                        <span className="text-white/80 text-sm">{post.date}</span>
                        <span className="text-white/60 text-sm">•</span>
                        <span className="text-white/80 text-sm">{post.category}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold mb-3 line-clamp-2">{post.title}</h2>
                      <p className="text-white/90 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      <Button className="bg-juice text-juice-foreground hover:bg-juice/90">Read Article</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid - Only show if we have other posts */}
      {otherPosts.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
                  All
                </Button>
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
                  Coaching
                </Button>
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
                  Technology
                </Button>
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
                  Fitness
                </Button>
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
                  Nutrition
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post, index) => (
                <Card
                  key={index}
                  className="bg-white border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative h-48">
                      <Image
                        src={post.image || getPlaceholderImage(post.category, index + 2)}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                        <span className="text-gray-500 text-xs">{post.date}</span>
                      </div>
                      <CardTitle className="text-lg text-gray-900 group-hover:text-juice transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-gray-700 line-clamp-2">{post.excerpt}</CardDescription>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        variant="link"
                        className="text-black p-0 h-auto underline decoration-juice hover:no-underline group-hover:text-juice transition-colors"
                      >
                        Read More →
                      </Button>
                    </CardFooter>
                  </Link>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section - Reduced padding */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">Subscribe to Our Newsletter</h2>
                <p className="text-gray-700 mb-4">
                  Get the latest articles, resources, and insights on fitness coaching and technology delivered straight
                  to your inbox.
                </p>
              </div>
              <div>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-juice"
                  />
                  <Button className="bg-juice text-juice-foreground hover:bg-juice/90">Subscribe</Button>
                </form>
                <p className="text-gray-500 text-sm mt-2 mb-3">We respect your privacy. Unsubscribe at any time.</p>
                <Link href="/download-juice-app">
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
                    Download the Juice App
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
