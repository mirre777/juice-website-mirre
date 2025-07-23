"use client"
import { useRouter } from "next/navigation"
import HomePage from "@/components/home-page"

export default function ClientPage() {
  const router = useRouter()

  // This component now serves as the root route handler
  // It renders the HomePage component directly
  return <HomePage />
}
