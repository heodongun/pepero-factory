import { seedByDate } from "./design-utils"

export interface Fortune {
  sweetness: number // 0-100
  message: string
  messageEn: string
  emoji: string
}

const fortunes = [
  {
    message: "오늘은 달콤한 하루가 될 거예요!",
    messageEn: "Today will be a sweet day!",
    emoji: "🍫",
    minSweetness: 80,
    maxSweetness: 100,
  },
  {
    message: "사랑하는 사람과 특별한 시간을 보내세요",
    messageEn: "Spend special time with loved ones",
    emoji: "💕",
    minSweetness: 70,
    maxSweetness: 90,
  },
  {
    message: "작은 행복이 당신을 찾아올 거예요",
    messageEn: "Little happiness will find you",
    emoji: "✨",
    minSweetness: 60,
    maxSweetness: 80,
  },
  {
    message: "좋은 소식이 곧 들려올 거예요!",
    messageEn: "Good news is coming soon!",
    emoji: "🎉",
    minSweetness: 75,
    maxSweetness: 95,
  },
  {
    message: "오늘 만나는 사람이 행운을 가져다줄 거예요",
    messageEn: "Someone you meet today will bring luck",
    emoji: "🌟",
    minSweetness: 65,
    maxSweetness: 85,
  },
  {
    message: "당신의 미소가 누군가를 행복하게 할 거예요",
    messageEn: "Your smile will make someone happy",
    emoji: "😊",
    minSweetness: 70,
    maxSweetness: 90,
  },
  {
    message: "초콜릿처럼 달콤한 순간이 찾아올 거예요",
    messageEn: "Sweet moments like chocolate await",
    emoji: "🍬",
    minSweetness: 80,
    maxSweetness: 100,
  },
  {
    message: "새로운 시작이 기다리고 있어요",
    messageEn: "A new beginning awaits",
    emoji: "🌸",
    minSweetness: 60,
    maxSweetness: 80,
  },
]

export function getTodayFortune(locale: "ko" | "en" = "ko"): Fortune {
  const seed = seedByDate()
  const index = seed % fortunes.length
  const fortune = fortunes[index]

  // Generate sweetness based on seed
  const sweetnessRange = fortune.maxSweetness - fortune.minSweetness
  const sweetness = fortune.minSweetness + (seed % sweetnessRange)

  return {
    sweetness,
    message: locale === "ko" ? fortune.message : fortune.messageEn,
    messageEn: fortune.messageEn,
    emoji: fortune.emoji,
  }
}
