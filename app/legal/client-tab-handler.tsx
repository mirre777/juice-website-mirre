const ClientTabHandler = () => {
  return (
    <div className="p-4">
      {/* BEGIN: Privacy Policy Tab Content */}
      <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
      <p className="text-zinc-400 mb-4">
        This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use
        our app.
      </p>
      {/* BEGIN: Updated Section 5 */}
      <h3 className="text-xl font-semibold mb-2">5. Third-Party Services</h3>
      <p className="text-zinc-400 mb-2">We use trusted third-party services to operate our app:</p>
      <ul className="list-disc pl-6 space-y-1 text-zinc-400">
        <li>Firebase (Authentication, Firestore, Analytics)</li>
        <li>Amplitude (User behavior analytics — hosted in EU data centers)</li>
        <li>Stripe / Apple Pay / Google Pay (Payment Processing)</li>
        <li>Crashlytics and Sentry (App Monitoring and Bug Reporting)</li>
        <li>Facebook SDK (Analytics and Social Features)</li>
        <li>Apple HealthKit / Google Fit (Fitness Data Syncing)</li>
        <li>OneSignal (Push Notifications)</li>
      </ul>
      <p className="text-zinc-400 mt-4">
        These services may process some user data on our behalf. However, no third parties collect data directly through
        our app without our oversight.
      </p>
      {/* END: Updated Section 5 */}
      {/* BEGIN: Section 6 */}
      <h3 className="text-xl font-semibold mb-2">6. Data Sharing and Transfers</h3>
      <p className="text-zinc-400 mb-4">
        We may share your information with third parties in the following circumstances:
      </p>
      {/* END: Section 6 */}
      {/* BEGIN: rest of code here */}
      {/* END: rest of code here */}
    </div>
  )
}

export default ClientTabHandler
