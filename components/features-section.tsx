"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"
import {
  Users,
  Calendar,
  BarChart3,
  CreditCard,
  MessageSquare,
  Smartphone,
  Dumbbell,
  TrendingUp,
  Share2,
} from "lucide-react"

export function FeaturesSection() {
  const { isCoach } = useTheme()
  const [activeTab, setActiveTab] = useState("overview")

  const coachFeatures = [
    {
      icon: Users,
      title: "Client Management",
      description: "Effortlessly manage all your clients in one place with detailed profiles and progress tracking.",
    },
    {
      icon: Calendar,
      title: "Workout Planning",
      description: "Create and schedule personalized workout plans with our intuitive drag-and-drop builder.",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Track client progress with detailed analytics and visual progress reports.",
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Handle payments, subscriptions, and billing automatically with integrated payment processing.",
    },
    {
      icon: MessageSquare,
      title: "Client Communication",
      description: "Stay connected with built-in messaging and automated check-ins.",
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Manage your business on the go with our fully-featured mobile application.",
    },
  ]

  const clientFeatures = [
    {
      icon: Dumbbell,
      title: "Workout Logging",
      description: "Log your workouts quickly and easily with our streamlined interface.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "See your fitness journey with detailed progress charts and milestone celebrations.",
    },
    {
      icon: Share2,
      title: "Social Sharing",
      description: "Share your achievements and workouts with friends and the community.",
    },
  ]

  const features = isCoach ? coachFeatures : clientFeatures

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isCoach ? "Everything you need to grow your coaching business" : "Simple, powerful fitness tracking"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {isCoach
              ? "From client management to payment processing, Juice provides all the tools you need to run a successful personal training business."
              : "Track your workouts, monitor your progress, and stay motivated with our easy-to-use fitness app."}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-2 hover:border-juice/50 transition-colors">
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-juice mb-2" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                {isCoach ? "Detailed Coach Features" : "Detailed Client Features"}
              </h3>
              <p className="text-muted-foreground mb-8">
                {isCoach
                  ? "Comprehensive tools designed specifically for personal trainers"
                  : "Everything you need for effective fitness tracking"}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {isCoach
                      ? "Get detailed insights into client progress, retention rates, and business metrics."
                      : "Track your personal records, workout frequency, and fitness improvements over time."}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Custom Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {isCoach
                      ? "Create automated workflows for client onboarding, check-ins, and program progressions."
                      : "Set up personalized workout routines and automated progress tracking."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Seamless Integrations</h3>
              <p className="text-muted-foreground mb-8">Connect with your favorite tools and platforms</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Google Sheets", "Stripe", "Zoom", "Calendar", "Slack", "Zapier", "MyFitnessPal", "Strava"].map(
                (integration) => (
                  <Card key={integration} className="text-center p-4">
                    <CardContent className="p-0">
                      <p className="font-medium">{integration}</p>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
