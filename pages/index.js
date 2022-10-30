// https://github.com/naomigrace/nextjs-with-mapbox-gl-js/blob/master/pages/index.js
import { useEffect, useState } from 'react'
import { initializeMap } from '../lib/initializeMap'
import { addDataLayer } from '../lib/addDataLayer'
import { data } from '../lib/data'
import 'mapbox-gl/dist/mapbox-gl.css'
import Overlay from '../components/Overlay'
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')

const MapComponent = () => {
  const [Map, setMap] = useState()
  const [pageIsMounted, setPageIsMounted] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(true)

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    setPageIsMounted(true)

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-v9',
      // style: 'mapbox://styles/mapbox/dark-v10',
      // style: 'mapbox://styles/mapbox/streets-v11',
      // style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [84.1, 28.5],
      zoom: 9.5,
      pitch: 45,
    })
    initializeMap(map)
    setMap(map)
  }, [])

  useEffect(() => {
    if (pageIsMounted && data) {
      Map.on('load', () => {
        addDataLayer(Map, data)
        Map.addControl(new mapboxgl.NavigationControl())
      })
    }
  }, [pageIsMounted, setMap, Map])

  return (
    <>
      {overlayOpen &&
        <Overlay overlayOpen={overlayOpen} setOverlayOpen={setOverlayOpen} />
      }
      <div id='map' className='w-full h-screen' />
    </>
  )
}

export default MapComponent
