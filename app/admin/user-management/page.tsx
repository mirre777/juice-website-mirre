"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  RefreshCw,
  UserIcon,
  UserCheck,
  Globe,
  MapPin,
  Phone,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

interface UserManagementUser {
  id: string
  email: string
  name?: string
  phone?: string
  city?: string
  user_type: "client" | "trainer"
  status: string
  source?: string
  goal?: string
  district?: string
  startTime?: string
  createdAt: any
  plan?: string
  numClients?: number
}

// Goal color mapping
const goalColors: { [key: string]: string } = {
  muskelaufbau: "bg-blue-100 text-blue-800",
  abnehmen: "bg-green-100 text-green-800",
  gesundheit: "bg-purple-100 text-purple-800",
  haltung: "bg-orange-100 text-orange-800",
  kraft: "bg-red-100 text-red-800",
  einstieg: "bg-cyan-100 text-cyan-800",
  beweglichkeit: "bg-pink-100 text-pink-800",
}

// Start time color mapping
const startTimeColors: { [key: string]: string } = {
  sofort: "bg-red-100 text-red-800",
  "1-2-wochen": "bg-orange-100 text-orange-800",
  "1-monat": "bg-yellow-100 text-yellow-800",
  "2-3-monate": "bg-blue-100 text-blue-800",
  unbestimmt: "bg-gray-100 text-gray-800",
}

// Source icon mapping
const getSourceIcon = (source: string) => {
  switch (source) {
    case "munich-landing-page":
      return <MapPin className="h-3 w-3" />
    case "trainer-signup":
      return <UserCheck className="h-3 w-3" />
    default:
      return <Globe className="h-3 w-3" />
  }
}

// Source color mapping
const getSourceColor = (source: string) => {
  switch (source) {
    case "munich-landing-page":
      return "bg-blue-100 text-blue-800"
    case "trainer-signup":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserManagementUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [firebaseInfo, setFirebaseInfo] = useState<any>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (data.success) {
        setUsers(data.users || [])
        setFirebaseInfo(data.firebaseInfo)
      } else {
        setError(data.error || "Failed to fetch users")
        // Set mock data if Firebase fails
        if (data.mockData) {
          setUsers(data.mockData)
        }
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.name?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower) ||
      user.city?.toLowerCase().includes(searchLower) ||
      user.goal?.toLowerCase().includes(searchLower) ||
      user.district?.toLowerCase().includes(searchLower) ||
      user.source?.toLowerCase().includes(searchLower) ||
      user.user_type?.toLowerCase().includes(searchLower)
    )
  })

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown"

    try {
      let date: Date

      if (timestamp.seconds) {
        // Firestore timestamp
        date = new Date(timestamp.seconds * 1000)
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp)
      } else {
        date = new Date(timestamp)
      }

      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    } catch (e) {
      return "Invalid date"
    }
  }

  const formatGoal = (goal: string) => {
    const goalLabels: { [key: string]: string } = {
      muskelaufbau: "Muskelaufbau",
      abnehmen: "Abnehmen",
      gesundheit: "Gesundheit",
      haltung: "Haltung",
      kraft: "Kraft",
      einstieg: "Einstieg",
      beweglichkeit: "Beweglichkeit",
    }
    return goalLabels[goal] || goal
  }

  const formatStartTime = (startTime: string) => {
    const timeLabels: { [key: string]: string } = {
      sofort: "Sofort",
      "1-2-wochen": "1-2 Wochen",
      "1-monat": "1 Monat",
      "2-3-monate": "2-3 Monate",
      unbestimmt: "Unbestimmt",
    }
    return timeLabels[startTime] || startTime
  }

  const formatSource = (source: string) => {
    const sourceLabels: { [key: string]: string } = {
      "munich-landing-page": "München Page",
      "trainer-signup": "Trainer Signup",
      website_waitlist: "Website",
    }
    return sourceLabels[source] || source
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-center">User Management</h1>
        <p className="text-gray-600 text-center">
          Manage potential users and convert them from waitlist to pending status.
        </p>
      </div>

      {/* Firebase Environment Info */}
      {firebaseInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Firebase Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
              <div>Project ID: {firebaseInfo.projectId}</div>
              <div>Auth Domain: {firebaseInfo.authDomain}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={fetchUsers} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh List
        </Button>
      </div>

      {/* Waitlist Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Waitlist Users
            <Badge variant="secondary">{filteredUsers.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading users...
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchUsers} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Contact</th>
                    <th className="text-left p-3 font-medium">User Type</th>
                    <th className="text-left p-3 font-medium">Goal</th>
                    <th className="text-left p-3 font-medium">Start Time</th>
                    <th className="text-left p-3 font-medium">Source</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Created At</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{user.email}</div>
                          {user.name && <div className="text-sm text-gray-600">{user.name}</div>}
                          {user.city && <div className="text-xs text-gray-500">{user.city}</div>}
                        </div>
                      </td>
                      <td className="p-3">
                        {user.phone ? (
                          <div className="flex items-center text-sm text-green-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No phone</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={user.user_type === "client" ? "default" : "secondary"}
                          className={
                            user.user_type === "client" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                          }
                        >
                          {user.user_type}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {user.goal ? (
                          <Badge variant="outline" className={goalColors[user.goal] || "bg-gray-100 text-gray-800"}>
                            <Target className="h-3 w-3 mr-1" />
                            {formatGoal(user.goal)}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        {user.startTime ? (
                          <Badge
                            variant="outline"
                            className={startTimeColors[user.startTime] || "bg-gray-100 text-gray-800"}
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatStartTime(user.startTime)}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        {user.source ? (
                          <Badge variant="outline" className={getSourceColor(user.source)}>
                            {getSourceIcon(user.source)}
                            <span className="ml-1">{formatSource(user.source)}</span>
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={
                            user.status === "waitlist"
                              ? "bg-yellow-100 text-yellow-800"
                              : user.status === "pending"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.status === "waitlist" && <Clock className="h-3 w-3 mr-1" />}
                          {user.status === "pending" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                      <td className="p-3">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          Accept
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
