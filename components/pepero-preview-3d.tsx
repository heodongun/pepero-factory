"use client"

import { useEffect, useRef, useState } from "react"
import type { PeperoDesign, ToppingType } from "@/lib/design-schema"
import { chocolateTypes, toppingOptions } from "@/lib/design-schema"

interface PeperoPreview3DProps {
  design: PeperoDesign
}

export function PeperoPreview3D({ design }: PeperoPreview3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const chocolate = chocolateTypes.find((c) => c.id === design.coating)
    if (!chocolate) return

    let rotation = 0
    let time = 0

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      time += 0.01

      // Draw Pepero stick with 3D effect
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const stickWidth = 44
      const stickHeight = 260
      const coatingHeight = stickHeight * 0.72

      drawBackdrop(ctx, canvas.width, canvas.height, chocolate.color)
      drawAtmosphere(ctx, canvas.width, canvas.height, time)
      drawStageShadow(ctx, centerX, centerY + stickHeight / 2 - 20, stickWidth * 2)

      // Apply slow rotation
      if (isAnimating) {
        rotation += 0.002
      }

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      // Draw shadow
      ctx.shadowColor = "rgba(15, 23, 42, 0.35)"
      ctx.shadowBlur = 28
      ctx.shadowOffsetX = 4
      ctx.shadowOffsetY = 6

      drawBiscuit(ctx, stickWidth, stickHeight, coatingHeight)
      drawChocolateLayer(ctx, {
        stickWidth,
        stickHeight,
        coatingHeight,
        chocolateColor: chocolate.color,
        glossiness: chocolate.glossiness,
        time,
      })

      // Draw toppings with physics-inspired placement
      design.toppings.forEach((topping, idx) => {
        const isValidTopping = toppingOptions.some((t) => t.id === topping.type)
        if (!isValidTopping) return

        for (let i = 0; i < Math.min(topping.count, 12); i++) {
          const angle = (i / topping.count) * Math.PI * 2 + idx
          const yPos = -stickHeight / 2 + 20 + (i / topping.count) * coatingHeight * 0.8
          const offsetSeed = seededRandom(idx * 10 + i)
          const xOffset = Math.sin(angle + time) * 6 + (offsetSeed - 0.5) * 10
          const scale = 0.8 + Math.sin(time + i) * 0.1
          const rotation = (offsetSeed - 0.5) * Math.PI

          ctx.save()
          ctx.translate(xOffset, yPos)
          ctx.scale(scale, scale)
          ctx.rotate(rotation)
          ctx.shadowColor = "rgba(0, 0, 0, 0.35)"
          ctx.shadowBlur = 4
          drawToppingShape(ctx, topping.type, topping.color, offsetSeed)
          ctx.restore()
        }
      })

      ctx.restore()

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Check for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) {
      setIsAnimating(false)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [design, isAnimating])

  return (
    <div className="relative w-full">
      <canvas ref={canvasRef} width={300} height={400} className="mx-auto" style={{ maxWidth: "100%" }} />
    </div>
  )
}

// Helper to adjust brightness
function adjustBrightness(color: string, factor: number): string {
  const hex = color.replace("#", "")
  const r = Math.min(255, Math.floor(Number.parseInt(hex.substr(0, 2), 16) * factor))
  const g = Math.min(255, Math.floor(Number.parseInt(hex.substr(2, 2), 16) * factor))
  const b = Math.min(255, Math.floor(Number.parseInt(hex.substr(4, 2), 16) * factor))
  return `rgb(${r}, ${g}, ${b})`
}

function seededRandom(seed: number) {
  return (Math.sin(seed * 12345.678) + 1) / 2
}

