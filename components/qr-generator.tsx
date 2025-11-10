"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download } from "lucide-react"
import QRCode from "qrcode"

interface QRGeneratorProps {
  url: string
}

export function QRGenerator({ url }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !url) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    QRCode.toCanvas(
      canvas,
      url,
      {
        width: 200,
        margin: 1,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      },
      (error) => {
        if (error) {
          console.error("[v0] Failed to render QR:", error)
          setQrError("QR 코드를 불러오지 못했어요. 링크를 복사해 공유해 보세요.")
        } else {
          setQrError(null)
        }
      },
    )
  }, [url])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("[v0] Failed to copy:", error)
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return
      const urlObject = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = urlObject
      link.download = "pepero-qr.png"
      link.click()
      URL.revokeObjectURL(urlObject)
    })
  }

  return (
    <Card className="p-6 text-center">
      <h3 className="text-xl font-bold mb-4">QR 코드로 공유</h3>
      <div className="flex justify-center mb-4">
        <canvas ref={canvasRef} width={200} height={200} className="border-4 border-border rounded-lg bg-background" />
      </div>
      {qrError ? (
        <p className="text-sm text-destructive mb-2">{qrError}</p>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">QR 코드를 스캔하여 선물을 확인하세요</p>
      )}
      <div className="flex flex-col gap-2">
        <Button onClick={handleCopy} variant="outline" className="w-full bg-transparent" disabled={!url}>
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            복사됨!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            링크 복사
          </>
        )}
        </Button>
        <Button onClick={handleDownload} className="w-full" variant="secondary" disabled={!url}>
          <Download className="mr-2 h-4 w-4" />
          QR 이미지 저장
        </Button>
      </div>
    </Card>
  )
}
