import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getAllPosts } from "@/lib/blog"

interface RelatedArticlesProps {
  currentSlug: string
  currentCategory: string
}

export default async function RelatedArticles({ currentSlug, currentCategory }: RelatedArticlesProps) {
  const allPosts = await getAllPosts()

  // Filter out current post
  const otherPosts = allPosts.filter((post) => post.slug !== currentSlug)

  // Prioritize posts from same category, then others
  const sameCategoryPosts = otherPosts.filter((post) => post.category === currentCategory)
  const otherCategoryPosts = otherPosts.filter((post) => post.category !== currentCategory)

  // Get 2 related articles (prefer same category)
  const relatedPosts = [...sameCategoryPosts, ...otherCategoryPosts].slice(0, 2)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {relatedPosts.map((post) => (
          <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <Link href={`/blog/${post.slug}`}>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg?height=200&width=400"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  {post.category}
                </Badge>
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}
