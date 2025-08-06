import { Suspense } from "react"
import CopenhagenPersonalTrainingClientPage from "./CopenhagenPersonalTrainingClientPage"

export const metadata = {
  title: "Personlig træning København - Find din træner | Juice Fitness",
  description: "Personlig træning i København. Gratis prøvetime eller videosamtale. Find trænere der passer til dig for sundhed, muskelopbygning eller vægttab.",
  keywords: "personlig træner københavn, gratis prøvetime træning københavn, fitness coach københavn, træning for begyndere københavn, muskelopbygning københavn",
}

export default function CopenhagenPersonalTrainingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CopenhagenPersonalTrainingClientPage />
    </Suspense>
  )
}
