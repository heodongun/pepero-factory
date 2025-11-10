"use client"

import { useEffect, useRef } from "react"
import type { PeperoDesign, ToppingType } from "@/lib/design-schema"
import { chocolateTypes, toppingOptions } from "@/lib/design-schema"

interface PeperoPreview3DProps {
  design: PeperoDesign
}

export function PeperoPreview3D({ design }: PeperoPreview3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const chocolate = chocolateTypes.find((c) => c.id === design.coating)
    if (!chocolate) return

    const pixelRatio = window.devicePixelRatio || 1
    const width = 300
    const height = 400
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    drawScene(ctx, width, height, chocolate.color, chocolate.glossiness, design)
  }, [design])

  return (
    <div className="relative w-full">
      <canvas ref={canvasRef} width={300} height={400} className="mx-auto" style={{ maxWidth: "100%" }} />
    </div>
  )
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  chocolateColor: string,
  glossiness: number,
  design: PeperoDesign,
) {
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, width, height)

  const centerX = width / 2
  const centerY = height / 2
  const stickWidth = 46
  const stickHeight = 270
  const top = -stickHeight / 2

  drawStageShadow(ctx, centerX, centerY + stickHeight / 2 - 18, stickWidth * 2.1)

  ctx.save()
  ctx.translate(centerX, centerY)

  drawStickWithHandle(ctx, {
    stickWidth,
    stickHeight,
    chocolateColor,
    glossiness,
  })

  design.toppings.forEach((topping, idx) => {
    const isValid = toppingOptions.some((option) => option.id === topping.type)
    if (!isValid) return

    const total = Math.min(topping.count, 12)
    for (let i = 0; i < total; i++) {
      const progress = i / total
      const y = top + 30 + progress * (stickHeight - 60)
      const jitter = seededRandom(idx * 17 + i)
      const xOffset = Math.sin(idx + i * 1.2) * 6 + (jitter - 0.5) * 8
      const scale = 0.85 + jitter * 0.12
      const rotation = (jitter - 0.5) * Math.PI * 0.4

      ctx.save()
      ctx.translate(xOffset, y)
      ctx.scale(scale, scale)
      ctx.rotate(rotation)
      ctx.shadowColor = "rgba(0, 0, 0, 0.18)"
      ctx.shadowBlur = 3
      drawToppingShape(ctx, topping.type, topping.color, jitter)
      ctx.restore()
    }
  })

  ctx.restore()
}

