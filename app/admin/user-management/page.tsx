"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  UserCheck,
  Globe,
} from "lucide-react"

interface PotentialUser {
  id: string
  email: string
  name?: string
  phone?: string
  city?: string
  district?: string
  goal?: string
  startTime?: string
  message?: string
  user_type: "client" | "trainer"
  plan?: string
  numClients?: number
  source: string
  status: string
  createdAt: any
  signUpDate?: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<PotentialUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "client" | "trainer">("all")
  const [filterCity, setFilterCity] = useState<string>("all")
  const [filterSource, setFilterSource] = useState<string>("all")

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/users")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setUsers(data.users || [])
      } else {
        setError(data.error || "Failed to fetch users")
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.goal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.message?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || user.user_type === filterType
    const matchesCity = filterCity === "all" || user.city === filterCity
    const matchesSource = filterSource === "all" || user.source === filterSource

    return matchesSearch && matchesType && matchesCity && matchesSource
  })

  // Get unique values for filters
  const uniqueCities = [...new Set(users.map((user) => user.city).filter(Boolean))]
  const uniqueSources = [...new Set(users.map((user) => user.source).filter(Boolean))]

  // Statistics
  const stats = {
    total: users.length,
    clients: users.filter((u) => u.user_type === "client").length,
    trainers: users.filter((u) => u.user_type === "trainer").length,
    munich: users.filter((u) => u.city === "München").length,
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"

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
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waitlist":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Waitlist
          </Badge>
        )
      case "contacted":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Mail className="h-3 w-3 mr-1" />
            Contacted
          </Badge>
        )
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "munich-landing-page":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <MapPin className="h-3 w-3 mr-1" />
            München Page
          </Badge>
        )
      case "trainer-signup":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <UserCheck className="h-3 w-3 mr-1" />
            Trainer Signup
          </Badge>
        )
      case "website_waitlist":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Globe className="h-3 w-3 mr-1" />
            Website
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            <Globe className="h-3 w-3 mr-1" />
            {source}
          </Badge>
        )
    }
  }

  const getGoalBadge = (goal?: string) => {
    if (!goal) return null

    const goalColors: Record<string, string> = {
      muskelaufbau: "bg-blue-100 text-blue-800 border-blue-200",
      abnehmen: "bg-green-100 text-green-800 border-green-200",
      gesundheit: "bg-purple-100 text-purple-800 border-purple-200",
      haltung: "bg-orange-100 text-orange-800 border-orange-200",
      kraft: "bg-red-100 text-red-800 border-red-200",
      einstieg: "bg-cyan-100 text-cyan-800 border-cyan-200",
      beweglichkeit: "bg-pink-100 text-pink-800 border-pink-200",
    }

    const goalLabels: Record<string, string> = {
      muskelaufbau: "Muskelaufbau",
      abnehmen: "Abnehmen",
      gesundheit: "Gesundheit",
      haltung: "Haltung",
      kraft: "Kraft",
      einstieg: "Einstieg",
      beweglichkeit: "Beweglichkeit",
    }

    const colorClass = goalColors[goal] || "bg-gray-100 text-gray-800 border-gray-200"
    const label = goalLabels[goal] || goal

    return (
      <Badge variant="outline" className={colorClass}>
        <Target className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const getStartTimeBadge = (startTime?: string) => {
    if (!startTime) return null

    const timeColors: Record<string, string> = {
      sofort: "bg-red-100 text-red-800 border-red-200",
      "1-2-wochen": "bg-orange-100 text-orange-800 border-orange-200",
      "1-monat": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "2-3-monate": "bg-blue-100 text-blue-800 border-blue-200",
      "noch-unentschieden": "bg-gray-100 text-gray-800 border-gray-200",
    }

    const timeLabels: Record<string, string> = {
      sofort: "Sofort",
      "1-2-wochen": "1-2 Wochen",
      "1-monat": "1 Monat",
      "2-3-monate": "2-3 Monate",
      "noch-unentschieden": "Unentschieden",
    }

    const colorClass = timeColors[startTime] || "bg-gray-100 text-gray-800 border-gray-200"
    const label = timeLabels[startTime] || startTime

    return (
      <Badge variant="outline" className={colorClass}>
        <Calendar className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage potential users and waitlist</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading users: {error}
            <Button variant="outline" size="sm" className="ml-4 bg-transparent" onClick={fetchUsers}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage potential users and waitlist</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers}>
            <Download className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trainers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trainers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">München</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.munich}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, name, city, goal, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="trainer">Trainers</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="w-full md:w-40">
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
              <SelectTrigger className="w-full md:w-40">
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
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>All potential users from various sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">User Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No users found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{user.name || "N/A"}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          <Badge variant={user.user_type === "trainer" ? "default" : "secondary"}>
                            {user.user_type === "trainer" ? "Trainer" : "Client"}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          {user.phone ? (
                            <div className="text-sm flex items-center">
                              <Phone className="h-3 w-3 mr-1 text-green-600" />
                              <span className="text-green-700">{user.phone}</span>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              N/A
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          {user.city ? (
                            <div className="text-sm flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {user.city}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">N/A</div>
                          )}
                          {user.district && <div className="text-xs text-muted-foreground">{user.district}</div>}
                        </div>
                      </TableCell>

                      <TableCell>
                        {user.goal ? (
                          getGoalBadge(user.goal)
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {user.startTime ? (
                          getStartTimeBadge(user.startTime)
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>

                      <TableCell>{getSourceBadge(user.source)}</TableCell>

                      <TableCell>{getStatusBadge(user.status)}</TableCell>

                      <TableCell>
                        <div className="text-sm">{formatDate(user.createdAt)}</div>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log("Contact user:", user.id)
                            }}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                          {user.status === "waitlist" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                console.log("Accept user:", user.id)
                              }}
                            >
                              Accept
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
