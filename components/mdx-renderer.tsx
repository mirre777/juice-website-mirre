"use client"

import type React from "react"

import { MDXRemote } from "next-mdx-remote"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Custom components for MDX
const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn("mt-12 mb-6 text-4xl font-bold tracking-tight text-gray-900 scroll-m-20", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    // Check if this is a TL;DR heading
    const isTldr =
      props.children && typeof props.children === "string" && props.children.toString().toLowerCase().includes("tl;dr")

    return (
      <h2
        className={cn(
          "mt-10 mb-4 text-3xl font-bold tracking-tight text-gray-900 scroll-m-20",
          isTldr && "bg-juice/10 p-4 rounded-lg",
          className,
        )}
        {...props}
      />
    )
  },
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("mt-8 mb-3 text-2xl font-bold tracking-tight text-gray-900 scroll-m-20", className)} {...props} />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={cn("mt-6 mb-2 text-xl font-bold tracking-tight text-gray-900 scroll-m-20", className)} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    // Check if this paragraph is part of a TL;DR section
    const isTldr =
      props.children && typeof props.children === "string" && props.children.toString().toLowerCase().includes("tl;dr:")

    return (
      <p
        className={cn("leading-7 mb-4 text-gray-700", isTldr && "bg-juice/10 p-4 rounded-lg font-medium", className)}
        {...props}
      />
    )
  },
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc space-y-2", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal space-y-2", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2 text-gray-700", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className={cn("mt-6 mb-6 border-l-4 border-juice pl-6 italic text-gray-800", className)} {...props} />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md border border-gray-200", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-8 border-gray-200" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-t border-gray-300 p-0 even:bg-gray-100", className)} {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border border-gray-200 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border border-gray-200 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className={cn("mb-4 mt-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white", className)} {...props} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn("relative rounded bg-gray-100 px-[0.3rem] py-[0.2rem] font-mono text-sm text-gray-900", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn("font-medium text-juice underline underline-offset-4 hover:text-juice/80", className)}
      {...props}
    />
  ),
  Image,
  Link,
}

interface MdxRendererProps {
  source: any
}

export function MdxRenderer({ source }: MdxRendererProps) {
  if (!source) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">Content is currently unavailable. Please try refreshing the page.</p>
      </div>
    )
  }

  // Check if source has the expected structure for MDXRemote
  if (!source.compiledSource && !source.frontmatter && !source.scope) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">Content format is invalid. Please contact support if this issue persists.</p>
      </div>
    )
  }

  try {
    return (
      <div className="mdx-content">
        <MDXRemote {...source} components={components} />
      </div>
    )
  } catch (error) {
    console.error("Error rendering MDX content:", error)
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600">There was an error rendering this content. Please try refreshing the page.</p>
      </div>
    )
  }
}
