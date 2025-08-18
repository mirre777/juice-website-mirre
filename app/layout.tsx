import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script" // Ensure Script is imported

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Juice - Fitness Tracking & Coaching Platform | Best Online Personal Trainer",
  description:
    "Connect with coaches, share workouts, and transform your fitness journey with Juice. The best coaching app for personal trainers with workout builder, client management, and fitness software to grow your personal training business.",
  keywords:
    "best online personal trainer, personal trainer website, coaching app for personal trainers, workout builder app, personal training software, fitness app for trainers, workout planner, online personal trainer app, personal trainer business tips, fitness coaching app",
  generator: "v0.dev",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5375W2FZ');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZVJGWP20NY"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZVJGWP20NY');
            `,
          }}
        />
        {/* End Google Analytics */}

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Calendly badge widget CSS - Placed in head */}
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <SpeedInsights />
        </ThemeProvider>

        {/* Calendly badge widget JS - Load the library */}
        <Script
          id="calendly-widget-script"
          src="https://assets.calendly.com/assets/external/widget.js"
          type="text/javascript"
          strategy="afterInteractive" // Load after the page is interactive
        />

        {/* Calendly initialization script - Runs on client after library loads */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              // Use a DOMContentLoaded listener or check for Calendly object
              document.addEventListener('DOMContentLoaded', function() {
                function initCalendly() {
                  if (window.location.pathname === '/gratis-workout-app-met-trainer') {
                    console.log("Skipping Calendly widget on client landing page");
                    return;
                  }
                  
                  if (window.Calendly) {
                    window.Calendly.initBadgeWidget({
                      url: 'https://calendly.com/sofree-mirre/talk',
                      text: 'Are you a Trainer? Let\\'s talk.',
                      color: '#9fc5fb',
                      textColor: '#ffffff'
                    });
                    console.log("Calendly badge widget initialized successfully.");
                  } else {
                    console.log("Calendly object not found yet, retrying...");
                    setTimeout(initCalendly, 200); // Retry after a short delay
                  }
                }
                initCalendly(); // Initial call
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
