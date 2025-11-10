"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { PeperoPreview3D } from "@/components/pepero-preview-3d"
import { FortuneCard } from "@/components/fortune-card"
import { RandomizerPanel } from "@/components/randomizer-panel"
import { GiftSharePanel } from "@/components/gift-share-panel"
import { ToppingSticker } from "@/components/topping-sticker"
import { WrapperCard } from "@/components/wrapper-card"
import { chocolateTypes, toppingOptions, wrapperStyles } from "@/lib/design-schema"
import { getTodayFortune } from "@/lib/fortune-utils"
import { generateRandomDesign, saveDesignToHistory } from "@/lib/design-utils"
import type { PeperoDesign } from "@/lib/design-schema"

export function PeperoMaker() {
  const searchParams = useSearchParams()
  const isRandom = searchParams.get("random") === "true"

  const [design, setDesign] = useState<PeperoDesign>({
    coating: "milk",
    toppings: [],
    wrapper: { ribbon: "plain", pattern: "plain", sticker: false },
    message: "",
    from: "",
    bgmEnabled: false,
  })

  const [showFortune, setShowFortune] = useState(false)
  const [locale, setLocale] = useState<"ko" | "en">("ko")
  const [activeTab, setActiveTab] = useState("design")

  useEffect(() => {
    if (isRandom) {
      const random = generateRandomDesign()
      setDesign(random)
      setShowFortune(true)
    }
  }, [isRandom])

  const handleApplyDesign = (newDesign: PeperoDesign) => {
    setDesign(newDesign)
  }

  const handleAddTopping = (toppingType: string, color: string) => {
    setDesign((prev) => {
      const existingIndex = prev.toppings.findIndex((topping) => topping.type === toppingType)

      // Update color when the topping already exists
      if (existingIndex > -1) {
        const updated = [...prev.toppings]
        updated[existingIndex] = {
          ...updated[existingIndex],
          color,
        }
        return { ...prev, toppings: updated }
      }

      // Prevent adding more than one instance per topping type
      if (prev.toppings.length >= toppingOptions.length) {
        return prev
      }

      return {
        ...prev,
        toppings: [
          ...prev.toppings,
          {
            type: toppingType as any,
            color,
            count: Math.floor(Math.random() * 5) + 3,
          },
        ],
      }
    })
  }

  const handleRemoveTopping = (index: number) => {
    setDesign((prev) => ({
      ...prev,
      toppings: prev.toppings.filter((_, i) => i !== index),
    }))
  }

  const handleSave = () => {
    saveDesignToHistory(design)
    setShowFortune(true)
  }

  const chocolate = chocolateTypes.find((c) => c.id === design.coating)

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
        <h1 className="text-4xl md:text-5xl font-bold text-primary">빼빼로 메이커</h1>
        <div className="flex gap-2">
          <Link href="/game">
            <Button variant="ghost" size="sm">
              <Gamepad2 className="mr-2 h-4 w-4" />
              게임
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
            aria-label="언어 변경"
          >
            {locale === "ko" ? "EN" : "KO"}
          </Button>
        </div>
      </div>

      {/* Fortune display */}
      {showFortune && (
        <div className="mb-8">
          <FortuneCard fortune={getTodayFortune(locale)} onClose={() => setShowFortune(false)} locale={locale} />
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Main design area */}
        <div className="space-y-6">
          {/* Wrapper card preview */}
          {chocolate && <WrapperCard wrapper={design.wrapper} chocolateName={chocolate.name} />}

          {/* 3D Preview */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
            <h2 className="text-2xl font-bold mb-6 text-center">미리보기</h2>
            <PeperoPreview3D design={design} />

            {/* Topping stickers */}
            {design.toppings.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {design.toppings.map((topping, index) => (
                  <ToppingSticker key={index} topping={topping} onRemove={() => handleRemoveTopping(index)} />
                ))}
              </div>
            )}
          </Card>

          {/* Customization tabs */}
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="design">디자인</TabsTrigger>
                <TabsTrigger value="toppings">토핑</TabsTrigger>
                <TabsTrigger value="message">메시지</TabsTrigger>
                <TabsTrigger value="options">옵션</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-6">
                {/* Chocolate selection */}
                <div>
                  <h3 className="text-lg font-bold mb-3">초콜릿 코팅</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {chocolateTypes.map((choco) => (
                      <button
                        key={choco.id}
                        onClick={() => setDesign((prev) => ({ ...prev, coating: choco.id }))}
                        className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                          design.coating === choco.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: choco.color }} />
                        <p className="text-sm font-medium text-center">{choco.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wrapper selection */}
                <div>
                  <h3 className="text-lg font-bold mb-3">포장지</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {wrapperStyles.map((wrapper) => (
                      <button
                        key={wrapper.id}
                        onClick={() =>
                          setDesign((prev) => ({
                            ...prev,
                            wrapper: { ...prev.wrapper, pattern: wrapper.id, ribbon: wrapper.id },
                          }))
                        }
                        className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                          design.wrapper.pattern === wrapper.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="text-sm font-medium">{wrapper.name}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="sticker"
                      checked={design.wrapper.sticker}
                      onCheckedChange={(checked) =>
                        setDesign((prev) => ({
                          ...prev,
                          wrapper: { ...prev.wrapper, sticker: checked as boolean },
                        }))
                      }
                    />
                    <Label htmlFor="sticker" className="cursor-pointer">
                      스페셜 에디션 스티커 추가
                    </Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="toppings" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  토핑을 클릭하여 추가하세요 (종류별로 한 번씩 선택 가능하며, 색상은 언제든 변경할 수 있어요)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {toppingOptions.map((topping) => (
                    <div key={topping.id} className="space-y-2">
                      <p className="text-sm font-medium">
                        {topping.emoji} {topping.name}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {topping.colors.map((color) => {
                          const selectedTopping = design.toppings.find((t) => t.type === topping.id)
                          const isSelectedColor = selectedTopping?.color === color
                          const disableSelection =
                            design.toppings.length >= toppingOptions.length && !selectedTopping

                          return (
                            <button
                              key={color}
                              onClick={() => handleAddTopping(topping.id, color)}
                              className={`w-10 h-10 rounded-full border-2 transition-transform ${
                                isSelectedColor
                                  ? "border-primary ring-2 ring-primary/50 scale-105"
                                  : "border-border hover:scale-110"
                              }`}
                              style={{ backgroundColor: color }}
                              aria-label={`${topping.name} ${color} 추가`}
                              disabled={disableSelection}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="message" className="space-y-4">
                <div>
                  <Label htmlFor="message" className="text-lg font-bold">
                    달콤한 메시지
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="받는 사람에게 전할 메시지를 작성하세요..."
                    value={design.message}
                    onChange={(e) => setDesign((prev) => ({ ...prev, message: e.target.value }))}
                    className="min-h-32 resize-none mt-3"
                    maxLength={120}
                  />
                  <p className="text-sm text-muted-foreground mt-2 text-right">{design.message.length}/120</p>
                </div>

                <div>
                  <Label htmlFor="from" className="text-lg font-bold">
                    보내는 사람
                  </Label>
                  <Input
                    id="from"
                    placeholder="당신의 이름 (선택사항)"
                    value={design.from}
                    onChange={(e) => setDesign((prev) => ({ ...prev, from: e.target.value }))}
                    maxLength={20}
                    className="mt-3"
                  />
                </div>
              </TabsContent>

              <TabsContent value="options" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bgm"
                    checked={design.bgmEnabled}
                    onCheckedChange={(checked) => setDesign((prev) => ({ ...prev, bgmEnabled: checked as boolean }))}
                  />
                  <Label htmlFor="bgm" className="cursor-pointer">
                    선물 수신 시 배경음악 재생
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">브라우저 설정에 따라 자동 재생이 제한될 수 있어요</p>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Randomizer */}
          <RandomizerPanel onApply={handleApplyDesign} />

          {/* Share panel */}
          <GiftSharePanel design={design} />

          {/* Save button */}
          <Button onClick={handleSave} className="w-full" size="lg">
            저장하고 운세 보기
          </Button>
        </div>
      </div>
    </div>
  )
}
