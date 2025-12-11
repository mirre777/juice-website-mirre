"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, User } from "lucide-react"
import { useTrainerFavorites, MAX_FAVORITES } from "@/app/(landing-pages)/utils/trainer-favorites-context"

const EMPTY_MESSAGE = "No favorites yet. Click the lime icon on trainer cards to add them."

const TrainerItem = ({ trainer, removeFavorite }: { trainer: any; removeFavorite: (id: string) => void }) => (
  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
    <button
      onClick={() => trainer.publicPath && window.open(`https://app.juice.fitness${trainer.publicPath}`, "_blank", "noopener,noreferrer")}
      className="flex items-center gap-2 flex-1 min-w-0 text-left"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {trainer.imageUrl ? (
          <Image src={trainer.imageUrl} alt={trainer.name} width={32} height={32} className="w-full h-full object-cover rounded-full" />
        ) : (
          <User className="h-4 w-4 text-gray-400" />
        )}
      </div>
      <span className="text-xs font-medium text-gray-900 truncate flex-1">{trainer.name}</span>
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation()
        removeFavorite(trainer.id)
      }}
      className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
      aria-label={`Remove ${trainer.name}`}
    >
      <X className="h-3 w-3" />
    </button>
  </div>
)

const SidebarHeader = ({ count, onClose }: { count: number; onClose?: () => void }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200">
    <div className="flex items-center gap-2">
      <Image src="/lime_traind_ir2-removebg-preview.png" alt="Favorites" width={18} height={18} className="w-[18px] h-[18px]" />
      <h3 className="font-semibold text-gray-900 text-sm">Favorites ({count}/{MAX_FAVORITES})</h3>
    </div>
    {onClose && (
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
        <X className="h-5 w-5" />
      </button>
    )}
  </div>
)

export function TrainerFavoritesSidebar() {
  const { favorites, removeFavorite } = useTrainerFavorites()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  if (isMobile) {
    return (
      <div className="fixed top-20 left-4 z-[60]">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="bg-juice text-gray-900 rounded-full p-3 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow relative"
            aria-label="View favorites"
          >
            <Image src="/lime_traind_ir2-removebg-preview.png" alt="Favorites" width={28} height={28} className="w-7 h-7" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {favorites.length}
              </span>
            )}
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-[70vh] flex flex-col">
            <SidebarHeader count={favorites.length} onClose={() => setIsExpanded(false)} />
            <div className="overflow-y-auto flex-1 p-2">
              {favorites.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">{EMPTY_MESSAGE}</div>
              ) : (
                favorites.map((trainer) => <TrainerItem key={trainer.id} trainer={trainer} removeFavorite={removeFavorite} />)
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="hidden md:block fixed top-20 right-4 z-[60] w-64">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-[calc(100vh-2rem)] flex flex-col">
        <SidebarHeader count={favorites.length} />
        <div className="overflow-y-auto flex-1 p-2">
          {favorites.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-xs">{EMPTY_MESSAGE}</div>
          ) : (
            favorites.map((trainer) => <TrainerItem key={trainer.id} trainer={trainer} removeFavorite={removeFavorite} />)
          )}
        </div>
      </div>
    </div>
  )
}
