"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { QRPayment } from "@/components/payment/qr-payment"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { CreditCard, QrCode, Smartphone } from "lucide-react"

export default function PaymentPage() {
  const { isCoach } = useTheme()
  const [paymentMethod, setPaymentMethod] = useState("qr")

  return (
    <main className={`min-h-screen ${isCoach ? "bg-white" : "bg-black"} text-white`}>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isCoach ? "text-black" : "text-white"}`}>
              Complete Your Payment
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mb-8">
              Choose your preferred payment method to complete your subscription
            </p>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section className="py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="qr" value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
              <TabsList className={`grid grid-cols-3 w-full ${isCoach ? "bg-gray-100" : "bg-zinc-800"}`}>
                <TabsTrigger value="qr" className="data-[state=active]:bg-juice data-[state=active]:text-black">
                  <QrCode className="mr-2 h-4 w-4" />
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="card" className="data-[state=active]:bg-juice data-[state=active]:text-black">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credit Card
                </TabsTrigger>
                <TabsTrigger value="mobile" className="data-[state=active]:bg-juice data-[state=active]:text-black">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Mobile Banking
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="qr" className="mt-0">
                  <div className="flex justify-center">
                    <QRPayment
                      defaultAmount="29.99"
                      recipientName="Juice Fitness GmbH"
                      recipientIBAN="AT123456789012345678"
                      description="Juice Premium Subscription"
                    />
                  </div>
                  <div className="mt-8 text-center">
                    <h3 className={`text-xl font-semibold mb-2 ${isCoach ? "text-black" : "text-white"}`}>
                      How to pay with QR code
                    </h3>
                    <ol
                      className={`text-left max-w-md mx-auto ${isCoach ? "text-gray-600" : "text-gray-400"} space-y-2`}
                    >
                      <li>1. Open your banking app on your smartphone</li>
                      <li>2. Find the "Scan QR code" or "Scan to pay" option</li>
                      <li>3. Scan the QR code displayed above</li>
                      <li>4. Verify the payment details in your app</li>
                      <li>5. Confirm the payment</li>
                      <li>6. Click "I've completed payment" when done</li>
                    </ol>
                  </div>
                </TabsContent>

                <TabsContent value="card" className="mt-0">
                  <div className={`p-8 rounded-lg text-center ${isCoach ? "bg-gray-100" : "bg-zinc-800"}`}>
                    <h3 className={`text-xl font-semibold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
                      Credit Card Payment Coming Soon
                    </h3>
                    <p className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                      We're currently integrating credit card payments. Please use QR code or mobile banking payment for
                      now.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="mobile" className="mt-0">
                  <div className={`p-8 rounded-lg ${isCoach ? "bg-gray-100" : "bg-zinc-800"}`}>
                    <h3 className={`text-xl font-semibold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
                      Mobile Banking Transfer
                    </h3>
                    <p className={`mb-6 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                      Please transfer the payment to the following bank account:
                    </p>

                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="flex justify-between">
                        <span className={`font-medium ${isCoach ? "text-black" : "text-white"}`}>Recipient:</span>
                        <span className={isCoach ? "text-gray-600" : "text-gray-400"}>Juice Fitness GmbH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`font-medium ${isCoach ? "text-black" : "text-white"}`}>IBAN:</span>
                        <span className={isCoach ? "text-gray-600" : "text-gray-400"}>AT123456789012345678</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`font-medium ${isCoach ? "text-black" : "text-white"}`}>BIC:</span>
                        <span className={isCoach ? "text-gray-600" : "text-gray-400"}>GIBAATWWXXX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`font-medium ${isCoach ? "text-black" : "text-white"}`}>Amount:</span>
                        <span className={isCoach ? "text-gray-600" : "text-gray-400"}>€29.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`font-medium ${isCoach ? "text-black" : "text-white"}`}>Reference:</span>
                        <span className={isCoach ? "text-gray-600" : "text-gray-400"}>JUICE-PREMIUM</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
