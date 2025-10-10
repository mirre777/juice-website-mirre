"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Copy, Check, X } from "lucide-react"
import Image from "next/image"

interface BlogImageUploaderProps {
  blogSlug?: string
  contentType?: "blog" | "interview"
  onImageUploaded?: (imageUrl: string) => void
  availablePosts?: Array<{ slug: string; title: string; source: string }>
}

interface UploadedImage {
  url: string
  fileName: string
  originalName: string
  size: number
  type: string
  originalSize?: number // Added to show compression stats
  compressionRatio?: string // Added to show compression stats
}

export function BlogImageUploader({
  blogSlug,
  contentType,
  onImageUploaded,
  availablePosts = [],
}: BlogImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [preserveOriginalName, setPreserveOriginalName] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedBlogPost, setSelectedBlogPost] = useState<string>(blogSlug || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter out hardcoded posts - only show editable blob posts
  const editablePosts = availablePosts.filter((post) => post.source === "blob")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadImage = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", selectedFile)

      let actualSlug = blogSlug || selectedBlogPost
      if (actualSlug && (actualSlug.startsWith("blog-") || actualSlug.startsWith("interview-"))) {
        actualSlug = actualSlug.split("-").slice(1).join("-")
      }

      if (actualSlug && actualSlug !== "none") {
        formData.append("blogSlug", actualSlug)
      }
      formData.append("preserveOriginalName", preserveOriginalName.toString())

      console.log("[v0] Uploading image with slug:", actualSlug)

      // Step 1: Upload the image
      const uploadResponse = await fetch("/api/admin/blog-images", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json()
        throw new Error(error.error || "Upload failed")
      }

      const uploadResult = await uploadResponse.json()

      if (uploadResult.compressionRatio) {
        console.log(
          `[v0] Image compressed: ${uploadResult.originalSize} → ${uploadResult.size} bytes (${uploadResult.compressionRatio} reduction)`,
        )
      }

      if (selectedBlogPost && selectedBlogPost !== "none" && contentType) {
        const slug = actualSlug || selectedBlogPost.split("-").slice(1).join("-")

        console.log("[v0] Linking image to content:", {
          contentType,
          slug,
          endpoint: contentType === "interview" ? "/api/admin/interviews" : "/api/admin/blog-posts",
        })

        const endpoint = contentType === "interview" ? "/api/admin/interviews" : "/api/admin/blog-posts"

        const linkResponse = await fetch(endpoint, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: slug,
            image: uploadResult.url,
          }),
        })

        if (!linkResponse.ok) {
          const linkError = await linkResponse.json()
          throw new Error(linkError.error || `Failed to link image to ${contentType}`)
        }

        alert(
          `Image successfully linked to ${contentType}!${uploadResult.compressionRatio ? `\n\nCompressed by ${uploadResult.compressionRatio}` : ""}`,
        )
      }

      setUploadedImages((prev) => [uploadResult, ...prev])
      onImageUploaded?.(uploadResult.url)

      clearSelectedFile()
    } catch (error) {
      console.error("Upload error:", error)
      alert(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Blog Image Uploader
        </CardTitle>
        <CardDescription>
          Upload images for blog posts. Images will be stored in the blog-images folder.
          {selectedBlogPost && ` Linked to: ${selectedBlogPost}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {editablePosts.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="blog-post-select">Link to Blog Post (Optional)</Label>
            <Select value={selectedBlogPost} onValueChange={setSelectedBlogPost}>
              <SelectTrigger>
                <SelectValue placeholder="Select a blog post to link this image to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No blog post (general upload)</SelectItem>
                {editablePosts.map((post) => (
                  <SelectItem key={post.slug} value={post.slug}>
                    {post.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-2">
          <Label htmlFor="image-upload">Select Image</Label>
          <div className="flex gap-2">
            <Input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              disabled={uploading}
              className="flex-1"
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} variant="outline">
              <Upload className="w-4 h-4" />
            </Button>
          </div>

          {selectedFile && (
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Selected file:</p>
                <Button size="sm" variant="ghost" onClick={clearSelectedFile} disabled={uploading}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 relative rounded bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
                <Button onClick={uploadImage} disabled={uploading} className="ml-auto">
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Uploading...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="preserve-name"
              checked={preserveOriginalName}
              onCheckedChange={(checked) => setPreserveOriginalName(checked as boolean)}
            />
            <Label htmlFor="preserve-name" className="text-sm">
              Preserve original filename (adds timestamp for uniqueness)
            </Label>
          </div>

          <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WebP. Maximum size: 10MB</p>
        </div>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="space-y-3">
            <Label>Recently Uploaded Images</Label>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uploadedImages.map((image, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {/* Image Preview */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.originalName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Image Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{image.originalName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(image.size)} • {image.type}
                      {image.compressionRatio && (
                        <span className="text-green-600 ml-1">• {image.compressionRatio} smaller</span>
                      )}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Input value={image.url} readOnly className="text-xs h-8 font-mono" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(image.url)}
                        className="h-8 px-2"
                      >
                        {copiedUrl === image.url ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
