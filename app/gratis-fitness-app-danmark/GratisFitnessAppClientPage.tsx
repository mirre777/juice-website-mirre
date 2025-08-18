"use client"

import { ClientHeroSection } from "@/components/client-hero-section"
import { ClientFeaturesSection } from "@/components/client-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"

export default function GratisFitnessAppClientPage() {
  const heroData = {
    title: "Gratis fitness app i Danmark – Træn når og hvor du vil",
    subtitle:
      "Vil du i form uden at betale abonnement? Vores gratis fitness app giver dig træningsprogrammer, tracking og mulighed for at dele din træning med venner. Perfekt til både hjemmetræning og fitnesscenter.",
    rating: "5/5 af vores brugere",
    ctaText: "Download gratis fitness app",
  }

  const featuresData = {
    title: "Hvorfor denne app?",
    features: [
      {
        title: "Gratis at starte",
        description: "Gratis fitness app med træningsprogrammer til alle niveauer",
      },
      {
        title: "Personligt program",
        description: "Træningsprogram app til styrke, cardio eller HIIT",
      },
      {
        title: "Online & Offline",
        description: "Brug appen online eller offline – perfekt til alle situationer",
      },
      {
        title: "Community",
        description: "Del din træning med venner og bliv motiveret af fællesskabet",
      },
    ],
  }

  const faqData = {
    title: "Ofte stillede spørgsmål",
    faqs: [
      {
        question: "Er der en gratis fitness app i Danmark?",
        answer:
          "Ja! Vores fitness app er helt gratis at bruge i Danmark. Du får adgang til træningsprogrammer, tracking og community-funktioner uden abonnement eller skjulte omkostninger.",
      },
      {
        question: "Hvad er den bedste træningsprogram app?",
        answer:
          "Den bedste træningsprogram app giver dig fleksibilitet til at lave dine egne programmer eller følge færdige planer. Vores app tilbyder både styrke-, cardio- og HIIT-programmer tilpasset dit niveau.",
      },
      {
        question: "Hvilken løbe app er bedst til tracking?",
        answer:
          "En god løbe app skal have GPS tracking, rute-lagring og mulighed for at dele resultater. Vores app fungerer som både løbe app og cykel app med præcis tracking af dine aktiviteter.",
      },
      {
        question: "Kan jeg bruge appen offline?",
        answer:
          "Ja, du kan bruge vores fitness app offline. Download dine træningsprogrammer og brug dem hvor som helst – også uden internetforbindelse.",
      },
      {
        question: "Koster booking via fitness app ekstra?",
        answer:
          "Nej, booking-funktionen er inkluderet gratis. Du kan booke træning, deltage i challenges og måle dine resultater uden ekstra omkostninger.",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <ClientHeroSection {...heroData} />
      <ClientFeaturesSection {...featuresData} />
      <ClientFAQSection {...faqData} />
    </div>
  )
}
