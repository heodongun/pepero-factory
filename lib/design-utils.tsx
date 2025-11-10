import type { PeperoDesign } from "./design-schema"
import { validateDesign, chocolateTypes, toppingOptions, wrapperStyles } from "./design-schema"

// Encode design to base64url for sharing
export function encodeDesign(design: PeperoDesign): string {
  try {
    const compact = {
      c: design.coating,
      t: design.toppings.map((t) => ({
        ty: t.type,
        co: t.color,
        ct: t.count,
      })),
      w: {
        r: design.wrapper.ribbon,
        p: design.wrapper.pattern,
        s: design.wrapper.sticker ? 1 : 0,
      },
      m: design.message,
      f: design.from || "",
      b: design.bgmEnabled ? 1 : 0,
    }

    const json = JSON.stringify(compact)
    const base64 = btoa(json)
    // Make URL-safe
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
  } catch (error) {
    console.error("[v0] Error encoding design:", error)
    return ""
  }
}

// Decode base64url back to design object
export function decodeDesign(encoded: string): PeperoDesign | null {
  try {
    // Restore base64 format
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
    while (base64.length % 4) {
      base64 += "="
    }

    const json = atob(base64)
    const compact = JSON.parse(json)

    const design: PeperoDesign = {
      coating: compact.c,
      toppings: compact.t.map((t: any) => ({
        type: t.ty,
        color: t.co,
        count: t.ct,
      })),
      wrapper: {
        ribbon: compact.w.r,
        pattern: compact.w.p,
        sticker: compact.w.s === 1,
      },
      message: compact.m,
      from: compact.f,
      bgmEnabled: compact.b === 1,
    }

    return validateDesign(design) ? design : null
  } catch (error) {
    console.error("[v0] Error decoding design:", error)
    return null
  }
}

// Generate random Pepero design with creative naming
const adjectives = [
  "달콤한",
  "몽글",
  "진한",
  "부드러운",
  "향기로운",
  "반짝이는",
  "사랑스러운",
  "포근한",
  "Sweet",
  "Fluffy",
  "Rich",
  "Smooth",
  "Fragrant",
  "Sparkling",
  "Lovely",
  "Cozy",
]

const nouns = [
  "스노우",
  "드림",
  "크런치",
  "블리스",
  "하트",
  "키스",
  "위시",
  "클라우드",
  "Snow",
  "Dream",
  "Crunch",
  "Bliss",
  "Heart",
  "Kiss",
  "Wish",
  "Cloud",
]

export function generateRandomDesign(): PeperoDesign & { designName: string } {
  const chocolate = chocolateTypes[Math.floor(Math.random() * chocolateTypes.length)]
  const numToppings = Math.floor(Math.random() * 3) + 1 // 1-3 toppings
  const toppings = Array.from({ length: numToppings }, () => {
    const topping = toppingOptions[Math.floor(Math.random() * toppingOptions.length)]
    const color = topping.colors[Math.floor(Math.random() * topping.colors.length)]
    return {
      type: topping.id,
      color,
      count: Math.floor(Math.random() * 8) + 3, // 3-10 pieces
    }
  })

  const wrapper = wrapperStyles[Math.floor(Math.random() * wrapperStyles.length)]

  const messages = [
    "당신이 최고예요!",
    "오늘도 달콤하게!",
    "언제나 응원할게요",
    "행복이 가득하길",
    "사랑해요",
    "함께해서 행복해",
  ]

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const chocolateKeyword = chocolate.name.split(" ")[0]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const designName = `${adjective} ${chocolateKeyword} ${noun}`

  return {
    coating: chocolate.id,
    toppings,
    wrapper: {
      ribbon: wrapper.id,
      pattern: wrapper.id,
      sticker: Math.random() > 0.5,
    },
    message: messages[Math.floor(Math.random() * messages.length)],
    from: "",
    bgmEnabled: false,
    designName,
  }
}

// Generate date-based seed for fortune
export function seedByDate(): number {
  const now = new Date()
  const dateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// Sanitize user input to prevent XSS
export function sanitizeMessage(message: string): string {
  return message
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .slice(0, 120) // Max 120 characters
}

// Save design to localStorage
export function saveDesignToHistory(design: PeperoDesign): void {
  try {
    const history = JSON.parse(localStorage.getItem("pepero-history") || "[]")
    const newHistory = [
      {
        ...design,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      },
      ...history,
    ].slice(0, 10) // Keep only last 10

    localStorage.setItem("pepero-history", JSON.stringify(newHistory))
  } catch (error) {
    console.error("[v0] Error saving to history:", error)
  }
}

// Get design history
export function getDesignHistory(): PeperoDesign[] {
  try {
    return JSON.parse(localStorage.getItem("pepero-history") || "[]")
  } catch (error) {
    console.error("[v0] Error reading history:", error)
    return []
  }
}
