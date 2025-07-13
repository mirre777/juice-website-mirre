import { Suspense } from "react"
import TrainerContentEditor from "./TrainerContentEditor"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  params: {
    id: string
  }
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function TrainerEditPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <TrainerContentEditor trainerId={params.id} />
    </Suspense>
  )
}
