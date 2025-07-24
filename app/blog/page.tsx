import { getBlogPosts } from "@/lib/blog"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Clock } from "lucide-react"

export default async function BlogPage() {
  const posts = await getBlogPosts()

  // Get featured posts (first 2 posts)
  const featuredPosts = posts.slice(0, 2)
  const regularPosts = posts.slice(2)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Juice Blog</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Insights, tips, and stories from the world of fitness coaching and technology.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {posts.length === 0 ? (
          // Empty state when no posts are found
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 mb-8">We're working on some amazing blog content for you. Stay tuned!</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Featured Posts Section */}
            {featuredPosts.length > 0 && (
              <section className="mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <Card key={post.slug} className="overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className="relative h-64">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-juice text-black font-semibold">FEATURED</Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                              {post.category}
                            </Badge>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </div>
                          </div>
                          <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{post.title}</h2>
                          <p className="text-white/90 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                          {post.excerpt === "Coming Soon" ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled
                              className="bg-white/20 text-white border-0 cursor-not-allowed"
                            >
                              Coming Soon
                            </Button>
                          ) : (
                            <Link href={`/blog/${post.slug}`}>
                              <Button variant="secondary" size="sm" className="bg-juice text-black hover:bg-juice/90">
                                Read Article
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Latest Articles Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    All
                  </Button>
                  <Button variant="ghost" size="sm">
                    Coaching
                  </Button>
                  <Button variant="ghost" size="sm">
                    Technology
                  </Button>
                  <Button variant="ghost" size="sm">
                    Fitness
                  </Button>
                  <Button variant="ghost" size="sm">
                    Nutrition
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <Card key={post.slug} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {post.excerpt === "Coming Soon" && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center text-white">
                            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                            <p className="text-sm opacity-90">Stay tuned for this upcoming article!</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                      {post.excerpt === "Coming Soon" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="w-full cursor-not-allowed bg-transparent"
                        >
                          Coming Soon
                        </Button>
                      ) : (
                        <Link href={`/blog/${post.slug}`} className="block">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Read More →
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {regularPosts.length === 0 && featuredPosts.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">More articles coming soon!</p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Newsletter Section */}
        <section className="bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get the latest articles, resources, and insights on fitness coaching and technology delivered straight to
            your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" className="flex-1" />
            <Button className="bg-juice text-black hover:bg-juice/90">Subscribe</Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </section>
      </div>
    </div>
  )
}
