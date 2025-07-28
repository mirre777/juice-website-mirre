"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { joinWaitlist } from "@/actions/waitlist-actions"
import { useToast } from "@/hooks/use-toast"

interface WaitlistFormProps {
  userType: "client" | "trainer"
}

export function WaitlistForm({ userType }: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [numClients, setNumClients] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !phone || !city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("phone", phone)
      formData.append("city", city)
      formData.append("user_type", userType)
      if (userType === "trainer" && numClients) {
        formData.append("numClients", numClients)
      }

      const result = await joinWaitlist(formData)

      if (result.success) {
        toast({
          title: "Success!",
          description: "You've been added to the waitlist.",
        })
        // Clear form
        setEmail("")
        setPhone("")
        setCity("")
        setNumClients("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-black border-white text-white placeholder:text-gray-400"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
            Phone
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            minLength={8}
            className="bg-black border-white text-white placeholder:text-gray-400"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="city" className="block text-sm font-medium text-white mb-2">
            City
          </label>
          <Input
            id="city"
            type="text"
            placeholder="Your City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="bg-black border-white text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {userType === "trainer" && (
        <div>
          <label htmlFor="numClients" className="block text-sm font-medium text-white mb-2">
            Number of Clients (Optional)
          </label>
          <Input
            id="numClients"
            type="number"
            placeholder="How many clients do you currently have?"
            value={numClients}
            onChange={(e) => setNumClients(e.target.value)}
            min="0"
            className="bg-black border-white text-white placeholder:text-gray-400"
          />
        </div>
      )}

      <div className="text-center">
        <p className="text-gray-400 text-sm mb-4">By joining, you agree to receive updates about our launch. 💪</p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-white text-black hover:bg-gray-200 px-8 py-2 rounded-full font-medium"
        >
          {isSubmitting ? "Joining..." : "Enter waitlist now"}
        </Button>
      </div>
    </form>
  )
}
