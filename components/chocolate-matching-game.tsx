"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Trophy, RefreshCw, Sparkles } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

type TileType = "sprinkle" | "almond" | "heart" | "cookie" | "strawberry" | "marshmallow"

interface Tile {
  id: string
  type: TileType
  matched: boolean
}

const tileEmojis: Record<TileType, string> = {
  sprinkle: "🌈",
  almond: "🥜",
  heart: "💗",
  cookie: "🍪",
  strawberry: "🍓",
  marshmallow: "☁️",
}

const specialToppings = [
  { id: "golden-sprinkle", name: "황금 스프링클", emoji: "✨", requiredScore: 100 },
  { id: "diamond-heart", name: "다이아 하트", emoji: "💎", requiredScore: 200 },
  { id: "rainbow-cookie", name: "무지개 쿠키", emoji: "🌈", requiredScore: 300 },
]

export function ChocolateMatchingGame() {
  const [grid, setGrid] = useState<Tile[][]>([])
  const [selectedTiles, setSelectedTiles] = useState<{ row: number; col: number }[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [unlockedToppings, setUnlockedToppings] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("pepero-high-score")
    if (saved) setHighScore(Number.parseInt(saved))

    const unlocked = localStorage.getItem("pepero-unlocked-toppings")
    if (unlocked) setUnlockedToppings(JSON.parse(unlocked))
  }, [])

  const generateGrid = useCallback((): Tile[][] => {
    const types: TileType[] = ["sprinkle", "almond", "heart", "cookie", "strawberry", "marshmallow"]
    const newGrid: Tile[][] = []

    for (let i = 0; i < 8; i++) {
      const row: Tile[] = []
      for (let j = 0; j < 8; j++) {
        const type = types[Math.floor(Math.random() * types.length)]
        row.push({
          id: `${i}-${j}`,
          type,
          matched: false,
        })
      }
      newGrid.push(row)
    }

    return newGrid
  }, [])

  const startGame = () => {
    setGrid(generateGrid())
    setScore(0)
    setTimeLeft(60)
    setIsPlaying(true)
    setSelectedTiles([])
  }

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false)
          // Check for high score
          if (score > highScore) {
            setHighScore(score)
            localStorage.setItem("pepero-high-score", score.toString())
          }
          // Check for unlocks
          checkUnlocks()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, timeLeft, score, highScore])

  const checkUnlocks = () => {
    const newUnlocks = specialToppings
      .filter((t) => score >= t.requiredScore && !unlockedToppings.includes(t.id))
      .map((t) => t.id)

    if (newUnlocks.length > 0) {
      const updated = [...unlockedToppings, ...newUnlocks]
      setUnlockedToppings(updated)
      localStorage.setItem("pepero-unlocked-toppings", JSON.stringify(updated))
    }
  }

  const handleTileClick = (row: number, col: number) => {
    if (!isPlaying || grid[row][col].matched) return

    const newSelected = [...selectedTiles, { row, col }]
    setSelectedTiles(newSelected)

    if (newSelected.length === 3) {
      // Check for match
      const types = newSelected.map(({ row, col }) => grid[row][col].type)
      if (types[0] === types[1] && types[1] === types[2]) {
        // Match found!
        const newGrid = [...grid]
        newSelected.forEach(({ row, col }) => {
          newGrid[row][col].matched = true
        })
        setGrid(newGrid)
        setScore((prev) => prev + 10)

        // Refill grid
        setTimeout(() => {
          const refilledGrid = refillGrid(newGrid)
          setGrid(refilledGrid)
        }, 300)
      }
      setSelectedTiles([])
    }
  }

  const refillGrid = (currentGrid: Tile[][]): Tile[][] => {
    const newGrid = [...currentGrid]
    const types: TileType[] = ["sprinkle", "almond", "heart", "cookie", "strawberry", "marshmallow"]

    for (let col = 0; col < 8; col++) {
      let emptyCount = 0
      for (let row = 7; row >= 0; row--) {
        if (newGrid[row][col].matched) {
          emptyCount++
        } else if (emptyCount > 0) {
          newGrid[row + emptyCount][col] = newGrid[row][col]
          newGrid[row][col] = {
            id: `${row}-${col}-new`,
            type: types[Math.floor(Math.random() * types.length)],
            matched: false,
          }
        }
      }
      // Fill top
      for (let i = 0; i < emptyCount; i++) {
        newGrid[i][col] = {
          id: `${i}-${col}-new`,
          type: types[Math.floor(Math.random() * types.length)],
          matched: false,
        }
      }
    }

    return newGrid
  }

  const isSelected = (row: number, col: number) => {
    return selectedTiles.some((t) => t.row === row && t.col === col)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="mr-2 h-4 w-4" />
            홈으로
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">초콜릿 매칭</h1>
        <div className="w-20" />
      </div>

      {/* Game stats */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">점수</p>
            <p className="text-2xl font-bold text-primary">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">남은 시간</p>
            <p className="text-2xl font-bold text-secondary">{timeLeft}s</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">최고 점수</p>
            <p className="text-2xl font-bold text-accent">{highScore}</p>
          </div>
        </div>

        <Progress value={(timeLeft / 60) * 100} className="h-2" />
      </Card>

      {/* Game board */}
      {!isPlaying && grid.length === 0 ? (
        <Card className="p-12 text-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="text-6xl mb-6">🎮</div>
          <h2 className="text-2xl font-bold mb-4">초콜릿 매칭 게임</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            같은 종류의 토핑 3개를 연결하여 점수를 획득하세요!
            <br />
            높은 점수를 달성하면 특별한 토핑을 해금할 수 있어요.
          </p>
          <Button size="lg" onClick={startGame}>
            <Sparkles className="mr-2 h-5 w-5" />
            게임 시작
          </Button>
        </Card>
      ) : (
        <>
          <Card className="p-4 mb-6">
            <div className="grid grid-cols-8 gap-1">
              {grid.map((row, rowIndex) =>
                row.map((tile, colIndex) => (
                  <button
                    key={tile.id}
                    onClick={() => handleTileClick(rowIndex, colIndex)}
                    disabled={!isPlaying || tile.matched}
                    className={`
                      aspect-square rounded-lg text-2xl flex items-center justify-center
                      transition-all duration-200 hover:scale-110
                      ${tile.matched ? "opacity-0 cursor-not-allowed" : "bg-card hover:bg-accent"}
                      ${isSelected(rowIndex, colIndex) ? "ring-2 ring-primary scale-110" : ""}
                      focus:outline-none focus:ring-2 focus:ring-ring
                    `}
                    aria-label={`${tileEmojis[tile.type]} 타일`}
                  >
                    {!tile.matched && tileEmojis[tile.type]}
                  </button>
                )),
              )}
            </div>
          </Card>

          {!isPlaying && timeLeft === 0 && (
            <Card className="p-8 text-center mb-6 bg-gradient-to-br from-secondary/20 to-accent/20">
              <div className="text-5xl mb-4">{score > highScore ? "🎉" : "⏰"}</div>
              <h3 className="text-2xl font-bold mb-2">{score > highScore ? "새로운 기록!" : "게임 종료"}</h3>
              <p className="text-xl mb-4">최종 점수: {score}점</p>
              <Button onClick={startGame}>
                <RefreshCw className="mr-2 h-4 w-4" />
                다시 도전
              </Button>
            </Card>
          )}
        </>
      )}

      {/* Special toppings unlock status */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          스페셜 토핑 해금
        </h3>
        <div className="space-y-3">
          {specialToppings.map((topping) => {
            const isUnlocked = unlockedToppings.includes(topping.id)
            return (
              <div
                key={topping.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isUnlocked ? "bg-accent/20" : "bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{isUnlocked ? topping.emoji : "🔒"}</span>
                  <div>
                    <p className={`font-medium ${isUnlocked ? "" : "text-muted-foreground"}`}>{topping.name}</p>
                    <p className="text-xs text-muted-foreground">{topping.requiredScore}점 필요</p>
                  </div>
                </div>
                {isUnlocked && (
                  <span className="text-xs font-semibold text-primary px-2 py-1 bg-primary/10 rounded-full">
                    해금됨
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
