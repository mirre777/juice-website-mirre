"use client"

import { Suspense } from "react"
import TempTrainerPage from "../TempTrainerPage"
import { Loader2 } from "lucide-react"

interface PageProps {
  params: { tempId: string }
  searchParams: { token?: string }
}

export default function TempTrainerDynamicPage({ params, searchParams }: PageProps) {
  const { tempId } = params
  const { token } = searchParams

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">No access token provided</p>
          <button
            onClick={() => (window.location.href = "/marketplace/personal-trainer-website")}
            className="bg-[#D2FF28] hover:bg-[#B8E625] text-black px-6 py-2 rounded-lg font-medium"
          >
            Return to Form
          </button>
        </div>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#D2FF28]" />
            <p className="text-gray-600">Loading trainer profile...</p>
          </div>
        </div>
      }
    >
      <TempTrainerPage tempId={tempId} token={token} />
    </Suspense>
  )
}
