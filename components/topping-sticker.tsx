"use client"

import { useState } from "react"
import type { Topping } from "@/lib/design-schema"
import { toppingOptions } from "@/lib/design-schema"

interface ToppingStickerProps {
  topping: Topping
  onRemove?: () => void
}

export function ToppingSticker({ topping, onRemove }: ToppingStickerProps) {
  const [isHovered, setIsHovered] = useState(false)
  const toppingConfig = toppingOptions.find((t) => t.id === topping.type)

  if (!toppingConfig) return null

  return (
    <div
      className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-card/80 backdrop-blur border-2 border-border rounded-full cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onRemove}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onRemove?.()
        }
      }}
      aria-label={`${toppingConfig.name} ${topping.count}개`}
    >
      <span className="text-lg">{toppingConfig.emoji}</span>
      <span className="text-sm font-medium">{topping.count}</span>
      <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: topping.color }} />
      {isHovered && onRemove && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs">
          ×
        </span>
      )}
    </div>
  )
}
