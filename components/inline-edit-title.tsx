"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface InlineEditTitleProps {
  initialTitle: string
  onSave: (newTitle: string) => Promise<void>
  disabled?: boolean
  className?: string
}

export function InlineEditTitle({ initialTitle, onSave, disabled = false, className = "" }: InlineEditTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    if (!disabled && !isSaving) {
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (title.trim() === initialTitle.trim() || !title.trim()) {
      setIsEditing(false)
      setTitle(initialTitle)
      return
    }

    try {
      setIsSaving(true)
      await onSave(title.trim())
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save title:", error)
      setTitle(initialTitle)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBlur = () => {
    if (!isSaving) {
      handleSave()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setTitle(initialTitle)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        className={`font-semibold text-lg ${className}`}
        placeholder="Enter title..."
      />
    )
  }

  return (
    <h3
      className={`font-semibold text-lg line-clamp-2 mb-2 cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 transition-colors ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
      onClick={handleClick}
      title={disabled ? "Cannot edit hardcoded posts" : "Click to edit title"}
    >
      {initialTitle}
    </h3>
  )
}
