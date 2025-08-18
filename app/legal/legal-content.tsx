"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LegalContentProps {
  initialTab: string
}

function TermsContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Terms of Service</h2>
      <p className="text-zinc-300">Last updated: June 1, 2023</p>

      <div className="space-y-6 text-zinc-300">
        <section>
          <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms,
            you may not access or use the Service.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">2. Changes to Terms</h3>
          <p>
            We may modify these Terms at any time. If we make changes, we will provide notice by updating the date at
            the top of these Terms and by maintaining a current version of the Terms at [URL]. Your continued use of the
            Service after any such change constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">3. Privacy Policy</h3>
          <p>
            Our Privacy Policy describes how we handle the information you provide to us when you use the Service. You
            understand that by using the Service, you consent to the collection and use of this information as set forth
            in the Privacy Policy.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">4. Account Registration</h3>
          <p>
            To access certain features of the Service, you may be required to register for an account. You agree to
            provide accurate, current, and complete information during the registration process and to update such
            information to keep it accurate, current, and complete.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">5. User Content</h3>
          <p>
            The Service may allow you to store or share content such as workout data, photos, comments, and other
            materials. You retain ownership of any intellectual property rights that you hold in that content.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">6. Prohibited Conduct</h3>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Copying, distributing, or disclosing any part of the Service</li>
            <li>Using any automated system to access the Service</li>
            <li>Attempting to interfere with or compromise the system integrity or security</li>
            <li>Impersonating another person or entity</li>
            <li>Collecting or harvesting any personally identifiable information from the Service</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">7. Termination</h3>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for
            any reason whatsoever, including without limitation if you breach these Terms.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">8. Disclaimer</h3>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY
            KIND, WHETHER EXPRESS OR IMPLIED.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">9. Limitation of Liability</h3>
          <p>
            IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES,
            INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">10. Governing Law</h3>
          <p>
            These Terms shall be governed by the laws of Austria, without respect to its conflict of laws principles.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">11. Contact Information</h3>
          <p>If you have any questions about these Terms, please contact us at crew@juice.fitness.</p>
        </section>
      </div>
    </div>
  )
}

function PrivacyContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Privacy Policy for Juice Fitness App</h2>
      <p className="text-zinc-300">Effective Date: [Insert Date]</p>

      <div className="space-y-6 text-zinc-300">
        <p>
          Thank you for using Juice Fitness App ("we," "our," or "us"). Your privacy is important to us. This Privacy
          Policy explains how we collect, use, and protect your personal information in compliance with the General Data
          Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA/CPRA), and other applicable privacy
          laws.
        </p>

        {/* ... existing privacy policy content ... */}
        <section>
          <h3 className="text-xl font-semibold mb-3">1. Who We Are</h3>
          <p>
            Juice Fitness App is operated by Folger Eduardo Fonseca Velasco, who is also the designated data protection
            officer. He is located at Karl-Marx-Allee 53, 10243 Berlin, Germany. You can contact us at
            crew@juice.fitness.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">2. Data We Collect</h3>
          <p>We may collect the following personal data:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Name</li>
            <li>Email address</li>
            <li>IP address</li>
            <li>Device identifiers (e.g., IDFA, Android Advertising ID)</li>
            <li>Photos, videos, or files uploaded to the app</li>
            <li>Payment information</li>
            <li>Health and biometric data (e.g., fitness activity, workout stats)</li>
          </ul>
        </section>

        {/* ... rest of existing privacy content ... */}
        <section>
          <h3 className="text-xl font-semibold mb-3">13. Contact Us</h3>
          <p>
            For questions or concerns about this policy, contact us at:
            <br />
            crew@juice.fitness
          </p>
        </section>
      </div>
    </div>
  )
}

function CookieContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cookie Policy</h2>
      <p className="text-zinc-300">Last updated: May 19, 2025</p>

      <div className="space-y-6 text-zinc-300">
        <section>
          <h3 className="text-xl font-semibold mb-3">1. What Are Cookies</h3>
          <p>
            As is common practice with almost all professional websites, this site uses cookies, which are tiny files
            that are downloaded to your computer, to improve your experience. This page describes what information they
            gather, how we use it and why we sometimes need to store these cookies.
          </p>
        </section>

        {/* ... rest of existing cookie content ... */}
        <section>
          <h3 className="text-xl font-semibold mb-3">5. More Information</h3>
          <p>If you are still looking for more information, you can contact us at crew@juice.fitness.</p>
        </section>
      </div>
    </div>
  )
}

function GdprContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">GDPR Compliance</h2>
      <p className="text-zinc-300">Last updated: May 19, 2025</p>

      <div className="space-y-6 text-zinc-300">
        <section>
          <h3 className="text-xl font-semibold mb-3">1. Introduction to GDPR</h3>
          <p>
            The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy for
            all individuals within the European Union and the European Economic Area.
          </p>
        </section>

        {/* ... rest of existing GDPR content ... */}
        <section>
          <h3 className="text-xl font-semibold mb-3">8. Contact Us</h3>
          <p>
            If you have any questions about our GDPR compliance or how we handle your personal data, please contact us
            at crew@juice.fitness.
          </p>
        </section>
      </div>
    </div>
  )
}

export function LegalContent({ initialTab }: LegalContentProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["terms", "privacy", "cookie", "gdpr"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const url = new URL(window.location.href)
    url.searchParams.set("tab", value)
    window.history.pushState({}, "", url.toString())
  }

  const renderTabContent = (tabValue: string) => {
    switch (tabValue) {
      case "terms":
        return <TermsContent />
      case "privacy":
        return <PrivacyContent />
      case "cookie":
        return <CookieContent />
      case "gdpr":
        return <GdprContent />
      default:
        return <TermsContent />
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-zinc-800">
          <TabsTrigger value="terms" className="data-[state=active]:bg-juice data-[state=active]:text-black">
            Terms of Service
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-juice data-[state=active]:text-black">
            Privacy Policy
          </TabsTrigger>
          <TabsTrigger value="cookie" className="data-[state=active]:bg-juice data-[state=active]:text-black">
            Cookie Policy
          </TabsTrigger>
          <TabsTrigger value="gdpr" className="data-[state=active]:bg-juice data-[state=active]:text-black">
            GDPR
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="bg-zinc-800 rounded-xl p-8">{renderTabContent(activeTab)}</div>
    </Tabs>
  )
}
