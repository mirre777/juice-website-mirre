import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Users, Zap, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function PersonalTrainerWebsite() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-gray-600">No coding required</span>
        </div>

        {/* Hero Section */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Get Your Professional Trainer Website in 10 minutes</h1>
          <p className="text-gray-600 text-lg mb-8">
            Launch a high-converting one-page site that captures leads and books sessions for you. Just complete a short
            form and your personal-training brand goes live – with SEO and client-ready.
          </p>
          <Button className="bg-lime-400 hover:bg-lime-500 text-black font-medium px-6 py-3 rounded-lg">
            Create for free →
          </Button>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-6 mb-16">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm">Increase visibility</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Super fast</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span className="text-sm">Professional design</span>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/laner.png"
                    alt="Laner"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-gray-900 mb-2">"Super smooth, I had my website in 3 minutes."</p>
                  <p className="text-sm text-gray-500">- Laner</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/rici.png"
                    alt="Rici"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-gray-900 mb-2">"I never knew a website could be made this fast and good"</p>
                  <p className="text-sm text-gray-500">- Rici</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-black" />
            </div>
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-gray-600">Trainers Trust Us</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <div className="text-3xl font-bold mb-2">95%</div>
            <div className="text-gray-600">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-black" />
            </div>
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-gray-600">Website Availability</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Stand out. Book clients.</h2>
          <p className="text-gray-600 mb-8">Fill out this form to get your own page. No coding required.</p>
        </div>

        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-8 text-center">Create Your Trainer Profile</h3>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input placeholder="john@example.com" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Specialty *</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="strength">Strength Training</SelectItem>
                      <SelectItem value="cardio">Cardio Training</SelectItem>
                      <SelectItem value="nutrition">Nutrition Coaching</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <Input placeholder="Vienna" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">District *</label>
                  <Input placeholder="Innere Stadt" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Professional Bio</label>
                <p className="text-sm text-gray-500 mb-2">
                  Tell potential clients about your background, training philosophy, and what makes you unique.
                  (Optional)
                </p>
                <Textarea
                  placeholder="I'm a certified personal trainer with experience helping clients achieve their fitness goals. My approach focuses on sustainable lifestyle changes and personalized workout plans..."
                  className="min-h-[120px]"
                />
                <div className="text-right text-sm text-gray-500 mt-1">0/500 characters</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Certifications & Qualifications</label>
                <p className="text-sm text-gray-500 mb-2">
                  List your certifications, degrees, or other qualifications (comma separated)
                </p>
                <Input placeholder="NASM-CPT, ACE Personal Trainer, Nutrition Specialist" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Services Offered</label>
                <p className="text-sm text-gray-500 mb-4">
                  Select the services you provide to your clients. (Optional)
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="personal-training" />
                      <label htmlFor="personal-training" className="text-sm">
                        Personal Training
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="online-coaching" />
                      <label htmlFor="online-coaching" className="text-sm">
                        Online Coaching
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sports-training" />
                      <label htmlFor="sports-training" className="text-sm">
                        Sports-Specific Training
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rehabilitation" />
                      <label htmlFor="rehabilitation" className="text-sm">
                        Rehabilitation
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="weight-loss" />
                      <label htmlFor="weight-loss" className="text-sm">
                        Weight Loss Programs
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="group-fitness" />
                      <label htmlFor="group-fitness" className="text-sm">
                        Group Fitness
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="nutrition-coaching" />
                      <label htmlFor="nutrition-coaching" className="text-sm">
                        Nutrition Coaching
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="flexibility" />
                      <label htmlFor="flexibility" className="text-sm">
                        Flexibility & Mobility
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="strength-training" />
                      <label htmlFor="strength-training" className="text-sm">
                        Strength Training
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cardio-training" />
                      <label htmlFor="cardio-training" className="text-sm">
                        Cardio Training
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-lime-400 hover:bg-lime-500 text-black font-medium py-3 rounded-lg">
                Create My Website →
              </Button>

              <p className="text-center text-sm text-gray-500">
                Your website will be generated <strong>instantly</strong>. You can edit and activate it for{" "}
                <Badge variant="secondary" className="bg-lime-400 text-black">
                  €10
                </Badge>
                . No one's forcing you.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
