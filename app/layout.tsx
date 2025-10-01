import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { AnalyticsConsentBanner } from "@/components/analytics-consent-banner"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Juice - Fitness Tracking & Coaching Platform | Best Online Personal Trainer",
  description:
    "Connect with coaches, share workouts, and transform your fitness journey with Juice. The best coaching app for personal trainers with workout builder, client management, and fitness software to grow your personal training business.",
  keywords:
    "best online personal trainer, personal trainer website, coaching app for personal trainers, workout builder app, personal training software, fitness app for trainers, workout planner, online personal trainer app, personal trainer business tips, fitness coaching app",
  generator: "v0.dev",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice Fitness App - Simple Workout Logging",
      },
    ],
  },
}

// Get GA tracking ID from environment variables
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "G-2N948XX72T"
const shouldLoadAnalytics = process.env.NODE_ENV === "production"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      </head>
      <body className={inter.className}>
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

        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AnalyticsProvider>
              {children}
              <SpeedInsights />
              <AnalyticsConsentBanner />
            </AnalyticsProvider>
          </ThemeProvider>
        </Suspense>

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
              console.log('[v0] Calendly init script loaded');
              
              function initCalendly() {
                console.log('[v0] Attempting to initialize Calendly');
                console.log('[v0] Current pathname:', window.location.pathname);
                
                if (window.location.pathname === '/gratis-workout-app-met-trainer') {
                  console.log('[v0] Skipping Calendly on this page');
                  return;
                }
                
                const consentBanner = document.querySelector('[data-consent-banner="true"]');
                console.log('[v0] Consent banner exists:', !!consentBanner);
                
                if (consentBanner) {
                  console.log('[v0] Consent banner still visible, retrying in 1s');
                  setTimeout(initCalendly, 1000);
                  return;
                }
                
                if (window.Calendly) {
                  console.log('[v0] Initializing Calendly badge widget');
                  window.Calendly.initBadgeWidget({
                    url: 'https://calendly.com/sofree-mirre/talk',
                    text: 'Are you a Trainer? Let\\'s talk.',
                    color: '#9fc5fb',
                    textColor: '#ffffff'
                  });
                  console.log('[v0] Calendly badge widget initialized');
                } else {
                  console.log('[v0] Calendly library not loaded yet, retrying in 200ms');
                  setTimeout(initCalendly, 200);
                }
              }
              
              // Start initialization after a short delay to ensure DOM is ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  console.log('[v0] DOM loaded, starting Calendly init');
                  setTimeout(initCalendly, 500);
                });
              } else {
                console.log('[v0] DOM already loaded, starting Calendly init');
                setTimeout(initCalendly, 500);
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
