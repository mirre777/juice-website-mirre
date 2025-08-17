interface SharedLoadingProps {
  message?: string
  showSpinner?: boolean
}

export default function SharedLoading({ 
  message = "Loading...", 
  showSpinner = true 
}: SharedLoadingProps) {
  if (!showSpinner) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-6xl mb-4">🍋</div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
