'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from '@/components/Icons'
import type { MarkerViewProps } from '@/types'
import { data } from '@/data'

export default function MarkerView({
  marker,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: MarkerViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lastLoadedFullscreenSrc, setLastLoadedFullscreenSrc] = useState<string | null>(null)
  const { altitude, image, exif } = marker.properties
  const imageSrc = image ? `/trek/${image}` : null
  const alt = `Trek stop ${marker.id}`

  const fullscreenImageLoaded = imageSrc !== null && lastLoadedFullscreenSrc === imageSrc

  useEffect(() => {
    if (!isFullscreen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev()
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowRight' && hasNext) {
        onNext()
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, hasPrev, hasNext, onPrev, onNext])

  return (
    <div className="flex flex-1 flex-col min-h-[50vh] gap-4">
      <div className="flex flex-1 min-h-0 items-center justify-center">
        <button
          type="button"
          onClick={() => imageSrc && setIsFullscreen(true)}
          className="relative w-full aspect-[4/3] max-h-[50vh] rounded shadow-lg overflow-hidden cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-default disabled:opacity-80"
          disabled={!imageSrc}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-level-2 text-level-4 text-sm">
              No image
            </span>
          )}
        </button>
      </div>

      {isFullscreen && imageSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen image"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md cursor-zoom-out"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative flex items-center justify-center max-h-[90vh] max-w-[95vw] cursor-default min-h-[200px] min-w-[200px]"
            onClick={(e) => e.stopPropagation()}
          >
            {!fullscreenImageLoaded && (
              <div
                className="absolute inset-0 flex items-center justify-center z-10"
                aria-hidden
              >
                <div
                  className="w-12 h-12 rounded-full border-2 border-white border-t-transparent animate-spin"
                  role="img"
                  aria-label="Loading image"
                />
              </div>
            )}
            <Image
              src={imageSrc}
              alt={alt}
              width={1920}
              height={1080}
              className="max-h-[85vh] max-w-[80vw] w-auto h-auto object-contain rounded shadow-lg"
              draggable={false}
              onLoad={() => setLastLoadedFullscreenSrc(imageSrc)}
            />
          </div>
          {hasPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-[51] flex items-center justify-center w-14 h-14 rounded-full bg-black/30 text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-[51] flex items-center justify-center w-14 h-14 rounded-full bg-black/30 text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
      <div className="text-sm text-level-4 space-y-1">
        <p>Altitude: {altitude}m</p>
        {exif?.dateTimeOriginal && (
          <p>
            Date: {new Date(exif.dateTimeOriginal).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
        )}
      </div>
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
