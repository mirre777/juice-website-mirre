// create a new react component
import React, { useEffect, useState } from "react"

type CTAData = {
  ctaButtonStyle: "black" | "green"
  ctaButtonText: string
}

type GlobalProgramProps = {
  programId: string
  ctaData: CTAData
}

const APP_URL = process.env.NEXT_PUBLIC_API_URL || "https://app.juice.fitness"

export const GlobalProgram = ({programId, ctaData}: GlobalProgramProps) => {
  const [programData, setProgramData] = useState<any>(null)
  console.log("programId", programId)

  useEffect(() => {
    const fetchProgramData = async () => {
        const url = `${APP_URL}/api/programs/${programId}`;
        console.log("fetching program data", url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch program data: ${response.status}`);
        }
        const data = await response.json();
        console.log("program data", data);
        setProgramData(data.program);
    }
    fetchProgramData()
  }, [programId])

  const getGlobalProgramUrl = (programId: string) => {
    return `${APP_URL}/programs/${programId}`
  }

  const getButtonClasses = () => {
    if (ctaData.ctaButtonStyle === "black") {
      return "bg-black hover:bg-gray-800 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
    }
    // Default to green
    return "bg-[#D2FF28] hover:bg-[#c4f01f] text-black font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
  }

  return (
    <div className="text-center mb-16">
    <h2 className="text-4xl font-bold mb-8 text-black">What's Inside the Program</h2>

    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
      {/* Day 1 - Push */}
      {programData && programData?.routines.map((routine: any) => (
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="bg-[#D2FF28] text-black font-bold text-xl py-3 px-4 rounded-lg mb-4 text-left">{routine.name}</div>
        <div className="space-y-3 text-left">
          <div className="text-sm">
            <div className="font-semibold">Chest press</div>
            <div className="text-gray-600">Dumbbells • 3 sets • 8-12 reps</div>
            <div className="text-gray-500 text-xs">Chest</div>
          </div>
          <div className="text-sm">
            <div className="font-semibold">Incline fly</div>
            <div className="text-gray-600">Dumbbells • 3 sets • 8-12 reps</div>
            <div className="text-gray-500 text-xs">Chest</div>
          </div>
          <div className="text-sm">
            <div className="font-semibold">Arnold press</div>
            <div className="text-gray-600">Dumbbells • 3 sets • 8-12 reps</div>
            <div className="text-gray-500 text-xs">Shoulders</div>
          </div>
          <div className="text-sm">
            <div className="font-semibold">Overhead tricep</div>
            <div className="text-gray-600">Dumbbells • 3 sets • 8-12 reps</div>
            <div className="text-gray-500 text-xs">Triceps</div>
          </div>
          <div className="text-sm">
            <div className="font-semibold">Crunches</div>
            <div className="text-gray-600">Bodyweight • 3 sets • 15-20 reps</div>
            <div className="text-gray-500 text-xs">Abs</div>
          </div>
        </div>
      </div>
      ))}

    </div>

    <div className="flex justify-center mt-8">
        <button
            className={getButtonClasses()}
            onClick={() => window.open(getGlobalProgramUrl(programId), "_blank")} // Added onClick handler for redirect
        >
            {ctaData.ctaButtonText || "Get Program"}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
        </button>
    </div>
  </div>
  )
}