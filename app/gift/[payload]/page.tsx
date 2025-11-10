import { Suspense } from "react"
import { GiftViewEnhanced } from "@/components/gift-view-enhanced"

export default function EncodedGiftPage({ params }: { params: { payload: string } }) {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div>Loading your gift...</div>}>
          <GiftViewEnhanced payload={params.payload} />
        </Suspense>
      </div>
    </div>
  )
}
