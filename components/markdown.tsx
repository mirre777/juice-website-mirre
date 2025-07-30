interface MarkdownProps {
  content: string
}

export default function Markdown({ content }: MarkdownProps) {
  return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
}
