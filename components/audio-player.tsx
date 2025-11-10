"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

interface AudioPlayerProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function AudioPlayer({ enabled, onToggle }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion && enabled) {
      onToggle(false)
    }
  }, [enabled, onToggle])

  const handleToggle = () => {
    if (!audioRef.current) return

    if (enabled && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      onToggle(false)
    } else {
      audioRef.current.play().catch((error) => {
        console.error("[v0] Audio playback failed:", error)
      })
      setIsPlaying(true)
      onToggle(true)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggle}
        aria-label={enabled ? "음악 끄기" : "음악 켜기"}
        className="rounded-full shadow-lg bg-transparent"
      >
        {enabled && isPlaying ? (
          <>
            <Volume2 className="h-4 w-4" />
            <span className="sr-only">음악 재생 중</span>
          </>
        ) : (
          <>
            <VolumeX className="h-4 w-4" />
            <span className="sr-only">음악 끔</span>
          </>
        )}
      </Button>

      {/* Hidden audio element - would use actual audio file in production */}
      <audio ref={audioRef} loop>
        {/* <source src="/audio/bgm.mp3" type="audio/mpeg" /> */}
      </audio>
    </div>
  )
}
