"use client"

import type { BlogPostFrontmatter } from "@/lib/blog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface RelatedArticlesProps {
  currentSlug: string
  currentCategory: string
  allPosts: BlogPostFrontmatter[]
}

export function RelatedArticles({ currentSlug, currentCategory, allPosts }: RelatedArticlesProps) {
  // Filter out current post and get related articles
  const otherPosts = allPosts.filter((post) => post.slug !== currentSlug)

  // Prioritize posts from same category, then others
  const sameCategoryPosts = otherPosts.filter((post) => post.category === currentCategory)
  const otherCategoryPosts = otherPosts.filter((post) => post.category !== currentCategory)

  // Get 2 related articles (prefer same category)
  const relatedPosts = [...sameCategoryPosts, ...otherCategoryPosts].slice(0, 2)

  if (relatedPosts.length === 0) return null

  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {relatedPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <Image
                  src={post.image || "/placeholder.svg?height=200&width=400&query=blog-post"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
