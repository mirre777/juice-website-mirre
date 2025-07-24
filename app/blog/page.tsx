import { getAllPosts } from "@/lib/blog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"

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
  console.log("[BlogPage] Rendering blog page...")

  let posts
  try {
    posts = await getAllPosts()
    console.log(`[BlogPage] Fetched ${posts.length} posts`)
  } catch (error) {
    console.error("[BlogPage] Error fetching posts:", error)
    posts = []
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar isCoach={true} className="bg-white" />

      <div className="container mx-auto px-4 md:px-6 py-20 pt-32">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">Juice Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Insights, tips, and stories from the world of fitness coaching and technology.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button variant="default" className="bg-juice text-juice-foreground hover:bg-juice/90">
            All Posts
          </Button>
          <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
            Fitness
          </Button>
          <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
            Technology
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
              <Card
                key={post.slug}
                className="group hover:shadow-lg transition-all duration-300 border-gray-200 bg-white"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image || getPlaceholderImage(post.category)}
                    alt={post.title}
                    width={400}
                    height={240}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-juice text-juice-foreground">{post.category}</Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>5 min read</span>
                    </div>
                  </div>

                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-juice transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</CardDescription>

                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      variant="ghost"
                      className="group/btn p-0 h-auto font-semibold text-juice hover:text-juice/80 hover:bg-transparent"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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
