import TrainerProfilePage from "./TrainerProfilePage"

export const metadata = {
  title: "Trainer Profile | Juice Marketplace",
  description: "Connect with elite personal trainers on the Juice platform",
}

interface TrainerPageProps {
  params: {
    id: string
  }
}

export default function TrainerPage({ params }: TrainerPageProps) {
  return <TrainerProfilePage trainerId={params.id} />
}
