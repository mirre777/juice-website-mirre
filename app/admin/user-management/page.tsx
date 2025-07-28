"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PotentialUser {
  id: string
  email: string
  phone?: string
  city?: string
  user_type?: string
  numClients?: number
  status: string
  created_at?: any
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<PotentialUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching users from API...")
      const response = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API response:", data)

      if (data.error) {
        console.warn("API returned error:", data.error)
        setError(data.error)
      }

      setUsers(data.users || [])
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAcceptUser = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/users/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        // Refresh the users list
        fetchUsers()
      } else {
        console.error("Failed to accept user")
      }
    } catch (error) {
      console.error("Error accepting user:", error)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return "N/A"

    try {
      if (date.toDate) {
        return date.toDate().toLocaleString()
      }
      return new Date(date).toLocaleString()
    } catch {
      return "Invalid Date"
    }
  }

  const getUserTypeBadge = (userType?: string) => {
    switch (userType) {
      case "trainer":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Trainer
          </Badge>
        )
      case "client":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Client
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waitlist":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Waitlist
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Pending
          </Badge>
        )
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">
                Manage potential users and convert them from waitlist to pending status.
              </p>
            </div>

            <Button onClick={fetchUsers} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh List
            </Button>
          </div>
        </div>

        {/* Firebase Environment Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Firebase Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
              <div>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not configured"}</div>
              <div>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "Not configured"}</div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Waitlist Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading users...
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <Button onClick={fetchUsers} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found in the waitlist.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Email</th>
                      <th className="text-left p-3 font-medium">Phone</th>
                      <th className="text-left p-3 font-medium">City</th>
                      <th className="text-left p-3 font-medium">User Type</th>
                      <th className="text-left p-3 font-medium">Clients</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Created At</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.phone || "N/A"}</td>
                        <td className="p-3">{user.city || "N/A"}</td>
                        <td className="p-3">{getUserTypeBadge(user.user_type)}</td>
                        <td className="p-3">{user.user_type === "trainer" ? user.numClients || 0 : "-"}</td>
                        <td className="p-3">{getStatusBadge(user.status)}</td>
                        <td className="p-3">{formatDate(user.created_at)}</td>
                        <td className="p-3">
                          {user.status === "waitlist" && (
                            <Button
                              onClick={() => handleAcceptUser(user.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug Info */}
        {users.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm">Total users loaded: {users.length}</p>
                <p className="text-sm">Last refresh: {new Date().toLocaleString()}</p>
                {error && <p className="text-sm text-red-600">Last error: {error}</p>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
