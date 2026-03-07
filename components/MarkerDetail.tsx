'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { MarkerDetailProps } from '@/types'
import { data } from '@/data'

export default function MarkerDetail({
  marker,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: MarkerDetailProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { altitude } = marker.properties
  const imageSrc = `/trek/${marker.id}.jpg`

  return (
    <div className="flex flex-col min-h-[50vh] gap-4">
      <div className="flex flex-1 min-h-0 items-center justify-center">
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="relative w-full aspect-[4/3] max-h-[50vh] rounded shadow-lg overflow-hidden cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          <Image
            src={imageSrc}
            alt={`Trek stop ${marker.id}`}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </button>
      </div>

      {isFullscreen && (
        <button
          type="button"
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md cursor-zoom-out focus:outline-none"
          aria-label="Close fullscreen image"
        >
          <Image
            src={imageSrc}
            alt={`Trek stop ${marker.id}`}
            width={1920}
            height={1080}
            className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain"
            draggable={false}
          />
        </button>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Altitude: {altitude}m
      </p>
      <div className="mt-auto flex justify-between items-center pt-4 text-sm">
        {hasPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="button"
          >
            &lsaquo; Prev
          </button>
        ) : (
          <div />
        )}
        {hasNext ? (
          <button
            type="button"
            onClick={onNext}
            className="button"
          >
            Next &rsaquo;
          </button>
        ) : null}
      </div>
    </div>
  )
}

export const MAX_MARKER_ID = data.features.length
