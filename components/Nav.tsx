'use client'

import type { NavProps } from '@/types'

export default function Nav({
  onPrev,
  onNext,
  selectedMarkerId,
  totalMarkers,
}: NavProps) {
  return (
    <div className="fixed top-2.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
      <div className="flex justify-between items-center gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={selectedMarkerId <= 1}
          className="button-nav"
          aria-label="Previous marker"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedMarkerId >= totalMarkers}
          className="button-nav"
          aria-label="Next marker"
        >
          Next
        </button>
      </div>
    </div>
  )
}
