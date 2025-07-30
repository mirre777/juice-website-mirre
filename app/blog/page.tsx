import { Suspense } from "react"
import { getAllPosts } from "@/lib/blog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Blog - Juice Fitness",
  description: "Latest insights on fitness, training, and wellness from industry experts.",
}

interface BlogPageProps {
  searchParams: { category?: string }
}

const categories = [
  { id: "all", label: "All Posts" },
  { id: "fitness", label: "Fitness" },
  { id: "technology", label: "Technology" },
  { id: "coaching", label: "Coaching" },
  { id: "nutrition", label: "Nutrition" },
  { id: "marketing", label: "Marketing" },
]

function CategoryFilter({ selectedCategory }: { selectedCategory: string }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={category.id === "all" ? "/blog" : `/blog?category=${category.id}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {category.label}
        </Link>
      ))}
    </div>
  )
}

function BlogCard({ post }: { post: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        {post.image && (
          <div className="relative h-48 w-full">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-sm text-muted-foreground">{post.date}</span>
          </div>
          <h2 className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors">{post.title}</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>
      </Link>
    </Card>
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await getAllPosts()
  const selectedCategory = searchParams.category || "all"

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        <CategoryFilter selectedCategory={selectedCategory} />

        <Suspense fallback={<div>Loading posts...</div>}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Suspense>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
