"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { joinWaitlist } from "@/actions/waitlist-actions"
import { CheckCircle } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"
import { successAnimations } from "@/utils/animations"

interface WaitlistFormProps {
  selectedPlan?: string | null
}

export function WaitlistForm({ selectedPlan }: WaitlistFormProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setButtonDisabled(true)

    // Small delay before showing the spinner to ensure the button click is visually acknowledged
    setTimeout(() => {
      if (buttonDisabled) {
        setIsSubmitting(true)
      }
    }, 150)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("city", city) // Add city to formData
    formData.append("plan", selectedPlan || "")
    formData.append("user_type", isCoach ? "trainer" : "client")

    // Add clientCount to formData only if showClientCounter is true
    formData.append("numClients", clientCount.toString())

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
        setCity("") // Clear city field
        setClientCount(1) // Reset client count
      }

      toast({
        title: result.success ? "Success!" : "Error",
        description: result.success
          ? "You've been added to the waitlist. We'll be in touch soon!"
          : "Something went wrong. Please try again.",
        variant: result.success ? undefined : "destructive",
      })
    } catch (error) {
      console.error("Form submission error:", error)
      setFormStatus({
        success: false,
        message: "Something went wrong. Please try again.",
        error: error instanceof Error ? error.message : String(error),
      })

      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div>
        <Label htmlFor="email" className="sr-only">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="city" className="sr-only">
          City
        </Label>
        <Input
          id="city"
          type="text"
          placeholder="Your City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full"
        />
      </div>
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
        <Input
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
      <Button
        type="submit"
        disabled={isSubmitting || buttonDisabled}
        className="w-full bg-juice text-black hover:bg-juice/90"
      >
        {isSubmitting ? "Joining..." : "Join Waitlist"}
      </Button>
      {formStatus.success === false && (
        <div className="text-red-500 text-xs text-center mt-2">
          <p>{formStatus.message}</p>
          {formStatus.error && <p className="mt-1">Error details: {formStatus.error}</p>}
        </div>
      )}
      <p className="text-xs text-zinc-400 text-center mt-2">
        By joining, you agree to receive updates about our launch. 💪
      </p>
    </form>
  )
}
