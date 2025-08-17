"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, Tag, Database, FileText, Lock, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BlogPost {
  title: string
  slug: string
  date: string
  category: string
  excerpt: string
  image?: string
  source: "hardcoded" | "blob"
}

interface BlogDebugData {
  totalPosts: number
  hardcodedPosts: number
  blobPosts: number
  posts: BlogPost[]
  isWorkingCorrectly: boolean
}

export default function BlogAdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [blogData, setBlogData] = useState<BlogDebugData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingPosts, setDeletingPosts] = useState<Set<string>>(new Set())

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "Arnold") {
      setIsAuthenticated(true)
      fetchBlogData()
    } else {
      setError("Incorrect password")
    }
  }

  const fetchBlogData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/blog-posts")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setBlogData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      console.error("Blog admin fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (slug: string, source: "hardcoded" | "blob") => {
    if (source === "hardcoded") {
      alert("Cannot delete hardcoded sample posts")
      return
    }

    if (!confirm(`Are you sure you want to delete the post "${slug}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingPosts((prev) => new Set(prev).add(slug))

      const response = await fetch("/api/admin/blog-posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status}`)
      }

      // Refresh the blog data after successful deletion
      await fetchBlogData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post")
      console.error("Delete post error:", err)
    } finally {
      setDeletingPosts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(slug)
        return newSet
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Blog Admin Access
            </CardTitle>
            <CardDescription>Enter password to access blog administration</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full">
                Access Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading blog data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Administration</h1>
          <p className="text-muted-foreground">Manage all blog posts from hardcoded and Blob storage</p>
        </div>
        <Button onClick={fetchBlogData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {blogData && (
        <>
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogData.totalPosts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hardcoded Posts</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogData.hardcodedPosts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blob Posts</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogData.blobPosts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={blogData.isWorkingCorrectly ? "default" : "destructive"}>
                  {blogData.isWorkingCorrectly ? "Working" : "Issues"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Blog Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>All Blog Posts</CardTitle>
              <CardDescription>
                Complete list of blog posts from both hardcoded samples and Blob storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogData.posts.map((post, index) => (
                  <div
                    key={`${post.slug}-${index}`}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    {/* Post Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-200">
                        {post.image && (
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </div>

                    {/* Post Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              <Badge variant="outline" className="text-xs">
                                {post.category}
                              </Badge>
                            </div>
                            <Badge variant={post.source === "hardcoded" ? "default" : "secondary"} className="text-xs">
                              {post.source === "hardcoded" ? "Sample" : "Dynamic"}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="flex gap-2">
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            {post.source === "blob" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeletePost(post.slug, post.source)}
                                disabled={deletingPosts.has(post.slug)}
                              >
                                {deletingPosts.has(post.slug) ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
