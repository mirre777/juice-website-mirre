import { Suspense } from "react"
import { notFound } from "next/navigation"
import TrainerContentEditor from "./TrainerContentEditor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  params: Promise<{ id: string }>
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-64" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default async function TrainerEditPage({ params }: PageProps) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <TrainerContentEditor trainerId={id} />
    </Suspense>
  )
}
