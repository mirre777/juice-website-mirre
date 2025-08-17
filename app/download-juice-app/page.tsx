import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DownloadHeroSection } from "@/components/download-hero-section"
import { AppDownloadSection } from "@/components/app-download-section"

export const metadata = {
  title: "Download Juice Fitness App | Personal Training Made Simple",
  description:
    "Download the Juice Fitness app for iOS and Android. Connect with certified personal trainers and get customized workout plans delivered to your phone.",
  openGraph: {
    title: "Download Juice Fitness App | Personal Training Made Simple",
    description:
      "Download the Juice Fitness app for iOS and Android. Connect with certified personal trainers and get customized workout plans delivered to your phone.",
    images: ["/images/og-feature-graphic.png"],
  },
}

export default function DownloadJuiceAppPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <DownloadHeroSection />
      <AppDownloadSection />
      <Footer />
    </main>
  )
}
