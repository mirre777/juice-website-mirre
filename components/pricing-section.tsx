"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap } from "lucide-react"

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
  buttonVariant: "default" | "outline"
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for getting started with fitness tracking",
    features: ["Basic workout tracking", "Progress photos", "Community access", "Mobile app access"],
    buttonText: "Get Started",
    buttonVariant: "outline",
  },
  {
    name: "Pro",
    price: "€29",
    period: "/month",
    description: "Everything you need to scale your coaching business",
    features: [
      "Unlimited clients",
      "Custom workout builder",
      "Nutrition tracking",
      "Progress analytics",
      "Client messaging",
      "Custom branding",
    ],
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Advanced features for large coaching businesses",
    features: [
      "Everything in Pro",
      "White-label solution",
      "API access",
      "Priority support",
      "Custom integrations",
      "Advanced analytics",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
  },
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 mb-8">Choose the perfect plan for your fitness coaching business</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? "text-black font-medium" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? "bg-[#D2FF28]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? "text-black font-medium" : "text-gray-500"}`}>Annual</span>
            {isAnnual && (
              <Badge variant="secondary" className="bg-[#D2FF28]/10 text-[#D2FF28] border-[#D2FF28]/20">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative ${tier.popular ? "border-[#D2FF28] shadow-lg scale-105" : "border-gray-200"}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#D2FF28] text-black hover:bg-[#c5f01f]">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-black mb-2">{tier.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-black">{tier.price}</span>
                  {tier.period && (
                    <span className="text-gray-600 ml-1">
                      {isAnnual && tier.price !== "Free" && tier.price !== "Custom" ? "/year" : tier.period}
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{tier.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#D2FF28] flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tier.buttonVariant === "default"
                      ? "bg-[#D2FF28] text-black hover:bg-[#c5f01f]"
                      : "bg-white text-black border border-gray-300 hover:bg-gray-50"
                  }`}
                  variant={tier.buttonVariant}
                >
                  {tier.popular && <Zap className="w-4 h-4 mr-2" />}
                  {tier.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-black mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-black mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-black mb-2">Is there a free trial?</h4>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial for the Pro plan with no credit card required.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-black mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-black mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
