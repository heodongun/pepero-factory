"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRGenerator } from "@/components/qr-generator"
import { Share2, LinkIcon, QrCode, Check } from "lucide-react"
import { encodeDesign } from "@/lib/design-utils"
import type { PeperoDesign } from "@/lib/design-schema"

interface GiftSharePanelProps {
  design: PeperoDesign
}

export function GiftSharePanel({ design }: GiftSharePanelProps) {
  const [copied, setCopied] = useState(false)
  const [shareMode, setShareMode] = useState<"inline" | "short">("inline")

  const generateShareUrl = () => {
    const encoded = encodeDesign(design)
    if (!encoded) return ""

    if (shareMode === "short") {
      // In production, this would hit an API to generate a short code
      // For now, use inline mode
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      return `${baseUrl}/gift/${encoded}`
    }

    // Inline mode - full payload in URL
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    return `${baseUrl}/gift/${encoded}`
  }

  const shareUrl = generateShareUrl()

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("[v0] Failed to copy link:", error)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "빼빼로 선물이 도착했어요!",
          text: design.message || "특별한 빼빼로를 만들었어요!",
          url: shareUrl,
        })
      } catch (error) {
        console.error("[v0] Failed to share:", error)
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Share2 className="h-5 w-5 text-primary" />
        선물 공유하기
      </h3>

      <Tabs defaultValue="link" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="link">
            <LinkIcon className="h-4 w-4 mr-2" />
            링크
          </TabsTrigger>
          <TabsTrigger value="qr">
            <QrCode className="h-4 w-4 mr-2" />
            QR 코드
          </TabsTrigger>
        </TabsList>

        <TabsContent value="link" className="space-y-4">
          <div className="p-4 bg-muted rounded-lg break-all text-sm">{shareUrl}</div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleCopyLink} className="w-full">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  복사됨!
                </>
              ) : (
                <>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  링크 복사
                </>
              )}
            </Button>

            {typeof navigator !== "undefined" && navigator.share && (
              <Button onClick={handleNativeShare} variant="secondary" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                공유하기
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            링크를 통해 누구나 당신의 빼빼로 선물을 받을 수 있어요
          </p>
        </TabsContent>

        <TabsContent value="qr">
          <QRGenerator url={shareUrl} />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
