'use client'

import type { TrekMarkerType } from '@/types'

export interface MarkerInfoCardProps {
  marker: TrekMarkerType
  isFullscreen?: boolean
}

export default function MarkerInfoCard({ marker, isFullscreen = false }: MarkerInfoCardProps) {
  const { properties } = marker
  if (!properties) return null
  
  const layoutClass = isFullscreen ? 'marker-info-badge--fullscreen' : 'marker-info-badge--inline'

  return (
    <div className={`marker-info-badge ${layoutClass}`}>
      {properties.dateTime && (
        <p>
          {new Date(properties.dateTime).toLocaleDateString(undefined, {
            dateStyle: 'medium',
          })}
        </p>
      )}
      <p>Alt: {properties.altitude}m</p>
    </div>
  )
}
