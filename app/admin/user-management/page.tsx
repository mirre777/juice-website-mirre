"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw, Users, AlertCircle } from "lucide-react"
import Link from "next/link"

interface PotentialUser {
  id: string
  email: string
  phone?: string
  city?: string
  user_type: string
  numClients?: number
  status: string
  created_at: string | null
  plan?: string
}

interface ApiResponse {
  success: boolean
  users: PotentialUser[]
  count: number
  error?: string
  mock?: boolean
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<PotentialUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMockData, setIsMockData] = useState(false)

  const fetchUsers = async () => {
    console.log("Fetching users...")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/users")
      const data: ApiResponse = await response.json()

      console.log("API response:", data)

      if (data.success) {
        setUsers(data.users)
        setIsMockData(data.mock || false)
      } else {
        setError(data.error || "Failed to fetch users")
        setUsers(data.users || []) // Use mock data if available
        setIsMockData(true)
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Network error occurred")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const acceptUser = async (userId: string) => {
    console.log("Accepting user:", userId)
    try {
      const response = await fetch("/api/admin/users/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        // Refresh the user list
        fetchUsers()
      } else {
        console.error("Failed to accept user")
      }
    } catch (error) {
      console.error("Error accepting user:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return "Invalid Date"
    }
  }

  const getUserTypeBadge = (userType: string) => {
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
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600">
            undefined
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waitlist":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            waitlist (potential_users)
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
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage potential users and convert them from waitlist to pending status.</p>
        </div>

        {/* Waitlist Users Section */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Waitlist Users
            </CardTitle>
            <Button onClick={fetchUsers} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh List
            </Button>
          </CardHeader>
          <CardContent>
            {/* Firebase Environment Info */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Firebase Environment</h3>
              <div className="text-sm text-gray-600 font-mono">
                <div>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not configured"}</div>
                <div>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "Not configured"}</div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading users...</span>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-red-800 font-medium">Error loading users</p>
                  <p className="text-red-600 text-sm">{error}</p>
                  {isMockData && <p className="text-red-600 text-sm mt-1">Showing mock data instead.</p>}
                </div>
              </div>
            )}

            {/* Users Table */}
            {!loading && users.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">City</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">User Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Clients</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.phone || "N/A"}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.city || "N/A"}</td>
                        <td className="border border-gray-300 px-4 py-2">{getUserTypeBadge(user.user_type)}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.user_type === "trainer" ? user.numClients || "N/A" : "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{getStatusBadge(user.status)}</td>
                        <td className="border border-gray-300 px-4 py-2">{formatDate(user.created_at)}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Button
                            onClick={() => acceptUser(user.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Accept
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* No Users State */}
            {!loading && users.length === 0 && !error && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No users found in the waitlist.</p>
              </div>
            )}

            {/* Mock Data Warning */}
            {isMockData && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">⚠️ Showing mock data because Firebase connection failed.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Firebase Security Rules Section */}
        <Card>
          <CardHeader>
            <CardTitle>Firebase Security Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you're experiencing permission errors when converting users, make sure your Firebase security rules
              allow writing to the users collection:
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /potential_users/{document=**} {
      allow read, write: if true;
    }
    match /users/{userId} {
      allow read, write: if true;
    }
    
    match /profile/{document=**} {
      allow read, write: if true;
    }
    
    match /notifications/{document=**} {
      allow read, write: if true;
    }
  }
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
