import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dumbbell, Users, Target, TrendingUp, Star, Play, CheckCircle, ArrowRight, Menu } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">Juice</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
              Blog
            </Link>
            <Link href="/trainers" className="text-gray-600 hover:text-gray-900 transition-colors">
              Find Trainers
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Button className="bg-orange-500 hover:bg-orange-600">Get Started</Button>
          </div>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                  🚀 New: AI-Powered Workout Plans
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Your
                  <span className="text-orange-500 block">Fitness Journey</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with certified personal trainers, track your progress, and achieve your fitness goals with our
                  comprehensive platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Certified Trainers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    Rating
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-200 to-orange-300 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Dumbbell className="w-32 h-32 text-orange-500/30" />
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                  <div className="text-sm font-semibold">Today's Progress</div>
                  <div className="text-xs text-gray-600">85% Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Why Choose Juice?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed in your fitness journey, all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
                <CardTitle className="text-xl">Expert Trainers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Connect with certified personal trainers who understand your goals and create personalized workout
                  plans just for you.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
                <CardTitle className="text-xl">Smart Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Advanced analytics and progress tracking help you stay motivated and see real results from your
                  workouts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle className="text-xl">Proven Results</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Join thousands of users who have achieved their fitness goals with our evidence-based approach to
                  training.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
              <p className="text-xl text-gray-600">Expert insights and tips to help you on your fitness journey</p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="hidden md:flex bg-transparent">
                View All Posts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Dumbbell className="w-12 h-12 text-orange-500/30" />
                </div>
                <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600">Training</Badge>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-orange-600 transition-colors">
                  The Science Behind HIIT Training
                </CardTitle>
                <CardDescription>
                  Discover why high-intensity interval training is so effective for burning fat and building endurance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Dr. Sarah Johnson</span>
                  <span className="mx-2">•</span>
                  <span>5 min read</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-12 h-12 text-blue-500/30" />
                </div>
                <Badge className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600">Nutrition</Badge>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-blue-600 transition-colors">
                  Nutrition Timing for Peak Performance
                </CardTitle>
                <CardDescription>
                  Learn the optimal timing for meals and supplements to fuel your workouts and recovery.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Mike Chen</span>
                  <span className="mx-2">•</span>
                  <span>7 min read</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-12 h-12 text-green-500/30" />
                </div>
                <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">Mental Health</Badge>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-green-600 transition-colors">
                  Building Mental Resilience Through Fitness
                </CardTitle>
                <CardDescription>
                  How regular exercise can strengthen your mind and improve your ability to handle stress.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Emma Rodriguez</span>
                  <span className="mx-2">•</span>
                  <span>6 min read</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/blog">
              <Button variant="outline">
                View All Posts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-white">Ready to Start Your Fitness Journey?</h2>
            <p className="text-xl text-orange-100">
              Join thousands of users who have transformed their lives with Juice. Start your free trial today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Input placeholder="Enter your email address" className="max-w-md bg-white" />
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Get Started Free
              </Button>
            </div>

            <p className="text-sm text-orange-200">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Dumbbell className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold">Juice</span>
              </div>
              <p className="text-gray-400">Transform your fitness journey with expert trainers and smart tracking.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <Link href="/features" className="block hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="block hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="/trainers" className="block hover:text-white transition-colors">
                  Find Trainers
                </Link>
                <Link href="/blog" className="block hover:text-white transition-colors">
                  Blog
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <Link href="/about" className="block hover:text-white transition-colors">
                  About
                </Link>
                <Link href="/careers" className="block hover:text-white transition-colors">
                  Careers
                </Link>
                <Link href="/contact" className="block hover:text-white transition-colors">
                  Contact
                </Link>
                <Link href="/press" className="block hover:text-white transition-colors">
                  Press
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <Link href="/help" className="block hover:text-white transition-colors">
                  Help Center
                </Link>
                <Link href="/privacy" className="block hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/status" className="block hover:text-white transition-colors">
                  Status
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Juice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
