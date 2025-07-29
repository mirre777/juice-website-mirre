"use client"
import Image from "next/image"

export function CoachDashboard() {
  return (
    <div className="relative w-full max-w-[800px] rounded-2xl border-2 border-zinc-800 shadow-2xl overflow-hidden">
      <Image
        src="/images/coach-dashboard.png"
        alt="Coach Dashboard Interface"
        width={800}
        height={600}
        className="w-full h-auto"
      />
    </div>
  )
}
