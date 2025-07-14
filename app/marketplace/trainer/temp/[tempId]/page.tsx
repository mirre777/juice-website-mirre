import { Suspense } from "react"
import TempTrainerPage from "../TempTrainerPage"

interface PageProps {
  params: Promise<{ tempId: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function TempTrainerDynamicPage({ params, searchParams }: PageProps) {
  const { tempId } = await params
  const { token } = await searchParams

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <TempTrainerPage tempId={tempId} token={token} />
    </Suspense>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ tempId: string }> }) {
  const { tempId } = await params

  return {
    title: "Trainer Website Preview - Juice",
    description: "Preview your personal trainer website before activation",
    robots: "noindex, nofollow",
  }
}
