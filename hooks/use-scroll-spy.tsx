"use client"

import { useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"

interface ScrollSpyOptions {
  rootMargin?: string
  threshold?: number
  debounceMs?: number
  minViewTime?: number
}

export function useScrollSpy(sectionIds: string[], options: ScrollSpyOptions = {}) {
  const { rootMargin = "-20% 0px -70% 0px", threshold = 0.3, debounceMs = 1500, minViewTime = 1000 } = options

  const [activeSection, setActiveSection] = useState<string>("")
  const pathname = usePathname()

  // Track section view times
  const [sectionViewTimes, setSectionViewTimes] = useState<Record<string, number>>({})

  const updateURL = useCallback(
    (sectionId: string) => {
      if (typeof window === "undefined") return

      const newHash = sectionId ? `#${sectionId}` : ""
      const newURL = `${pathname}${newHash}`

      // Only update if the URL actually changes
      if (window.location.pathname + window.location.hash !== newURL) {
        window.history.replaceState(null, "", newURL)
      }
    },
    [pathname],
  )

  // Debounced URL update
  useEffect(() => {
    if (!activeSection) return

    const timer = setTimeout(() => {
      const viewTime = sectionViewTimes[activeSection] || 0

      // Only update URL if section has been viewed for minimum time
      if (viewTime >= minViewTime) {
        updateURL(activeSection)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [activeSection, sectionViewTimes, debounceMs, minViewTime, updateURL])

  useEffect(() => {
    if (typeof window === "undefined" || sectionIds.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now()

        entries.forEach((entry) => {
          const sectionId = entry.target.id

          if (entry.isIntersecting) {
            // Section became visible - start tracking view time
            setSectionViewTimes((prev) => ({
              ...prev,
              [sectionId]: now,
            }))

            // Set as active section
            setActiveSection(sectionId)
          } else {
            // Section left view - calculate total view time
            setSectionViewTimes((prev) => {
              const startTime = prev[sectionId]
              if (startTime) {
                const totalViewTime = now - startTime
                return {
                  ...prev,
                  [sectionId]: totalViewTime,
                }
              }
              return prev
            })
          }
        })

        // If no sections are intersecting, clear active section
        const visibleSections = entries.filter((entry) => entry.isIntersecting)
        if (visibleSections.length === 0) {
          setActiveSection("")
          // Clear hash when back at top
          setTimeout(() => updateURL(""), debounceMs)
        }
      },
      {
        rootMargin,
        threshold,
      },
    )

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [sectionIds, rootMargin, threshold, debounceMs, updateURL])

  return activeSection
}
