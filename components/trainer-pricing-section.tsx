"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentModal } from "./payment/payment-modal"
import { useRouter } from "next/navigation"

interface TrainerPricingSectionProps {
  showHeader?: boolean
  onPaymentComplete?: (plan: string) => void
}

export function TrainerPricingSection({ showHeader = true, onPaymentComplete }: TrainerPricingSectionProps) {
  const router = useRouter()

  const handlePaymentComplete = (plan: string) => {
    if (onPaymentComplete) {
      onPaymentComplete(plan)
    } else {
      // Default behavior: redirect to marketplace after successful payment
      console.log(`Payment completed for ${plan} plan`)
      setTimeout(() => {
        router.push("/marketplace")
      }, 3000)
    }
  }

  return (
    <section className="pb-0 pt-0 bg-white scroll-mt-24">
      <div className="container px-4 md:px-6 mb-16">
        {showHeader && (
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-black font-medium mb-3">PRICING</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Pricing for Trainers
            </h2>
            <p className="text-zinc-400 max-w-2xl">
              You can use our platform for free with 3 clients. No hidden fees, no limitations. Go expand your business.
            </p>
          </div>
        )}

        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-white border-gray-200 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-black">Free</CardTitle>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold text-black">
                    €0
                    <span className="ml-1 text-lg font-medium text-gray-500">
                      /month
                    </span>
                  </div>
                  <CardDescription className="mt-4 text-gray-600">
                    Perfect for getting started
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3 text-black">
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Up to 3 clients</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Basic workout tracking</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Client progress monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Email support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Mobile app access</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    className="w-full trainer-gradient-btn"
                    onClick={() => (window.location.href = "https://app.juice.fitness/")}
                  >
                    Start now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="bg-white border-juice juice-glow h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-black">Pro</CardTitle>
                    <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-black rounded-full">
                      COMING SOON
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold text-black">
                    €29
                    <span className="ml-1 text-lg font-medium text-gray-500">
                      /month
                    </span>
                  </div>
                  <CardDescription className="mt-4 text-gray-600">
                    For growing trainers
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3 text-black">
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>3-10 Clients</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Advanced workout builder</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Google Sheets integration</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Progress analytics</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <PaymentModal
                    amount="29.00"
                    description="Juice Pro Monthly Subscription"
                    planName="Pro"
                    onPaymentComplete={() => handlePaymentComplete("pro")}
                  >
                    <Button className="w-full trainer-gradient-btn" disabled>
                      Pre-order
                    </Button>
                  </PaymentModal>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Elite Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="bg-white border-juice juice-glow h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-black">Elite</CardTitle>
                    <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-black rounded-full">
                      COMING SOON
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold text-black">
                    €45
                    <span className="ml-1 text-lg font-medium text-gray-500">
                      /month
                    </span>
                  </div>
                  <CardDescription className="mt-4 text-gray-600">
                    For established trainers
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3 text-black">
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>11-20 Clients</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Vacation mode</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-juice" />
                      <span>Advanced analytics</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <PaymentModal
                    amount="45.00"
                    description="Juice Elite Monthly Subscription"
                    planName="Elite"
                    onPaymentComplete={() => handlePaymentComplete("elite")}
                  >
                    <Button className="w-full trainer-gradient-btn" disabled>
                      Pre-order
                    </Button>
                  </PaymentModal>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

