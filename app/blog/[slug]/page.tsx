import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { MDXRemote } from "next-mdx-remote"
import RelatedArticles from "@/components/blog/related-articles"
import { CustomCode } from "@/components/mdx/custom-code"
import { CustomHeading } from "@/components/mdx/custom-heading"
import { CustomList } from "@/components/mdx/custom-list"
import { CustomParagraph } from "@/components/mdx/custom-paragraph"

const components = {
  h1: (props: any) => <CustomHeading level={1} {...props} />,
  h2: (props: any) => <CustomHeading level={2} {...props} />,
  h3: (props: any) => <CustomHeading level={3} {...props} />,
  h4: (props: any) => <CustomHeading level={4} {...props} />,
  h5: (props: any) => <CustomHeading level={5} {...props} />,
  h6: (props: any) => <CustomHeading level={6} {...props} />,
  p: CustomParagraph,
  ul: (props: any) => <CustomList type="ul" {...props} />,
  ol: (props: any) => <CustomList type="ol" {...props} />,
  code: CustomCode,
  pre: (props: any) => <CustomCode {...props} />,
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.frontmatter.title} - Juice Fitness Blog`,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: post.frontmatter.image ? [post.frontmatter.image] : [],
    },
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">{post.frontmatter.category}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={post.frontmatter.date}>
                {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.frontmatter.title}</h1>
          <p className="text-xl text-muted-foreground">{post.frontmatter.excerpt}</p>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote {...post.serializedContent} components={components} />
        </div>

        {/* Related Articles */}
        <RelatedArticles currentSlug={post.slug} currentCategory={post.frontmatter.category} />
      </div>
    </article>
  )
}
