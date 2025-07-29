import PricingDemoPageClient from "./PricingDemoPageClient"

export const metadata = {
  title: "Juice Pricing & Payment Demo | Affordable Fitness Coaching Software",
  description:
    "Explore Juice's flexible pricing plans for personal trainers and fitness coaches. See our integrated payment solutions in action.",
  openGraph: {
    images: "/images/og-feature-graphic.png",
  },
}

export default function PricingDemoPage() {
  return <PricingDemoPageClient />
}
