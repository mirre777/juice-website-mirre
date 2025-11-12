"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, Tag, Database, FileText, Lock, Trash2, Edit3, X, Save, HelpCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BlogImageUploader } from "@/components/blog-image-uploader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { InlineEditTitle } from "@/components/inline-edit-title"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContentItem {
  title: string
  slug: string
  date: string
  category: string
  excerpt: string
  image?: string
  source: "hardcoded" | "blob"
  trainerName?: string // Only for interviews
  type: "blog" | "interview"
}

interface BlogDebugData {
  totalPosts: number
  hardcodedPosts: number
  blobPosts: number
  posts: ContentItem[]
  errors: string[]
  isWorkingCorrectly: boolean
}

interface InterviewData {
  totalInterviews: number
  interviews: ContentItem[]
}

export default function BlogAdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [blogData, setBlogData] = useState<BlogDebugData | null>(null)
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingPosts, setDeletingPosts] = useState<Set<string>>(new Set())
  const [selectedPostForImage, setSelectedPostForImage] = useState<string>("")
  const [updatingCategories, setUpdatingCategories] = useState<Set<string>>(new Set())
  const [updatingDates, setUpdatingDates] = useState<Set<string>>(new Set())
  const [editingContent, setEditingContent] = useState<string | null>(null)
  const [contentBeingEdited, setContentBeingEdited] = useState<string>("")
  const [savingContent, setSavingContent] = useState(false)
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false)

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "Arnold") {
      setIsAuthenticated(true)
      fetchAllData()
    } else {
      setError("Incorrect password")
    }
  }

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch blog posts
      const blogResponse = await fetch(`/api/admin/blog/blogs?t=${Date.now()}`, {
        cache: "no-store",
      })
      if (!blogResponse.ok) {
        throw new Error(`HTTP error! status: ${blogResponse.status}`)
      }
      const blogDataResult = await blogResponse.json()
      setBlogData({
        ...blogDataResult,
        posts: blogDataResult.posts.map((post: any) => ({ ...post, type: "blog" })),
      })

      // Fetch interviews
      const interviewResponse = await fetch(`/api/admin/blog/interviews?t=${Date.now()}`, {
        cache: "no-store",
      })
      if (!interviewResponse.ok) {
        throw new Error(`HTTP error! status: ${interviewResponse.status}`)
      }
      const interviewDataResult = await interviewResponse.json()
      setInterviewData({
        ...interviewDataResult,
        interviews: interviewDataResult.interviews.map((interview: any) => ({ ...interview, type: "interview" })),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      console.error("Admin fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (slug: string, source: "hardcoded" | "blob", type: "blog" | "interview") => {
    if (source === "hardcoded") {
      alert("Cannot delete hardcoded sample posts")
      return
    }

    if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingPosts((prev) => new Set(prev).add(slug))

      const endpoint = type === "blog" ? "/api/admin/blog/blogs" : "/api/admin/blog/interviews"
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}: ${response.status}`)
      }

      await fetchAllData()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete ${type}`)
      console.error(`Delete ${type} error:`, err)
    } finally {
      setDeletingPosts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(slug)
        return newSet
      })
    }
  }

  const handleImageAssigned = async (imageUrl: string, postSlug: string, type: "blog" | "interview") => {
    try {
      const endpoint = type === "blog" ? "/api/admin/blog/blogs" : "/api/admin/blog/interviews"
      const response = await fetch(endpoint, {
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
        throw new Error(`Failed to update ${type} image`)
      }

      await fetchAllData()
      alert("Image successfully linked!")
    } catch (error) {
      console.error("Error linking image:", error)
      alert("Failed to link image")
    }
  }

  const handleTitleUpdate = async (slug: string, newTitle: string, type: "blog" | "interview") => {
    try {
      const endpoint = type === "blog" ? "/api/admin/blog/blogs" : "/api/admin/blog/interviews"
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          title: newTitle,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update title")
      }

      await fetchAllData()
    } catch (error) {
      console.error("Error updating title:", error)
      throw error
    }
  }

  const handleSlugUpdate = async (oldSlug: string, newSlug: string, type: "blog" | "interview") => {
    try {
      // Show confirmation dialog
      const confirmed = confirm(
        `⚠️ Warning: Changing the slug will break existing links!\n\n` +
        `If you've already shared this ${type} or posted it publicly, those links will stop working.\n\n` +
        `Current slug: ${oldSlug}\n` +
        `New slug: ${newSlug}\n\n` +
        `Are you sure you want to continue?`
      )
      
      if (!confirmed) {
        return // User cancelled
      }
      
      const endpoint = type === "blog" ? "/api/admin/blog/blogs" : "/api/admin/blog/interviews"
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: oldSlug,
          newSlug: newSlug,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update slug")
      }

      const result = await response.json()
      await fetchAllData()
      alert(`Successfully renamed slug to: ${result.newSlug || newSlug}`)
    } catch (error) {
      console.error("Error updating slug:", error)
      alert(error instanceof Error ? error.message : "Failed to update slug")
      throw error
    }
  }

  const handleCategoryUpdate = async (
    slug: string,
    newCategory: string,
    source: "hardcoded" | "blob",
    type: "blog" | "interview",
  ) => {
    if (source === "hardcoded") {
      alert("Cannot update hardcoded sample posts")
      return
    }

    try {
      setUpdatingCategories((prev) => new Set(prev).add(slug))

      const endpoint = type === "blog" ? "/api/admin/blog/blogs" : "/api/admin/blog/interviews"
      const response = await fetch(endpoint, {
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

      await fetchAllData()
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

  const handleDateUpdate = async (
    slug: string,
    newDate: Date,
    source: "hardcoded" | "blob",
    type: "blog" | "interview",
  ) => {
    if (source === "hardcoded") {
      alert("Cannot update hardcoded sample posts")
      return
    }

    try {
      setUpdatingDates((prev) => new Set(prev).add(slug))

      const formattedDate = format(newDate, "yyyy-MM-dd")

      const endpoint = type === "blog" ? "/api/admin/blog/blogs" : "/api/admin/blog/interviews"
      const response = await fetch(endpoint, {
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

      await fetchAllData()
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

  const handleEditContent = async (slug: string, source: "hardcoded" | "blob", type: "blog" | "interview") => {
    if (source === "hardcoded") {
      alert("Cannot edit hardcoded sample posts")
      return
    }

    try {
      const endpoint =
        type === "blog" ? `/api/admin/blog/blogs/content?slug=${slug}` : `/api/admin/blog/interviews/content?slug=${slug}`
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error("Failed to fetch content")
      }

      const data = await response.json()
      setContentBeingEdited(data.content)
      setEditingContent(slug)
    } catch (error) {
      console.error("Error fetching content:", error)
      alert("Failed to load content for editing")
    }
  }

  const handleSaveContent = async (slug: string, type: "blog" | "interview") => {
    try {
      setSavingContent(true)

      const endpoint = type === "blog" ? "/api/admin/blog/blogs/content" : "/api/admin/blog/interviews/content"
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          content: contentBeingEdited,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save content")
      }

      await fetchAllData()
      setEditingContent(null)
      setContentBeingEdited("")
      alert("Content saved successfully!")
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Failed to save content")
    } finally {
      setSavingContent(false)
    }
  }

  const handleCancelEdit = () => {
    if (confirm("Discard changes?")) {
      setEditingContent(null)
      setContentBeingEdited("")
    }
  }

  const renderContentItem = (item: ContentItem) => {
    const allCategories = ["Interview", "Science", "Training", "Nutrition"]
    const isEditing = editingContent === item.slug
    const viewUrl = item.type === "blog" ? `/blog/${item.slug}` : `/interview/${item.slug}`

    return (
      <div key={`${item.slug}-${item.type}`} className={`border rounded-lg ${isEditing ? "ring-2 ring-primary" : ""}`}>
        <div className="p-4">
          <div className="flex items-start gap-4 hover:bg-gray-50">
            {/* Item Image */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-200">
                {item.image && (
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                )}
              </div>
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <InlineEditTitle
                    initialTitle={item.title}
                    onSave={(newTitle) => handleTitleUpdate(item.slug, newTitle, item.type)}
                    disabled={item.source === "hardcoded"}
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Slug:</span>
                    <InlineEditTitle
                      initialTitle={item.slug}
                      onSave={(newSlug) => handleSlugUpdate(item.slug, newSlug, item.type)}
                      disabled={item.source === "hardcoded"}
                      className="text-xs text-gray-600 font-mono"
                    />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.source === "blob" ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="hover:text-gray-900 hover:underline transition-colors">
                              {updatingDates.has(item.slug) ? "Updating..." : item.date}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={new Date(item.date)}
                              onSelect={(date) => {
                                if (date) {
                                  handleDateUpdate(item.slug, date, item.source, item.type)
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span>{item.date}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {item.source === "blob" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Badge
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                              {updatingCategories.has(item.slug) ? "Updating..." : item.category}
                            </Badge>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {allCategories.map((category) => (
                              <DropdownMenuItem
                                key={category}
                                onClick={() => handleCategoryUpdate(item.slug, category, item.source, item.type)}
                                className={item.category === category ? "bg-gray-100 font-medium" : ""}
                              >
                                {category}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                    <Badge variant={item.source === "hardcoded" ? "default" : "secondary"} className="text-xs">
                      {item.source === "hardcoded" ? "Hardcoded" : "Dynamic"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.type === "blog" ? "Blog Post" : "Interview"}
                    </Badge>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="flex gap-2">
                    {item.source === "blob" && !isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditContent(item.slug, item.source, item.type)}
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Link href={viewUrl} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    {item.source === "blob" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(item.slug, item.source, item.type)}
                        disabled={deletingPosts.has(item.slug)}
                      >
                        {deletingPosts.has(item.slug) ? (
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

          {/* Content Editor Section */}
          {isEditing && (
            <div className="border-t mt-4 pt-4 bg-gray-50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Edit Markdown Content</label>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveContent(item.slug, item.type)} disabled={savingContent}>
                      {savingContent ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1" />
                      ) : (
                        <Save className="w-4 h-4 mr-1" />
                      )}
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={savingContent}>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
                <textarea
                  value={contentBeingEdited}
                  onChange={(e) => setContentBeingEdited(e.target.value)}
                  className="w-full h-96 p-3 border rounded-lg font-mono text-sm resize-y"
                  placeholder="Edit your markdown content here..."
                />
                <p className="text-xs text-gray-500">
                  Tip: You can edit the entire markdown file including frontmatter. Changes will be reflected on the
                  live site.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
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
          <p>Loading data...</p>
        </div>
      </div>
    )
  }

  const totalContent = (blogData?.totalPosts || 0) + (interviewData?.totalInterviews || 0)
  const totalBlobContent = (blogData?.blobPosts || 0) + (interviewData?.totalInterviews || 0)

  const getContentTypeAndSlug = () => {
    if (!selectedPostForImage || selectedPostForImage === "none") {
      return { contentType: undefined, slug: undefined }
    }

    const parts = selectedPostForImage.split("-")
    const contentType = parts[0] as "blog" | "interview"
    const slug = parts.slice(1).join("-")

    console.log("[v0] Admin: Extracted values:", {
      selectedPostForImage,
      contentType,
      slug,
    })

    return { contentType, slug }
  }

  const { contentType: extractedContentType, slug: extractedSlug } = getContentTypeAndSlug()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Administration</h1>
          <p className="text-muted-foreground">Manage blog posts and interviews</p>
        </div>
        <Button onClick={fetchAllData} variant="outline">
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
          <CardDescription>Upload images and link them to blog posts or interviews</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {blogData && interviewData && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Link to Content (Optional)</label>
              <Select value={selectedPostForImage} onValueChange={setSelectedPostForImage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content to link image to..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific content (general upload)</SelectItem>
                  {blogData.posts
                    .filter((post) => post.source === "blob")
                    .map((post) => (
                      <SelectItem key={`blog-${post.slug}`} value={`blog-${post.slug}`}>
                        [Blog] {post.title}
                      </SelectItem>
                    ))}
                  {interviewData.interviews.map((interview) => (
                    <SelectItem key={`interview-${interview.slug}`} value={`interview-${interview.slug}`}>
                      [Interview] {interview.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <BlogImageUploader
            blogSlug={extractedSlug}
            contentType={extractedContentType}
            availablePosts={[...(blogData?.posts || []), ...(interviewData?.interviews || [])]}
            onImageUploaded={(imageUrl) => {
              if (selectedPostForImage && selectedPostForImage !== "none") {
                const [type, ...slugParts] = selectedPostForImage.split("-")
                const slug = slugParts.join("-")
                console.log("[v0] Admin: Uploading image for:", { type, slug, selectedPostForImage })
                handleImageAssigned(imageUrl, slug, type as "blog" | "interview")
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogData?.totalPosts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewData?.totalInterviews || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dynamic Content</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlobContent}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Content</CardTitle>
          <CardDescription>Manage blog posts and interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Content ({totalContent})</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts ({blogData?.totalPosts || 0})</TabsTrigger>
              <TabsTrigger value="interviews">Interviews ({interviewData?.totalInterviews || 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-4">
              {[...(blogData?.posts || []), ...(interviewData?.interviews || [])]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item) => renderContentItem(item))}
            </TabsContent>
            <TabsContent value="blog" className="space-y-4 mt-4">
              {(blogData?.posts || []).map((item) => renderContentItem(item))}
            </TabsContent>
            <TabsContent value="interviews" className="space-y-4 mt-4">
              {(interviewData?.interviews || []).map((item) => renderContentItem(item))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0"
          title="Markdown Shortcuts"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>

        {showMarkdownHelp && (
          <Card className="absolute bottom-16 right-0 w-80 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Markdown Shortcuts</CardTitle>
              <CardDescription className="text-xs">Common formatting syntax</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div># Heading 1</div>
                  <div>## Heading 2</div>
                  <div>### Heading 3</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>**bold text**</div>
                  <div>*italic text*</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>[link text](url)</div>
                  <div>![alt text](image-url)</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>- bullet item</div>
                  <div>1. numbered item</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>`inline code`</div>
                  <div>\`\`\`language</div>
                  <div>code block</div>
                  <div>\`\`\`</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>&gt; blockquote</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
