"use client"

import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote"
import Image from "next/image"

// Define components that can be used within MDX
const components = {
  Image,
  // Add any other custom components you want to use in your MDX here
  // Example: MyCustomClientComponent,
}

interface MdxRendererProps {
  source: MDXRemoteProps["source"]
}

export function MdxRenderer({ source }: MdxRendererProps) {
  return <MDXRemote {...source} components={components} />
}
