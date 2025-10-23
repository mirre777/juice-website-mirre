import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClientWaitlistForm } from "@/components/client-waitlist-form"

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
        {/* X button in top-right corner */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 p-0 z-10"
        >
          <X className="h-4 w-4" />
        </Button>
        
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
                This trainer's microsite is coming soon! Join the waitlist to be notified when it's ready.
              </p>
            </div>
            
            {/* Replace button with ClientWaitlistForm */}
            <div className="bg-gray-50 rounded-lg p-4">
              <ClientWaitlistForm 
                source={`trainer-${trainerName.toLowerCase().replace(/\s+/g, '-')}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