function drawStickWithHandle(
  ctx: CanvasRenderingContext2D,
  {
    stickWidth,
    stickHeight,
    chocolateColor,
    glossiness,
  }: {
    stickWidth: number
    stickHeight: number
    chocolateColor: string
    glossiness: number
  },
) {
  const top = -stickHeight / 2
  const bottom = stickHeight / 2
  const coatingHeight = stickHeight * 0.72
  const coatingBottom = top + coatingHeight

  const baseGradient = ctx.createLinearGradient(0, coatingBottom - 10, 0, bottom)
  baseGradient.addColorStop(0, "#f8deb2")
  baseGradient.addColorStop(0.6, "#dca66b")
  baseGradient.addColorStop(1, "#b2763f")

  ctx.fillStyle = baseGradient
  ctx.beginPath()
  ctx.moveTo(-stickWidth / 2, bottom - 14)
  ctx.quadraticCurveTo(-stickWidth / 2, bottom + 6, 0, bottom)
  ctx.quadraticCurveTo(stickWidth / 2, bottom + 6, stickWidth / 2, bottom - 14)
  ctx.lineTo(stickWidth / 2, top + 12)
  ctx.quadraticCurveTo(stickWidth / 2, top - 10, 0, top - 14)
  ctx.quadraticCurveTo(-stickWidth / 2, top - 10, -stickWidth / 2, top + 12)
  ctx.closePath()
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(-stickWidth / 2, coatingBottom - 6)
  ctx.lineTo(-stickWidth / 2, top + 12)
  ctx.quadraticCurveTo(-stickWidth / 2, top - 10, 0, top - 14)
  ctx.quadraticCurveTo(stickWidth / 2, top - 10, stickWidth / 2, top + 12)
  ctx.lineTo(stickWidth / 2, coatingBottom - 6)
  ctx.quadraticCurveTo(stickWidth / 2, coatingBottom + 2, 0, coatingBottom + 6)
  ctx.quadraticCurveTo(-stickWidth / 2, coatingBottom + 2, -stickWidth / 2, coatingBottom - 6)
  ctx.closePath()

  const chocolateGradient = ctx.createLinearGradient(0, top, 0, coatingBottom + 4)
  chocolateGradient.addColorStop(0, adjustBrightness(chocolateColor, 1.2))
  chocolateGradient.addColorStop(0.5, chocolateColor)
  chocolateGradient.addColorStop(1, adjustBrightness(chocolateColor, 0.85))

  ctx.fillStyle = chocolateGradient
  ctx.fill()
  ctx.restore()

  ctx.strokeStyle = "rgba(255,255,255,0.18)"
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.save()
  ctx.globalCompositeOperation = "lighter"
  ctx.globalAlpha = 0.35
  ctx.fillStyle = "rgba(255,255,255,0.8)"
  ctx.beginPath()
  ctx.ellipse(0, top + 30, stickWidth * 0.35, 18, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.save()
  const shine = ctx.createLinearGradient(-stickWidth / 2, 0, stickWidth / 2, 0)
  shine.addColorStop(0, "rgba(255,255,255,0.15)")
  shine.addColorStop(0.25, `rgba(255,255,255,${glossiness * 0.4})`)
  shine.addColorStop(0.55, "rgba(255,255,255,0)")
  ctx.fillStyle = shine
  ctx.beginPath()
  ctx.roundRect?.(-stickWidth / 2 + 5, top + 24, 8, stickHeight - 48, 4)
  if (!ctx.roundRect) {
    ctx.rect(-stickWidth / 2 + 5, top + 24, 8, stickHeight - 48)
  }
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.fillStyle = adjustBrightness(chocolateColor, 0.65)
  for (let i = 0; i < 14; i++) {
    const x = -stickWidth / 2 + 8 + ((i * 13) % (stickWidth - 16))
    const y = top + 24 + ((i * 21) % (coatingHeight - 48))
    ctx.beginPath()
    ctx.arc(x, y, 0.8, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  drawHandleDetails(ctx, stickWidth, coatingBottom, bottom)
  drawCoatingSeam(ctx, stickWidth, coatingBottom, chocolateColor)
}

function drawStageShadow(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
  ctx.save()
  ctx.fillStyle = "rgba(15, 23, 42, 0.08)"
  ctx.beginPath()
  ctx.ellipse(x, y, width, width * 0.18, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawHandleDetails(ctx: CanvasRenderingContext2D, stickWidth: number, seamY: number, bottom: number) {
  ctx.save()
  ctx.strokeStyle = "rgba(120, 78, 28, 0.25)"
  ctx.lineWidth = 1
  for (let i = 0; i < 6; i++) {
    const y = seamY + 10 + i * 12
    ctx.beginPath()
    ctx.moveTo(-stickWidth / 3, y)
    ctx.lineTo(stickWidth / 3, y + 3)
    ctx.stroke()
  }

  ctx.fillStyle = "rgba(120, 78, 28, 0.25)"
  for (let i = 0; i < 12; i++) {
    const x = -stickWidth / 3 + (i * 11) % (stickWidth * 0.6)
    const y = seamY + 14 + (i * 17) % (bottom - seamY - 10)
    ctx.beginPath()
    ctx.arc(x, y, 1.1, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawCoatingSeam(ctx: CanvasRenderingContext2D, stickWidth: number, seamY: number, chocolateColor: string) {
  ctx.save()
  const gradient = ctx.createLinearGradient(0, seamY - 18, 0, seamY + 28)
  gradient.addColorStop(0, "rgba(255,255,255,0)")
  gradient.addColorStop(0.25, adjustBrightness(chocolateColor, 0.85))
  gradient.addColorStop(0.6, "rgba(203, 134, 68, 0.6)")
  gradient.addColorStop(1, "rgba(249, 214, 162, 0.35)")

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(-stickWidth / 2 + 4, seamY - 10)
  ctx.quadraticCurveTo(0, seamY + 6, stickWidth / 2 - 4, seamY - 10)
  ctx.lineTo(stickWidth / 2 - 4, seamY + 20)
  ctx.quadraticCurveTo(0, seamY + 32, -stickWidth / 2 + 4, seamY + 20)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)"
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.moveTo(-stickWidth / 2 + 8, seamY - 4)
  ctx.quadraticCurveTo(0, seamY + 4, stickWidth / 2 - 8, seamY - 4)
  ctx.stroke()
  ctx.restore()
}

function drawToppingShape(ctx: CanvasRenderingContext2D, type: ToppingType, color: string, seed: number) {
  switch (type) {
    case "sprinkle": {
      ctx.fillStyle = color
      drawRoundedRect(ctx, -6, -1.5, 12, 3, 1.5)
      ctx.fill()
      ctx.strokeStyle = "rgba(255,255,255,0.4)"
      ctx.lineWidth = 0.5
      ctx.stroke()
      break
    }
    case "almond": {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.ellipse(0, 0, 5.5, 9, Math.PI / 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "rgba(0,0,0,0.2)"
      ctx.lineWidth = 1
      ctx.stroke()
      break
    }
    case "cookie": {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(0, 0, 6.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "rgba(20, 11, 0, 0.25)"
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        const angle = seed * Math.PI * (i + 1)
        ctx.arc(Math.cos(angle) * 3, Math.sin(angle) * 3, 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case "strawberry": {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(0, 6)
      ctx.bezierCurveTo(-6, 2, -4, -6, 0, -4)
      ctx.bezierCurveTo(4, -6, 6, 2, 0, 6)
      ctx.fill()
      ctx.fillStyle = "rgba(255,255,255,0.6)"
      ctx.beginPath()
      ctx.arc(0, -4, 2, 0, Math.PI)
      ctx.fill()
      break
    }
    case "heart": {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(0, 4)
      ctx.bezierCurveTo(-5, -2, -3, -8, 0, -4)
      ctx.bezierCurveTo(3, -8, 5, -2, 0, 4)
      ctx.fill()
      break
    }
    case "marshmallow": {
      ctx.fillStyle = color
      drawRoundedRect(ctx, -6, -4, 12, 8, 4)
      ctx.fill()
      ctx.strokeStyle = "rgba(0,0,0,0.1)"
      ctx.lineWidth = 0.8
      ctx.stroke()
      break
    }
    default: {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(0, 0, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Helper to adjust brightness
function adjustBrightness(color: string, factor: number): string {
  const hex = color.replace("#", "")
  const r = Math.min(255, Math.floor(Number.parseInt(hex.substring(0, 2), 16) * factor))
  const g = Math.min(255, Math.floor(Number.parseInt(hex.substring(2, 4), 16) * factor))
  const b = Math.min(255, Math.floor(Number.parseInt(hex.substring(4, 6), 16) * factor))
  return `rgb(${r}, ${g}, ${b})`
}

function seededRandom(seed: number) {
  return (Math.sin(seed * 12345.678) + 1) / 2
}
