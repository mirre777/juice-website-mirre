import type { Metadata } from "next"
import { getAllPosts } from "@/lib/blog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BlogClient } from "./blog-client"

export const metadata: Metadata = {
  title: "Juice Blog - Fitness Coaching Tips & Personal Training Insights",
  description:
    "Expert insights, tips, and stories from the world of fitness coaching and personal training. Learn how to grow your fitness business and help clients succeed.",
  keywords: [
    "fitness coaching blog",
    "personal training tips",
    "fitness business advice",
    "workout programming",
    "client management tips",
    "personal trainer marketing",
    "fitness industry insights",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/blog",
    title: "Juice Blog - Fitness Coaching Tips & Personal Training Insights",
    description:
      "Expert insights, tips, and stories from the world of fitness coaching and personal training. Learn how to grow your fitness business.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice Blog - Fitness Coaching Tips",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juice Blog - Fitness Coaching Tips & Personal Training Insights",
    description:
      "Expert insights and tips for fitness coaches and personal trainers. Grow your business and help clients succeed.",
    images: ["/images/og-feature-graphic.png"],
    creator: "@juice_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

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

        <BlogClient posts={posts} />
      </div>

      <Footer />
    </main>
  )
}
