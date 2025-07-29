"use client"

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { format } from "date-fns"

interface WaitlistEntry {
  id: string
  email: string
  plan: string
  message: string
  createdAt: any
  status: string
  source: string
  user_type: string // Use user_type instead of role
}

const WaitlistPage = () => {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWaitlist = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/waitlist")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setWaitlist(data)
      } catch (error: any) {
        console.error("Failed to fetch waitlist:", error)
        toast.error("Failed to fetch waitlist")
      } finally {
        setLoading(false)
      }
    }

    fetchWaitlist()
  }, [])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setWaitlist((prevWaitlist) =>
        prevWaitlist.map((entry) => (entry.id === id ? { ...entry, status: newStatus } : entry)),
      )
      toast.success("Status updated successfully!")
    } catch (error: any) {
      console.error("Failed to update status:", error)
      toast.error("Failed to update status")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Waitlist Entries</h1>
      {loading ? (
        <p>Loading waitlist...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Plan</th>
                <th className="text-left py-3 px-4">Message</th>
                <th className="text-left py-3 px-4">Created At</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Source</th>
                <th className="text-left py-3 px-4">User Type</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{entry.email}</td>
                  <td className="py-3 px-4">{entry.plan}</td>
                  <td className="py-3 px-4">{entry.message}</td>
                  <td className="py-3 px-4">{format(new Date(entry.createdAt), "yyyy-MM-dd HH:mm:ss")}</td>
                  <td className="py-3 px-4">{entry.status}</td>
                  <td className="py-3 px-4">{entry.source}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        entry.user_type === "trainer" ? "bg-juice/20 text-juice" : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {entry.user_type || "unknown"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={entry.status}
                      onChange={(e) => handleStatusUpdate(entry.id, e.target.value)}
                      className="border rounded py-1 px-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default WaitlistPage
