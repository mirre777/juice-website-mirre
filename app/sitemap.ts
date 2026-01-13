import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"
import { getAllInterviews } from "@/app/interview/_lib/interview-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness" // Replace with your actual domain

  const posts = await getAllPosts()

  const blogPostEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date, // Assuming 'date' in frontmatter is last modified date
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Interview entries
  const interviews = await getAllInterviews()
  const interviewEntries: MetadataRoute.Sitemap = interviews.map((interview) => ({
    url: `${baseUrl}/interview/${interview.slug}`,
    lastModified: interview.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  // Workout program routes
  const workoutProgramRoutes: MetadataRoute.Sitemap = [
    // Main workout programs page
    {
      url: `${baseUrl}/workout-programs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Free workout programs
    {
      url: `${baseUrl}/workout-programs/free/3-day-full-body`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Paid workout programs
    {
      url: `${baseUrl}/workout-programs/paid/dumbbell-workout`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Celebrity workout programs
    {
      url: `${baseUrl}/workout-programs/celebrity/jeff-nippard-free-minimalist-workout`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/workout-programs/celebrity/henry-cavill-superman-workout-routine`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/workout-programs/celebrity/michael-b-jordan-creed-workout`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/workout-programs/celebrity/zac-efrons-baywatch-workout`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Trainer directory routes
  const trainerDirectoryRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/findatrainer`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/findatrainer/berlin`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/findatrainer/london`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/findatrainer/amsterdam`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/findatrainer/vienna`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/findatrainer/rotterdam`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/findatrainer/the-hague`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  // Client-focused landing pages
  const clientLandingPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/best-free-workout-app-uk`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gratis-fitness-app-danmark`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gratis-workout-app-met-trainer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/trainingsplan-app-gratis`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/personal-training-amsterdam`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/personal-training-berlin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/personal-training-koebenhavn`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/personal-training-muenchen`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/personal-training-wien`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/getfit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/juice-raffle-win-free-personal-training`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  // Trainer-focused landing pages
  const trainerLandingPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/getclients`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/personal-trainer-app-demo`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/100trainers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Other important pages
  const otherPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/marketplace/personal-trainer-website`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/trainers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/clients`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/download-juice-app`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/workout-planner`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Include workout program routes
    ...workoutProgramRoutes,
    // Include trainer directory routes
    ...trainerDirectoryRoutes,
    // Include client landing pages
    ...clientLandingPages,
    // Include trainer landing pages
    ...trainerLandingPages,
    // Include other important pages
    ...otherPages,
    // Include blog posts
    ...blogPostEntries,
    // Include interview pages
    ...interviewEntries,
  ]
}
