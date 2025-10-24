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

export const GlobalProgram = ({programId, ctaData}: GlobalProgramProps) => {
  const [programData, setProgramData] = useState<any>(null)
  console.log("programId", programId)

  useEffect(() => {
    const fetchProgramData = async () => {
        try {
            const response = await fetch(`/api/programs/${programId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors', // Explicitly set CORS mode
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch program data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("program data", data);
            setProgramData(data.program);
        } catch (error) {
            console.error("Error fetching program data:", error);
            // Set a fallback or show error state
            setProgramData(null);
        }
    }

    if (programId) {
        fetchProgramData();
    }
  }, [programId])

  const getGlobalProgramUrl = (programId: string) => {
    return `https://app.juice.fitness/programs/${programId}`
  }

  const getButtonClasses = () => {
    // Always use green gradient for consistency
    return "trainer-gradient-btn font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
  }

  // Show loading state while fetching
  if (!programData) {
    return (
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-8 text-black">What's Inside the Program</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Loading skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
              <div className="bg-gray-300 h-8 rounded-lg mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="text-sm">
                    <div className="bg-gray-300 h-4 rounded mb-1"></div>
                    <div className="bg-gray-200 h-3 rounded mb-1"></div>
                    <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center mb-16">
    <h2 className="text-4xl font-bold mb-8 text-black">What's Inside the Program</h2>

    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
      {/* Dynamic content from API */}
      {programData?.routines?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((routine: any, index: number) => (
      <div key={index} className="bg-gray-50 rounded-2xl p-6">
        <div className="bg-[#D2FF28] text-black font-bold text-xl py-3 px-4 rounded-lg mb-4 text-left">{routine.name}</div>
        <div className="space-y-3 text-left">
          {routine.exercises?.map((exercise: any, exerciseIndex: number) => (
            <div key={exerciseIndex} className="text-sm">
              <div className="font-semibold">{exercise.name}</div>
              <div className="text-gray-600">{exercise.sets.length} sets • {(exercise.sets && exercise.sets.length > 0 ? `${exercise.sets[0].reps} reps` : `10-12 reps`)}</div>
              <div className="text-gray-500 text-xs">{exercise.muscleGroup}</div>
            </div>
          )) || (
            // Fallback content if no exercises data
            <>
              <div className="text-sm">
                <div className="font-semibold">Exercise 1</div>
                <div className="text-gray-600">3 sets • 8-12 reps</div>
                <div className="text-gray-500 text-xs">Muscle Group</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold">Exercise 2</div>
                <div className="text-gray-600">3 sets • 8-12 reps</div>
                <div className="text-gray-500 text-xs">Muscle Group</div>
              </div>
            </>
          )}
        </div>
      </div>
      ))}

    </div>

    <div className="flex justify-center mt-8">
        <button
            className={getButtonClasses()}
            onClick={() => window.open(getGlobalProgramUrl(programId), "_blank")}
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