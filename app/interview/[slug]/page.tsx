import { getInterviewBySlug, getInterviewSlugs, getAllInterviews } from "@/lib/interview"
import { notFound } from "next/navigation"
import { MdxRenderer } from "@/components/mdx-renderer"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { SocialShare } from "@/components/blog/social-share"
import { ReadingTime } from "@/components/blog/reading-time"
import { InterviewWaitlistWidget } from "@/components/interview/interview-waitlist-widget"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import type { Metadata } from "next"
import type { InterviewFrontmatter } from "@/lib/interview"

export const dynamic = "force-dynamic"

type InterviewPageProps = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = await getInterviewSlugs()
  return slugs.map((slug) => ({ slug }))
}

async function getRelatedInterviews(currentSlug: string, limit = 2): Promise<InterviewFrontmatter[]> {
  const allInterviews = await getAllInterviews()
  const otherInterviews = allInterviews.filter((interview) => interview.slug !== currentSlug)
  const shuffled = otherInterviews.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, limit)
}

const getPlaceholderImage = () => "/fitness-coaching-session.png"

export async function generateMetadata({ params }: InterviewPageProps): Promise<Metadata> {
  const interview = await getInterviewBySlug(params.slug)

  if (!interview) {
    return {
      title: "Interview Not Found | Juice Fitness",
      description: "The requested interview could not be found.",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"
  const fullUrl = `${baseUrl}/interview/${params.slug}`

  const ogImage =
    interview.image === "/lena-gym-photo.png"
      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2825_edited-TItnaXlNqyoIoriOP3lxU4ebGua5uR.png"
      : interview.image
        ? `${baseUrl}${interview.image}`
        : `${baseUrl}${getPlaceholderImage()}`

  return {
    title: `${interview.title} | Juice Fitness Interviews`,
    description: interview.excerpt,
    keywords: [
      "fitness interview",
      "personal trainer interview",
      "fitness business",
      "trainer success story",
      interview.trainerName,
      "fitness coaching",
    ],
    authors: [{ name: "Juice Team" }],
    creator: "Juice Fitness",
    publisher: "Juice Fitness",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: interview.title,
      description: interview.excerpt,
      url: fullUrl,
      siteName: "Juice Fitness",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: interview.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: interview.date,
      authors: [interview.trainerName],
    },
    twitter: {
      card: "summary_large_image",
      title: interview.title,
      description: interview.excerpt,
      images: [ogImage],
      creator: "@JuiceFitness",
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
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  console.log(`[v0] ========== INTERVIEW PAGE RENDER START ==========`)
  console.log(`[v0] InterviewPage: Slug from params: "${params.slug}"`)
  console.log(`[v0] InterviewPage: Current time: ${new Date().toISOString()}`)

  const interview = await getInterviewBySlug(params.slug)

  if (!interview) {
    console.log(`[v0] InterviewPage: Interview not found for slug: "${params.slug}"`)
    console.log(`[v0] ========== INTERVIEW PAGE RENDER END (NOT FOUND) ==========`)
    notFound()
  }

  console.log(`[v0] InterviewPage: Successfully loaded interview`)
  console.log(`[v0] InterviewPage: Title: "${interview.title}"`)
  console.log(`[v0] InterviewPage: Image path: "${interview.image}"`)
  console.log(`[v0] InterviewPage: Trainer: "${interview.trainerName}"`)
  console.log(`[v0] InterviewPage: Has content: ${!!interview.content}`)
  console.log(`[v0] ========== INTERVIEW PAGE RENDER END (SUCCESS) ==========`)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness"
  const fullUrl = `${baseUrl}/interview/${params.slug}`
  const relatedInterviews = await getRelatedInterviews(params.slug, 2)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: interview.title,
    description: interview.excerpt,
    image: {
      "@type": "ImageObject",
      url: interview.image ? `${baseUrl}${interview.image}` : `${baseUrl}${getPlaceholderImage()}`,
      width: 1200,
      height: 630,
    },
    datePublished: interview.date,
    dateModified: interview.date,
    author: {
      "@type": "Person",
      name: interview.trainerName,
    },
    publisher: {
      "@type": "Organization",
      name: "Juice Fitness",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/juiceNewLogoPrime.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress />
      <main className="min-h-screen bg-white text-black">
        <Navbar isCoach={true} className="bg-white" />

        <article className="container mx-auto px-4 md:px-6 py-20 pt-32 max-w-4xl">
          {/* Back to Blog */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-juice transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{interview.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="px-3 py-1 bg-juice text-black text-sm font-semibold rounded-full">
                  {interview.category}
                </span>
              </div>

              <ReadingTime content={interview.rawContent || ""} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">{interview.title}</h1>

            {interview.excerpt && <p className="text-xl text-gray-600 leading-relaxed mb-6">{interview.excerpt}</p>}

            <SocialShare title={interview.title} url={fullUrl} excerpt={interview.excerpt} />
          </header>

          {/* Hero Image */}
          {interview.image && (
            <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={interview.image || "/placeholder.svg"}
                alt={interview.title}
                fill
                className="object-cover object-[center_30%]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          )}

          {/* Article Content */}
          <div className="relative">
            <div className="prose prose-lg max-w-none">
              <MdxRenderer source={interview.content} />
            </div>
          </div>

          <InterviewWaitlistWidget trainerName={interview.trainerName} articleTitle={interview.title} />

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="mb-8">
              <SocialShare title={interview.title} url={fullUrl} excerpt={interview.excerpt} />
            </div>

            {/* Related Interviews */}
            {relatedInterviews.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">More Interviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedInterviews.map((relatedInterview) => (
                    <Link
                      key={relatedInterview.slug}
                      href={`/interview/${relatedInterview.slug}`}
                      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedInterview.image || getPlaceholderImage()}
                          alt={relatedInterview.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-juice text-black text-xs font-semibold rounded-full">
                            {relatedInterview.category}
                          </span>
                          <span className="text-sm text-gray-500">{relatedInterview.date}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-juice transition-colors line-clamp-2 mb-2">
                          {relatedInterview.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-3">{relatedInterview.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-juice/10 to-juice/5 p-8 rounded-2xl text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to start your fitness journey?</h3>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                Connect with certified personal trainers like {interview.trainerName} and achieve your fitness goals!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/findatrainer">
                  <Button className="bg-juice text-juice-foreground hover:bg-juice/90">Find a Trainer</Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 bg-transparent">
                    Read More Stories
                  </Button>
                </Link>
              </div>
            </div>
          </footer>
        </article>

        <TableOfContents />
      </main>
      <Footer />
    </>
  )
}
