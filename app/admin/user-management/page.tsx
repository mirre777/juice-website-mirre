"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Mail, Phone, MapPin, Target, Clock, Search, Filter, RefreshCw, User, Building } from "lucide-react"

interface WaitlistUser {
  id: string
  name?: string
  email: string
  phone?: string
  city?: string
  district?: string
  goal?: string
  startTime?: string
  user_type: "client" | "trainer"
  status: string
  source?: string
  createdAt: any
  numClients?: number
  plan?: string
  message?: string
}

const goalColors: { [key: string]: string } = {
  muskelaufbau: "bg-blue-100 text-blue-800",
  abnehmen: "bg-green-100 text-green-800",
  gesundheit: "bg-purple-100 text-purple-800",
  haltung: "bg-orange-100 text-orange-800",
  kraft: "bg-red-100 text-red-800",
  ausdauer: "bg-cyan-100 text-cyan-800",
  beweglichkeit: "bg-pink-100 text-pink-800",
}

const sourceColors: { [key: string]: string } = {
  "munich-landing-page": "bg-blue-100 text-blue-800",
  "trainer-signup": "bg-green-100 text-green-800",
  website_waitlist: "bg-gray-100 text-gray-800",
  "general-waitlist": "bg-gray-100 text-gray-800",
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<WaitlistUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCity, setFilterCity] = useState("all")
  const [filterUserType, setFilterUserType] = useState("all")
  const [filterSource, setFilterSource] = useState("all")

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched users:", data)

      if (data.success) {
        setUsers(data.users || [])
        setError(null)
      } else {
        setError(data.error || "Failed to fetch users")
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.district?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCity = filterCity === "all" || user.city === filterCity
    const matchesUserType = filterUserType === "all" || user.user_type === filterUserType
    const matchesSource = filterSource === "all" || user.source === filterSource

    return matchesSearch && matchesCity && matchesUserType && matchesSource
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

      return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case "munich-landing-page":
        return "München Landing"
      case "trainer-signup":
        return "Trainer Signup"
      case "website_waitlist":
        return "Website Waitlist"
      default:
        return source || "Unknown"
    }
  }

  const getGoalLabel = (goal?: string) => {
    const goalLabels: { [key: string]: string } = {
      muskelaufbau: "Muskelaufbau",
      abnehmen: "Abnehmen",
      gesundheit: "Gesundheit & Rücken",
      haltung: "Haltung verbessern",
      kraft: "Kraft steigern",
      ausdauer: "Ausdauer",
      beweglichkeit: "Beweglichkeit",
    }
    return goalLabels[goal || ""] || goal || ""
  }

  const getStartTimeLabel = (startTime?: string) => {
    const startTimeLabels: { [key: string]: string } = {
      sofort: "Sofort",
      "1-2-wochen": "In 1-2 Wochen",
      "1-monat": "In einem Monat",
      "2-3-monate": "In 2-3 Monaten",
      unbestimmt: "Noch unbestimmt",
    }
    return startTimeLabels[startTime || ""] || startTime || ""
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading users...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchUsers} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage waitlist users and trainer applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.user_type === "client").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trainers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.user_type === "trainer").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">München</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.city === "München").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="München">München</SelectItem>
                <SelectItem value="Berlin">Berlin</SelectItem>
                <SelectItem value="Hamburg">Hamburg</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterUserType} onValueChange={setFilterUserType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="trainer">Trainers</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="munich-landing-page">München Landing</SelectItem>
                <SelectItem value="trainer-signup">Trainer Signup</SelectItem>
                <SelectItem value="website_waitlist">Website Waitlist</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchUsers} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>All waitlist users and trainer applications</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {users.length === 0 ? "No users have signed up yet." : "Try adjusting your filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || user.email.split("@")[0]}
                                </div>
                                <Badge
                                  variant={user.user_type === "trainer" ? "default" : "secondary"}
                                  className="mt-1"
                                >
                                  {user.user_type}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                {user.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              {user.city}
                            </div>
                            {user.district && <div className="text-sm text-gray-500">{user.district}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {user.goal && (
                                <Badge className={goalColors[user.goal] || "bg-gray-100 text-gray-800"}>
                                  <Target className="h-3 w-3 mr-1" />
                                  {getGoalLabel(user.goal)}
                                </Badge>
                              )}
                              {user.numClients && (
                                <div className="text-sm text-gray-500">{user.numClients} clients</div>
                              )}
                              {user.startTime && (
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {getStartTimeLabel(user.startTime)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={sourceColors[user.source || ""] || "bg-gray-100 text-gray-800"}>
                              {getSourceLabel(user.source)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name || user.email.split("@")[0]}</div>
                            <Badge variant={user.user_type === "trainer" ? "default" : "secondary"} className="mt-1">
                              {user.user_type}
                            </Badge>
                          </div>
                        </div>
                        <Badge className={sourceColors[user.source || ""] || "bg-gray-100 text-gray-800"}>
                          {getSourceLabel(user.source)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {user.email}
                        </div>

                        {user.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {user.phone}
                          </div>
                        )}

                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {user.city}
                          {user.district && `, ${user.district}`}
                        </div>

                        {user.goal && (
                          <div className="flex items-center">
                            <Badge className={goalColors[user.goal] || "bg-gray-100 text-gray-800"}>
                              <Target className="h-3 w-3 mr-1" />
                              {getGoalLabel(user.goal)}
                            </Badge>
                          </div>
                        )}

                        {user.startTime && (
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {getStartTimeLabel(user.startTime)}
                          </div>
                        )}

                        <div className="text-gray-500 text-xs pt-2 border-t">{formatDate(user.createdAt)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
