import type { TrekMarkerCollection, TrekMarkerType } from '@/types'
import {
  MARKER_CLUSTER_REF_DISTANCE_M,
  MARKER_ZOOM,
  MARKER_ZOOM_MAX,
  MARKER_ZOOM_MIN,
  MARKER_ZOOM_REF_DISTANCE_M,
} from '@/lib/constants'

/** Great-circle distance between two [lng, lat] points in meters (Haversine). */
export function haversineMeters(
  a: [number, number],
  b: [number, number],
): number {
  const R = 6_371_000 // Earth radius in meters
  const [lng1, lat1] = a.map((x) => (x * Math.PI) / 180)
  const [lng2, lat2] = b.map((x) => (x * Math.PI) / 180)
  const dlat = lat2 - lat1
  const dlng = lng2 - lng1
  const x =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

/** Minimum distance from this marker to any other marker in the collection, in meters. */
export function minDistanceToOtherMarkers(
  marker: TrekMarkerType,
  data: TrekMarkerCollection,
): number {
  const coords = marker.geometry.coordinates
  let min = Infinity
  for (const f of data.features) {
    if (f.id === marker.id) continue
    const d = haversineMeters(coords, f.geometry.coordinates)
    if (d < min) min = d
  }
  return min === Infinity ? MARKER_CLUSTER_REF_DISTANCE_M * 2 : min
}

export interface ZoomFromDistanceOpts {
  minZoom?: number
  maxZoom?: number
  refDistanceM?: number
}

/**
 * Zoom level based on distance from previous marker: short distance => lower zoom.
 */
export function zoomFromDistance(
  distanceMeters: number,
  opts: ZoomFromDistanceOpts = {},
): number {
  const minZoom = opts.minZoom ?? MARKER_ZOOM_MIN
  const maxZoom = opts.maxZoom ?? MARKER_ZOOM
  const refM = opts.refDistanceM ?? MARKER_ZOOM_REF_DISTANCE_M
  const t = Math.min(1, distanceMeters / refM)
  const zoom = minZoom + (maxZoom - minZoom) * t
  return Math.max(minZoom, Math.min(maxZoom, zoom))
}

export interface ZoomToUnclusterOpts {
  refDistanceM?: number
  minZoom?: number
  maxZoom?: number
}

/**
 * Zoom level so that markers at minDistMeters would be separated (e.g. >50px at cluster zoom).
 */
export function zoomToUncluster(
  minDistMeters: number,
  opts: ZoomToUnclusterOpts = {},
): number {
  const refM = opts.refDistanceM ?? MARKER_CLUSTER_REF_DISTANCE_M
  const minZ = opts.minZoom ?? 14
  const maxZ = opts.maxZoom ?? MARKER_ZOOM_MAX
  if (minDistMeters >= refM * 2) return minZ
  const z = 14 + Math.log2(refM / minDistMeters)
  return Math.max(minZ, Math.min(maxZ, z))
}

/**
 * Combined target zoom: max of distance-based zoom and cluster zoom, clamped to global min/max.
 */
export function computeTargetZoom(
  targetMarker: TrekMarkerType,
  data: TrekMarkerCollection,
  fromMarker?: TrekMarkerType | null,
): number {
  const clusterMinDist = minDistanceToOtherMarkers(targetMarker, data)
  const zoomForClustering = zoomToUncluster(clusterMinDist)

  let zoomFromDist = MARKER_ZOOM
  if (fromMarker) {
    const distM = haversineMeters(
      fromMarker.geometry.coordinates,
      targetMarker.geometry.coordinates,
    )
    zoomFromDist = zoomFromDistance(distM)
  }

  const zoom = Math.max(zoomForClustering, zoomFromDist)
  return Math.max(MARKER_ZOOM_MIN, Math.min(MARKER_ZOOM_MAX, zoom))
}
