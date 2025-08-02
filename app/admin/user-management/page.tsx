"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users, MapPin, Target, Calendar, Phone, Mail, Filter } from "lucide-react"

interface User {
  id: string
  name?: string
  email: string
  user_type: "client" | "trainer"
  city?: string
  district?: string
  goal?: string
  startTime?: string
  phone?: string
  message?: string
  status: string
  source?: string
  createdAt: any
  numClients?: number
}

const goalColors: { [key: string]: string } = {
  muskelaufbau: "bg-blue-100 text-blue-800",
  abnehmen: "bg-green-100 text-green-800",
  gesundheit: "bg-purple-100 text-purple-800",
  haltung: "bg-orange-100 text-orange-800",
  kraft: "bg-red-100 text-red-800",
  einstieg: "bg-cyan-100 text-cyan-800",
  beweglichkeit: "bg-pink-100 text-pink-800",
}

const goalLabels: { [key: string]: string } = {
  muskelaufbau: "Muskelaufbau",
  abnehmen: "Abnehmen",
  gesundheit: "Gesundheit & Rücken",
  haltung: "Haltung",
  kraft: "Kraft",
  einstieg: "Einstieg",
  beweglichkeit: "Beweglichkeit",
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCity, setFilterCity] = useState("all")
  const [filterUserType, setFilterUserType] = useState("all")
  const [filterSource, setFilterSource] = useState("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
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
    if (!timestamp) return "N/A"
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "N/A"
    }
  }

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case "munich-landing-page":
        return <Badge className="bg-blue-100 text-blue-800">München Landing</Badge>
      case "trainer-signup":
        return <Badge className="bg-green-100 text-green-800">Trainer Signup</Badge>
      case "website_waitlist":
        return <Badge className="bg-gray-100 text-gray-800">Website</Badge>
      default:
        return <Badge variant="secondary">Unbekannt</Badge>
    }
  }

  const getUserTypeBadge = (userType: string) => {
    return userType === "trainer" ? (
      <Badge className="bg-purple-100 text-purple-800">Trainer</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">Client</Badge>
    )
  }

  const getGoalBadge = (goal?: string) => {
    if (!goal) return null
    const color = goalColors[goal] || "bg-gray-100 text-gray-800"
    const label = goalLabels[goal] || goal
    return <Badge className={color}>{label}</Badge>
  }

  const uniqueCities = [...new Set(users.map((user) => user.city).filter(Boolean))]
  const uniqueSources = [...new Set(users.map((user) => user.source).filter(Boolean))]

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Verwalte alle Benutzer und Waitlist-Einträge</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Benutzer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.user_type === "client").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trainer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.user_type === "trainer").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">München Users</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.city === "München").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Suche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Suche nach Name, Email, Stadt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger>
                <SelectValue placeholder="Stadt wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Städte</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterUserType} onValueChange={setFilterUserType}>
              <SelectTrigger>
                <SelectValue placeholder="Benutzertyp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Typen</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="trainer">Trainer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger>
                <SelectValue placeholder="Quelle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Quellen</SelectItem>
                {uniqueSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterCity("all")
                setFilterUserType("all")
                setFilterSource("all")
              }}
            >
              Filter zurücksetzen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Benutzer ({filteredUsers.length})</CardTitle>
          <CardDescription>Alle registrierten Benutzer und Waitlist-Einträge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Benutzer</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Standort</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Quelle</TableHead>
                  <TableHead>Erstellt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">{user.name || user.email}</div>
                        {getUserTypeBadge(user.user_type)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {user.city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.city}
                          </div>
                        )}
                        {user.district && <div className="text-sm text-gray-600">{user.district}</div>}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {user.goal && getGoalBadge(user.goal)}
                        {user.user_type === "trainer" && user.numClients && (
                          <Badge variant="outline">{user.numClients} Clients</Badge>
                        )}
                        {user.startTime && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            {user.startTime}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{getSourceBadge(user.source)}</TableCell>

                    <TableCell>
                      <div className="text-sm text-gray-600">{formatDate(user.createdAt)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Keine Benutzer gefunden, die den Filterkriterien entsprechen.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
