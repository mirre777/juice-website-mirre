import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://juice.fitness" // Replace with your actual domain

  const posts = await getAllPosts()

  const blogPostEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date, // Assuming 'date' in frontmatter is last modified date
    changeFrequency: "weekly",
    priority: 0.8,
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
    // Include other static pages as needed
    ...blogPostEntries,
  ]
}
