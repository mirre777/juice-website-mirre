"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { joinWaitlist } from "@/actions/waitlist-actions"
import { Loader2, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { successAnimations } from "@/utils/animations"
import { trackEvent } from "@/lib/analytics"

interface InterviewWaitlistWidgetProps {
  trainerName: string
  articleTitle: string
}

export function InterviewWaitlistWidget({ trainerName, articleTitle }: InterviewWaitlistWidgetProps) {
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

    trackEvent("interview_waitlist_submit", {
      trainer: trainerName,
      article: articleTitle,
    })

    formData.append("source", "Interview")
    formData.append("trainer", trainerName)
    formData.append("user_type", "client")
    formData.append("city", city)
    formData.append("phone", phone)

    setButtonDisabled(true)
    setIsSubmitting(true)

    try {
      const result = await joinWaitlist(formData)

      setFormStatus(result)

      if (result.success) {
        trackEvent("interview_booking_success", {
          trainer: trainerName,
          article: articleTitle,
        })

        setEmail("")
        setPhone("")
        setCity("")
      } else {
        trackEvent("interview_booking_error", {
          trainer: trainerName,
          error_message: result.message || "Unknown error",
        })
      }
    } catch (error) {
      console.error("Interview form submission error:", error)

      trackEvent("interview_booking_error", {
        trainer: trainerName,
        error_message: error instanceof Error ? error.message : String(error),
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
    const animation = successAnimations.pulse

    return (
      <div className="py-6 text-center">
        <motion.div
          className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
          initial={animation.container.initial}
          animate={animation.container.animate}
          transition={animation.container.transition}
        >
          <motion.div
            initial={animation.icon.initial}
            animate={animation.icon.animate}
            transition={animation.icon.transition}
          >
            <CheckCircle className="h-8 w-8 text-green-500" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={animation.text.initial}
          animate={animation.text.animate}
          transition={animation.text.transition}
        >
          <h3 className="text-xl font-bold mb-2 text-gray-900">Thank You!</h3>
          <p className="text-gray-600 text-base">{formStatus.message}</p>
          {formStatus.alreadyExists && (
            <p className="text-gray-600 text-sm mt-2">We'll be in touch soon to schedule your intro call.</p>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-juice/10 to-juice/5 rounded-2xl p-8 my-12">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-2 text-gray-900 text-center">
          Interested in Training with {trainerName}?
        </h3>
        <p className="text-gray-600 mb-6 text-center">
          Book a free intro call to discuss your fitness goals and see if we're a good fit.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="interview-email" className="text-sm font-medium text-gray-900 block">
                Email
              </label>
              <input
                id="interview-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 h-11 rounded-full border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-juice text-sm"
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label htmlFor="interview-phone" className="text-sm font-medium text-gray-900 block">
                Phone
              </label>
              <input
                id="interview-phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+31 6 1234 5678"
                required
                className="w-full px-4 h-11 rounded-full border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-juice text-sm"
              />
            </div>

            {/* City Input */}
            <div className="space-y-2">
              <label htmlFor="interview-city" className="text-sm font-medium text-gray-900 block">
                City
              </label>
              <input
                id="interview-city"
                name="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Your City"
                required
                className="w-full px-4 h-11 rounded-full border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-juice text-sm"
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By submitting, you agree to be contacted about scheduling an intro call. 💪
          </p>

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              className="bg-juice text-juice-foreground hover:bg-juice/90 py-3 h-auto px-8 transition-all active:scale-95 rounded-full font-semibold"
              disabled={isSubmitting || buttonDisabled}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Book An Intro Call"
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
      </div>
    </div>
  )
}
