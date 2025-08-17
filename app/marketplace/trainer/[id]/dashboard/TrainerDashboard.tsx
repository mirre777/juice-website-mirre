"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit3, Eye, Settings, ExternalLink, Calendar, TrendingUp, CheckCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"
import type { TrainerDashboardData } from "@/types/trainer"

interface TrainerDashboardProps {
  trainerId: string
}

export function TrainerDashboard({ trainerId }: TrainerDashboardProps) {
  const [dashboardData, setDashboardData] = useState<TrainerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [trainerId])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trainer/dashboard/${trainerId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error || "Unable to load your trainer dashboard."}</p>
            <Button onClick={fetchDashboardData} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completionPercentage = dashboardData.isContentComplete ? 100 : 75

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {dashboardData.fullName}</h1>
              <p className="text-gray-600">Manage your trainer website and track your progress</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={dashboardData.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                  View Website
                </Button>
              </Link>
              <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                <Button className="flex items-center gap-2 bg-[#D2FF28] text-black hover:bg-[#c5f01f]">
                  <Edit3 className="h-4 w-4" />
                  Edit Content
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Website Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-gray-600">Published and live</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <p className="text-xs text-gray-600">{dashboardData.isContentComplete ? "Complete" : "Almost there!"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalViews || 0}</div>
              <p className="text-xs text-gray-600">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.lastUpdated ? new Date(dashboardData.lastUpdated).toLocaleDateString() : "Never"}
              </div>
              <p className="text-xs text-gray-600">Content changes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your trainer website content and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-[#D2FF28]/10 hover:border-[#D2FF28] bg-transparent"
                    >
                      <Edit3 className="h-6 w-6" />
                      <span>Edit Content</span>
                    </Button>
                  </Link>

                  <Link href={`/marketplace/trainer/${trainerId}/settings`}>
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                    >
                      <Settings className="h-6 w-6" />
                      <span>Website Settings</span>
                    </Button>
                  </Link>

                  <Link href={dashboardData.websiteUrl} target="_blank">
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                    >
                      <Eye className="h-6 w-6" />
                      <span>Preview Website</span>
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                    disabled
                  >
                    <Calendar className="h-6 w-6" />
                    <span>Booking System</span>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Specialty</h4>
                  <p className="text-sm">{dashboardData.specialty}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm text-gray-700">Location</h4>
                  <p className="text-sm">{dashboardData.location}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm text-gray-700">Experience</h4>
                  <p className="text-sm">{dashboardData.experience}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm text-gray-700">Services</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dashboardData.services?.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {dashboardData.services && dashboardData.services.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{dashboardData.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm text-gray-700">Website URL</h4>
                  <Link
                    href={dashboardData.websiteUrl}
                    target="_blank"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {`${window.location.origin}${dashboardData.websiteUrl}`}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Completion Status */}
        {!dashboardData.isContentComplete && (
          <Card className="mt-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-5 w-5" />
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-orange-700">
                Add more details to make your website stand out and attract more clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-orange-700">Your profile is {completionPercentage}% complete</div>
                <Link href={`/marketplace/trainer/${trainerId}/edit`}>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
