import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { BlogPostFrontmatter } from "@/lib/blog"

interface RelatedArticlesProps {
  currentSlug: string
  currentCategory: string
  allPosts?: BlogPostFrontmatter[]
}

export default function RelatedArticles({ currentSlug, currentCategory, allPosts = [] }: RelatedArticlesProps) {
  // Filter out current post and get related posts
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === currentCategory && b.category !== currentCategory) return -1
      if (b.category === currentCategory && a.category !== currentCategory) return 1
      // Then by date
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 2)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedPosts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`}>
              <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Featured Image */}
                {post.image && (
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
