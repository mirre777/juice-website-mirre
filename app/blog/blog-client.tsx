"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, X } from "lucide-react"
import { useState } from "react"

// Fitness-related placeholder images for blog posts
const getPlaceholderImage = (category: string) => {
  const placeholders = {
    coaching: "/fitness-coaching-session.png",
    technology: "/fitness-tech-digital-health.png",
    fitness: "/gym-dumbbells.png",
    nutrition: "/healthy-meal-prep.png",
    marketing: "/personal-trainer-booking-page-mobile.png",
    general: "/fitness-equipment.png",
    myths: "/fitness-equipment.png",
    default: "/fitness-equipment.png",
  }

  const categoryKey = category?.toLowerCase() as keyof typeof placeholders
  return placeholders[categoryKey] || placeholders.default
}

interface BlogClientProps {
  posts: any[]
}

export function BlogClient({ posts }: BlogClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showAllPosts, setShowAllPosts] = useState(true)

  const allCategories = [...new Set(posts.map((post) => post.category))].sort()

  const filteredPosts = showAllPosts ? posts : posts.filter((post) => selectedCategories.includes(post.category))

  const toggleCategory = (category: string) => {
    setShowAllPosts(false)
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const selectAllCategories = () => {
    setShowAllPosts(true)
    setSelectedCategories([])
  }

  const clearAllCategories = () => {
    setSelectedCategories([])
    setShowAllPosts(true)
  }

  return (
    <>
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {/* All Posts button */}
          <Button
            variant={showAllPosts ? "default" : "outline"}
            className={
              showAllPosts
                ? "bg-juice text-juice-foreground hover:bg-juice/90"
                : "border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent"
            }
            onClick={selectAllCategories}
          >
            All Posts
          </Button>

          {/* Individual category buttons */}
          {allCategories.map((category) => (
            <Button
              key={category}
              variant={!showAllPosts && selectedCategories.includes(category) ? "default" : "outline"}
              className={
                !showAllPosts && selectedCategories.includes(category)
                  ? "bg-juice text-juice-foreground hover:bg-juice/90"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent"
              }
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Clear all filters button */}
        {!showAllPosts && selectedCategories.length > 0 && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={clearAllCategories}
            >
              <X className="w-4 h-4 mr-1" />
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Blog Posts */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 bg-white h-full cursor-pointer">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image || getPlaceholderImage(post.category)}
                    alt={post.title}
                    width={400}
                    height={240}
                    className="w-full h-48 object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-300"
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

                <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                  <CardDescription className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</CardDescription>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="group/btn p-0 h-auto font-semibold text-black hover:text-juice hover:bg-transparent"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No posts found</h3>
            <p className="text-lg text-gray-700 mb-8">
              {!showAllPosts && selectedCategories.length === 0
                ? "Select some categories to see posts."
                : "No posts match the selected categories. Try selecting different categories."}
            </p>
            <Button onClick={selectAllCategories} className="bg-juice text-juice-foreground hover:bg-juice/90">
              Show All Posts
            </Button>
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      {filteredPosts.length > 0 && (
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
    </>
  )
}
