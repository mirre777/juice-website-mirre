"use client"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { WaitlistForm } from "./waitlist-form"
import { PaymentModal } from "./payment/payment-modal"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { usePathname } from "next/navigation"

export function PricingSectionWithPayment() {
  const { isCoach, setIsCoach } = useTheme()
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const waitlistRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [stripePreloaded, setStripePreloaded] = useState(false)
  const pathname = usePathname()
  const isPersonalTrainerAppPage = pathname === "/personal-trainer-app"

  useEffect(() => {
    // Preload Stripe.js when the pricing section is visible
    const preloadStripe = async () => {
      if (!stripePreloaded) {
        try {
          const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          if (publishableKey && publishableKey.trim() !== "") {
            await loadStripe(publishableKey)
            console.log("Stripe.js preloaded successfully")
            setStripePreloaded(true)
          } else {
            console.warn("Stripe publishable key not found or empty")
          }
        } catch (error) {
          console.error("Failed to preload Stripe.js:", error)
        }
      }
    }

    preloadStripe()
  }, [stripePreloaded])

  const handlePlanClick = (plan: string) => {
    setSelectedPlan(plan)
    setShowWaitlist(true)

    // If we're on the trainer tab, make sure we set isCoach to true
    if (plan === "coach") {
      setIsCoach(true)
    }

    // Wait for state to update and DOM to render before scrolling
    setTimeout(() => {
      if (waitlistRef.current) {
        waitlistRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  const handlePaymentComplete = (plan: string) => {
    // In a real app, this would update the user's subscription in the database
    console.log(`Payment completed for ${plan} plan`)

    // Redirect to dashboard or account page after successful payment
    setTimeout(() => {
      router.push("/account/dashboard")
    }, 3000)
  }

  useEffect(() => {
    if (showWaitlist && waitlistRef.current) {
      waitlistRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [showWaitlist])

  // Add the maintain-scroll class to the main container
  return (
    <section id="pricing" className={`pt-8 pb-0 ${isCoach ? "bg-white" : "bg-black"} scroll-mt-16 maintain-scroll`}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <span className={`${isCoach ? "text-black" : "text-white"} font-medium mb-3`}>PRICING</span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            {isCoach ? "Pricing for Trainers" : "Simple, transparent pricing"}
          </h2>
          {isCoach && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            ></motion.div>
          )}
          <p className="text-zinc-400 max-w-2xl">
            {
              "You can use our platform for free with 3 clients. No hidden fees, no limitations - other than the 3 clients. The world is yours."
            }
          </p>
        </div>

        {!isPersonalTrainerAppPage ? (
          <Tabs
            defaultValue="client"
            value={isCoach ? "trainer" : "client"}
            onValueChange={(value) => {
              if (value === "trainer") {
                router.push("/#pricing")
              } else {
                router.push("/clients#pricing")
              }
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-8">
              <TabsList className={`grid grid-cols-2 ${isCoach ? "bg-gray-100" : "bg-zinc-800"}`}>
                <TabsTrigger
                  value="client"
                  className="data-[state=active]:bg-juice data-[state=active]:text-black"
                  id="Tab_Client_Pricing"
                >
                  For Clients
                </TabsTrigger>
                <TabsTrigger
                  value="trainer"
                  className="data-[state=active]:bg-juice data-[state=active]:text-black"
                  id="Tab_Trainer_Pricing"
                >
                  For Trainers
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="client" className="mt-0 min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card
                    className={`${isCoach ? "bg-white border-gray-200" : "bg-zinc-900 border-zinc-800"} h-full flex flex-col`}
                  >
                    <CardHeader>
                      <CardTitle className={`${isCoach ? "text-black" : "text-white"}`}>Basic</CardTitle>
                      <div
                        className={`mt-4 flex items-baseline text-5xl font-extrabold ${isCoach ? "text-black" : "text-white"}`}
                      >
                        Free
                        <span className={`ml-1 text-xl font-medium ${isCoach ? "text-gray-500" : "text-gray-400"}`}>
                          /month
                        </span>
                      </div>
                      <CardDescription className={`mt-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                        Perfect for getting started with basic tracking
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className={`space-y-3 ${isCoach ? "text-black" : "text-white"}`}>
                        <li className="flex items-center">
                          <Check className="mr-2 h-5 w-5 text-juice" />
                          <span>Basic workout tracking</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="mr-2 h-5 w-5 text-juice" />
                          <span>Progress visualization</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="mr-2 h-5 w-5 text-juice" />
                          <span>Exercise library</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button
                        className="w-full max-w-xs mx-auto sm:max-w-none bg-juice text-black hover:bg-juice/90"
                        id="pricing_basic_client"
                        onClick={() => router.push("/account/signup?plan=basic")}
                      >
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Card
                    className={`${isCoach ? "bg-white" : "bg-zinc-900"} border-juice juice-glow h-full flex flex-col`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className={`${isCoach ? "text-black" : "text-white"}`}>Premium</CardTitle>
                        <span className="px-3 py-1 text-xs font-semibold bg-juice text-black rounded-full">
                          POPULAR
                        </span>
                      </div>
                      <div
                        className={`mt-4 flex items-baseline text-5xl font-extrabold ${isCoach ? "text-black" : "text-white"}`}
                      >
                        €5
                        <span className={`ml-1 text-xl font-medium ${isCoach ? "text-gray-500" : "text-gray-400"}`}>
                          /month
                        </span>
                      </div>
                      <CardDescription className={`mt-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                        Full access to all features and trainer connectivity
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className={`space-y-3 ${isCoach ? "text-black" : "text-white"}`}>
                        <li className="flex items-center">
                          <Check className="mr-2 h-5 w-5 text-juice" />
                          <span>Everything in Basic</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="mr-2 h-5 w-5 text-juice" />
                          <span>Connect with personal trainers</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="mr-2 h-5 w-5 text-juice" />
                          <span>Custom exercises</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="mr-2 h-5 w-5 text-juice" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="mr-2 h-5 w-5 text-juice" />
                          <span>Priority support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <PaymentModal
                        amount="5.00"
                        description="Juice Premium Monthly Subscription"
                        planName="Premium"
                        onPaymentComplete={() => handlePaymentComplete("premium")}
                      >
                        <Button
                          className="w-full max-w-xs mx-auto sm:max-w-none bg-juice text-black hover:bg-juice/90"
                          id="pricing_premium_client"
                        >
                          Get Premium
                        </Button>
                      </PaymentModal>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="trainer" className="mt-0 min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Free Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card
                    className={`${isCoach ? "bg-white border-gray-200" : "bg-zinc-900 border-zinc-800"} h-full flex flex-col`}
                  >
                    <CardHeader>
                      <CardTitle className={`${isCoach ? "text-black" : "text-white"}`}>Free</CardTitle>
                      <div
                        className={`mt-4 flex items-baseline text-4xl font-extrabold ${isCoach ? "text-black" : "text-white"}`}
                      >
                        €0
                        <span className={`ml-1 text-lg font-medium ${isCoach ? "text-gray-500" : "text-gray-400"}`}>
                          /month
                        </span>
                      </div>
                      <CardDescription className={`mt-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                        Perfect for getting started
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className={`space-y-3 ${isCoach ? "text-black" : "text-white"}`}>
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
                        className="w-full bg-juice text-black hover:bg-juice/90"
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
                  <Card
                    className={`${isCoach ? "bg-white" : "bg-zinc-900"} border-juice juice-glow h-full flex flex-col`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className={`${isCoach ? "text-black" : "text-white"}`}>Pro</CardTitle>
                        <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-black rounded-full">
                          COMING SOON
                        </span>
                      </div>
                      <div
                        className={`mt-4 flex items-baseline text-4xl font-extrabold ${isCoach ? "text-black" : "text-white"}`}
                      >
                        €29
                        <span className={`ml-1 text-lg font-medium ${isCoach ? "text-gray-500" : "text-gray-400"}`}>
                          /month
                        </span>
                      </div>
                      <CardDescription className={`mt-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                        For growing trainers
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className={`space-y-3 ${isCoach ? "text-black" : "text-white"}`}>
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
                        <Button className="w-full bg-juice text-black hover:bg-juice/90" disabled>
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
                  <Card
                    className={`${isCoach ? "bg-white border-gray-200" : "bg-zinc-900 border-zinc-800"} h-full flex flex-col`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className={`${isCoach ? "text-black" : "text-white"}`}>Elite</CardTitle>
                        <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-black rounded-full">
                          COMING SOON
                        </span>
                      </div>
                      <div
                        className={`mt-4 flex items-baseline text-4xl font-extrabold ${isCoach ? "text-black" : "text-white"}`}
                      >
                        €45
                        <span className={`ml-1 text-lg font-medium ${isCoach ? "text-gray-500" : "text-gray-400"}`}>
                          /month
                        </span>
                      </div>
                      <CardDescription className={`mt-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                        For established trainers
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className={`space-y-3 ${isCoach ? "text-black" : "text-white"}`}>
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
                        <Button className="w-full bg-juice text-black hover:bg-juice/90" disabled>
                          Pre-order
                        </Button>
                      </PaymentModal>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Free Plan */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Card
                  className={`${isCoach ? "bg-white border-gray-200" : "bg-zinc-900 border-zinc-800"} h-full flex flex-col`}
                >
                  <CardHeader>
                    <CardTitle className={`${isCoach ? "text-black" : "text-white"}`}>Free</CardTitle>
                    <div
                      className={`mt-4 flex items-baseline text-4xl font-extrabold ${isCoach ? "text-black" : "text-white"}`}
                    >
                      €0
                      <span className={`ml-1 text-lg font-medium ${isCoach ? "text-gray-500" : "text-gray-400"}`}>
                        /month
                      </span>
                    </div>
                    <CardDescription className={`mt-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                      Perfect for getting started
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className={`space-y-3 ${isCoach ? "text-black" : "text-white"}`}>
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
                      className="w-full bg-juice text-black hover:bg-juice/90"
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
                <Card
                  className={`${isCoach ? "bg-white" : "bg-zinc-900"} border-juice juice-glow h-full flex flex-col`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className={`${isCoach ? "text-black" : "text-white"}`}>Pro</CardTitle>
                      <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-black rounded-full">
                        COMING SOON
                      </span>
                    </div>
                    <div
                      className={`mt-4 flex items-baseline text-4xl font-extrabold ${isCoach ? "text-black" : "text-white"}`}
                    >
                      €29
                      <span className={`ml-1 text-lg font-medium ${isCoach ? "text-gray-500" : "text-gray-400"}`}>
                        /month
                      </span>
                    </div>
                    <CardDescription className={`mt-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                      For growing trainers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className={`space-y-3 ${isCoach ? "text-black" : "text-white"}`}>
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
                      <Button className="w-full bg-juice text-black hover:bg-juice/90" disabled>
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
                <Card
                  className={`${isCoach ? "bg-white border-gray-200" : "bg-zinc-900 border-zinc-800"} h-full flex flex-col`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className={`${isCoach ? "text-black" : "text-white"}`}>Elite</CardTitle>
                      <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-black rounded-full">
                        COMING SOON
                      </span>
                    </div>
                    <div
                      className={`mt-4 flex items-baseline text-4xl font-extrabold ${isCoach ? "text-black" : "text-white"}`}
                    >
                      €45
                      <span className={`ml-1 text-lg font-medium ${isCoach ? "text-gray-500" : "text-gray-400"}`}>
                        /month
                      </span>
                    </div>
                    <CardDescription className={`mt-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                      For established trainers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className={`space-y-3 ${isCoach ? "text-black" : "text-white"}`}>
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
                      <Button className="w-full bg-juice text-black hover:bg-juice/90" disabled>
                        Pre-order
                      </Button>
                    </PaymentModal>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        )}

        {/* Waitlist Section */}
        {showWaitlist && (
          <motion.div
            ref={waitlistRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
            className="mt-12 max-w-md mx-auto"
          >
            <Card className={`${isCoach ? "bg-white" : "bg-zinc-900"} border-juice overflow-hidden`}>
              <CardHeader className={`${isCoach ? "bg-gray-100" : "bg-zinc-800"} py-3 px-4`}>
                <div className="text-center">
                  <CardTitle className={`text-xl ${isCoach ? "text-black" : "text-white"}`}>
                    Get early access. Join the waitlist.
                  </CardTitle>
                  <CardDescription className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                    Join the waitlist.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <WaitlistForm selectedPlan={selectedPlan} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  )
}
