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
  const posts: BlogPostFrontmatter[] = await getAllPosts()

  // Create sample posts if no posts are available
  const samplePosts: BlogPostFrontmatter[] = [
    {
      title: "🏋️‍♀️ Top Fitness Software in Berlin 2025: Because Spreadsheets Are So Last Year",
      excerpt:
        "Alright, fitness aficionados of Berlin! Let's face it: running a personal training business with just a notebook and a dream is about as effective as doing bicep curls in the squat rack. It's time to ditch the stone age and embrace the tech revolution. Lucky for you, 2025 is bringing some seriously juicy software upgrades. Here's the lowdown on the tools that'll make you wonder how you ever survived without them.",
      date: "2024-01-15",
      category: "Technology",
      slug: "-top-fitness-software-in-berlin-2025-because-spreadsheets-are-so-last-year",
      image: getPlaceholderImage("technology", 0),
    },
    {
      title: "💪 Building Your Personal Training Business Online",
      excerpt:
        "Learn how to leverage technology and digital platforms to grow your personal training business and reach more clients.",
      date: "2024-01-12",
      category: "Coaching",
      slug: "building-your-personal-training-business-online",
      image: getPlaceholderImage("coaching", 0),
    },
    {
      title: "🤖 The Future of Fitness Technology",
      excerpt:
        "Exploring how AI, wearables, and mobile apps are revolutionizing the way we approach fitness and health tracking.",
      date: "2024-01-10",
      category: "Technology",
      slug: "fitness-technology-future",
      image: getPlaceholderImage("technology", 0),
    },
    {
      title: "🥗 Nutrition Timing for Optimal Performance",
      excerpt:
        "Understanding when and what to eat before, during, and after workouts to maximize your training results.",
      date: "2024-01-08",
      category: "Nutrition",
      slug: "nutrition-timing-performance",
      image: getPlaceholderImage("nutrition", 0),
    },
    {
      title: "🏆 Strength Training Myths Debunked",
      excerpt: "Separating fact from fiction in the world of strength training and muscle building.",
      date: "2024-01-05",
      category: "Fitness",
      slug: "strength-training-myths",
      image: getPlaceholderImage("fitness", 1),
    },
  ]

  // Use actual posts if available, otherwise use sample posts
  const displayPosts = posts.length > 0 ? posts : samplePosts
  const featuredPost = displayPosts[0]
  const otherPosts = displayPosts.slice(1)

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar isCoach={true} />

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
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="relative rounded-xl overflow-hidden block shadow-lg group"
            >
              <div className="relative h-[500px]">
                <Image
                  src={featuredPost.image || getPlaceholderImage(featuredPost.category, 0)}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-juice text-black text-xs font-semibold rounded-full">FEATURED</span>
                    <span className="text-white/80 text-sm">{featuredPost.date}</span>
                    <span className="text-white/60 text-sm">•</span>
                    <span className="text-white/80 text-sm">{featuredPost.category}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-white/90 max-w-3xl mb-6 text-lg">{featuredPost.excerpt}</p>
                  <Button className="bg-juice text-juice-foreground hover:bg-juice/90">Read Article</Button>
                </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {otherPosts.map((post, index) => (
              <Card
                key={index}
                className="bg-white border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48">
                    <Image
                      src={post.image || getPlaceholderImage(post.category, index)}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs">{post.date}</span>
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-juice transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 line-clamp-3">{post.excerpt}</CardDescription>
                  </CardContent>
                  <CardFooter>
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

          <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
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
