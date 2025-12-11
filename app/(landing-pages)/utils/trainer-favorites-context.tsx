"use client"

/**
 * Client-safe constants and types for trainer favorites feature
 * This file must not import any server-side code (like firebase-admin)
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

export type FavoriteTrainer = {
  id: string
  name: string
  imageUrl?: string
  publicPath?: string
}

export const FAVORITES_STORAGE_KEY = "juice_trainer_favorites"
export const MAX_FAVORITES = 5

interface TrainerFavoritesContextType {
  favorites: FavoriteTrainer[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (trainer: FavoriteTrainer) => void
  removeFavorite: (id: string) => void
  canAddMore: boolean
}

const TrainerFavoritesContext = createContext<TrainerFavoritesContextType | undefined>(undefined)

const isValidFavorite = (f: any): f is FavoriteTrainer => f?.id && typeof f.id === "string" && typeof f.name === "string"

export function TrainerFavoritesProvider({ children, city }: { children: ReactNode; city: string }) {
  const [favorites, setFavorites] = useState<FavoriteTrainer[]>([])
  const storageKey = `${FAVORITES_STORAGE_KEY}_${city}`

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem(storageKey)
      const valid = stored ? (JSON.parse(stored) || []).filter(isValidFavorite) : []
      setFavorites(valid.slice(0, MAX_FAVORITES))
    } catch {
      setFavorites([])
    }
  }, [city, storageKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites))
    } catch {}
  }, [favorites, storageKey])

  const isFavorite = useCallback((id: string) => favorites.some((f) => f.id === id), [favorites])
  const toggleFavorite = useCallback(
    (trainer: FavoriteTrainer) => {
      setFavorites((prev) => {
        const exists = prev.findIndex((f) => f.id === trainer.id)
        if (exists >= 0) return prev.filter((f) => f.id !== trainer.id)
        if (prev.length >= MAX_FAVORITES) return prev
        return [...prev, trainer]
      })
    },
    []
  )
  const removeFavorite = useCallback((id: string) => setFavorites((prev) => prev.filter((f) => f.id !== id)), [])

  return (
    <TrainerFavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, removeFavorite, canAddMore: favorites.length < MAX_FAVORITES }}
    >
      {children}
    </TrainerFavoritesContext.Provider>
  )
}

export function useTrainerFavorites() {
  const context = useContext(TrainerFavoritesContext)
  if (!context) throw new Error("useTrainerFavorites must be used within TrainerFavoritesProvider")
  return context
}
