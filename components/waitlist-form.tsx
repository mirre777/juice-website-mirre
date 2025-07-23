"use client"

import type React from "react"

import { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Loader2 } from "lucide-react"
import { submitWaitlistForm } from "@/actions/waitlist-actions"

export function WaitlistForm() {
  const { isCoach } = useTheme()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const result = await submitWaitlistForm(email, isCoach ? "coach" : "client")
      if (result.success) {
        setIsSubmitted(true)
      } else {
        setError(result.error || "Something went wrong")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className={`max-w-md mx-auto ${isCoach ? "bg-white" : "bg-zinc-800 border-zinc-700"}`}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className={`text-xl font-semibold ${isCoach ? "text-black" : "text-white"}`}>You're on the list!</h3>
            <p className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
              We'll notify you when Juice is ready for {isCoach ? "coaches" : "clients"}.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`max-w-md mx-auto ${isCoach ? "bg-white" : "bg-zinc-800 border-zinc-700"}`}>
      <CardHeader className="text-center">
        <Badge variant="outline" className="w-fit mx-auto mb-2">
          Early Access
        </Badge>
        <CardTitle className={`text-2xl ${isCoach ? "text-black" : "text-white"}`}>Join the Waitlist</CardTitle>
        <CardDescription className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
          Be the first to know when Juice launches for {isCoach ? "coaches" : "clients"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`${
                isCoach
                  ? "bg-white border-gray-300"
                  : "bg-zinc-700 border-zinc-600 text-white placeholder:text-gray-400"
              }`}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Waitlist"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
