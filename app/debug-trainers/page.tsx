"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, ExternalLink, RefreshCw } from "lucide-react"

interface Trainer {
  id: string
  fullName: string
  email: string
  location: string
  specialty: string
  isActive: boolean
  status: string
  isPaid: boolean
  hasContent: boolean
}

export default function DebugTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [customId, setCustomId] = useState("POj2MRZ5ZRbq3CW1U0zJ")

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/debug-trainers")
      const data = await response.json()

      if (data.success) {
        setTrainers(data.trainers)
      }
    } catch (error) {
      console.error("Error fetching trainers:", error)
    } finally {
      setLoading(false)
    }
  }

  const createTestTrainer = async () => {
    try {
      setCreating(true)
      const response = await fetch("/api/debug-trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-test-trainer",
          trainerId: customId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ Test trainer created! Access at: ${data.url}`)
        fetchTrainers()
      } else {
        alert("❌ Failed to create trainer")
      }
    } catch (error) {
      console.error("Error creating trainer:", error)
      alert("❌ Error creating trainer")
    } finally {
      setCreating(false)
    }
  }

  const deleteTrainer = async (trainerId: string) => {
    if (!confirm(`Delete trainer ${trainerId}?`)) return

    try {
      const response = await fetch("/api/debug-trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-trainer",
          trainerId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("✅ Trainer deleted!")
        fetchTrainers()
      } else {
        alert("❌ Failed to delete trainer")
      }
    } catch (error) {
      console.error("Error deleting trainer:", error)
      alert("❌ Error deleting trainer")
    }
  }

  useEffect(() => {
    fetchTrainers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Debug Trainers</h1>
          <Button onClick={fetchTrainers} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Create Test Trainer */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Test Trainer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Trainer ID</label>
                <Input value={customId} onChange={(e) => setCustomId(e.target.value)} placeholder="Enter trainer ID" />
              </div>
              <Button onClick={createTestTrainer} disabled={creating}>
                <Plus className="w-4 h-4 mr-2" />
                {creating ? "Creating..." : "Create Test Trainer"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trainers List */}
        <Card>
          <CardHeader>
            <CardTitle>All Trainers ({trainers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading trainers...</div>
            ) : trainers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No trainers found</div>
            ) : (
              <div className="space-y-4">
                {trainers.map((trainer) => (
                  <div key={trainer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{trainer.fullName}</h3>
                        <Badge variant={trainer.isActive ? "default" : "secondary"}>
                          {trainer.status || (trainer.isActive ? "active" : "inactive")}
                        </Badge>
                        {trainer.isPaid && <Badge variant="outline">Paid</Badge>}
                        {trainer.hasContent && <Badge variant="outline">Has Content</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">
                        {trainer.email} • {trainer.location} • {trainer.specialty}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">ID: {trainer.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/marketplace/trainer/${trainer.id}`, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteTrainer(trainer.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
