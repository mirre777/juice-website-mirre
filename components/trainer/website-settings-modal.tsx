"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertCircle, ExternalLink, Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface WebsiteSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  trainerId: string
  currentSlug?: string
  trainerName: string
  onSlugUpdated?: (newSlug: string) => void
}

export function WebsiteSettingsModal({
  isOpen,
  onClose,
  trainerId,
  currentSlug,
  trainerName,
  onSlugUpdated,
}: WebsiteSettingsModalProps) {
  const [customSlug, setCustomSlug] = useState(currentSlug || "")
  const [isValidating, setIsValidating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [validation, setValidation] = useState<{
    isValid: boolean
    isAvailable: boolean
    error?: string
  } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Generate suggested slug from trainer name
  const generateSuggestedSlug = (name: string) => {
    if (!name) return ""
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const suggestedSlug = generateSuggestedSlug(trainerName || "")

  useEffect(() => {
    setHasChanges(customSlug !== (currentSlug || ""))
  }, [customSlug, currentSlug])

  // Validate slug with debouncing
  useEffect(() => {
    if (!customSlug || customSlug === currentSlug) {
      setValidation(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsValidating(true)
      try {
        const response = await fetch(`/api/trainer/validate-slug`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: customSlug, trainerId }),
        })

        const result = await response.json()
        setValidation(result)
      } catch (error) {
        setValidation({
          isValid: false,
          isAvailable: false,
          error: "Failed to validate URL",
        })
      } finally {
        setIsValidating(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [customSlug, currentSlug, trainerId])

  const handleSave = async () => {
    if (!validation?.isValid || !validation?.isAvailable) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/trainer/update-slug`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainerId, customSlug }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Website URL updated successfully!")
        if (onSlugUpdated) {
          onSlugUpdated(customSlug)
        }
        onClose()
      } else {
        toast.error(result.error || "Failed to update URL")
      }
    } catch (error) {
      toast.error("Failed to update URL")
    } finally {
      setIsUpdating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("URL copied to clipboard!")
  }

  const currentUrl = currentSlug ? `/marketplace/trainer/${currentSlug}` : `/marketplace/trainer/${trainerId}`

  const newUrl = customSlug ? `/marketplace/trainer/${customSlug}` : currentUrl

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Website Settings</DialogTitle>
          <DialogDescription>Customize your website URL to make it more memorable and professional.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current URL */}
          <div>
            <Label className="text-sm font-medium">Current Website URL</Label>
            <div className="flex items-center gap-2 mt-1 p-3 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-600 flex-1 break-all">
                {window.location.origin}
                {currentUrl}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`${window.location.origin}${currentUrl}`)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`${window.location.origin}${currentUrl}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Custom URL Input */}
          <div>
            <Label htmlFor="customSlug" className="text-sm font-medium">
              Custom URL
            </Label>
            <div className="mt-2">
              <div className="flex items-stretch overflow-hidden rounded-md border">
                <div className="bg-gray-50 px-3 py-2 border-r flex items-center min-w-0 flex-shrink">
                  <span className="text-sm text-gray-500 truncate">{window.location.origin}/marketplace/trainer/</span>
                </div>
                <Input
                  id="customSlug"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase())}
                  placeholder="your-name-fitness"
                  className="border-0 rounded-none flex-1 min-w-0"
                />
              </div>
            </div>

            {/* Validation Status */}
            {isValidating && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking availability...
              </div>
            )}

            {validation && !isValidating && (
              <div className="mt-2">
                {validation.isValid && validation.isAvailable ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    URL is available!
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {validation.error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Suggested URL */}
          {!currentSlug && customSlug !== suggestedSlug && (
            <div>
              <Label className="text-sm font-medium">Suggested URL</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {suggestedSlug}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setCustomSlug(suggestedSlug)} className="text-xs">
                  Use this
                </Button>
              </div>
            </div>
          )}

          {/* Preview New URL */}
          {hasChanges && customSlug && (
            <div>
              <Label className="text-sm font-medium">New Website URL</Label>
              <div className="flex items-center gap-2 mt-1 p-3 bg-green-50 border border-green-200 rounded-md">
                <span className="text-sm text-green-700 flex-1 break-all">
                  {window.location.origin}
                  {newUrl}
                </span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`${window.location.origin}${newUrl}`)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Warning about URL changes */}
          {currentSlug && hasChanges && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Important:</strong> Changing your URL may affect your search engine rankings. We recommend
                keeping your current URL unless absolutely necessary.
              </AlertDescription>
            </Alert>
          )}

          {/* URL Guidelines */}
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              <strong>URL Guidelines:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use lowercase letters, numbers, and hyphens only</li>
              <li>Keep it short and memorable (3-50 characters)</li>
              <li>Avoid special characters and spaces</li>
              <li>Choose something that represents your brand</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || !validation?.isValid || !validation?.isAvailable || isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WebsiteSettingsModal
