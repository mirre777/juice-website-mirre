import Link from "next/link"
import Image from "next/image"
import type { BlogPostFrontmatter } from "@/lib/blog"

interface RelatedArticlesProps {
  articles: BlogPostFrontmatter[]
}

// Fitness-related placeholder images for blog posts
function getPlaceholderImage(category: string): string {
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

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={article.image || getPlaceholderImage(article.category)}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-juice text-black text-xs font-semibold rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">{article.date}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 group-hover:text-juice transition-colors line-clamp-2 mb-2">
                {article.title}
              </h4>
              <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

