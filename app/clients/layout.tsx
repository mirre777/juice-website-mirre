import type React from "react"
export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-black min-h-screen">{children}</div>
}
