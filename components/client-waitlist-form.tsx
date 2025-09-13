"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { joinWaitlist } from "@/actions/waitlist-actions"
import { Loader2, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { successAnimations } from "@/utils/animations"
import { trackEvent } from "@/lib/analytics"

interface ClientWaitlistFormProps {
  selectedPlan?: string | null
}

export function ClientWaitlistForm({ selectedPlan }: ClientWaitlistFormProps) {
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
  const [buttonDisabled, setButtonDisabled] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    trackEvent("waitlist_submit", {
      user_type: "client",
      plan: selectedPlan || "basic",
    })

    // Set user type to client
    formData.append("user_type", "client")
    formData.append("city", city)
    formData.append("phone", phone)

    // Provide immediate visual feedback
    setButtonDisabled(true)
    setIsSubmitting(true)

    try {
      const result = await joinWaitlist(formData)

      setFormStatus(result)

      if (result.success) {
        trackEvent("early_access_valid_form_submission", {
          user_type: "client",
          plan: selectedPlan || "basic",
        })

        // Clear form if successful
        setEmail("")
        setPhone("")
        setCity("")
      } else {
        trackEvent("early_access_valid_form_submission", {
          user_type: "client",
          error_message: result.message || "Unknown error",
          success: false,
        })
      }
    } catch (error) {
      console.error("Client form submission error:", error)

      trackEvent("early_access_valid_form_submission", {
        user_type: "client",
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div className="flex flex-col gap-4">
        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="client-email" className="text-sm font-medium text-left block text-white">
            Email
          </label>
          <input
            id="client-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 h-12 rounded-full border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent text-sm"
          />
        </div>

        {/* Phone Input */}
        <div className="space-y-2">
          <label htmlFor="client-phone" className="text-sm font-medium text-left block text-white">
            Phone
          </label>
          <input
            id="client-phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+31 6 1234 5678"
            required
            className="w-full px-4 h-12 rounded-full border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent text-sm"
          />
        </div>

        {/* City Input */}
        <div className="space-y-2">
          <label htmlFor="client-city" className="text-sm font-medium text-left block text-white">
            City
          </label>
          <input
            id="client-city"
            name="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Your City"
            required
            className="w-full px-4 h-12 rounded-full border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Hidden inputs for form data */}
      <input type="hidden" name="plan" value={selectedPlan || "basic"} />

      <p className="text-xs text-zinc-400 text-center mt-4">
        By joining, you agree to receive updates about our launch. 💪
      </p>

      <div className="flex justify-center mt-6">
        <Button
          type="submit"
          className="bg-white text-black hover:bg-gray-200 py-3 h-auto px-8 transition-all active:scale-95 active:bg-gray-300 rounded-full font-medium"
          disabled={isSubmitting || buttonDisabled}
          id="waitlist_submit_client"
          data-plan={selectedPlan || "basic"}
          data-user-type="client"
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
