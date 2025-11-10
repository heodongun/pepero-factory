"use client"

import { Card } from "@/components/ui/card"
import type { Wrapper } from "@/lib/design-schema"
import { wrapperStyles } from "@/lib/design-schema"

interface WrapperCardProps {
  wrapper: Wrapper
  chocolateName: string
}

export function WrapperCard({ wrapper, chocolateName }: WrapperCardProps) {
  const wrapperConfig = wrapperStyles.find((w) => w.id === wrapper.pattern)

  const getPatternBackground = () => {
    switch (wrapper.pattern) {
      case "hearts":
        return "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 182, 193, 0.1) 10px, rgba(255, 182, 193, 0.1) 20px)"
      case "stars":
        return "radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)"
      case "dots":
        return "radial-gradient(circle, rgba(139, 69, 19, 0.1) 1px, transparent 1px)"
      case "stripe":
        return "repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(139, 69, 19, 0.05) 15px, rgba(139, 69, 19, 0.05) 30px)"
      case "check":
        return "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139, 69, 19, 0.05) 10px, rgba(139, 69, 19, 0.05) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(139, 69, 19, 0.05) 10px, rgba(139, 69, 19, 0.05) 20px)"
      default:
        return "none"
    }
  }

  return (
    <Card
      className="p-6 bg-secondary/10 backdrop-blur text-center overflow-hidden relative"
      style={{
        backgroundImage: getPatternBackground(),
        backgroundSize: wrapper.pattern === "dots" ? "20px 20px" : "auto",
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10">
        {wrapper.ribbon && (
          <div className="mb-3">
            <div className="w-full h-8 bg-gradient-to-r from-transparent via-primary/30 to-transparent relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mb-2 tracking-wider">PEPERO FACTORY</p>
        <p className="text-xl font-bold mb-1">{chocolateName}</p>
        <p className="text-xs text-muted-foreground">{wrapperConfig?.nameEn || wrapperConfig?.name}</p>

        {wrapper.sticker && (
          <div className="mt-4 inline-block px-3 py-1 bg-accent/20 rounded-full text-xs font-medium">
            Special Edition
          </div>
        )}
      </div>
    </Card>
  )
}
