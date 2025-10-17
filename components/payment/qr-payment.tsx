"use client"

import { useState, useEffect } from "react"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/components/theme-provider"
import { Copy, Check, Download } from "lucide-react"

interface QRPaymentProps {
  defaultAmount?: string
  recipientName?: string
  recipientIBAN?: string
  reference?: string
  description?: string
  onPaymentComplete?: () => void
  userId?: string // Add user ID prop
}

export function QRPayment({
  defaultAmount = "29.99",
  recipientName = "Juice Fitness GmbH",
  recipientIBAN = "AT123456789012345678",
  reference = "",
  description = "Juice Premium Subscription",
  onPaymentComplete,
  userId = "anonymous", // Default to anonymous if no user ID provided
}: QRPaymentProps) {
  const { isCoach } = useTheme()
  const [amount, setAmount] = useState(defaultAmount)
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentReference, setPaymentReference] = useState("")

  // Generate a unique payment reference when component mounts
  useEffect(() => {
    // Create a unique reference combining user ID and timestamp
    const timestamp = new Date().getTime()
    const uniqueRef = `JUICE-${userId.substring(0, 6)}-${timestamp}`
    setPaymentReference(uniqueRef)
  }, [userId])

  // Generate EPC QR Code content (SEPA Credit Transfer)
  const generateEPCQRContent = () => {
    // Format according to EPC QR Code standard
    // BCD version 001 - Service Tag 'BCD' - Version '001' - Encoding 'UTF-8'
    const bcdHeader = "BCD\n001\n1\nUTF-8\n"
    const sepaTransfer = "SCT\n"
    const bic = "\n" // BIC is optional
    const recipient = `${recipientName}\n`
    const iban = `${recipientIBAN}\n`
    const currency = "EUR"
    const purposeCode = "\n" // Purpose code is optional
    const remittanceInfo = paymentReference ? `${paymentReference}\n` : "\n"
    const beneficiaryInfo = description ? `${description}\n` : "\n"

    return `${bcdHeader}${sepaTransfer}${bic}${recipient}${iban}${currency}${amount}${purposeCode}${remittanceInfo}${beneficiaryInfo}`
  }

  const qrContent = generateEPCQRContent()

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText(recipientIBAN)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    const svg = document.getElementById("payment-qr-code")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      // Download the PNG
      const downloadLink = document.createElement("a")
      downloadLink.download = "juice-payment-qr.png"
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  // Update the handlePaymentComplete function to pass the reference
  const handlePaymentComplete = () => {
    setIsSubmitting(true)

    // In a real app, this would trigger a backend verification with the reference
    if (onPaymentComplete) {
      // Pass the reference ID to the parent component
      onPaymentComplete()
    }
    setIsSubmitting(false)
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${isCoach ? "bg-white" : "bg-zinc-900 border-zinc-800"}`}>
      <CardHeader>
        <CardTitle className={isCoach ? "text-black" : "text-white"}>Scan to Pay</CardTitle>
        <CardDescription className={isCoach ? "text-gray-600" : "text-gray-400"}>
          Scan this QR code with your banking app to make a payment
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg mb-4">
          <QRCode id="payment-qr-code" value={qrContent} size={200} level="M" className="h-auto max-w-full" />
        </div>

        <div className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className={isCoach ? "text-black" : "text-white"}>
              Amount (EUR)
            </Label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={isCoach ? "bg-white" : "bg-zinc-800 border-zinc-700 text-white"}
            />
          </div>

          <div className="space-y-2">
            <Label className={isCoach ? "text-black" : "text-white"}>Recipient</Label>
            <p className={isCoach ? "text-gray-600" : "text-gray-400"}>{recipientName}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className={isCoach ? "text-black" : "text-white"}>IBAN</Label>
              <button onClick={handleCopyIBAN} className="flex items-center text-xs text-juice hover:text-juice/80">
                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className={isCoach ? "text-gray-600" : "text-gray-400"}>{recipientIBAN}</p>
          </div>

          <div className="space-y-2">
            <Label className={isCoach ? "text-black" : "text-white"}>Description</Label>
            <p className={isCoach ? "text-gray-600" : "text-gray-400"}>{description}</p>
          </div>

          <div className="space-y-2">
            <Label className={isCoach ? "text-black" : "text-white"}>Payment Reference</Label>
            <div className="flex justify-between items-center">
              <p className={isCoach ? "text-gray-600" : "text-gray-400"}>{paymentReference}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentReference)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="flex items-center text-xs text-juice hover:text-juice/80"
              >
                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Include this reference in your bank transfer so we can identify your payment.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleDownloadQR} className={isCoach ? "" : "border-zinc-700"}>
          <Download className="mr-2 h-4 w-4" />
          Download QR
        </Button>
        <Button
          className="trainer-gradient-btn"
          onClick={handlePaymentComplete}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              Processing...
            </>
          ) : (
            "I've completed payment"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
