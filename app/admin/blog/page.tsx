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
import { BlogImageUploader } from "@/components/blog-image-uploader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { InlineEditTitle } from "@/components/inline-edit-title"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

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
  errors: string[] // Added errors array to interface
  isWorkingCorrectly: boolean
}

export default function BlogAdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [blogData, setBlogData] = useState<BlogDebugData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingPosts, setDeletingPosts] = useState<Set<string>>(new Set())
  const [selectedPostForImage, setSelectedPostForImage] = useState<string>("") // Added state for image linking
  const [updatingCategories, setUpdatingCategories] = useState<Set<string>>(new Set()) // Added state for tracking category updates
  const [updatingDates, setUpdatingDates] = useState<Set<string>>(new Set()) // Added state for tracking date updates

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

      const response = await fetch(`/api/admin/blog-posts?t=${Date.now()}`, {
        cache: "no-store",
      })
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

  const handleImageAssigned = async (imageUrl: string, postSlug: string) => {
    try {
      // Update the blog post's frontmatter to include the new image
      const response = await fetch("/api/admin/blog-posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: postSlug,
          image: imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update blog post image")
      }

      // Refresh blog data to show updated image
      await fetchBlogData()
      alert("Image successfully linked to blog post!")
    } catch (error) {
      console.error("Error linking image to post:", error)
      alert("Failed to link image to post")
    }
  }

  const handleTitleUpdate = async (slug: string, newTitle: string) => {
    try {
      console.log("[v0] Starting title update for slug:", slug, "new title:", newTitle)

      const response = await fetch("/api/admin/blog-posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          title: newTitle,
        }),
      })

      console.log("[v0] Title update response status:", response.status)

      if (!response.ok) {
        throw new Error("Failed to update title")
      }

      const result = await response.json()
      console.log("[v0] Title update result:", result)

      // Refresh blog data to show updated title
      await fetchBlogData()
      console.log("[v0] Blog data refreshed after title update")
    } catch (error) {
      console.error("[v0] Error updating title:", error)
      throw error // Re-throw to let the component handle the error
    }
  }

  const handleCategoryUpdate = async (slug: string, newCategory: string, source: "hardcoded" | "blob") => {
    if (source === "hardcoded") {
      alert("Cannot update hardcoded sample posts")
      return
    }

    try {
      setUpdatingCategories((prev) => new Set(prev).add(slug))

      const response = await fetch("/api/admin/blog-posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          category: newCategory,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      await fetchBlogData()
    } catch (error) {
      console.error("Error updating category:", error)
      alert("Failed to update category")
    } finally {
      setUpdatingCategories((prev) => {
        const newSet = new Set(prev)
        newSet.delete(slug)
        return newSet
      })
    }
  }

  const handleDateUpdate = async (slug: string, newDate: Date, source: "hardcoded" | "blob") => {
    if (source === "hardcoded") {
      alert("Cannot update hardcoded sample posts")
      return
    }

    try {
      setUpdatingDates((prev) => new Set(prev).add(slug))

      const formattedDate = format(newDate, "yyyy-MM-dd")

      const response = await fetch("/api/admin/blog-posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          date: formattedDate,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update date")
      }

      await fetchBlogData()
    } catch (error) {
      console.error("Error updating date:", error)
      alert("Failed to update date")
    } finally {
      setUpdatingDates((prev) => {
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

      <Card>
        <CardHeader>
          <CardTitle>Upload & Link Images</CardTitle>
          <CardDescription>Upload images and optionally link them to specific blog posts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {blogData && blogData.posts.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Link to Blog Post (Optional)</label>
              <Select value={selectedPostForImage} onValueChange={setSelectedPostForImage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a blog post to link image to..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific post (general upload)</SelectItem>
                  {blogData.posts
                    .filter((post) => post.source === "blob") // Only show editable posts
                    .map((post) => (
                      <SelectItem key={post.slug} value={post.slug}>
                        {post.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <BlogImageUploader
            blogSlug={selectedPostForImage || undefined}
            availablePosts={blogData?.posts || []}
            onImageUploaded={(imageUrl) => {
              if (selectedPostForImage) {
                handleImageAssigned(imageUrl, selectedPostForImage)
              }
            }}
          />
        </CardContent>
      </Card>

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

      {blogData.errors && blogData.errors.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Processing Errors ({blogData.errors.length})</CardTitle>
            <CardDescription>Errors encountered while processing blog posts from Blob storage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {blogData.errors.map((error, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                  <code className="text-red-800">{error}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blog Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>Complete list of blog posts from both hardcoded samples and Blob storage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blogData.posts.map((post, index) => {
              const allCategories = [...new Set(blogData.posts.map((p) => p.category))].sort()

              return (
                <div
                  key={`${post.slug}-${index}`}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  {/* Post Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-200">
                      {post.image && (
                        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                      )}
                    </div>
                  </div>

                  {/* Post Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <InlineEditTitle
                          initialTitle={post.title}
                          onSave={(newTitle) => handleTitleUpdate(post.slug, newTitle)}
                          disabled={post.source === "hardcoded"}
                        />
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.source === "blob" ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="hover:text-gray-900 hover:underline transition-colors">
                                    {updatingDates.has(post.slug) ? "Updating..." : post.date}
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={new Date(post.date)}
                                    onSelect={(date) => {
                                      if (date) {
                                        handleDateUpdate(post.slug, date, post.source)
                                      }
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <span>{post.date}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            {post.source === "blob" ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className="text-xs cursor-pointer hover:bg-gray-100 transition-colors"
                                  >
                                    {updatingCategories.has(post.slug) ? "Updating..." : post.category}
                                  </Badge>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  {allCategories.map((category) => (
                                    <DropdownMenuItem
                                      key={category}
                                      onClick={() => handleCategoryUpdate(post.slug, category, post.source)}
                                      className={post.category === category ? "bg-gray-100 font-medium" : ""}
                                    >
                                      {category}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                {post.category}
                              </Badge>
                            )}
                          </div>
                          <Badge variant={post.source === "hardcoded" ? "default" : "secondary"} className="text-xs">
                            {post.source === "hardcoded" ? "Hardcoded" : "Dynamic"}
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
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
