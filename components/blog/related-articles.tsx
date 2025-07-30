"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface RelatedArticle {
  title: string
  slug: string
  category: string
  image?: string
  excerpt: string
}

interface RelatedArticlesProps {
  currentSlug: string
  currentCategory: string
}

// Sample related articles - in a real app, this would come from your blog API
const ALL_ARTICLES: RelatedArticle[] = [
  {
    title: "📱 How to Get More Clients with a Booking Page",
    slug: "how-to-get-more-clients-with-booking-page",
    category: "Marketing",
    image: "/personal-trainer-booking-page-mobile.png",
    excerpt:
      "Still relying on DMs and WhatsApp back-and-forths? You're losing clients while checking your phone. A booking page converts scrolls into sessions while you sleep.",
  },
  {
    title: "🏆 Top 5 Free Personal Trainer Website Builders (2025)",
    slug: "top-5-free-personal-trainer-website-builders-2025",
    category: "Technology",
    image: "/personal-trainer-website-builders-laptops.png",
    excerpt:
      "Let's cut the fluff. You're a personal trainer, not a web developer. You need a high-converting website that books sessions while you're smashing reps with clients.",
  },
  {
    title: "📊 Tracking Biometrics: What Actually Moves the Needle",
    slug: "tracking-biometrics-what-actually-moves-the-needle",
    category: "Technology",
    image: "/biometric-tracking-fitness-coach-phone.png",
    excerpt:
      "Biometrics aren't just numbers—they're accountability. Knowing how often clients sleep, rest, recover, and move can elevate your coaching.",
  },
  {
    title: "📊 Google Sheets for Coaching: A Trainer's Secret Weapon (or Trap?)",
    slug: "google-sheets-for-coaching-trainers-secret-weapon-or-trap",
    category: "Technology",
    image: "/google-sheets-coaching-trainer-gym.png",
    excerpt:
      "Let's be real: fancy coaching apps are sexy. But Google Sheets? That's where trainers roll up their sleeves. Customize whatever you want, track everything, and stay lean on cost.",
  },
  {
    title: "🥗 Nutrition Coaching Trends Taking Over Berlin in 2025",
    slug: "nutrition-coaching-trends-berlin-2025",
    category: "Nutrition",
    image: "/nutrition-coaching-trends-berlin-woman-phone.png",
    excerpt:
      "From personalized meal planning to AI-driven nutrition advice, discover the trends shaping how Berlin's fitness professionals approach nutrition coaching.",
  },
  {
    title: "🏋️ Strength Training Revolution: What's New in Berlin Gyms",
    slug: "strength-training-revolution-berlin-gyms",
    category: "Fitness",
    image: "/strength-training-barbell-gym.png",
    excerpt:
      "Berlin's gym scene is evolving with new training methodologies, equipment innovations, and coaching techniques that are changing how we build strength.",
  },
]

// Fitness-related placeholder images for articles without images
const getPlaceholderImage = (category: string) => {
  const placeholders = {
    coaching: "/fitness-coaching-session.png",
    technology: "/fitness-tech-digital-health.png",
    fitness: "/gym-dumbbells.png",
    nutrition: "/healthy-meal-prep.png",
    marketing: "/personal-trainer-booking-page-mobile.png",
    default: "/fitness-equipment.png",
  }

  const categoryKey = category?.toLowerCase() as keyof typeof placeholders
  return placeholders[categoryKey] || placeholders.default
}

export function RelatedArticles({ currentSlug, currentCategory }: RelatedArticlesProps) {
  // Filter out current article and get related articles
  const relatedArticles = ALL_ARTICLES.filter((article) => article.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category articles
      if (a.category === currentCategory && b.category !== currentCategory) return -1
      if (b.category === currentCategory && a.category !== currentCategory) return 1
      return 0
    })
    .slice(0, 2) // Show only 2 related articles

  if (relatedArticles.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold mb-8 text-gray-900">Related Articles</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedArticles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="block group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-200 bg-white cursor-pointer">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={article.image || getPlaceholderImage(article.category)}
                  alt={article.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-juice text-juice-foreground">{article.category}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-juice transition-colors line-clamp-2 mb-3">
                  {article.title}
                </h4>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.excerpt}</p>

                <div className="flex items-center text-juice font-semibold text-sm">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
