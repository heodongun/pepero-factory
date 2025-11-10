// Design schema types and validation
export type CoatingType = "milk" | "dark" | "strawberry" | "matcha" | "white"
export type ToppingType = "sprinkle" | "almond" | "cookie" | "strawberry" | "heart" | "marshmallow"
export type WrapperPattern = "dots" | "stripe" | "check" | "plain" | "hearts" | "stars"

export interface Topping {
  type: ToppingType
  color: string
  count: number
}

export interface Wrapper {
  ribbon: string
  pattern: WrapperPattern
  sticker: boolean
}

export interface PeperoDesign {
  coating: CoatingType
  toppings: Topping[]
  wrapper: Wrapper
  message: string
  from?: string
  bgmEnabled: boolean
  createdAt?: string
  id?: string
}

// Chocolate type configurations with realistic colors
export const chocolateTypes = [
  { id: "milk" as CoatingType, name: "밀크 초콜릿", nameEn: "Milk Chocolate", color: "#8B4513", glossiness: 0.6 },
  { id: "dark" as CoatingType, name: "다크 초콜릿", nameEn: "Dark Chocolate", color: "#3D2817", glossiness: 0.7 },
  { id: "white" as CoatingType, name: "화이트 초콜릿", nameEn: "White Chocolate", color: "#F5DEB3", glossiness: 0.5 },
  {
    id: "strawberry" as CoatingType,
    name: "딸기 초콜릿",
    nameEn: "Strawberry Chocolate",
    color: "#FFB6C1",
    glossiness: 0.55,
  },
  { id: "matcha" as CoatingType, name: "말차 초콜릿", nameEn: "Matcha Chocolate", color: "#88C091", glossiness: 0.5 },
]

// Topping options with emojis and colors
export const toppingOptions = [
  {
    id: "sprinkle" as ToppingType,
    name: "스프링클",
    nameEn: "Sprinkles",
    emoji: "🌈",
    colors: ["#FF6B9D", "#C2E9FB", "#FFE66D", "#B8F3B8"],
  },
  { id: "almond" as ToppingType, name: "아몬드", nameEn: "Almonds", emoji: "🥜", colors: ["#DEB887", "#F5DEB3"] },
  {
    id: "cookie" as ToppingType,
    name: "쿠키 크럼블",
    nameEn: "Cookie Crumble",
    emoji: "🍪",
    colors: ["#8B4513", "#D2691E"],
  },
  {
    id: "strawberry" as ToppingType,
    name: "건조 딸기",
    nameEn: "Dried Strawberry",
    emoji: "🍓",
    colors: ["#FF6B9D", "#FF1493"],
  },
  {
    id: "heart" as ToppingType,
    name: "하트 슈가",
    nameEn: "Heart Sugar",
    emoji: "💗",
    colors: ["#FFB6C1", "#FF69B4", "#FFD700"],
  },
  {
    id: "marshmallow" as ToppingType,
    name: "마시멜로우",
    nameEn: "Marshmallow",
    emoji: "☁️",
    colors: ["#FFFFFF", "#FFF0F5"],
  },
]

// Wrapper styles
export const wrapperStyles = [
  { id: "plain" as WrapperPattern, name: "플레인", nameEn: "Plain", pattern: "plain" },
  { id: "hearts" as WrapperPattern, name: "하트", nameEn: "Hearts", pattern: "hearts" },
  { id: "stars" as WrapperPattern, name: "별", nameEn: "Stars", pattern: "stars" },
  { id: "dots" as WrapperPattern, name: "도트", nameEn: "Dots", pattern: "dots" },
  { id: "stripe" as WrapperPattern, name: "줄무늬", nameEn: "Stripes", pattern: "stripe" },
  { id: "check" as WrapperPattern, name: "체크", nameEn: "Check", pattern: "check" },
]

// Validate design object
export function validateDesign(design: Partial<PeperoDesign>): design is PeperoDesign {
  return (
    typeof design.coating === "string" &&
    chocolateTypes.some((c) => c.id === design.coating) &&
    Array.isArray(design.toppings) &&
    typeof design.wrapper === "object" &&
    typeof design.message === "string" &&
    design.message.length <= 120 &&
    typeof design.bgmEnabled === "boolean"
  )
}
