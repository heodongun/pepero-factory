"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, History, Trash2 } from "lucide-react"
import { generateRandomDesign, getDesignHistory, saveDesignToHistory } from "@/lib/design-utils"
import type { PeperoDesign } from "@/lib/design-schema"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface RandomizerPanelProps {
  onApply: (design: PeperoDesign) => void
}

export function RandomizerPanel({ onApply }: RandomizerPanelProps) {
  const [history, setHistory] = useState<(PeperoDesign & { designName?: string; id?: string })[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setHistory(getDesignHistory())
  }, [])

  const handleGenerate = () => {
    setIsGenerating(true)

    // Animate generation
    setTimeout(() => {
      const randomDesign = generateRandomDesign()
      saveDesignToHistory(randomDesign)
      setHistory(getDesignHistory())
      onApply(randomDesign)
      setIsGenerating(false)
    }, 300)
  }

  const handleApplyFromHistory = (design: PeperoDesign) => {
    onApply(design)
  }

  const handleClearHistory = () => {
    if (confirm("정말로 히스토리를 모두 삭제하시겠습니까?")) {
      localStorage.removeItem("pepero-history")
      setHistory([])
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          랜덤 생성기
        </h3>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearHistory} aria-label="히스토리 지우기">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">마법처럼 완벽한 조합을 만들어드려요!</p>

      <Button onClick={handleGenerate} disabled={isGenerating} className="w-full mb-6" size="lg">
        {isGenerating ? (
          <>
            <span className="animate-spin mr-2">⚡</span>
            생성 중...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            랜덤 생성
          </>
        )}
      </Button>

      {history.length > 0 && (
        <>
          <Separator className="my-4" />

          <div className="flex items-center gap-2 mb-3">
            <History className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold">최근 생성 기록</h4>
            <span className="text-xs text-muted-foreground">({history.length}/10)</span>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {history.map((design, index) => (
                <Card
                  key={design.id || index}
                  className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleApplyFromHistory(design)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleApplyFromHistory(design)
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{(design as any).designName || "Custom Design"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {design.toppings.length}종 토핑 • {design.wrapper.pattern} 포장
                      </p>
                      {design.createdAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(design.createdAt).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      입히기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </Card>
  )
}
