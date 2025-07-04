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

export default async function BlogPage() {
  const posts: BlogPostFrontmatter[] = await getAllPosts()

  const featuredPost = posts[0]
  const otherPosts = posts.slice(1).filter((post) => post && post.slug && post.title) // Ensure valid posts are rendered

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar isCoach={true} /> {/* Ensure Navbar is in light mode */}
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Juice Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mb-8">
              Insights, tips, and stories from the world of fitness coaching and technology.
            </p>
          </div>
        </div>
      </section>
      {/* Featured Post */}
      {featuredPost && (
        <section className="py-8">
          <div className="container px-4 md:px-6">
            <Link href={`/blog/${featuredPost.slug}`} className="relative rounded-xl overflow-hidden block shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10"></div>
              <Image
                src={featuredPost.image || "/placeholder.svg?height=500&width=1200&query=gym workout featured"}
                alt={featuredPost.title}
                width={1200}
                height={500}
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-juice text-black text-xs font-semibold rounded-full">FEATURED</span>
                  <span className="text-gray-600 text-sm">{featuredPost.date}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{featuredPost.title}</h2>
                <p className="text-gray-700 max-w-3xl mb-6">{featuredPost.excerpt}</p>
                <Button className="bg-juice text-juice-foreground hover:bg-juice/90">Read Article</Button>
              </div>
            </Link>
          </div>
        </section>
      )}
      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700">
                All
              </Button>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700">
                Coaching
              </Button>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700">
                Technology
              </Button>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700">
                Fitness
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {otherPosts.map((post, index) => (
              <Card key={index} className="bg-white border-gray-200 overflow-hidden shadow-md">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48">
                    <Image
                      src={post.image || "/placeholder.svg?height=300&width=500&query=abstract pattern for blog post"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs">{post.date}</span>
                    </div>
                    {console.log(`[BlogPage] Rendering post: ${post.title}, Slug: ${post.slug}`)}
                    <CardTitle className="text-xl text-gray-900">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700">{post.excerpt}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="link"
                      className="text-black p-0 h-auto underline decoration-juice hover:no-underline"
                    >
                      Read More
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>
      {/* Newsletter Section */}
      <section className="py-16 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Subscribe to Our Newsletter</h2>
                <p className="text-gray-700 mb-6">
                  Get the latest articles, resources, and insights on fitness coaching and technology delivered straight
                  to your inbox.
                </p>
              </div>
              <div>
                <form className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-juice"
                  />
                  <Button className="bg-juice text-juice-foreground hover:bg-juice/90">Subscribe</Button>
                </form>
                <p className="text-gray-500 text-sm mt-3 mb-4">We respect your privacy. Unsubscribe at any time.</p>
                <Link href="/download-juice-app">
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700">
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
