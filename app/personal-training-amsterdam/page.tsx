import { Suspense } from "react"
import AmsterdamPersonalTrainingClientPage from "./AmsterdamPersonalTrainingClientPage"

export const metadata = {
  title: "Personal Training Amsterdam - Vind jouw trainer | Juice Fitness",
  description: "Personal training in Amsterdam. Gratis proefles of videogesprek. Vind trainers die bij jou passen voor gezondheid, spiermassa of houding verbeteren.",
  keywords: "personal trainer amsterdam, gratis proefles personal trainer, fitness begeleiding amsterdam, krachttraining amsterdam, houding verbeteren training",
}

export default function AmsterdamPersonalTrainingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AmsterdamPersonalTrainingClientPage />
    </Suspense>
  )
}
