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
  user_type: string
  status: string
  created_at: string
  numClients?: number
  plan?: string
  source?: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<PotentialUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchUsers = async () => {
    try {
      console.log("Fetching users from API...")
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      console.log("API response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users")
      }

      setUsers(data.users || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchUsers()
  }

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
        // Refresh the list after accepting
        handleRefresh()
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

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case "trainer":
        return (
          <Badge variant="default" className="bg-blue-500">
            Trainer
          </Badge>
        )
      case "client":
        return <Badge variant="secondary">Client</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waitlist":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Waitlist
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            Pending
          </Badge>
        )
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage potential users and convert them from waitlist to pending status.</p>
        </div>

        {/* Waitlist Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Waitlist Users</CardTitle>
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
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

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading users...</span>
              </div>
            ) : error ? (
              <div className="text-red-600 py-4">
                <p>Error: {error}</p>
                <Button onClick={handleRefresh} className="mt-2 bg-transparent" variant="outline">
                  Try Again
                </Button>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No users found in the waitlist.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Email</th>
                      <th className="text-left p-3 font-semibold">Phone</th>
                      <th className="text-left p-3 font-semibold">City</th>
                      <th className="text-left p-3 font-semibold">User Type</th>
                      <th className="text-left p-3 font-semibold">Clients</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">Created At</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.phone || "N/A"}</td>
                        <td className="p-3">{user.city || "N/A"}</td>
                        <td className="p-3">{getUserTypeBadge(user.user_type)}</td>
                        <td className="p-3">
                          {user.user_type === "trainer" && user.numClients
                            ? user.numClients
                            : user.user_type === "trainer"
                              ? "0"
                              : "-"}
                        </td>
                        <td className="p-3">{getStatusBadge(user.status)}</td>
                        <td className="p-3">
                          {new Date(user.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
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

        {/* Firebase Security Rules Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Firebase Security Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you're experiencing permission errors when converting users, make sure your Firebase security rules
              allow writes to the users collection:
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
