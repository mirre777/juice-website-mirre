"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { joinWaitlist } from "@/actions/waitlist-actions"
import { CheckCircle, Loader2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"
import { successAnimations } from "@/utils/animations"

interface WaitlistFormProps {
  selectedPlan: string | null
  showClientCounter?: boolean
}

export function WaitlistForm({ selectedPlan, showClientCounter = true }: WaitlistFormProps) {
  const { isCoach } = useTheme()
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("") // New state for city
  const [clientCount, setClientCount] = useState(1) // New state for client count
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    success?: boolean
    message?: string
    error?: string
    alreadyExists?: boolean
  }>({})
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false) // Declare isSubmitting state

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    // Add clientCount to formData only if showClientCounter is true
    if (showClientCounter) {
      formData.append("numClients", clientCount.toString())
    }
    formData.append("city", city)

    // Provide immediate visual feedback
    setButtonDisabled(true)

    // Small delay before showing the spinner to ensure the button click is visually acknowledged
    setTimeout(() => {
      if (buttonDisabled) {
        setIsSubmitting(true)
      }
    }, 150)

    try {
      console.log("Submitting form with plan:", selectedPlan)

      // Check if we're using mock Firebase configuration
      if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        // Simulate a successful response in preview/development mode
        setTimeout(() => {
          setFormStatus({
            success: true,
            message: "You've been added to our waitlist! (Preview Mode)",
          })
          setIsSubmitting(false)
          setButtonDisabled(false)
        }, 1000)
        return
      }

      const result = await joinWaitlist(formData)
      console.log("Form submission result:", result)
      setFormStatus(result)

      if (result.success) {
        // Clear form if successful
        setEmail("")
        setCity("")
        if (showClientCounter) {
          setClientCount(1)
        }
      }

      // Re-enable the button after 2 seconds
      setTimeout(() => {
        setButtonDisabled(false)
      }, 2000)
    } catch (error) {
      console.error("Form submission error:", error)
      setFormStatus({
        success: false,
        message: "Something went wrong. Please try again.",
        error: error instanceof Error ? error.message : String(error),
      })

      // Re-enable the button after 2 seconds
      setTimeout(() => {
        setButtonDisabled(false)
      }, 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (formStatus.success) {
    // Using the pulse animation from our animations utility
    const animation = successAnimations.pulse

    return (
      <div className="py-4 text-center">
        <motion.div
          className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3"
          initial={animation.container.initial}
          animate={animation.container.animate}
          transition={animation.container.transition}
        >
          <motion.div
            initial={animation.icon.initial}
            animate={animation.icon.animate}
            transition={animation.icon.transition}
          >
            <CheckCircle className="h-6 w-6 text-green-500" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={animation.text.initial}
          animate={animation.text.animate}
          transition={animation.text.transition}
        >
          <h3 className={`text-lg font-bold mb-1 text-white`}>Thank You!</h3>
          <p className="text-zinc-400 text-sm">{formStatus.message}</p>
          {formStatus.alreadyExists && (
            <p className="text-zinc-400 text-sm mt-2">We'll keep you updated on our progress.</p>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Email Input */}
        <div className="space-y-1 flex-1">
          <label htmlFor="email" className={`text-sm font-medium text-left block text-white`}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className={`w-full px-3 h-10 rounded-full border border-white bg-black text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-juice text-sm`}
          />
        </div>

        {/* City Input */}
        <div className="space-y-1 flex-1">
          <label htmlFor="city" className={`text-sm font-medium text-left block text-white`}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Your City"
            required
            className={`w-full px-3 h-10 rounded-full border border-white bg-black text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-juice text-sm`}
          />
        </div>

        {/* Client Count Stepper */}
        {showClientCounter && (
          <div className="space-y-1 flex-1">
            <label htmlFor="numClients" className={`text-sm font-medium text-left block text-white`}>
              Get clients
            </label>
            <div className="flex items-center border border-white rounded-full bg-white text-black overflow-hidden h-10 max-w-[180px] mx-auto">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setClientCount((prev) => Math.max(1, prev - 1))}
                className="h-10 w-10 rounded-full text-black hover:bg-zinc-200"
              >
                -
              </Button>
              <input
                id="numClients"
                name="numClients"
                type="number"
                value={clientCount}
                onChange={(e) => setClientCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-16 text-center bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setClientCount((prev) => prev + 1)}
                className="h-10 w-10 rounded-full text-black hover:bg-zinc-200"
              >
                +
              </Button>
            </div>
          </div>
        )}
      </div>
      <input type="hidden" name="plan" value={selectedPlan || ""} />
      <input type="hidden" name="user_type" value={isCoach ? "trainer" : "client"} />
      {/* Moved the paragraph here */}
      <p className="text-xs text-zinc-400 text-center mt-2">
        By joining, you agree to receive updates about our launch. 💪
      </p>
      <div className="flex justify-center mt-6">
        <Button
          type="submit"
          className="bg-white text-black hover:bg-gray-200 py-2 h-auto px-8 transition-all active:scale-95 active:bg-gray-300"
          disabled={isSubmitting || buttonDisabled}
          id={isCoach ? "waitlist_submit_trainer" : "waitlist_submit_client"}
          data-plan={selectedPlan || ""}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Enter waitlist now"
          )}
        </Button>
      </div>
      {formStatus.success === false && (
        <div className="text-red-500 text-xs text-center mt-2">
          <p>{formStatus.message}</p>
          {formStatus.error && <p className="mt-1">Error details: {formStatus.error}</p>}
        </div>
      )}
    </form>
  )
}
