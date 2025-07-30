import { getAllPosts } from "@/lib/posts"
import { RelatedArticles } from "@/components/blog/related-articles"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/posts"
import Markdown from "@/components/markdown"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) {
    return notFound()
  }
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const allPosts = await getAllPosts()

  if (!post) {
    return notFound()
  }

  return (
    <article>
      <h1>{post.frontmatter.title}</h1>
      <Markdown content={post.content} />
      <RelatedArticles currentSlug={post.slug} currentCategory={post.frontmatter.category} allPosts={allPosts} />
    </article>
  )
}
