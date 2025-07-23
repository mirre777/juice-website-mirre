"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/components/theme-provider"
import { submitWaitlistForm } from "@/actions/waitlist-actions"
import { useToast } from "@/hooks/use-toast"

interface WaitlistFormProps {
  selectedPlan?: string
}

export function WaitlistForm({ selectedPlan = "basic" }: WaitlistFormProps) {
  const { isCoach } = useTheme()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await submitWaitlistForm(formData)
      if (result.success) {
        toast({
          title: "Success!",
          description: "You've been added to our waitlist. We'll be in touch soon!",
        })
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
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className={isCoach ? "text-black" : "text-white"}>
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            required
            className={isCoach ? "bg-white border-gray-300" : "bg-zinc-800 border-zinc-700 text-white"}
          />
        </div>
        <div>
          <Label htmlFor="lastName" className={isCoach ? "text-black" : "text-white"}>
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            required
            className={isCoach ? "bg-white border-gray-300" : "bg-zinc-800 border-zinc-700 text-white"}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className={isCoach ? "text-black" : "text-white"}>
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className={isCoach ? "bg-white border-gray-300" : "bg-zinc-800 border-zinc-700 text-white"}
        />
      </div>

      <div>
        <Label htmlFor="userType" className={isCoach ? "text-black" : "text-white"}>
          I am a...
        </Label>
        <Select name="userType" defaultValue={isCoach ? "trainer" : "client"}>
          <SelectTrigger className={isCoach ? "bg-white border-gray-300" : "bg-zinc-800 border-zinc-700 text-white"}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trainer">Personal Trainer</SelectItem>
            <SelectItem value="client">Fitness Enthusiast</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="plan" className={isCoach ? "text-black" : "text-white"}>
          Interested Plan
        </Label>
        <Select name="plan" defaultValue={selectedPlan}>
          <SelectTrigger className={isCoach ? "bg-white border-gray-300" : "bg-zinc-800 border-zinc-700 text-white"}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="elite">Elite</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="message" className={isCoach ? "text-black" : "text-white"}>
          Tell us about your goals (optional)
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="What are you hoping to achieve with Juice?"
          className={isCoach ? "bg-white border-gray-300" : "bg-zinc-800 border-zinc-700 text-white"}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
        {isSubmitting ? "Joining..." : "Join Waitlist"}
      </Button>
    </form>
  )
}
