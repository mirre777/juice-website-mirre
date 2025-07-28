"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react"

// Define the structure for a potential user
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
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<PotentialUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [firebaseConfig, setFirebaseConfig] = useState({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Fetching users from API...")
      const response = await fetch("/api/admin/users")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch users`)
      }

      const data = await response.json()
      console.log("API Response:", data)

      setUsers(data.users || [])
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to fetch users. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/users/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user status")
      }

      fetchUsers() // Refresh the list
    } catch (err) {
      console.error("Error updating user status:", err)
      setError("Failed to update user status. Please try again.")
    }
  }

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
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "client":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waitlist":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-4 dark:bg-gray-950">
      <div className="w-full max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage potential users and convert them from waitlist to pending status.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlist Users</CardTitle>
            <Button onClick={fetchUsers} disabled={loading} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing..." : "Refresh List"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 rounded-md bg-gray-200 p-3 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              <p>
                <strong>Firebase Environment</strong>
              </p>
              <p>Project ID: {firebaseConfig.projectId || "N/A"}</p>
              <p>Auth Domain: {firebaseConfig.authDomain || "N/A"}</p>
            </div>

            {error && <div className="mb-4 text-red-500">{error}</div>}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading users...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Clients</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div>{user.email}</div>
                            {user.plan && user.plan !== "N/A" && (
                              <div className="text-xs text-gray-500">Plan: {user.plan}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{user.phone || "N/A"}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{user.city || "N/A"}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getUserTypeColor(user.user_type)}>{user.user_type || "N/A"}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {user.user_type === "trainer" ? user.numClients || "N/A" : "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status} ({user.status === "waitlist" ? "potential_users" : user.status})
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(user.created_at)}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAccept(user.id)}
                              disabled={user.status !== "waitlist"}
                              className="juice-bg text-black hover:bg-juice/80"
                            >
                              Accept
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
