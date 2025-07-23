import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, ArrowRight, TrendingUp, Heart, Dumbbell } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog - Juice Fitness",
  description: "Latest insights, tips, and trends in fitness and personal training",
}

const blogPosts = [
  {
    id: 1,
    title: "The Science Behind High-Intensity Interval Training",
    excerpt:
      "Discover why HIIT workouts are so effective for burning fat and building endurance, backed by the latest research.",
    author: "Dr. Sarah Johnson",
    date: "2024-01-15",
    category: "Training",
    readTime: "5 min read",
    image: "/images/hiit-training.jpg",
    featured: true,
    tags: ["HIIT", "Science", "Fat Loss"],
  },
  {
    id: 2,
    title: "Nutrition Timing: When to Eat for Maximum Performance",
    excerpt: "Learn the optimal timing for meals and supplements to fuel your workouts and recovery.",
    author: "Mike Chen",
    date: "2024-01-12",
    category: "Nutrition",
    readTime: "7 min read",
    image: "/images/nutrition-timing.jpg",
    featured: false,
    tags: ["Nutrition", "Performance", "Recovery"],
  },
  {
    id: 3,
    title: "Building Mental Resilience Through Fitness",
    excerpt: "How regular exercise can strengthen your mind and improve your ability to handle stress and challenges.",
    author: "Emma Rodriguez",
    date: "2024-01-10",
    category: "Mental Health",
    readTime: "6 min read",
    image: "/images/mental-resilience.jpg",
    featured: false,
    tags: ["Mental Health", "Stress", "Mindset"],
  },
  {
    id: 4,
    title: "The Future of Personal Training: Technology Meets Human Touch",
    excerpt:
      "Exploring how AI and wearable technology are revolutionizing personal training while maintaining the human connection.",
    author: "Alex Thompson",
    date: "2024-01-08",
    category: "Technology",
    readTime: "8 min read",
    image: "/images/future-training.jpg",
    featured: true,
    tags: ["Technology", "AI", "Future"],
  },
  {
    id: 5,
    title: "Recovery Strategies for Busy Professionals",
    excerpt: "Practical recovery techniques that fit into a hectic schedule without compromising results.",
    author: "Lisa Park",
    date: "2024-01-05",
    category: "Recovery",
    readTime: "4 min read",
    image: "/images/recovery-strategies.jpg",
    featured: false,
    tags: ["Recovery", "Professionals", "Time Management"],
  },
  {
    id: 6,
    title: "Strength Training Myths Debunked",
    excerpt: "Separating fact from fiction in the world of strength training and muscle building.",
    author: "David Wilson",
    date: "2024-01-03",
    category: "Training",
    readTime: "6 min read",
    image: "/images/strength-myths.jpg",
    featured: false,
    tags: ["Strength Training", "Myths", "Education"],
  },
]

const categories = [
  { name: "All", count: 6, active: true },
  { name: "Training", count: 2, active: false },
  { name: "Nutrition", count: 1, active: false },
  { name: "Mental Health", count: 1, active: false },
  { name: "Technology", count: 1, active: false },
  { name: "Recovery", count: 1, active: false },
]

const popularTags = [
  "HIIT",
  "Nutrition",
  "Mental Health",
  "Strength Training",
  "Recovery",
  "Fat Loss",
  "Performance",
  "Technology",
  "Mindset",
  "Science",
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const recentPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Juice Fitness Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert insights, training tips, and the latest trends in fitness and wellness
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search articles..." className="pl-10 pr-4 py-2 w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Posts */}
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600">Featured</Badge>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Dumbbell className="w-16 h-16 text-orange-500/30" />
                      </div>
                    </div>

                    <CardHeader>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <span>{post.readTime}</span>
                      </div>
                      <CardTitle className="group-hover:text-orange-600 transition-colors">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                          <Calendar className="w-4 h-4 ml-2" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="group-hover:text-orange-600">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Posts */}
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">Recent Articles</h2>
              </div>

              <div className="space-y-6">
                {recentPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow group">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="aspect-video md:aspect-square bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden rounded-lg">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Dumbbell className="w-12 h-12 text-blue-500/30" />
                        </div>
                      </div>

                      <div className="md:col-span-3 p-6">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          <span>{post.readTime}</span>
                        </div>

                        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                            <Calendar className="w-4 h-4 ml-2" />
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="group-hover:text-blue-600">
                            Read More <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={category.active ? "default" : "ghost"}
                    className="w-full justify-between"
                    size="sm"
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg text-orange-900">Stay Updated</CardTitle>
                <CardDescription className="text-orange-700">
                  Get the latest fitness tips and articles delivered to your inbox
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Enter your email" className="bg-white" />
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Subscribe</Button>
                <p className="text-xs text-orange-600 text-center">No spam, unsubscribe anytime</p>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {blogPosts.slice(0, 3).map((post, index) => (
                  <div key={post.id} className="flex space-x-3 group cursor-pointer">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500 mt-2" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium group-hover:text-orange-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.date).toLocaleDateString()} • {post.readTime}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
