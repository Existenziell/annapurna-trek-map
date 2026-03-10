'use client'

import type { ImagePanelProps } from '@/types'
import MarkerView from '@/components/MarkerView'

export default function ImagePanel({
  selectedMarker,
  onPrev,
  onNext,
  onResizeHandleMouseDown,
  onFullscreenChange,
}: ImagePanelProps) {
  return (
    <aside className="flex min-h-0 min-w-0 flex-1 flex-col bg-transparent overflow-hidden">
      <div className="relative flex flex-1 flex-col justify-start overflow-y-auto pt-6 px-4 pb-4 min-h-0">
        <div className="min-h-full flex flex-col w-full">
          {!selectedMarker ? null : (
            <div className="absolute inset-0 min-w-0">
              <div className="min-w-0 max-w-full w-full ml-auto">
                <MarkerView
                  marker={selectedMarker}
                  onPrev={onPrev}
                  onNext={onNext}
                  onResizeHandleMouseDown={onResizeHandleMouseDown}
                  onFullscreenChange={onFullscreenChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
