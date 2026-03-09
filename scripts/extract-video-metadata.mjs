#!/usr/bin/env node
/**
 * Extract metadata (GPS, altitude, date) from video files via exiftool and append markers to data/markers.json.
 * Usage: node scripts/extract-video-metadata.mjs [video1.mp4] [video2.mp4] ...
 * If no args: processes slowmo1-original.mp4, slowmo2-original.mp4, slowmo3-original.mp4 in public/trek/video.
 * Output marker uses video: "video/<base>.mp4" (e.g. slowmo1.mp4) so the displayed file is the main clip.
 */

import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const VIDEO_DIR = join(ROOT, 'public', 'trek', 'video')
const MARKERS_PATH = join(ROOT, 'data', 'markers.json')

function exiftool(...args) {
  try {
    return execSync(['exiftool', '-json', '-q', '-q', ...args].join(' '), {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024,
    })
  } catch {
    return null
  }
}

function parseDate(tag) {
  if (!tag || typeof tag !== 'string') return null
  // exiftool often gives "2019:11:22 23:18:17"
  const m = tag.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/)
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}.000Z`
  return null
}

function extractFromVideo(absPath) {
  const raw = exiftool(absPath)
  if (!raw) return null
  let data
  try {
    data = JSON.parse(raw)[0]
  } catch {
    return null
  }
  if (!data) return null

  const dateTime =
    parseDate(data.CreateDate) ??
    parseDate(data.DateTimeOriginal) ??
    parseDate(data.MediaCreateDate) ??
    null

  let lat = null,
    lng = null,
    altitude = 0
  if (data.GPSLatitude != null && data.GPSLongitude != null) {
    lat = Number(data.GPSLatitude)
    lng = Number(data.GPSLongitude)
    if (data.GPSAltitude != null) altitude = Math.round(Number(data.GPSAltitude))
  }

  return { dateTime, coordinates: lat != null && lng != null ? [lng, lat] : null, altitude }
}

function orderMarkersByDateTime(markers) {
  return [...markers].sort((a, b) => {
    const da = a.dateTime ?? ''
    const db = b.dateTime ?? ''
    if (!da && !db) return 0
    if (!da) return 1
    if (!db) return -1
    return da.localeCompare(db)
  })
}

async function main() {
  const videoFiles =
    process.argv.length > 2
      ? process.argv.slice(2).map((f) => join(process.cwd(), f))
      : [
          join(VIDEO_DIR, 'slowmo1-original.mp4'),
          join(VIDEO_DIR, 'slowmo2-original.mp4'),
          join(VIDEO_DIR, 'slowmo3-original.mp4'),
        ]

  let markers
  try {
    const raw = await readFile(MARKERS_PATH, 'utf8')
    markers = JSON.parse(raw)
  } catch (err) {
    console.error('Failed to read data/markers.json:', err.message)
    process.exit(1)
  }
  if (!Array.isArray(markers)) {
    console.error('data/markers.json must be a JSON array')
    process.exit(1)
  }

  const existingVideos = new Set(markers.map((m) => m.video).filter(Boolean))
  const added = []
  const placeholder = { coordinates: [84.05487792658954, 28.64641780274735], altitude: 3435 }

  for (const absPath of videoFiles) {
    const basename = absPath.split('/').pop()
    const base = basename.replace(/-original\.mp4$/, '').replace(/\.mp4$/, '')
    const videoKey = `video/${base}.mp4`
    if (existingVideos.has(videoKey)) {
      console.log(`Skip ${basename} (already in markers)`)
      continue
    }

    const meta = extractFromVideo(absPath)
    if (!meta) {
      console.warn(`Could not read metadata: ${basename}`)
      continue
    }

    const marker = {
      video: videoKey,
      dateTime: meta.dateTime ?? undefined,
      altitude: meta.coordinates != null ? meta.altitude : placeholder.altitude,
      coordinates:
        meta.coordinates ?? placeholder.coordinates,
      desc: meta.coordinates == null ? 'Location from video metadata (not in file; placeholder)' : '',
    }
    markers.push(marker)
    existingVideos.add(videoKey)
    added.push(basename)
  }

  if (added.length > 0) {
    const sorted = orderMarkersByDateTime(markers)
    await writeFile(MARKERS_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8')
    console.log(`Added ${added.length} marker(s) to data/markers.json:`)
    added.forEach((n) => console.log(`  + ${n}`))
  } else {
    console.log('No new markers to add.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
