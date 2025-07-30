"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface RelatedArticle {
  title: string
  slug: string
  image: string
  category: string
}

interface RelatedArticlesProps {
  currentSlug: string
  currentCategory: string
}

// Sample related articles - in a real app, this would come from your blog data
const ALL_ARTICLES: RelatedArticle[] = [
  {
    title: "📊 Tracking Biometrics: What Actually Moves the Needle",
    slug: "tracking-biometrics-what-actually-moves-the-needle",
    image: "/biometric-tracking-fitness-coach-phone.png",
    category: "Technology",
  },
  {
    title: "📊 Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)",
    slug: "google-sheets-for-coaching-trainers-secret-weapon-or-trap",
    image: "/google-sheets-coaching-trainer-gym.png",
    category: "Technology",
  },
  {
    title: "📱 How to Get More Clients with a Booking Page",
    slug: "how-to-get-more-clients-with-booking-page",
    image: "/personal-trainer-booking-page-mobile.png",
    category: "Marketing",
  },
  {
    title: "🏆 Top 5 Free Personal Trainer Website Builders (2025)",
    slug: "top-5-free-personal-trainer-website-builders-2025",
    image: "/personal-trainer-website-builders-laptops.png",
    category: "Technology",
  },
  {
    title: "🥗 Nutrition Coaching Trends Taking Over Berlin in 2025",
    slug: "nutrition-coaching-trends-berlin-2025",
    image: "/nutrition-coaching-trends-berlin-woman-phone.png",
    category: "Nutrition",
  },
  {
    title: "🏋️ Strength Training Revolution: What's New in Berlin Gyms",
    slug: "strength-training-revolution-berlin-gyms",
    image: "/strength-training-barbell-gym.png",
    category: "Fitness",
  },
]

export function RelatedArticles({ currentSlug, currentCategory }: RelatedArticlesProps) {
  // Filter out current article and get related articles
  const availableArticles = ALL_ARTICLES.filter((article) => article.slug !== currentSlug)

  // Prioritize articles from the same category, then others
  const sameCategory = availableArticles.filter((article) => article.category === currentCategory)
  const otherCategories = availableArticles.filter((article) => article.category !== currentCategory)

  // Take up to 2 articles, preferring same category
  const relatedArticles = [...sameCategory, ...otherCategories].slice(0, 2)

  if (relatedArticles.length === 0) return null

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold mb-8 text-gray-900">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedArticles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="block group">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-juice text-juice-foreground">{article.category}</Badge>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-juice transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="ghost"
                    className="group/btn p-0 h-auto font-semibold text-juice hover:text-juice/80 hover:bg-transparent"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
