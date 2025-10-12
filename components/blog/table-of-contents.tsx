"use client"

import { useEffect, useState } from "react"

export function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState<string>("")

  // Extract headings from the document
  useEffect(() => {
    if (typeof document === "undefined") return

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
    if (headings.length === 0 || typeof window === "undefined" || typeof document === "undefined") return

    const handleScroll = () => {
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

  // Component now returns null
  return null
}
