"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ClientTabHandler() {
  const [activeTab, setActiveTab] = useState("terms")
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["terms", "privacy", "cookie", "gdpr"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Update URL without full page refresh
    const url = new URL(window.location.href)
    url.searchParams.set("tab", value)
    window.history.pushState({}, "", url.toString())
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

      <div className="bg-zinc-800 rounded-xl p-8">
        <TabsContent value="terms" className="mt-0">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Terms of Service</h2>
            <p className="text-zinc-300">Last updated: June 1, 2023</p>

            <div className="space-y-6 text-zinc-300">
              <section>
                <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
                <p>
                  By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these
                  Terms, you may not access or use the Service.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">2. Changes to Terms</h3>
                <p>
                  We may modify these Terms at any time. If we make changes, we will provide notice by updating the date
                  at the top of these Terms and by maintaining a current version of the Terms at [URL]. Your continued
                  use of the Service after any such change constitutes your acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">3. Privacy Policy</h3>
                <p>
                  Our Privacy Policy describes how we handle the information you provide to us when you use the Service.
                  You understand that by using the Service, you consent to the collection and use of this information as
                  set forth in the Privacy Policy.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">4. Account Registration</h3>
                <p>
                  To access certain features of the Service, you may be required to register for an account. You agree
                  to provide accurate, current, and complete information during the registration process and to update
                  such information to keep it accurate, current, and complete.
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
                  We may terminate or suspend your access to the Service immediately, without prior notice or liability,
                  for any reason whatsoever, including without limitation if you breach these Terms.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">8. Disclaimer</h3>
                <p>
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES
                  OF ANY KIND, WHETHER EXPRESS OR IMPLIED.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">9. Limitation of Liability</h3>
                <p>
                  IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE
                  DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE
                  LOSSES.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">10. Governing Law</h3>
                <p>
                  These Terms shall be governed by the laws of Austria, without respect to its conflict of laws
                  principles.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">11. Contact Information</h3>
                <p>If you have any questions about these Terms, please contact us at crew@juice.fitness.</p>
              </section>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="mt-0">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Privacy Policy</h2>
            <p className="text-zinc-300">Last updated: May 19, 2025</p>

            <div className="space-y-6 text-zinc-300">
              <p>
                Juice Fitness ("we," "our," or "us") respects your privacy and is committed to protecting your personal
                data. This Privacy Policy describes how we collect, use, and share information when you use our website,
                mobile app, and associated services (collectively, "the Service").
              </p>

              <p>By accessing or using Juice, you agree to this Privacy Policy.</p>

              <section>
                <h3 className="text-xl font-semibold mb-3">1. Who We Are</h3>
                <p>
                  Juice Fitness is a company registered in Austria. If you have questions or requests regarding your
                  data, you can contact us at:
                </p>
                <p className="mt-2">
                  Email: support@getjuice.app
                  <br />
                  Address: [insert physical address if available]
                </p>
                <p className="mt-2">We do not currently have a Data Protection Officer (DPO).</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">2. What Data We Collect</h3>
                <p>We may collect the following types of personal data:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Identity Data: name, email address</li>
                  <li>Workout Data: workout entries, exercise history, trainer feedback</li>
                  <li>Media: photos you upload</li>
                  <li>Technical Data: device and system information for troubleshooting</li>
                  <li>Future: biometric data from Apple Health (if you opt in)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">3. How We Collect Data</h3>
                <p>We collect data in the following ways:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>When you enter information manually (e.g., during signup or workout tracking)</li>
                  <li>From third-party integrations like Apple Health (with your permission)</li>
                  <li>Automatically, such as device data during app use</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">4. How We Use Your Data</h3>
                <p>We process your personal data to:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Provide and improve the Service</li>
                  <li>Suggest workouts and track progress</li>
                  <li>Enable communication with your trainer (only if you consent)</li>
                  <li>Respond to your feedback or support requests</li>
                  <li>Send product updates or marketing emails (only if you've opted in)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">5. Legal Basis for Processing</h3>
                <p>We rely on the following legal bases under the General Data Protection Regulation (GDPR):</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Consent: For collecting health or biometric data, and sending marketing communications</li>
                  <li>Performance of a contract: To provide the core functionality of Juice</li>
                  <li>Legitimate interest: For technical troubleshooting and product improvement</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">6. Cookies and Tracking</h3>
                <p>
                  We use cookies and similar technologies (e.g., Google Analytics, Hotjar) to understand how users
                  interact with the app and improve performance.
                </p>
                <p className="mt-2">We do not currently support "Do Not Track" browser signals.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">7. Sharing Your Data</h3>
                <p>
                  We do not currently share your data with third parties beyond the services needed to operate Juice.
                </p>
                <p className="mt-2">
                  In the future, we may use services such as Mixpanel or Google BigQuery. Some providers may be located
                  outside the EU and subject to international data transfer safeguards such as Standard Contractual
                  Clauses.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">8. Your Rights Under GDPR</h3>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Access your data</li>
                  <li>Correct or update inaccurate information</li>
                  <li>Withdraw your consent at any time</li>
                  <li>Request deletion of your data</li>
                  <li>Lodge a complaint with a data protection authority</li>
                </ul>
                <p className="mt-2">To exercise any of these rights, please contact support@getjuice.app.</p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">9. Data Retention</h3>
                <p>
                  We retain your data as long as your account is active or as needed to provide our Service. You may
                  request account deletion at any time via customer support.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">10. Children's Privacy</h3>
                <p>
                  Juice is not intended for users under the age of 16. We do not knowingly collect data from minors.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">11. Changes to This Policy</h3>
                <p>
                  We may update this Privacy Policy occasionally. If we make significant changes, we'll notify you via
                  the app or email.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">12. Contact Us</h3>
                <p>
                  For any questions or concerns, please email:
                  <br />
                  crew@juice.fitness
                </p>
              </section>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cookie" className="mt-0">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Cookie Policy</h2>
            <p className="text-zinc-300">Last updated: May 19, 2025</p>

            <div className="space-y-6 text-zinc-300">
              <section>
                <h3 className="text-xl font-semibold mb-3">1. What Are Cookies</h3>
                <p>
                  As is common practice with almost all professional websites, this site uses cookies, which are tiny
                  files that are downloaded to your computer, to improve your experience. This page describes what
                  information they gather, how we use it and why we sometimes need to store these cookies. We will also
                  share how you can prevent these cookies from being stored however this may downgrade or 'break'
                  certain elements of the site's functionality.
                </p>
                <p className="mt-2">
                  Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer
                  or mobile device when you go offline, while session cookies are deleted as soon as you close your web
                  browser.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">2. How We Use Cookies</h3>
                <p>
                  We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no
                  industry standard options for disabling cookies without completely disabling the functionality and
                  features they add to this site. It is recommended that you leave on all cookies if you are not sure
                  whether you need them or not in case they are used to provide a service that you use.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">3. The Cookies We Set</h3>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    <strong>Account related cookies:</strong> If you create an account with us, we will use cookies for
                    the management of the signup process and general administration. These cookies will usually be
                    deleted when you log out; however, in some cases, they may remain afterward to remember your site
                    preferences when logged out.
                  </li>
                  <li>
                    <strong>Login related cookies:</strong> We use cookies when you are logged in so that we can
                    remember this fact. This prevents you from having to log in every single time you visit a new page.
                    These cookies are typically removed or cleared when you log out to ensure that you can only access
                    restricted features and areas when logged in.
                  </li>
                  <li>
                    <strong>Site preferences cookies:</strong> In order to provide you with a great experience on this
                    site, we provide the functionality to set your preferences for how this site runs when you use it.
                    In order to remember your preferences, we need to set cookies so that this information can be called
                    whenever you interact with a page that is affected by your preferences.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">4. Third-Party Cookies</h3>
                <p>
                  In some special cases, we also use cookies provided by trusted third parties. The following section
                  details which third-party cookies you might encounter through this site.
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    This site uses Google Analytics which is one of the most widespread and trusted analytics solutions
                    on the web for helping us to understand how you use the site and ways that we can improve your
                    experience. These cookies may track things such as how long you spend on the site and the pages that
                    you visit so we can continue to produce engaging content.
                  </li>
                  <li>
                    From time to time, we test new features and make subtle changes to the way that the site is
                    delivered. When we are still testing new features, these cookies may be used to ensure that you
                    receive a consistent experience whilst on the site whilst ensuring we understand which optimizations
                    our users appreciate the most.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">5. More Information</h3>
                <p>
                  Hopefully, that has clarified things for you and as was previously mentioned if there is something
                  that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it
                  does interact with one of the features you use on our site.
                </p>
                <p className="mt-2">
                  If you are still looking for more information, you can contact us at crew@juice.fitness.
                </p>
              </section>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gdpr" className="mt-0">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">GDPR Compliance</h2>
            <p className="text-zinc-300">Last updated: May 19, 2025</p>

            <div className="space-y-6 text-zinc-300">
              <section>
                <h3 className="text-xl font-semibold mb-3">1. Introduction to GDPR</h3>
                <p>
                  The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy
                  for all individuals within the European Union and the European Economic Area. It addresses the export
                  of personal data outside the EU and EEA areas.
                </p>
                <p className="mt-2">
                  At Juice, we respect your privacy and are committed to protecting your personal data. This GDPR
                  compliance statement explains how we collect, process, and store personal data in accordance with GDPR
                  requirements.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">2. Data Controller</h3>
                <p>
                  Juice Fitness is the data controller responsible for your personal data. If you have any questions
                  about this GDPR compliance statement, including any requests to exercise your legal rights, please
                  contact us at crew@juice.fitness.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">3. Your Rights Under GDPR</h3>
                <p>Under the GDPR, you have the following rights:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    <strong>Right to be informed:</strong> You have the right to be informed about the collection and
                    use of your personal data.
                  </li>
                  <li>
                    <strong>Right of access:</strong> You have the right to request copies of your personal data.
                  </li>
                  <li>
                    <strong>Right to rectification:</strong> You have the right to request that we correct any
                    information you believe is inaccurate or complete information you believe is incomplete.
                  </li>
                  <li>
                    <strong>Right to erasure:</strong> You have the right to request that we erase your personal data,
                    under certain conditions.
                  </li>
                  <li>
                    <strong>Right to restrict processing:</strong> You have the right to request that we restrict the
                    processing of your personal data, under certain conditions.
                  </li>
                  <li>
                    <strong>Right to data portability:</strong> You have the right to request that we transfer the data
                    that we have collected to another organization, or directly to you, under certain conditions.
                  </li>
                  <li>
                    <strong>Right to object:</strong> You have the right to object to our processing of your personal
                    data, under certain conditions.
                  </li>
                  <li>
                    <strong>Rights related to automated decision making and profiling:</strong> You have the right not
                    to be subject to a decision based solely on automated processing, including profiling, which
                    produces legal effects concerning you or similarly significantly affects you.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">4. Data Protection Principles</h3>
                <p>We adhere to the principles set out in the GDPR, which require that personal data be:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Processed lawfully, fairly, and in a transparent manner</li>
                  <li>Collected for specified, explicit, and legitimate purposes</li>
                  <li>Adequate, relevant, and limited to what is necessary</li>
                  <li>Accurate and, where necessary, kept up to date</li>
                  <li>Kept in a form which permits identification of data subjects for no longer than is necessary</li>
                  <li>Processed in a manner that ensures appropriate security of the personal data</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">5. International Transfers</h3>
                <p>
                  We may transfer your personal data to countries outside the European Economic Area (EEA). Whenever we
                  transfer your personal data out of the EEA, we ensure a similar degree of protection is afforded to it
                  by ensuring at least one of the following safeguards is implemented:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    We will only transfer your personal data to countries that have been deemed to provide an adequate
                    level of protection for personal data by the European Commission.
                  </li>
                  <li>
                    Where we use certain service providers, we may use specific contracts approved by the European
                    Commission which give personal data the same protection it has in Europe (Standard Contractual
                    Clauses).
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">6. How to Exercise Your Rights</h3>
                <p>
                  If you wish to exercise any of your rights under the GDPR, please contact us at crew@juice.fitness. We
                  will respond to your request within one month. If your request is particularly complex or you have
                  made a number of requests, it may take us longer. We will notify you if this is the case.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">7. Data Breach Procedures</h3>
                <p>
                  In the case of a personal data breach, we will notify the relevant supervisory authority within 72
                  hours of becoming aware of the breach, where feasible. If the breach is likely to result in a high
                  risk to your rights and freedoms, we will also notify you without undue delay.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">8. Contact Us</h3>
                <p>
                  If you have any questions about our GDPR compliance or how we handle your personal data, please
                  contact us at crew@juice.fitness.
                </p>
              </section>
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
