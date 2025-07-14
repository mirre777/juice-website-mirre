import { TempTrainerPage } from "../TempTrainerPage"

interface PageProps {
  params: {
    tempId: string
  }
  searchParams: {
    token?: string
  }
}

export default function TempTrainerPageRoute({ params, searchParams }: PageProps) {
  return <TempTrainerPage tempId={params.tempId} token={searchParams.token} />
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Trainer Preview - ${params.tempId}`,
    description: "Preview your trainer profile before activation",
    robots: "noindex, nofollow",
  }
}
