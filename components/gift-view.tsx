"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PeperoPreview } from "@/components/pepero-preview"
import { Gift, Home, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const chocolateTypes = [
  { id: "milk", name: "밀크 초콜릿", color: "#8B4513" },
  { id: "dark", name: "다크 초콜릿", color: "#3D2817" },
  { id: "white", name: "화이트 초콜릿", color: "#F5DEB3" },
  { id: "strawberry", name: "딸기 초콜릿", color: "#FFB6C1" },
  { id: "matcha", name: "말차 초콜릿", color: "#88C091" },
]

const toppingOptions = [
  { id: "none", name: "없음", emoji: "" },
  { id: "almonds", name: "아몬드", emoji: "🥜" },
  { id: "sprinkles", name: "스프링클", emoji: "🌈" },
  { id: "cookies", name: "쿠키", emoji: "🍪" },
  { id: "marshmallow", name: "마시멜로우", emoji: "☁️" },
  { id: "hearts", name: "하트", emoji: "💗" },
]

const wrapperStyles = [
  { id: "classic", name: "클래식", pattern: "solid" },
  { id: "hearts", name: "하트", pattern: "hearts" },
  { id: "stars", name: "별", pattern: "stars" },
  { id: "dots", name: "도트", pattern: "dots" },
  { id: "stripes", name: "줄무늬", pattern: "stripes" },
]

export function GiftView() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)

  const chocolateId = searchParams.get("c") || "milk"
  const toppingId = searchParams.get("t") || "none"
  const wrapperId = searchParams.get("w") || "classic"
  const message = searchParams.get("m") || ""
  const from = searchParams.get("f") || ""

  const chocolate = chocolateTypes.find((c) => c.id === chocolateId) || chocolateTypes[0]
  const topping = toppingOptions.find((t) => t.id === toppingId) || toppingOptions[0]
  const wrapper = wrapperStyles.find((w) => w.id === wrapperId) || wrapperStyles[0]

  useEffect(() => {
    // Show confetti animation on load
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleMakeYourOwn = () => {
    router.push("/maker")
  }

  return (
    <div className="max-w-4xl mx-auto">
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
              className="absolute text-3xl animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10%",
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {["🍫", "💖", "✨", "🎉", "💝"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Gift card */}
      <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 backdrop-blur">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎁</div>
          <h2 className="text-3xl font-bold mb-2">누군가 당신에게</h2>
          <h2 className="text-3xl font-bold text-primary mb-4">빼빼로를 보냈어요!</h2>
          {from && <p className="text-xl text-muted-foreground">From. {from}</p>}
        </div>

        {/* Pepero preview */}
        <div className="flex justify-center mb-8">
          <PeperoPreview chocolate={chocolate} topping={topping} wrapper={wrapper} message={message} from="" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/maker">
            <Button size="lg" className="w-full sm:w-auto">
              <Sparkles className="mr-2 h-5 w-5" />
              나도 만들기
            </Button>
          </Link>
          <Button size="lg" variant="secondary" onClick={() => window.print()} className="w-full sm:w-auto">
            <Gift className="mr-2 h-5 w-5" />
            저장하기
          </Button>
        </div>

        {/* Share appreciation */}
        <div className="mt-8 text-center">
          <Card className="p-6 bg-card/50 backdrop-blur">
            <p className="text-lg leading-relaxed text-pretty">달콤한 빼빼로와 함께 행복한 하루 되세요! 💕</p>
          </Card>
        </div>
      </Card>

      {/* Create your own section */}
      <div className="mt-12 text-center">
        <Card className="p-8 bg-gradient-to-br from-secondary/10 to-accent/10">
          <h3 className="text-2xl font-bold mb-4">당신도 만들어보세요!</h3>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            나만의 빼빼로를 디자인하고 친구들에게 공유해보세요
          </p>
          <Button size="lg" onClick={handleMakeYourOwn}>
            <Sparkles className="mr-2 h-5 w-5" />
            빼빼로 만들러 가기
          </Button>
        </Card>
      </div>
    </div>
  )
}
