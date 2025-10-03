"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import { AnalyticsConsentBanner } from "@/components/analytics-consent-banner"

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "G-2N948XX72T"
const shouldLoadAnalytics = process.env.NODE_ENV === "production"

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isClientsRoute = pathname?.startsWith("/clients")

  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5375W2FZ"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />
      {/* End Google Tag Manager (noscript) */}

      {/* Google Tag Manager */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5375W2FZ');`,
        }}
      />

      {shouldLoadAnalytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Don't auto-initialize - wait for consent
              gtag('config', '${GA_TRACKING_ID}', {
                send_page_view: false
              });
            `}
          </Script>
        </>
      )}

      <div className={`${isClientsRoute ? "bg-black text-white" : ""}`}>
        {children}
        <SpeedInsights />
        <AnalyticsConsentBanner />
      </div>

      {/* Calendly badge widget JS - Load the library */}
      <Script
        id="calendly-widget-script"
        src="https://assets.calendly.com/assets/external/widget.js"
        type="text/javascript"
        strategy="afterInteractive"
      />

      <Script
        id="calendly-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            function initCalendly() {
              if (window.location.pathname === '/gratis-workout-app-met-trainer' || 
                  window.location.pathname.startsWith('/admin')) {
                return;
              }
              
              const consentBanner = document.querySelector('[data-consent-banner="true"]');
              
              if (consentBanner) {
                setTimeout(initCalendly, 1000);
                return;
              }
              
              if (window.Calendly) {
                window.Calendly.initBadgeWidget({
                  url: 'https://calendly.com/sofree-mirre/talk',
                  text: 'Are you a Trainer? Let\\'s talk.',
                  color: '#9fc5fb',
                  textColor: '#ffffff'
                });
              } else {
                setTimeout(initCalendly, 200);
              }
            }
            
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(initCalendly, 500);
              });
            } else {
              setTimeout(initCalendly, 500);
            }
          `,
        }}
      />
    </>
  )
}
