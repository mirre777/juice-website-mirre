import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  themeColor: "#000000",
}

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="bg-black text-white min-h-screen">{children}</div>
}
