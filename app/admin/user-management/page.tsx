"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { initializeFirebase } from "@/firebase"
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"

// Define the structure for a potential user
interface PotentialUser {
  id: string
  email: string
  user_type: string
  status: string
  created_at: string
  numClients?: number // Optional field for number of clients
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
      const app = initializeFirebase()
      const db = getFirestore(app)
      const usersCollection = collection(db, "potential_users")
      const userSnapshot = await getDocs(usersCollection)
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
        user_type: doc.data().user_type,
        status: doc.data().status,
        created_at: doc.data().created_at.toDate().toLocaleString(), // Convert Firebase Timestamp to readable string
        numClients: doc.data().numClients || "N/A", // Get numClients, default to N/A
      })) as PotentialUser[]
      setUsers(userList)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to fetch users. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (userId: string) => {
    try {
      const app = initializeFirebase()
      const db = getFirestore(app)
      const userRef = doc(db, "potential_users", userId)
      await updateDoc(userRef, {
        status: "pending",
      })
      fetchUsers() // Refresh the list
    } catch (err) {
      console.error("Error updating user status:", err)
      setError("Failed to update user status. Please try again.")
    }
  }

  const handleDelete = async (userId: string, userEmail: string) => {
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) {
      return
    }

    try {
      const app = initializeFirebase()
      const db = getFirestore(app)
      const userRef = doc(db, "potential_users", userId)
      await deleteDoc(userRef)

      // Remove user from local state immediately for better UX
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))

      // Show success message
      setError(null)
    } catch (err) {
      console.error("Error deleting user:", err)
      setError("Failed to delete user. Please try again.")
      // Refresh the list in case of error to ensure consistency
      fetchUsers()
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-4 dark:bg-gray-950">
      <div className="w-full max-w-6xl space-y-6">
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
            <Button onClick={fetchUsers} disabled={loading}>
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

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>User Type</TableHead>
                    <TableHead>Clients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.user_type}</TableCell>
                      <TableCell>{user.numClients}</TableCell>
                      <TableCell>
                        <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          {user.status} ({user.status === "waitlist" ? "potential_users" : user.status})
                        </span>
                      </TableCell>
                      <TableCell>{user.created_at}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAccept(user.id)}
                            disabled={user.status !== "waitlist"}
                            className="juice-bg text-black hover:bg-juice/80"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(user.id, user.email)}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
