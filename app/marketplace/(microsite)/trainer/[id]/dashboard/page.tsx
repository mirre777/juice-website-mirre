import { TrainerDashboard } from "./TrainerDashboard"

interface TrainerDashboardPageProps {
  params: {
    id: string
  }
}

export default function TrainerDashboardPage({ params }: TrainerDashboardPageProps) {
  return <TrainerDashboard trainerId={params.id} />
}
