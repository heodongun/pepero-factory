"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Reaction {
  emoji: string
  label: string
  count: number
}

const reactionOptions: Reaction[] = [
  { emoji: "❤️", label: "사랑해요", count: 0 },
  { emoji: "😋", label: "맛있어요", count: 0 },
  { emoji: "🥹", label: "감동이에요", count: 0 },
  { emoji: "🌸", label: "예뻐요", count: 0 },
  { emoji: "✨", label: "멋져요", count: 0 },
]

interface EmojiReactionsProps {
  giftId: string
}

export function EmojiReactions({ giftId }: EmojiReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>(reactionOptions)
  const [userReaction, setUserReaction] = useState<string | null>(null)

  useEffect(() => {
    // Load reactions from localStorage (in production, use API)
    const savedReactions = localStorage.getItem(`reactions-${giftId}`)
    if (savedReactions) {
      setReactions(JSON.parse(savedReactions))
    }

    const savedUserReaction = localStorage.getItem(`user-reaction-${giftId}`)
    if (savedUserReaction) {
      setUserReaction(savedUserReaction)
    }
  }, [giftId])

  const handleReaction = (emoji: string) => {
    const newReactions = reactions.map((r) => {
      if (r.emoji === emoji) {
        return { ...r, count: userReaction === emoji ? r.count - 1 : r.count + 1 }
      }
      if (userReaction && r.emoji === userReaction) {
        return { ...r, count: Math.max(0, r.count - 1) }
      }
      return r
    })

    setReactions(newReactions)

    // Toggle reaction
    const newUserReaction = userReaction === emoji ? null : emoji
    setUserReaction(newUserReaction)

    // Save to localStorage
    localStorage.setItem(`reactions-${giftId}`, JSON.stringify(newReactions))
    if (newUserReaction) {
      localStorage.setItem(`user-reaction-${giftId}`, newUserReaction)
    } else {
      localStorage.removeItem(`user-reaction-${giftId}`)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">이 선물은 어떠신가요?</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {reactions.map((reaction) => (
          <Button
            key={reaction.emoji}
            variant={userReaction === reaction.emoji ? "default" : "outline"}
            size="lg"
            onClick={() => handleReaction(reaction.emoji)}
            className="flex flex-col items-center gap-1 h-auto py-3 px-4 min-w-[80px] hover:scale-110 transition-transform"
            aria-label={`${reaction.label} 반응 ${reaction.count}개`}
          >
            <span className="text-2xl">{reaction.emoji}</span>
            <span className="text-xs">{reaction.label}</span>
            {reaction.count > 0 && (
              <span className="text-xs font-bold text-muted-foreground mt-1">{reaction.count}</span>
            )}
          </Button>
        ))}
      </div>
    </Card>
  )
}