function drawBiscuit(
  ctx: CanvasRenderingContext2D,
  stickWidth: number,
  stickHeight: number,
  coatingHeight: number,
) {
  const coatingBottom = coatingHeight - stickHeight / 2
  const biscuitGradient = ctx.createLinearGradient(0, coatingBottom, 0, stickHeight / 2)
  biscuitGradient.addColorStop(0, "#F5DEB3")
  biscuitGradient.addColorStop(0.4, "#E0BA7C")
  biscuitGradient.addColorStop(1, "#CC9A54")

  ctx.fillStyle = biscuitGradient
  ctx.beginPath()
  ctx.moveTo(-stickWidth / 2, coatingBottom)
  ctx.lineTo(-stickWidth / 2, stickHeight / 2 - 15)
  ctx.quadraticCurveTo(0, stickHeight / 2, stickWidth / 2, stickHeight / 2 - 15)
  ctx.lineTo(stickWidth / 2, coatingBottom)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawChocolateLayer(
  ctx: CanvasRenderingContext2D,
  {
    stickWidth,
    stickHeight,
    coatingHeight,
    chocolateColor,
    glossiness,
    time,
  }: {
    stickWidth: number
    stickHeight: number
    coatingHeight: number
    chocolateColor: string
    glossiness: number
    time: number
  },
) {
  const top = -stickHeight / 2
  const bottom = top + coatingHeight

  const gradient = ctx.createLinearGradient(0, top, 0, bottom)
  gradient.addColorStop(0, adjustBrightness(chocolateColor, 1.15))
  gradient.addColorStop(0.5, chocolateColor)
  gradient.addColorStop(1, adjustBrightness(chocolateColor, 0.85))

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(-stickWidth / 2, bottom)
  ctx.lineTo(-stickWidth / 2, top + 12)
  ctx.quadraticCurveTo(-stickWidth / 2, top - 12, -stickWidth / 3, top - 14)
  ctx.quadraticCurveTo(0, top - 18, stickWidth / 3, top - 14)
  ctx.quadraticCurveTo(stickWidth / 2, top - 12, stickWidth / 2, top + 12)
  ctx.lineTo(stickWidth / 2, bottom - 8)
  ctx.quadraticCurveTo(0, bottom + 16, -stickWidth / 2, bottom - 8)
  ctx.closePath()
  ctx.fill()

  // rim glow
  ctx.strokeStyle = "rgba(255,255,255,0.15)"
  ctx.lineWidth = 1
  ctx.stroke()

  // chocolate drips for a freshly dipped look
  ctx.fillStyle = adjustBrightness(chocolateColor, 0.9)
  ctx.beginPath()
  ctx.moveTo(-stickWidth / 3, top + 6)
  ctx.quadraticCurveTo(-stickWidth / 4, top + 42, -stickWidth / 5, top + 44)
  ctx.quadraticCurveTo(-stickWidth / 5, top + 28, -stickWidth / 4, top + 14)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(stickWidth / 4, top + 8)
  ctx.quadraticCurveTo(stickWidth / 5, top + 46, stickWidth / 6, top + 48)
  ctx.quadraticCurveTo(stickWidth / 6, top + 30, stickWidth / 5, top + 16)
  ctx.closePath()
  ctx.fill()

  // subtle texture lines
  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.strokeStyle = adjustBrightness(chocolateColor, 1.3)
  for (let i = -stickWidth / 2 + 4; i < stickWidth / 2 - 4; i += 6) {
    ctx.beginPath()
    ctx.moveTo(i, top + 10)
    ctx.quadraticCurveTo(i + stickWidth * 0.03, top + coatingHeight / 2, i, bottom - 16)
    ctx.stroke()
  }
  ctx.restore()

  // meniscus highlight
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + Math.sin(time * 2) * 0.05})`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-stickWidth / 2 + 6, top)
  ctx.quadraticCurveTo(0, top - 10, stickWidth / 2 - 6, top)
  ctx.stroke()

  // glossy highlight
  const highlightGradient = ctx.createLinearGradient(-stickWidth / 2, top, stickWidth / 2, top)
  highlightGradient.addColorStop(0, "rgba(255,255,255,0)")
  highlightGradient.addColorStop(0.4, `rgba(255,255,255,${glossiness * 0.35})`)
  highlightGradient.addColorStop(0.6, `rgba(255,255,255,${glossiness * 0.45})`)
  highlightGradient.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = highlightGradient
  ctx.fillRect(-stickWidth / 2, top + 8, stickWidth, coatingHeight * 0.5)

  ctx.save()
  ctx.globalCompositeOperation = "lighter"
  ctx.globalAlpha = 0.12
  ctx.fillStyle = "#ffffff"
  ctx.beginPath()
  ctx.ellipse(0, top + coatingHeight * 0.25, stickWidth * 0.35, coatingHeight * 0.25, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number, chocolateColor: string) {
  const gradient = ctx.createRadialGradient(width / 2, height * 0.35, 60, width / 2, height / 2, height * 0.7)
  gradient.addColorStop(0, adjustBrightness(chocolateColor, 1.5))
  gradient.addColorStop(0.4, "#fdf6f0")
  gradient.addColorStop(1, "#f1f5f9")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function drawAtmosphere(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.fillStyle = "#94a3b8"

  for (let i = 0; i < 12; i++) {
    const flicker = Math.sin(time * 2 + i) * 0.5 + 0.5
    const x = ((i * 97) % width) + Math.sin(time + i) * 10
    const y = ((i * 53) % (height / 1.2)) + Math.cos(time * 0.9 + i) * 10
    ctx.beginPath()
    ctx.arc(x, y, 2 + flicker * 2, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

function drawStageShadow(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
  ctx.save()
  ctx.fillStyle = "rgba(15, 23, 42, 0.18)"
  ctx.beginPath()
  ctx.ellipse(x, y, width, width * 0.18, 0, 0, Math.PI * 2)
  ctx.fill()
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
        ctx.arc(Math.cos(angle) * 3, Math.sin(angle) * 3, 1.5, 0, Math.PI * 2)
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
