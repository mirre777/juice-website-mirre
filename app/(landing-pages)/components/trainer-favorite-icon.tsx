"use client"

import Image from "next/image"
import type { Trainer } from "@/app/(landing-pages)/utils/trainer-directory-utils"

interface TrainerFavoriteIconProps {
  trainer: Trainer
  isFavorite: boolean
  onToggle: () => void
  disabled?: boolean
}

export function TrainerFavoriteIcon({ trainer, isFavorite, onToggle, disabled }: TrainerFavoriteIconProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled) onToggle()
      }}
      disabled={disabled}
      className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all ${
        isFavorite ? "bg-juice/20 hover:bg-juice/30" : disabled ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-white/80 hover:bg-white shadow-sm hover:shadow-md"
      }`}
      aria-label={isFavorite ? `Remove ${trainer.name} from favorites` : `Add ${trainer.name} to favorites`}
      title={isFavorite ? "Remove from favorites" : disabled ? "Maximum favorites reached" : "Add to favorites"}
    >
      <Image
        src="/lime_traind_ir2-removebg-preview.png"
        alt="Favorite"
        width={20}
        height={20}
        className={`transition-opacity ${isFavorite ? "opacity-100" : disabled ? "opacity-30" : "opacity-60 hover:opacity-100"}`}
      />
    </button>
  )
}
