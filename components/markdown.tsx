import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote"
import { CustomCode } from "./mdx/custom-code"
import { CustomHeading } from "./mdx/custom-heading"
import { CustomList } from "./mdx/custom-list"
import { CustomParagraph } from "./mdx/custom-paragraph"

interface MarkdownProps {
  content: MDXRemoteSerializeResult
}

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

export default function Markdown({ content }: MarkdownProps) {
  return <MDXRemote {...content} components={components} />
}
