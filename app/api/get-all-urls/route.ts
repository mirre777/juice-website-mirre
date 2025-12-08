import { NextResponse } from "next/server"
import { getAllPosts } from "@/lib/blog"
import { getAllInterviews } from "@/app/interview/_lib/interview-data"

export async function GET() {
  try {
    const posts = await getAllPosts()
    const interviews = await getAllInterviews()

    const blogUrls = posts.map((post) => `https://juice.fitness/blog/${post.slug}`)
    const interviewUrls = interviews.map((interview) => `https://juice.fitness/interview/${interview.slug}`)

    return NextResponse.json({
      blogPosts: blogUrls,
      interviews: interviewUrls,
      total: {
        blogPosts: blogUrls.length,
        interviews: interviewUrls.length,
      },
    })
  } catch (error) {
    console.error("Error fetching URLs:", error)
    return NextResponse.json({ error: "Failed to fetch URLs" }, { status: 500 })
  }
}

