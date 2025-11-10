"use client"

import { Card } from "@/components/ui/card"

interface PeperoPreviewProps {
  chocolate: {
    id: string
    name: string
    color: string
  }
  topping: {
    id: string
    name: string
    emoji: string
  }
  wrapper: {
    id: string
    name: string
    pattern: string
  }
  message: string
  from: string
}

export function PeperoPreview({ chocolate, topping, wrapper, message, from }: PeperoPreviewProps) {
  // Wrapper pattern background
  const getWrapperPattern = () => {
    switch (wrapper.pattern) {
      case "hearts":
        return "💗 💗 💗 💗 💗"
      case "stars":
        return "⭐ ⭐ ⭐ ⭐ ⭐"
      case "dots":
        return "• • • • • • • •"
      case "stripes":
        return "| | | | | | | |"
      default:
        return ""
    }
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Wrapper */}
      <div className="relative mb-8">
        <Card className="p-6 bg-secondary/20 backdrop-blur text-center overflow-hidden relative">
          {/* Pattern overlay */}
          {wrapper.pattern !== "solid" && (
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-4xl leading-relaxed whitespace-pre-wrap pointer-events-none">
              {getWrapperPattern().repeat(10)}
            </div>
          )}

          <div className="relative z-10">
            <p className="text-sm text-muted-foreground mb-2">Pepero Factory</p>
            <p className="text-lg font-bold">{chocolate.name}</p>
            {topping.id !== "none" && (
              <p className="text-sm text-muted-foreground mt-1">
                {topping.emoji} {topping.name}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Pepero Stick */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {/* Stick */}
          <div
            className="w-12 h-64 rounded-t-lg rounded-b-sm shadow-xl relative overflow-hidden"
            style={{
              background: `linear-gradient(to bottom, ${chocolate.color} 0%, ${chocolate.color} 70%, #F5DEB3 70%, #F5DEB3 100%)`,
            }}
          >
            {/* Toppings on chocolate part */}
            {topping.id !== "none" && (
              <div className="absolute top-4 left-0 right-0 space-y-3 text-center">
                <div className="text-xl opacity-80">{topping.emoji}</div>
                <div className="text-xl opacity-90 ml-4">{topping.emoji}</div>
                <div className="text-xl opacity-70">{topping.emoji}</div>
                <div className="text-xl opacity-85 ml-3">{topping.emoji}</div>
                <div className="text-xl opacity-75">{topping.emoji}</div>
              </div>
            )}

            {/* Chocolate coating line */}
            <div
              className="absolute bottom-[30%] left-0 right-0 h-1 opacity-30"
              style={{ backgroundColor: chocolate.color }}
            />
          </div>

          {/* Sparkle effect */}
          <div className="absolute -top-2 -right-2 text-2xl sparkle">✨</div>
          <div className="absolute -top-4 -left-2 text-2xl sparkle" style={{ animationDelay: "0.5s" }}>
            ✨
          </div>
        </div>
      </div>

      {/* Message Card */}
      {(message || from) && (
        <Card className="p-6 bg-card/80 backdrop-blur">
          {message && <p className="text-lg text-center mb-3 leading-relaxed text-pretty">{message}</p>}
          {from && <p className="text-sm text-muted-foreground text-center">From. {from}</p>}
        </Card>
      )}
    </div>
  )
}
