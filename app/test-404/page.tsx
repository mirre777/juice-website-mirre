"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Test404Page() {
  const router = useRouter()

  useEffect(() => {
    // This will trigger the not-found.tsx page
    router.push("/non-existent-page-to-trigger-404")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to test the 404 page...</p>
    </div>
  )
}
