"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Trophy, Heart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { PeperoPreview } from "@/components/pepero-preview"

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

// Mock leaderboard data
const mockLeaderboard = [
  {
    id: 1,
    rank: 1,
    chocolate: "strawberry",
    topping: "hearts",
    wrapper: "hearts",
    message: "사랑해요! 💕",
    from: "민지",
    likes: 1247,
    shares: 342,
  },
  {
    id: 2,
    rank: 2,
    chocolate: "matcha",
    topping: "almonds",
    wrapper: "stars",
    message: "행복한 하루 되세요!",
    from: "준호",
    likes: 1089,
    shares: 298,
  },
  {
    id: 3,
    rank: 3,
    chocolate: "dark",
    topping: "cookies",
    wrapper: "classic",
    message: "당신이 최고예요!",
    from: "서연",
    likes: 956,
    shares: 267,
  },
  {
    id: 4,
    rank: 4,
    chocolate: "milk",
    topping: "sprinkles",
    wrapper: "dots",
    message: "언제나 응원할게요 ✨",
    from: "태양",
    likes: 843,
    shares: 215,
  },
  {
    id: 5,
    rank: 5,
    chocolate: "white",
    topping: "marshmallow",
    wrapper: "stripes",
    message: "달콤한 하루!",
    from: "지우",
    likes: 721,
    shares: 189,
  },
  {
    id: 6,
    rank: 6,
    chocolate: "strawberry",
    topping: "sprinkles",
    wrapper: "hearts",
    message: "오늘도 화이팅!",
    from: "현우",
    likes: 654,
    shares: 156,
  },
  {
    id: 7,
    rank: 7,
    chocolate: "matcha",
    topping: "none",
    wrapper: "classic",
    message: "감사합니다 💚",
    from: "수민",
    likes: 598,
    shares: 142,
  },
  {
    id: 8,
    rank: 8,
    chocolate: "milk",
    topping: "hearts",
    wrapper: "stars",
    message: "빼빼로데이 축하해요!",
    from: "다은",
    likes: 523,
    shares: 128,
  },
]

export function LeaderboardView() {
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null)
  const [userLikes, setUserLikes] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Load user's likes from localStorage
    const savedLikes = localStorage.getItem("peperoLikes")
    if (savedLikes) {
      setUserLikes(new Set(JSON.parse(savedLikes)))
    }
  }, [])

  const handleLike = (id: number) => {
    const newLikes = new Set(userLikes)
    if (newLikes.has(id)) {
      newLikes.delete(id)
    } else {
      newLikes.add(id)
    }
    setUserLikes(newLikes)
    localStorage.setItem("peperoLikes", JSON.stringify([...newLikes]))
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { emoji: "🥇", color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300" }
      case 2:
        return { emoji: "🥈", color: "bg-gray-400/20 text-gray-700 dark:text-gray-300" }
      case 3:
        return { emoji: "🥉", color: "bg-orange-500/20 text-orange-700 dark:text-orange-300" }
      default:
        return { emoji: `#${rank}`, color: "bg-primary/10 text-primary" }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="mr-2 h-4 w-4" />
            홈으로
          </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-primary flex items-center gap-3">
          <Trophy className="h-10 w-10" />
          리더보드
        </h1>
        <div className="w-24" />
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="text-4xl font-bold text-primary mb-2">{mockLeaderboard.length}</div>
          <div className="text-sm text-muted-foreground">인기 디자인</div>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-secondary/10 to-secondary/5">
          <div className="text-4xl font-bold text-secondary mb-2">
            {mockLeaderboard.reduce((sum, item) => sum + item.likes, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">총 좋아요</div>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-accent/10 to-accent/5">
          <div className="text-4xl font-bold text-accent mb-2">
            {mockLeaderboard.reduce((sum, item) => sum + item.shares, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">총 공유</div>
        </Card>
      </div>

      {/* Leaderboard Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {mockLeaderboard.map((entry) => {
          const chocolate = chocolateTypes.find((c) => c.id === entry.chocolate) || chocolateTypes[0]
          const topping = toppingOptions.find((t) => t.id === entry.topping) || toppingOptions[0]
          const wrapper = wrapperStyles.find((w) => w.id === entry.wrapper) || wrapperStyles[0]
          const rankBadge = getRankBadge(entry.rank)
          const isLiked = userLikes.has(entry.id)

          return (
            <Card
              key={entry.id}
              className={`p-6 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                entry.rank <= 3 ? "border-2 border-primary/20" : ""
              } ${selectedEntry === entry.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
            >
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <Badge className={`text-2xl px-4 py-2 ${rankBadge.color}`}>{rankBadge.emoji}</Badge>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold">{chocolate.name}</h3>
                      {topping.id !== "none" && (
                        <p className="text-sm text-muted-foreground">
                          {topping.emoji} {topping.name} · {wrapper.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message Preview */}
                  {entry.message && (
                    <p className="text-sm mb-3 leading-relaxed text-pretty line-clamp-2">"{entry.message}"</p>
                  )}

                  {/* Creator */}
                  <p className="text-sm text-muted-foreground mb-4">From. {entry.from}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(entry.id)
                      }}
                      className={`flex items-center gap-2 transition-colors ${
                        isLiked ? "text-secondary" : "text-muted-foreground hover:text-secondary"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                      <span className="font-semibold">{(entry.likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
                    </button>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-semibold">{entry.shares.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Expanded Preview */}
                  {selectedEntry === entry.id && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex justify-center">
                        <div className="scale-75 origin-top">
                          <PeperoPreview
                            chocolate={chocolate}
                            topping={topping}
                            wrapper={wrapper}
                            message={entry.message}
                            from={entry.from}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <Card className="p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <h3 className="text-2xl font-bold mb-4">나만의 디자인으로 도전하세요!</h3>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            창의적인 빼빼로를 만들어 리더보드에 올라보세요
          </p>
          <Link href="/maker">
            <Button size="lg">
              <Trophy className="mr-2 h-5 w-5" />
              빼빼로 만들기
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
