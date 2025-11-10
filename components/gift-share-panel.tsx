"use client"

import { useEffect, useState } from "react"
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

const ENV_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
const PRODUCTION_BASE_URL = "https://pepero-factory.pages.dev"
const CLOUDFLARE_PREVIEW_PATTERN = /^https?:\/\/[0-9a-f-]+\.pepero-factory\.pages\.dev$/i

export function GiftSharePanel({ design }: GiftSharePanelProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true)
    }
  }, [])

  const getShareBaseUrl = () => {
    if (ENV_SITE_URL) return ENV_SITE_URL
    if (typeof window === "undefined") return PRODUCTION_BASE_URL

    const origin = window.location.origin
    const isLocalhost = origin.includes("localhost") || origin.includes("127.0.0.1")

    if (isLocalhost) return origin

    if (CLOUDFLARE_PREVIEW_PATTERN.test(origin)) {
      return PRODUCTION_BASE_URL
    }

    return origin
  }

  const generateShareUrl = () => {
    if (typeof window === "undefined") return ""
    const encoded = encodeDesign(design)
    if (!encoded) return ""
    const baseUrl = getShareBaseUrl()
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
    const url = `${normalizedBase}/gift/${encodeURIComponent(encoded)}`
    setShareUrl(url)
    return url
  }

  const copyToClipboard = async (text: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      }

      if (typeof document === "undefined") return false

      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.setAttribute("readonly", "")
      textarea.style.position = "absolute"
      textarea.style.left = "-9999px"
      document.body.appendChild(textarea)
      textarea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textarea)
      return successful
    } catch (error) {
      console.error("[PeperoFactory] Clipboard fallback failed:", error)
      return false
    }
  }

  const handleCopyLink = async () => {
    try {
      const url = generateShareUrl()
      if (!url) return
      const success = await copyToClipboard(url)
      if (!success) {
        alert("링크를 자동으로 복사할 수 없었어요. 직접 드래그해서 복사해 주세요.")
        return
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("[PeperoFactory] Failed to copy link:", error)
      alert("링크 복사 중 문제가 발생했어요. 다시 시도해 주세요.")
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

            {canNativeShare && (
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
