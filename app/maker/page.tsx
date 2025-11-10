import { Suspense } from "react"
import { PeperoMaker } from "@/components/pepero-maker"

export default function MakerPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div>Loading...</div>}>
          <PeperoMaker />
        </Suspense>
      </div>
    </div>
  )
}
