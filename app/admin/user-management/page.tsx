"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface PotentialUser {
  id: string
  email: string
  phone?: string
  city?: string
  user_type: "client" | "trainer"
  numClients?: number
  status: string
  created_at: any
  plan?: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<PotentialUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users")
      }

      setUsers(data.users || [])
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const acceptUser = async (userId: string, userEmail: string) => {
    try {
      setProcessingUsers((prev) => new Set(prev).add(userId))

      const response = await fetch("/api/admin/users/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email: userEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to accept user")
      }

      toast({
        title: "Success",
        description: `User ${userEmail} has been accepted and moved to pending status.`,
      })

      // Refresh the users list
      await fetchUsers()
    } catch (err) {
      console.error("Error accepting user:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to accept user",
        variant: "destructive",
      })
    } finally {
      setProcessingUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"

    try {
      // Handle Firestore timestamp
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleDateString()
      }
      // Handle regular date string
      return new Date(timestamp).toLocaleDateString()
    } catch {
      return "N/A"
    }
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "trainer":
        return "bg-blue-100 text-blue-800"
      case "client":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waitlist":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "active":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">
                Manage potential users and convert them from waitlist to pending status.
              </p>
            </div>

            <Button
              onClick={fetchUsers}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh List
            </Button>
          </div>
        </div>

        {/* Firebase Environment Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Firebase Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              <div>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not configured"}</div>
              <div>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "Not configured"}</div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Waitlist Users</CardTitle>
            <CardDescription>Users who have joined the waitlist and are waiting to be accepted.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading users...
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
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
                        <td className="p-3">
                          <div className="font-medium">{user.email}</div>
                          {user.plan && <div className="text-sm text-gray-500">Plan: {user.plan}</div>}
                        </td>
                        <td className="p-3">
                          <div className="text-sm">{user.phone || "N/A"}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">{user.city || "N/A"}</div>
                        </td>
                        <td className="p-3">
                          <Badge className={getUserTypeColor(user.user_type)}>{user.user_type}</Badge>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">{user.user_type === "trainer" ? user.numClients || "N/A" : "-"}</div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">{formatDate(user.created_at)}</div>
                        </td>
                        <td className="p-3">
                          {user.status === "waitlist" && (
                            <Button
                              size="sm"
                              onClick={() => acceptUser(user.id, user.email)}
                              disabled={processingUsers.has(user.id)}
                              className="flex items-center gap-1"
                            >
                              {processingUsers.has(user.id) ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
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

        {/* Firebase Security Rules */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Firebase Security Rules</CardTitle>
            <CardDescription>
              If you're experiencing permission errors when converting users, make sure your Firebase security rules
              allow writes to the users collection:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
              <pre>{`rules_version = '2';
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
}`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
