"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Generate table of contents from headings
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const tocItems: TocItem[] = []

    headings.forEach((heading) => {
      if (heading.id && heading.textContent) {
        tocItems.push({
          id: heading.id,
          text: heading.textContent,
          level: Number.parseInt(heading.tagName.charAt(1)),
        })
      }
    })

    setToc(tocItems)
    setIsVisible(tocItems.length > 2) // Only show if there are more than 2 headings

    // Set up intersection observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -80% 0%" },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 hidden xl:block">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs">
        <h4 className="font-semibold text-sm text-gray-900 mb-3">Table of Contents</h4>
        <nav>
          <ul className="space-y-1">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block text-sm py-1 px-2 rounded transition-colors",
                    "hover:bg-gray-100 hover:text-juice",
                    activeId === item.id ? "bg-juice/10 text-juice font-medium" : "text-gray-600",
                    item.level > 2 && "ml-4 text-xs",
                  )}
                  style={{ paddingLeft: `${(item.level - 1) * 0.5}rem` }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
