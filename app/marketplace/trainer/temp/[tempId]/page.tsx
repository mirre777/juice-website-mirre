import { TempTrainerPage } from "../TempTrainerPage"

interface TempTrainerPageProps {
  params: {
    tempId: string
  }
  searchParams: {
    token?: string
  }
}

export default function TempTrainerRoute({ params, searchParams }: TempTrainerPageProps) {
  return <TempTrainerPage tempId={params.tempId} token={searchParams.token} />
}

export async function generateMetadata({ params }: { params: { tempId: string } }) {
  return {
    title: `Trainer Profile Preview - ${params.tempId}`,
    description: "Preview your trainer profile before activation",
  }
}
