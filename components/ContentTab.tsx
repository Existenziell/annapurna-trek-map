'use client'

import type { ContentTabProps } from '@/types'
import MarkerView, { MAX_MARKER_ID } from '@/components/MarkerView'

export default function ContentTab({
  selectedMarker,
  onPrev,
  onNext,
  onStartTrek,
}: ContentTabProps) {
  if (!selectedMarker) {
    return (
      <div className="flex flex-col gap-6 card max-w-md mx-auto">
        <h2 className="text-xl font-medium text-level-6">Namaste,</h2>
        <p className="text-level-4 leading-relaxed">
          This is the Annapurna Circuit, one of the most stunning routes in the
          Himalayas. A trek between 160-230 km long encircling the Annapurna
          Massif in Central Nepal. I walked this trek solo in November 2019 and
          want to share some visual impressions.
        </p>
        <button
          type="button"
          onClick={onStartTrek}
          className="button max-w-fit mx-auto"
        >
          Start trek
        </button>
        <p className="text-sm text-level-4">
          Or click a marker on the map to view details.
        </p>
      </div>
    )
  }

  return (
    <MarkerView
      marker={selectedMarker}
      onPrev={onPrev}
      onNext={onNext}
      hasPrev={selectedMarker.id > 1}
      hasNext={selectedMarker.id < MAX_MARKER_ID}
    />
  )
}
