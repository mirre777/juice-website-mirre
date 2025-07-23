"use client"

import { useEffect } from "react"
import HomePage from "@/components/home-page"

export default function ClientPage() {
  useEffect(() => {
    // Any client-side initialization can go here
  }, [])

  return <HomePage />
}
