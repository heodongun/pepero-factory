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
  const [shareUrl, setShareUrl] = useState("")

  const generateShareUrl = () => {
    if (typeof window === "undefined") return ""
    const encoded = encodeDesign(design)
    if (!encoded) return ""
    const url = `${window.location.origin}/gift/${encoded}`
    setShareUrl(url)
    return url
  }

  const handleCopyLink = async () => {
    try {
      const url = generateShareUrl()
      if (!url) return
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("[PeperoFactory] Failed to copy link:", error)
    }
  }

  const handleNativeShare = async () => {
    const url = generateShareUrl()
    if (!url) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: "빼빼로 선물이 도착했어요!",
          text: design.message || "특별한 빼빼로를 만들었어요!",
          url,
        })
      } catch (error) {
        console.error("[PeperoFactory] Failed to share:", error)
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
          <div className="p-4 bg-muted rounded-lg break-all text-sm">
            {shareUrl || "아직 공유 링크가 없어요. 아래 버튼을 누르면 즉시 생성돼요."}
          </div>

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
          {shareUrl ? (
            <QRGenerator url={shareUrl} />
          ) : (
            <div className="text-center space-y-4 py-6">
              <p className="text-sm text-muted-foreground">링크를 생성하면 동일한 정보로 QR 코드도 만들 수 있어요.</p>
              <Button onClick={() => generateShareUrl()}>
                <QrCode className="mr-2 h-4 w-4" />
                링크 생성하고 QR 보기
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
