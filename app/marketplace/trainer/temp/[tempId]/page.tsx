import { TempTrainerPage } from "../TempTrainerPage"

interface PageProps {
  params: Promise<{ tempId: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function TempTrainerDynamicPage({ params, searchParams }: PageProps) {
  const { tempId } = await params
  const { token } = await searchParams

  return <TempTrainerPage tempId={tempId} token={token} />
}

export async function generateMetadata({ params }: { params: Promise<{ tempId: string }> }) {
  const { tempId } = await params

  return {
    title: "Trainer Website Preview - Juice",
    description: "Preview your personal trainer website before activation",
    robots: "noindex, nofollow",
  }
}
