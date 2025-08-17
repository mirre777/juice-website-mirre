"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, ExternalLink, X, Clock, Save } from "lucide-react"

interface TrainerProfileHeaderProps {
  mode: "live" | "temp"

  // Live mode props
  isActive?: boolean
  isEditing?: boolean
  hasUnsavedChanges?: boolean
  onViewLive?: () => void
  onEdit?: () => void
  onDashboard?: () => void
  onSave?: () => void
  onCancel?: () => void
  saving?: boolean

  // Temp mode props
  timeLeft?: string
  onActivate?: () => void
  activationPrice?: string
}

export default function TrainerProfileHeader({
  mode,
  isActive,
  isEditing,
  hasUnsavedChanges,
  onViewLive,
  onEdit,
  onDashboard,
  onSave,
  onCancel,
  saving,
  timeLeft,
  onActivate,
  activationPrice = "€70",
}: TrainerProfileHeaderProps) {
  if (mode === "temp") {
    return (
      <div className="bg-[#D2FF28] text-black py-3 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Preview Mode - Expires in: {timeLeft}</span>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <>
                <Button
                  onClick={onEdit}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Preview
                </Button>
                <Button
                  onClick={onActivate}
                  size="sm"
                  className="bg-black text-[#D2FF28] hover:bg-gray-800 font-medium"
                >
                  Activate Now - {activationPrice}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onCancel}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={onSave}
                  size="sm"
                  className="bg-black text-[#D2FF28] hover:bg-gray-800 font-medium"
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Live mode header
  return (
    <div className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Badge variant="default" className="bg-green-500">
              {isActive ? "Live" : "Draft"}
            </Badge>
            <Badge variant="secondary">{isEditing ? "Editing Mode" : "Active Profile"}</Badge>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="border-orange-500 text-orange-600">
                Unsaved Changes
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              // View Mode Actions
              <>
                <Button variant="outline" onClick={onViewLive} className="flex items-center space-x-2 bg-transparent">
                  <Eye className="h-4 w-4" />
                  <span>View Live</span>
                </Button>
                <Button variant="outline" onClick={onEdit} className="flex items-center space-x-2 bg-transparent">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
                <Button variant="outline" onClick={onDashboard} className="flex items-center space-x-2 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </>
            ) : (
              // Edit Mode Actions
              <>
                <Button variant="outline" onClick={onCancel} className="flex items-center space-x-2 bg-transparent">
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
