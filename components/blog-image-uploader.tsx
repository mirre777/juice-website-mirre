"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, ImageIcon, Copy, Check, X } from "lucide-react"
import Image from "next/image"

interface BlogImageUploaderProps {
  blogSlug?: string
  onImageUploaded?: (imageUrl: string) => void
}

interface UploadedImage {
  url: string
  fileName: string
  originalName: string
  size: number
  type: string
}

export function BlogImageUploader({ blogSlug, onImageUploaded }: BlogImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [preserveOriginalName, setPreserveOriginalName] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      if (blogSlug) {
        formData.append("blogSlug", blogSlug)
      }
      formData.append("preserveOriginalName", preserveOriginalName.toString())

      const response = await fetch("/api/admin/blog-images", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const result = await response.json()

      setUploadedImages((prev) => [result, ...prev])
      onImageUploaded?.(result.url)

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
          {blogSlug && ` Linked to: ${blogSlug}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </>
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
