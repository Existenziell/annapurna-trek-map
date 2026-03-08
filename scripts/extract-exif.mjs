#!/usr/bin/env node
/**
 * Extract EXIF GPS (lat/long, altitude) from images in public/trek/new
 * and append new markers to data/markers.json (idempotent).
 *
 * Usage: npm run extract-exif  (or node scripts/extract-exif.mjs)
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import exifr from 'exifr'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const NEW_DIR = join(ROOT, 'public', 'trek', 'new')
const MARKERS_PATH = join(ROOT, 'data', 'markers.json')

const IMAGE_EXT = /\.(jpg|jpeg|JPG|JPEG|png|PNG|heic|HEIC)$/

function isImage(filename) {
  return IMAGE_EXT.test(filename)
}

/**
 * Parse EXIF and return marker-ready data or null if no GPS.
 * exifr.parse() with gps: true returns latitude, longitude (and possibly
 * Latitude/Longitude); GPSAltitude may be in result or under result.GPS.
 */
async function extractExif(imagePath) {
  try {
    const data = await exifr.parse(imagePath, { gps: true, exif: true })
    if (!data) return null

    const lat = Number(data.latitude ?? data.Latitude)
    const lng = Number(data.longitude ?? data.Longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null

    // Altitude: EXIF GPSAltitude is often in meters (round to integer)
    let altitude = 0
    const rawAlt = data.GPSAltitude ?? data.GPS?.GPSAltitude
    if (rawAlt != null) {
      const a = Number(rawAlt)
      if (!Number.isNaN(a)) altitude = Math.round(a)
    }

    const dateTimeOriginal =
      data.DateTimeOriginal != null
        ? (data.DateTimeOriginal instanceof Date
            ? data.DateTimeOriginal.toISOString()
            : String(data.DateTimeOriginal))
        : undefined

    return {
      coordinates: [lng, lat],
      altitude,
      ...(dateTimeOriginal && { dateTimeOriginal }),
    }
  } catch (err) {
    console.warn(`  ⚠ ${err.message}`)
    return null
  }
}

async function main() {
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

  const existingImages = new Set(markers.map((m) => m.image).filter(Boolean))

  let entries
  try {
    entries = await readdir(NEW_DIR, { withFileTypes: true })
  } catch (err) {
    console.error('Failed to read public/trek/new:', err.message)
    process.exit(1)
  }

  const imageFiles = entries
    .filter((e) => e.isFile() && isImage(e.name))
    .map((e) => e.name)
    .sort()

  if (imageFiles.length === 0) {
    console.log('No image files found in public/trek/new')
    return
  }

  console.log(`Found ${imageFiles.length} image(s) in public/trek/new\n`)

  const added = []
  const skippedNoGps = []
  const skippedExisting = []

  for (const name of imageFiles) {
    const imagePath = join(NEW_DIR, name)
    const imageKey = `new/${name}`

    if (existingImages.has(imageKey)) {
      skippedExisting.push(name)
      continue
    }

    const exifData = await extractExif(imagePath)
    if (!exifData) {
      skippedNoGps.push(name)
      continue
    }

    const marker = {
      altitude: exifData.altitude,
      coordinates: exifData.coordinates,
      image: imageKey,
      ...(exifData.dateTimeOriginal && { dateTimeOriginal: exifData.dateTimeOriginal }),
    }
    markers.push(marker)
    existingImages.add(imageKey)
    added.push(name)
  }

  if (added.length > 0) {
    await writeFile(MARKERS_PATH, JSON.stringify(markers, null, 2) + '\n', 'utf8')
    console.log(`Added ${added.length} marker(s) to data/markers.json:`)
    added.forEach((n) => console.log(`  + ${n}`))
  } else {
    console.log('No new markers to add.')
  }

  if (skippedNoGps.length > 0) {
    console.log(`\nSkipped (no GPS in EXIF): ${skippedNoGps.length}`)
    skippedNoGps.forEach((n) => console.log(`  - ${n}`))
  }
  if (skippedExisting.length > 0) {
    console.log(`\nSkipped (already in markers): ${skippedExisting.length}`)
    skippedExisting.forEach((n) => console.log(`  - ${n}`))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
