import { Suspense } from "react"
import TempTrainerPage from "./TempTrainerPage"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TempTrainerPage />
    </Suspense>
  )
}
