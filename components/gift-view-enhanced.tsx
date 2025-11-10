"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PeperoPreview3D } from "@/components/pepero-preview-3d"
import { EmojiReactions } from "@/components/emoji-reactions"
import { AudioPlayer } from "@/components/audio-player"
import { Home, Sparkles, Download } from "lucide-react"
import Link from "next/link"
import { decodeDesign, sanitizeMessage } from "@/lib/design-utils"
import type { PeperoDesign } from "@/lib/design-schema"
import { chocolateTypes } from "@/lib/design-schema"
import * as htmlToImage from "html-to-image"

interface GiftViewEnhancedProps {
  payload: string
}

const messageCardTemplates = {
  simple: { name: "심플", bgClass: "bg-card" },
  ribbon: { name: "리본", bgClass: "bg-gradient-to-br from-secondary/20 to-accent/20" },
  polaroid: { name: "폴라로이드", bgClass: "bg-white shadow-xl" },
}

export function GiftViewEnhanced({ payload }: GiftViewEnhancedProps) {
  const [design, setDesign] = useState<PeperoDesign | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [cardTemplate, setCardTemplate] = useState<keyof typeof messageCardTemplates>("simple")
  const [isDownloading, setIsDownloading] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Decode the design from payload
    const decoded = decodeDesign(payload)
    if (decoded) {
      // Sanitize message for XSS protection
      decoded.message = sanitizeMessage(decoded.message)
      setDesign(decoded)
      setAudioEnabled(decoded.bgmEnabled)
    }

    // Show confetti animation on load
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [payload])

  if (!design) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <Card className="p-12">
          <h2 className="text-2xl font-bold mb-4">선물을 불러올 수 없어요</h2>
          <p className="text-muted-foreground mb-6">링크가 올바르지 않거나 만료되었을 수 있어요</p>
          <Link href="/maker">
            <Button>
              <Sparkles className="mr-2 h-5 w-5" />
              빼빼로 만들기
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const chocolate = chocolateTypes.find((c) => c.id === design.coating)

  const handleDownloadImage = async () => {
    if (!captureRef.current || !design) return
    setIsDownloading(true)
    try {
      const dataUrl = await htmlToImage.toPng(captureRef.current, {
        backgroundColor: "#fdf8f4",
        pixelRatio: window.devicePixelRatio || 2,
      })

      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `pepero-gift-${design.from || "friend"}.png`
      link.click()
    } catch (error) {
      console.error("[PeperoFactory] Failed to download image:", error)
      alert("이미지를 저장할 수 없었어요. 다시 시도해 주세요.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Audio player */}
      {design.bgmEnabled && <AudioPlayer enabled={audioEnabled} onToggle={setAudioEnabled} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="mr-2 h-4 w-4" />
            홈으로
          </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-primary">선물 도착!</h1>
        <div className="w-24" />
      </div>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10%",
                animation: `sprinkle-fall ${3 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {["🍫", "💖", "✨", "🎉", "💝"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Gift card */}
      <Card
        ref={captureRef}
        className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 backdrop-blur mb-8"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎁</div>
          <h2 className="text-3xl font-bold mb-2">누군가 당신에게</h2>
          <h2 className="text-3xl font-bold text-primary mb-4">빼빼로를 보냈어요!</h2>
          {design.from && (
            <p className="text-xl text-muted-foreground">
              From. <span className="font-semibold">{design.from}</span>
            </p>
          )}
        </div>

        {/* 3D Pepero preview */}
        <div className="flex justify-center mb-8">
          <PeperoPreview3D design={design} />
        </div>

        {/* Message card with template selection */}
        {design.message && (
          <div className="mb-8">
            <div className="flex justify-center gap-2 mb-4">
              {Object.entries(messageCardTemplates).map(([key, template]) => (
                <Button
                  key={key}
                  variant={cardTemplate === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCardTemplate(key as keyof typeof messageCardTemplates)}
                >
                  {template.name}
                </Button>
              ))}
            </div>

            <Card className={`p-6 ${messageCardTemplates[cardTemplate].bgClass} backdrop-blur`}>
              {cardTemplate === "polaroid" && (
                <div className="border-8 border-white p-4 shadow-inner">
                  <p className="text-lg text-center leading-relaxed text-pretty text-foreground">
                    {design.message.length > 120 ? `${design.message.slice(0, 120)}...` : design.message}
                  </p>
                </div>
              )}
              {cardTemplate === "ribbon" && (
                <>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-accent rounded-full border-4 border-background" />
                  <p className="text-lg text-center leading-relaxed text-pretty pt-4">
                    {design.message.length > 120 ? `${design.message.slice(0, 120)}...` : design.message}
                  </p>
                </>
              )}
              {cardTemplate === "simple" && (
                <p className="text-lg text-center leading-relaxed text-pretty">
                  {design.message.length > 120 ? `${design.message.slice(0, 120)}...` : design.message}
                </p>
              )}
              {chocolate && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  {chocolate.name} • {design.toppings.length}종 토핑
                </p>
              )}
            </Card>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/maker">
            <Button size="lg" className="w-full sm:w-auto">
              <Sparkles className="mr-2 h-5 w-5" />
              나도 만들기
            </Button>
          </Link>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-5 w-5" />
            {isDownloading ? "이미지 만드는 중..." : "이미지로 저장"}
          </Button>
        </div>
      </Card>

      {/* Emoji reactions */}
      <div className="mb-8">
        <EmojiReactions giftId={payload} />
      </div>

      {/* Create your own section */}
      <Card className="p-8 bg-gradient-to-br from-secondary/10 to-accent/10">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">당신도 만들어보세요!</h3>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            나만의 빼빼로를 디자인하고 친구들에게 공유해보세요
          </p>
          <Link href="/maker">
            <Button size="lg">
              <Sparkles className="mr-2 h-5 w-5" />
              빼빼로 만들러 가기
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
