'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { MarkerViewProps } from '@/types'
import { data } from '@/data'
import MarkerInfoCard from '@/components/MarkerInfoCard'
import { XIcon } from '@/components/Icons'

const TOTAL_MARKERS = data.features.length

export default function MarkerView({
  marker,
  onPrev,
  onNext,
  onResizeHandleMouseDown,
  onFullscreenChange,
}: MarkerViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lastLoadedFullscreenSrc, setLastLoadedFullscreenSrc] = useState<string | null>(null)
  const hasPrev = marker.id > 1
  const hasNext = marker.id < TOTAL_MARKERS

  useEffect(() => {
    onFullscreenChange?.(isFullscreen)
  }, [isFullscreen, onFullscreenChange])
  const { image, video, external = false } = marker.properties
  const imageSrc = image ? `/trek/${image}` : null
  const videoSrc = !external && video ? `/trek/${video}` : null
  const vimeoId = external && video ? (/\d{7,}/.exec(String(video))?.[0] ?? null) : null
  const hasMedia = vimeoId ? true : (videoSrc ?? imageSrc)
  const alt = `Trek stop ${marker.id}`
  const vimeoEmbedUrl = vimeoId
    ? `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&title=0&byline=0`
    : null

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
    <div className="flex flex-1 flex-col gap-4">
      <div className="relative">
        {imageSrc && !videoSrc && !vimeoEmbedUrl ? (
          <div className="relative">
            {onResizeHandleMouseDown && (
              <div
                role="separator"
                aria-orientation="vertical"
                title="Drag to resize panel"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onResizeHandleMouseDown(e)
                }}
                className="resize-handle-vertical"
                style={{ touchAction: 'none' }}
              />
            )}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="cursor-zoom-in focus-ring block w-full max-h-[100vh] rounded-2xl overflow-hidden border-4 border-level-3 shadow-lg bg-level-1"
              aria-label={alt}
            >
              <Image
                src={imageSrc}
                alt={alt}
                width={1200}
                height={800}
                className="w-full h-auto block max-h-[100vh]"
                style={{ maxHeight: '90vh' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>
          </div>
        ) : (
          <div className="media-frame">
            {onResizeHandleMouseDown && (
              <div
                role="separator"
                aria-orientation="vertical"
                title="Drag to resize panel"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onResizeHandleMouseDown(e)
                }}
                className="resize-handle-vertical"
                style={{ touchAction: 'none' }}
              />
            )}
            <button
              type="button"
              onClick={() => hasMedia && setIsFullscreen(true)}
              className={`relative w-full cursor-zoom-in focus-ring disabled:cursor-default disabled:opacity-80 block overflow-hidden ${vimeoEmbedUrl ? 'aspect-video max-h-[90vh]' : 'h-[75vh] min-h-[280px]'}`}
              disabled={!hasMedia}
            >
              {vimeoEmbedUrl ? (
                <iframe
                  src={vimeoEmbedUrl}
                  title={alt}
                  className="absolute inset-0 w-full h-full object-contain object-center"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : videoSrc ? (
                <video
                  src={videoSrc}
                  controls
                  playsInline
                  muted
                  loop
                  className="absolute inset-0 w-full h-full object-contain object-center"
                  aria-label={alt}
                />
              ) : (
                <span className="flex absolute inset-0 items-center justify-center bg-level-2 text-level-4 text-sm">
                  No image
                </span>
              )}
            </button>
          </div>
        )}
        {/* Marker info overlay inside media, top-right */}
        <div className="pointer-events-none absolute top-0 right-0 z-20">
          <MarkerInfoCard marker={marker}  />
        </div>
      </div>

      {isFullscreen && hasMedia && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={vimeoEmbedUrl || videoSrc ? 'Fullscreen video' : 'Fullscreen image'}
          className="overlay-fullscreen"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsFullscreen(false)
            }}
            className="btn-close-overlay"
            aria-label="Close fullscreen"
          >
            <XIcon className="w-8 h-8" />
          </button>
          <div
            className="absolute inset-2 flex items-center justify-center cursor-zoom-out min-h-0 min-w-0"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <MarkerInfoCard marker={marker} isFullscreen={true} />
            </div>
            {vimeoEmbedUrl ? (
              <div className="relative max-w-full max-h-full w-full aspect-video">
                <iframe
                  src={vimeoEmbedUrl}
                  title={alt}
                  className="absolute inset-0 w-full h-full rounded"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : videoSrc ? (
              <video
                src={videoSrc}
                controls
                playsInline
                autoPlay
                className="max-w-full max-h-full w-auto h-auto object-contain rounded"
                aria-label={alt}
              />
            ) : (
              <>
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
                  src={imageSrc!}
                  alt={alt}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded"
                  draggable={false}
                  onLoad={() => setLastLoadedFullscreenSrc(imageSrc)}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const MAX_MARKER_ID = TOTAL_MARKERS
