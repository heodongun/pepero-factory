import { Suspense } from "react"
import { GiftView } from "@/components/gift-view"

export default function GiftPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div>Loading your gift...</div>}>
          <GiftView />
        </Suspense>
      </div>
    </div>
  )
}
