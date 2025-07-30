import { getAllPosts } from "@/lib/blog"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Force dynamic rendering to ensure fresh content
export const dynamic = "force-dynamic"

// Fitness-related placeholder images for blog posts
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
            Marketing
          </Button>
          <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
            Nutrition
          </Button>
        </div>

        {/* Blog Posts */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 bg-white h-full cursor-pointer">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={post.image || getPlaceholderImage(post.category)}
                      alt={`${post.title} - ${post.category} blog post for fitness coaches and personal trainers`}
                      width={400}
                      height={240}
                      className="w-full h-48 \
