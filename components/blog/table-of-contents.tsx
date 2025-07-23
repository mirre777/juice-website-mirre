"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const tocItems: TOCItem[] = []

    headings.forEach((heading) => {
      const id =
        heading.id ||
        heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ||
        ""
      if (!heading.id) heading.id = id

      tocItems.push({
        id,
        text: heading.textContent || "",
        level: Number.parseInt(heading.tagName.charAt(1)),
      })
    })

    setToc(tocItems)

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -35% 0%" },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  if (toc.length === 0) return null

  return (
    <div className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 w-64">
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Table of Contents</h4>
        <nav className="space-y-1">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "block text-sm py-1 px-2 rounded transition-colors",
                "hover:bg-gray-100 hover:text-juice",
                activeId === item.id ? "bg-juice/10 text-juice font-medium border-l-2 border-juice" : "text-gray-600",
                item.level === 1 && "font-medium",
                item.level === 2 && "pl-4",
                item.level === 3 && "pl-6",
                item.level >= 4 && "pl-8",
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
