"use client"

import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payment/payment-modal"
import { useTheme } from "@/components/theme-provider"

export function PaymentExample() {
  const { isCoach } = useTheme()

  return (
    <div
      className={`p-6 rounded-lg ${isCoach ? "bg-white border border-gray-200" : "bg-zinc-900 border border-zinc-800"}`}
    >
      <h2 className={`text-xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
        Payment Integration Examples
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className={`text-lg font-semibold mb-2 ${isCoach ? "text-black" : "text-white"}`}>
            Basic Payment Button
          </h3>
          <p className={`mb-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
            Simple payment button with default settings
          </p>
          <PaymentModal />
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-2 ${isCoach ? "text-black" : "text-white"}`}>
            Custom Payment Button
          </h3>
          <p className={`mb-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
            Custom payment button with specific amount and description
          </p>
          <PaymentModal triggerText="Pay €19.99" amount="19.99" description="Juice One-time Payment" />
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-2 ${isCoach ? "text-black" : "text-white"}`}>
            Custom Trigger Element
          </h3>
          <p className={`mb-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
            Using a custom element as the payment trigger
          </p>
          <PaymentModal amount="99.00" description="Juice Annual Subscription">
            <Button variant="outline" className={isCoach ? "" : "border-zinc-700"}>
              Subscribe Annually (€99)
            </Button>
          </PaymentModal>
        </div>
      </div>
    </div>
  )
}
