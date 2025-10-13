"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { joinWaitlist } from "@/actions/waitlist-actions"
import { Loader2, CheckCircle } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"
import { successAnimations } from "@/utils/animations"
import { trackEvent } from "@/lib/analytics"

interface WaitlistFormProps {
  selectedPlan: string | null
  showClientCounter?: boolean
}

export function WaitlistForm({ selectedPlan, showClientCounter = true }: WaitlistFormProps) {
  const { isCoach } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    success?: boolean
    message?: string
    error?: string
    alreadyExists?: boolean
  }>({})
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [clientCount, setClientCount] = useState(1)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Determine user type - fix the undefined issue
    const userType = isCoach ? "trainer" : "client"

    trackEvent("waitlist_submit", {
      user_type: userType,
      plan: selectedPlan || "basic",
      client_count: showClientCounter ? clientCount : undefined,
    })

    // Add all form data
    if (showClientCounter) {
      formData.append("numClients", clientCount.toString())
    }
    formData.append("city", city)
    formData.append("phone", phone)
    formData.append("user_type", userType) // Explicitly set user_type

    // Provide immediate visual feedback
    setButtonDisabled(true)
    setIsSubmitting(true)

    try {
      const result = await joinWaitlist(formData)

      setFormStatus(result)

      if (result.success) {
        trackEvent("early_access_valid_form_submission", {
          user_type: userType,
          plan: selectedPlan || "basic",
        })

        // Clear form if successful
        setEmail("")
        setPhone("")
        setCity("")
        if (showClientCounter) {
          setClientCount(1)
        }
      } else {
        trackEvent("early_access_valid_form_submission", {
          user_type: userType,
          error_message: result.message || "Unknown error",
          success: false,
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)

      trackEvent("early_access_valid_form_submission", {
        user_type: userType,
        error_message: error instanceof Error ? error.message : String(error),
        success: false,
      })

      setFormStatus({
        success: false,
        message: "Something went wrong. Please try again.",
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsSubmitting(false)
      setButtonDisabled(false)
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
          <h3 className="text-lg font-bold mb-1 text-white">Thank You!</h3>
          <p className="text-zinc-400 text-sm">{formStatus.message}</p>
          {formStatus.alreadyExists && (
            <p className="text-zinc-400 text-sm mt-2">We'll keep you updated on our progress.</p>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Email Input */}
        <div className="space-y-1 flex-2 min-w-0">
          <label htmlFor="email" className="text-sm font-medium text-left block text-black">
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
            className="w-full px-4 h-12 rounded-full border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-juice text-base"
          />
        </div>

        {/* Phone Input */}
        <div className="space-y-1 flex-1 min-w-0 max-w-[180px]">
          <label htmlFor="phone" className="text-sm font-medium text-left block text-black">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+31 6 1234 5678"
            required
            className="w-full px-4 h-12 rounded-full border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-juice text-base"
          />
        </div>

        {/* City Input */}
        <div className="space-y-1 flex-1 min-w-0">
          <label htmlFor="city" className="text-sm font-medium text-left block text-black">
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
            className="w-full px-4 h-12 rounded-full border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-juice text-base"
          />
        </div>

        {/* Client Count Stepper */}
        {showClientCounter && (
          <div className="space-y-1 flex-1">
            <label htmlFor="numClients" className="text-sm font-medium text-left block text-black">
              Get clients
            </label>
            <div className="flex items-center border border-gray-300 rounded-full bg-white text-black overflow-hidden h-11 max-w-[180px] mx-auto">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setClientCount((prev) => Math.max(1, prev - 1))}
                className="h-11 w-11 rounded-full text-black hover:bg-zinc-200"
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
                className="h-11 w-11 rounded-full text-black hover:bg-zinc-200"
              >
                +
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden inputs for form data */}
      <input type="hidden" name="plan" value={selectedPlan || ""} />

      <p className="text-xs text-zinc-400 text-center mt-2">
        By joining, you agree to receive updates about our launch. 💪
      </p>

      <div className="flex justify-center mt-6">
        <Button
          type="submit"
          className={
            isCoach
              ? "bg-black text-white hover:bg-gray-800 py-2 h-auto px-8 transition-all active:scale-95 active:bg-gray-900 rounded-full border-2 border-white"
              : "bg-white text-black hover:bg-gray-200 py-2 h-auto px-8 transition-all active:scale-95 active:bg-gray-300 rounded-full"
          }
          disabled={isSubmitting || buttonDisabled}
          id={isCoach ? "waitlist_submit_trainer" : "waitlist_submit_client"}
          data-plan={selectedPlan || ""}
          data-user-type={isCoach ? "trainer" : "client"}
          data-client-count={showClientCounter ? clientCount : undefined}
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
