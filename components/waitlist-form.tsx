"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { joinWaitlist } from "@/actions/waitlist-actions"
import { Loader2, CheckCircle } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"
import { successAnimations } from "@/utils/animations"

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

    console.log("Form submission started")
    console.log("isCoach from theme:", isCoach)

    // Determine user type - fix the undefined issue
    const userType = isCoach ? "trainer" : "client"
    console.log("Determined user type:", userType)

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
      console.log("Calling joinWaitlist with data:", Object.fromEntries(formData.entries()))

      const result = await joinWaitlist(formData)
      console.log("joinWaitlist result:", result)

      setFormStatus(result)

      if (result.success) {
        // Clear form if successful
        setEmail("")
        setPhone("")
        setCity("")
        if (showClientCounter) {
          setClientCount(1)
        }
      }
    } catch (error) {
      console.error("Form submission error:", error)
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
    <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Email Input */}
        <div className="space-y-1 flex-1">
          <label htmlFor="email" className="text-sm font-medium text-left block text-white">
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
            className="w-full px-3 h-10 rounded-full border border-white bg-black text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-juice text-sm"
          />
        </div>

        {/* Phone Input */}
        <div className="space-y-1 flex-1">
          <label htmlFor="phone" className="text-sm font-medium text-left block text-white">
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
            className="w-full px-3 h-10 rounded-full border border-white bg-black text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-juice text-sm"
          />
        </div>

        {/* City Input */}
        <div className="space-y-1 flex-1">
          <label htmlFor="city" className="text-sm font-medium text-left block text-white">
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
            className="w-full px-3 h-10 rounded-full border border-white bg-black text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-juice text-sm"
          />
        </div>

        {/* Client Count Stepper */}
        {showClientCounter && (
          <div className="space-y-1 flex-1">
            <label htmlFor="numClients" className="text-sm font-medium text-left block text-white">
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

      {/* Hidden inputs for form data */}
      <input type="hidden" name="plan" value={selectedPlan || ""} />

      {/* Debug info */}
      <div className="text-xs text-zinc-500 text-center">Debug: User type will be {isCoach ? "trainer" : "client"}</div>

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
