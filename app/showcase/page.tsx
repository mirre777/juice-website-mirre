import { JuiceAppShowcase } from "@/components/juice-app-showcase"

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Juice App Showcase Preview</h1>
        <JuiceAppShowcase />
      </div>
    </main>
  )
}
