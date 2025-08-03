"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Filter, MapPin, Mail, Phone, Calendar, Target, RefreshCw } from "lucide-react"

interface WaitlistUser {
  id: string
  name?: string
  email: string
  phone?: string
  city?: string
  user_type: "client" | "trainer"
  plan?: string
  numClients?: number
  goal?: string
  district?: string
  startTime?: string
  message?: string
  source?: string
  status: "pending" | "contacted" | "converted"
  createdAt: string
  updatedAt: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<WaitlistUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCity, setFilterCity] = useState<string>("all")
  const [filterSource, setFilterSource] = useState<string>("all")

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        console.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.district?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || user.user_type === filterType
    const matchesCity = filterCity === "all" || user.city === filterCity
    const matchesSource = filterSource === "all" || user.source === filterSource

    return matchesSearch && matchesType && matchesCity && matchesSource
  })

  const getGoalBadgeColor = (goal?: string) => {
    if (!goal) return "bg-gray-100 text-gray-800"

    const goalColors: Record<string, string> = {
      muskelaufbau: "bg-blue-100 text-blue-800",
      abnehmen: "bg-green-100 text-green-800",
      gesundheit: "bg-purple-100 text-purple-800",
      haltung: "bg-orange-100 text-orange-800",
      kraft: "bg-red-100 text-red-800",
      einstieg: "bg-cyan-100 text-cyan-800",
      beweglichkeit: "bg-pink-100 text-pink-800",
    }

    return goalColors[goal] || "bg-gray-100 text-gray-800"
  }

  const getSourceBadge = (source?: string) => {
    if (source === "munich-landing-page") {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          München
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700">
        General
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      converted: "bg-green-100 text-green-800",
    }
    return <Badge className={statusColors[status as keyof typeof statusColors]}>{status}</Badge>
  }

  const uniqueCities = [...new Set(users.map((u) => u.city).filter(Boolean))]
  const uniqueSources = [...new Set(users.map((u) => u.source).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage waitlist users and track conversions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                <Target className="h-8 w-8 text-green-600" />
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
                <Users className="h-8 w-8 text-purple-600" />
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
              Filters
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

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="client">Clients</SelectItem>
                  <SelectItem value="trainer">Trainers</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {uniqueCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
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
            <CardDescription>Manage and track all waitlist users</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No users found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop View */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-medium text-gray-600">
                    <div className="col-span-3">User</div>
                    <div className="col-span-2">Contact</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-3">Details</div>
                    <div className="col-span-2">Source & Status</div>
                  </div>

                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-12 gap-4 py-4 border-b border-gray-100 hover:bg-gray-50"
                    >
                      <div className="col-span-3">
                        <div className="flex items-center">
                          <div>
                            <p className="font-medium text-gray-900">{user.name || user.email.split("@")[0]}</p>
                            <Badge
                              variant="outline"
                              className={
                                user.user_type === "trainer"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-blue-50 text-blue-700"
                              }
                            >
                              {user.user_type}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2">
                        {user.city && (
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.city}
                          </div>
                        )}
                        {user.district && <p className="text-xs text-gray-500">{user.district}</p>}
                      </div>

                      <div className="col-span-3">
                        <div className="space-y-2">
                          {user.goal && <Badge className={getGoalBadgeColor(user.goal)}>{user.goal}</Badge>}
                          {user.numClients && (
                            <Badge variant="outline" className="bg-gray-50">
                              {user.numClients} clients
                            </Badge>
                          )}
                          {user.startTime && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {user.startTime}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="space-y-2">
                          {getSourceBadge(user.source)}
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{user.name || user.email.split("@")[0]}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant="outline"
                              className={
                                user.user_type === "trainer"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-blue-50 text-blue-700"
                              }
                            >
                              {user.user_type}
                            </Badge>
                            {getStatusBadge(user.status)}
                          </div>
                        </div>

                        {user.phone && (
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        )}

                        {user.city && (
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.city}
                            {user.district && `, ${user.district}`}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-3">
                          {user.goal && <Badge className={getGoalBadgeColor(user.goal)}>{user.goal}</Badge>}
                          {user.numClients && (
                            <Badge variant="outline" className="bg-gray-50">
                              {user.numClients} clients
                            </Badge>
                          )}
                          {getSourceBadge(user.source)}
                        </div>

                        {user.startTime && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            Start: {user.startTime}
                          </div>
                        )}

                        {user.message && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">{user.message}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
