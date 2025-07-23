"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"

export function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isVisible, setIsVisible] = useState(false)

  // Extract headings from the document
  useEffect(() => {
    const extractHeadings = () => {
      const elements = Array.from(document.querySelectorAll("h2, h3, h4"))
        .filter((element) => element.id) // Only get elements with IDs
        .map((element) => ({
          id: element.id,
          text: element.textContent || "",
          level: Number.parseInt(element.tagName.substring(1)), // Get heading level (2 for h2, etc.)
        }))

      setHeadings(elements)
    }

    // Wait for content to render
    setTimeout(extractHeadings, 500)
  }, [])

  // Track scroll position to highlight active heading
  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      // Show TOC after scrolling down a bit
      setIsVisible(window.scrollY > 300)

      // Find the current active heading
      const headingElements = headings.map(({ id }) => document.getElementById(id))
      const visibleHeadings = headingElements
        .filter((el) => el !== null)
        .map((el, i) => {
          if (!el) return { id: "", offsetTop: 0 }
          return { id: el.id, offsetTop: el.getBoundingClientRect().top }
        })
        .filter(({ offsetTop }) => offsetTop < 200)

      const current = visibleHeadings[visibleHeadings.length - 1]
      if (current && current.id) {
        setActiveId(current.id)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (headings.length === 0 || !isVisible) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={scrollToTop}
          className="bg-juice text-white p-3 rounded-full shadow-lg hover:bg-juice/90 transition-all"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <button
        onClick={scrollToTop}
        className="bg-juice text-white p-3 rounded-full shadow-lg hover:bg-juice/90 transition-all mb-4"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  )
}
