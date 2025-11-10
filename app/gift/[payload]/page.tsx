import { Suspense } from "react"
import { GiftViewEnhanced } from "@/components/gift-view-enhanced"

export default async function EncodedGiftPage({ params }: { params: Promise<{ payload: string }> }) {
  const { payload } = await params

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div>Loading your gift...</div>}>
          <GiftViewEnhanced payload={payload} />
        </Suspense>
      </div>
    </div>
  )
}
