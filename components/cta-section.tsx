"use client"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function CTASection() {
  const { isCoach } = useTheme()

  return (
    <section className={`py-20 ${isCoach ? "bg-orange-50" : "bg-zinc-800"}`}>
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-4xl font-bold mb-6 ${isCoach ? "text-black" : "text-white"}`}>
            {isCoach ? "Ready to transform your training business?" : "Ready to transform your fitness journey?"}
          </h2>
          <p className={`text-xl mb-8 ${isCoach ? "text-gray-700" : "text-gray-300"}`}>
            {isCoach
              ? "Join thousands of successful trainers who have streamlined their business and increased their revenue with Juice."
              : "Join thousands of people who have achieved their fitness goals with the help of certified personal trainers."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
              onClick={() => window.open("https://app.juice.fitness/", "_blank")}
            >
              {isCoach ? "Start Free Trial" : "Get Started Today"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`px-8 py-3 text-lg ${
                isCoach
                  ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                  : "border-zinc-600 text-gray-300 hover:bg-zinc-700"
              }`}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          <p className={`text-sm mt-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
