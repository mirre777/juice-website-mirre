"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Star } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function HeroSection() {
  const { theme } = useTheme()

  return (
    <section className="container space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="mx-auto flex max-w-[64rem] flex-col items-center space-y-4 text-center">
        <Badge variant="outline" className="rounded-2xl px-4 py-1.5">
          <span className="mr-2 text-sm">🚀</span>
          <span className="text-sm">New: AI-Powered Workout Plans</span>
        </Badge>

        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Transform Your{" "}
          <span className={theme === "coach" ? "text-orange-500" : "text-blue-600"}>Fitness Journey</span>
        </h1>

        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Connect with certified personal trainers, track your progress, and achieve your fitness goals with our
          comprehensive platform designed for both clients and coaches.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" className="gap-2">
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="gap-2 bg-transparent">
            <Play className="h-4 w-4" />
            Watch Demo
          </Button>
        </div>

        <div className="flex items-center space-x-8 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-muted-foreground">Certified Trainers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              4.9
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
}
