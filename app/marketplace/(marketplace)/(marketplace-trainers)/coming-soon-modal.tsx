import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  trainerName: string
}

export function ComingSoonModal({ isOpen, onClose, trainerName }: ComingSoonModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Coming Soon</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {trainerName}'s Profile
              </h3>
              <p className="text-gray-600 mb-4">
                This trainer's microsite is coming soon! We're working hard to bring you the best experience.
              </p>
            </div>
            <Button onClick={onClose} className="w-full">
              Got it!
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
