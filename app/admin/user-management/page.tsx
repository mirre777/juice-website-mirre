"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, ArrowLeft, MapPin, Target, Clock, Globe } from "lucide-react"
import Link from "next/link"

interface PotentialUser {
  id: string
  email: string
  phone?: string
  city?: string
  district?: string // NEW field
  user_type: string
  status: string
  created_at: string
  numClients?: number
  plan?: string
  source?: string
  // NEW: Munich-specific fields
  name?: string
  goal?: string
  startTime?: string
  origin?: string
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

  const getSourceBadge = (source?: string, origin?: string) => {
    if (origin?.includes("personal-training-muenchen")) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          München Landing
        </Badge>
      )
    }
    if (source === "munich-landing") {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          München
        </Badge>
      )
    }
    if (source === "trainer-signup") {
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800">
          Trainer Signup
        </Badge>
      )
    }
    if (source === "website_waitlist") {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Website
        </Badge>
      )
    }
    return <Badge variant="outline">Unknown</Badge>
  }

  const getGoalBadge = (goal?: string) => {
    if (!goal) return null

    const goalColors: { [key: string]: string } = {
      Muskelaufbau: "bg-orange-100 text-orange-800",
      "Abnehmen & Körperfett reduzieren": "bg-red-100 text-red-800",
      "Gesundheit & Wohlbefinden": "bg-green-100 text-green-800",
      "Haltung verbessern": "bg-blue-100 text-blue-800",
      "Kraft & Leistung steigern": "bg-purple-100 text-purple-800",
      "Rücken stärken": "bg-indigo-100 text-indigo-800",
      "Einstieg ins Training": "bg-yellow-100 text-yellow-800",
    }

    return (
      <Badge variant="outline" className={goalColors[goal] || "bg-gray-100 text-gray-800"}>
        <Target className="h-3 w-3 mr-1" />
        {goal}
      </Badge>
    )
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
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">User</th>
                        <th className="text-left p-3 font-semibold">Contact</th>
                        <th className="text-left p-3 font-semibold">Location</th>
                        <th className="text-left p-3 font-semibold">Details</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Source</th>
                        <th className="text-left p-3 font-semibold">Created</th>
                        <th className="text-left p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{user.name || user.email.split("@")[0]}</div>
                              <div className="text-sm text-gray-500">{getUserTypeBadge(user.user_type)}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div>{user.email}</div>
                              {user.phone && <div className="text-gray-500">{user.phone}</div>}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span>{user.city}</span>
                              {user.district && <span className="text-gray-500">({user.district})</span>}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              {user.goal && getGoalBadge(user.goal)}
                              {user.user_type === "trainer" && user.numClients && (
                                <div className="text-xs text-gray-500">{user.numClients} clients</div>
                              )}
                              {user.startTime && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {user.startTime}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">{getStatusBadge(user.status)}</td>
                          <td className="p-3">{getSourceBadge(user.source, user.origin)}</td>
                          <td className="p-3 text-sm">
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

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{user.name || user.email.split("@")[0]}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                          </div>
                          <div className="flex flex-col gap-1">
                            {getUserTypeBadge(user.user_type)}
                            {getStatusBadge(user.status)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>{user.city}</span>
                          {user.district && <span className="text-gray-500">({user.district})</span>}
                        </div>

                        {user.goal && <div>{getGoalBadge(user.goal)}</div>}

                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-gray-400" />
                            {getSourceBadge(user.source, user.origin)}
                          </div>
                          <div className="text-gray-500">{new Date(user.created_at).toLocaleDateString()}</div>
                        </div>

                        {user.status === "waitlist" && (
                          <Button
                            onClick={() => handleAcceptUser(user.id)}
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            Accept User
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
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
