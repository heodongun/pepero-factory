"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Fortune } from "@/lib/fortune-utils"

interface FortuneCardProps {
  fortune: Fortune
  onClose: () => void
  locale?: "ko" | "en"
}

export function FortuneCard({ fortune, onClose, locale = "ko" }: FortuneCardProps) {
  const getSweetnessLabel = () => {
    if (fortune.sweetness >= 80) return locale === "ko" ? "매우 달콤해요!" : "Very Sweet!"
    if (fortune.sweetness >= 60) return locale === "ko" ? "달콤해요" : "Sweet"
    return locale === "ko" ? "은은해요" : "Subtle"
  }

  return (
    <Card className="relative p-8 bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 backdrop-blur border-2 border-primary/20 overflow-hidden">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onClose}
        aria-label={locale === "ko" ? "닫기" : "Close"}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="text-8xl grid grid-cols-6 gap-4 p-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i}>{fortune.emoji}</span>
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center">
        {/* Fortune emoji */}
        <div className="text-6xl mb-4 animate-bounce">{fortune.emoji}</div>
        <h2 className="text-3xl font-bold mb-2 text-primary">
          {locale === "ko" ? "오늘의 달콤운세" : "Today's Sweet Fortune"}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">{getSweetnessLabel()}</p>

        {/* Sweetness meter */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-muted-foreground">
              {locale === "ko" ? "달콤지수" : "Sweetness Level"}
            </span>
            <span className="text-xl font-bold text-primary">{fortune.sweetness}%</span>
          </div>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary via-primary to-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${fortune.sweetness}%` }}
            />
          </div>
        </div>

        {/* Fortune message */}
        <p className="text-xl leading-relaxed text-pretty max-w-lg mx-auto">
          {locale === "ko" ? fortune.message : fortune.messageEn}
        </p>

        {/* Sparkles decoration */}
        <div className="mt-6 flex justify-center gap-3 text-2xl">
          <span className="sparkle">✨</span>
          <span className="sparkle" style={{ animationDelay: "0.5s" }}>
            🍫
          </span>
          <span className="sparkle" style={{ animationDelay: "1s" }}>
            💖
          </span>
        </div>
      </div>
    </Card>
  )
}
