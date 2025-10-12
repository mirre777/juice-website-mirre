"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, Loader2 } from "lucide-react"
import { joinWaitlist } from "@/actions/waitlist-actions"

interface InterviewWaitlistWidgetProps {
  trainerName: string
  articleTitle: string
  slug: string
}

export function InterviewWaitlistWidget({ trainerName, articleTitle, slug }: InterviewWaitlistWidgetProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("email", formData.email)
      formDataObj.append("phone", formData.phone)
      formDataObj.append("message", formData.message)
      formDataObj.append("source", slug) // Use slug instead of full article title for easier tracking
      formDataObj.append("city", "Unknown") // Required field
      formDataObj.append("user_type", "client") // Default to client
      formDataObj.append("plan", "basic") // Default plan

      const result = await joinWaitlist(formDataObj)

      if (!result.success) {
        throw new Error(result.message || "Failed to submit form")
      }

      setIsSuccess(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.error("[v0] Error submitting form:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSuccess) {
    return (
      <Card className="my-12 border-juice/20 bg-gradient-to-br from-juice/5 to-juice/10">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-juice mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2 text-gray-900">Thank You!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We've received your request. {trainerName} or a member of our team will be in touch soon to schedule your
            intro call.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="my-12 border-juice/20 bg-gradient-to-br from-juice/5 to-juice/10">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-juice rounded-full">
            <Calendar className="w-6 h-6 text-black" />
          </div>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
          Interested in Training with {trainerName}?
        </CardTitle>
        <CardDescription className="text-base text-gray-600 max-w-2xl mx-auto">
          Book a free intro call to discuss your fitness goals and see if {trainerName}'s training style is right for
          you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="bg-white border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Tell us about your fitness goals (Optional)
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="I'm interested in strength training and would like to improve my overall fitness..."
              rows={4}
              className="bg-white border-gray-300 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-juice text-black hover:bg-juice/90 font-semibold py-6 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                Request Intro Call
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By submitting this form, you agree to be contacted by Juice or {trainerName} regarding your fitness goals.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
