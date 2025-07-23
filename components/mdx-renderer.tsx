"use client"

import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote"
import Image from "next/image"
import { CustomHeading } from "./mdx/custom-heading"
import { CustomList, CustomListItem } from "./mdx/custom-list"
import { CustomParagraph } from "./mdx/custom-paragraph"
import { CustomCode, CustomPre } from "./mdx/custom-code"

// Define components that can be used within MDX
const components = {
  Image,
  h1: (props: any) => <CustomHeading level={1} {...props} />,
  h2: (props: any) => <CustomHeading level={2} {...props} />,
  h3: (props: any) => <CustomHeading level={3} {...props} />,
  h4: (props: any) => <CustomHeading level={4} {...props} />,
  h5: (props: any) => <CustomHeading level={5} {...props} />,
  h6: (props: any) => <CustomHeading level={6} {...props} />,
  ul: (props: any) => <CustomList {...props} />,
  ol: (props: any) => <CustomList ordered {...props} />,
  li: (props: any) => <CustomListItem {...props} />,
  p: (props: any) => <CustomParagraph {...props} />,
  code: (props: any) => <CustomCode {...props} />,
  pre: (props: any) => <CustomPre {...props} />,
}

interface MdxRendererProps {
  source: MDXRemoteProps["source"]
}

export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <div className="mdx-content">
      <MDXRemote {...source} components={components} />
    </div>
  )
}
