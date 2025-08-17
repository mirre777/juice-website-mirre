"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, RefreshCw } from "lucide-react"

const POSTS_TO_DELETE = [
  "test-post-or-my-brain-on-auto-pilot",
  "lift-weights-look-great-feel-amazing-no-really",
  "weightlifting-also-known-as-strength-or",
  "httpsfilesslackcomfiles-tmbt07esv7cp7h-f09at31byr2-ae7bbacb8aoptimusprime07375thepersonontheleftisourmaincharacte640434d1-f779-4dc3-b033-ca19f8077ba73720png-weightlifting-also-known-as-strength",
  "weightlifting-not-just-for-meatheads-anymore-but-theyre-welcome-too",
  "weightlifting-not-just-for-meatheads-anymore-or-is-it",
  "-sleep-tracking-helpful-snooze-or-data-doze",
  "-gym-bro-science-fact-fiction-or-just-really-good-marketing",
  "-goodbye-spreadsheets-hello-ai-sidekick",
  "-the-rise-of-the-machines-in-coaching-spoiler-not-quite-",
  "-is-your-toaster-plotting-to-take-your-job-ai-in-the-workplace",
  "-is-your-toaster-plotting-to-steal-your-job-aka-ai-in-the-fitness-world-",
  "-ai-the-fitness-worlds-newest-shiny-toy-or-your-coachs-new-sidekick",
]

interface BlogPost {
  slug: string
  title: string
  category: string
  url: string
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [debugToken, setDebugToken] = useState("")

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blog-list", {
        headers: {
          "X-Debug-Token": debugToken,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      } else {
        console.error("Failed to fetch posts")
        setPosts([])
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (debugToken) {
      fetchPosts()
    }
  }, [debugToken])

  const deletePost = async (slug: string) => {
    if (!debugToken) {
      alert("Please enter debug token first")
      return
    }

    setDeleting(slug)
    try {
      const response = await fetch("/api/blog-post", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Token": debugToken,
        },
        body: JSON.stringify({ slug }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Successfully deleted: ${slug}`)
        await fetchPosts() // Refresh the list
      } else {
        alert(`Error: ${result.message}`)
      }
    } catch (error) {
      alert(`Error deleting post: ${error.message}`)
    } finally {
      setDeleting(null)
    }
  }

  const deleteAllProblematic = async () => {
    if (!debugToken) {
      alert("Please enter debug token first")
      return
    }

    if (!confirm(`Delete ${POSTS_TO_DELETE.length} problematic posts?`)) return

    for (const slug of POSTS_TO_DELETE) {
      await deletePost(slug)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second between deletions
    }
  }

  const problematicPosts = posts.filter((post) =>
    POSTS_TO_DELETE.some(
      (problemSlug) => post.slug === problemSlug || post.slug.includes(problemSlug) || problemSlug.includes(post.slug),
    ),
  )

  const cleanPosts = posts.filter(
    (post) =>
      !POSTS_TO_DELETE.some(
        (problemSlug) =>
          post.slug === problemSlug || post.slug.includes(problemSlug) || problemSlug.includes(post.slug),
      ),
  )

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Blog Admin</h1>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Enter debug token"
            value={debugToken}
            onChange={(e) => setDebugToken(e.target.value)}
            className="px-4 py-2 border rounded mr-4"
          />
          <Button onClick={fetchPosts} className="mr-4" disabled={!debugToken}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading && <div className="text-center py-8">Loading blog posts...</div>}

        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{posts.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Problematic Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{problematicPosts.length}</div>
                  <Button
                    onClick={deleteAllProblematic}
                    className="mt-2 bg-red-600 hover:bg-red-700"
                    disabled={!debugToken || problematicPosts.length === 0}
                  >
                    Delete All Problematic
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clean Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{cleanPosts.length}</div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-red-600">Problematic Posts ({problematicPosts.length})</h2>
              <div className="grid gap-4">
                {problematicPosts.map((post) => (
                  <Card key={post.slug} className="border-red-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">Slug: {post.slug}</p>
                          <Badge className="mt-2">{post.category}</Badge>
                        </div>
                        <Button
                          onClick={() => deletePost(post.slug)}
                          disabled={deleting === post.slug || !debugToken}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleting === post.slug ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-green-600">Clean Posts ({cleanPosts.length})</h2>
              <div className="grid gap-4">
                {cleanPosts.map((post) => (
                  <Card key={post.slug} className="border-green-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">Slug: {post.slug}</p>
                          <p className="text-sm text-blue-600 mt-1">URL: https://www.juice.fitness/blog/{post.slug}</p>
                          <Badge className="mt-2">{post.category}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
