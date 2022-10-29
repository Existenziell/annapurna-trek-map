// https://github.com/naomigrace/nextjs-with-mapbox-gl-js/blob/master/pages/index.js
import { useEffect, useState } from 'react'
import { initializeMap } from '../lib/initializeMap'
import { addDataLayer } from '../lib/addDataLayer'
import { data } from '../lib/data'
import Head from 'next/head'
import 'mapbox-gl/dist/mapbox-gl.css'

import Overlay from '../components/overlay'
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
      center: [84, 28.5],
      zoom: 9,
      // pitch: 45,
    })
    initializeMap(mapboxgl, map)
    setMap(map)
  }, [])

  useEffect(() => {
    if (pageIsMounted && data) {
      Map.on('load', () => {
        addDataLayer(Map, data)
      })
    }
  }, [pageIsMounted, setMap, Map])

  return (
    <>
      <Head>
        <title>Annapurna Circuit Trek | christof.digital</title>
        <meta name='description' content='My trek around the Annapurna Circuit, Himalayas, Nepal, 2019 | shift-happens' />
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
      </Head>

      {overlayOpen &&
        <Overlay overlayOpen={overlayOpen} setOverlayOpen={setOverlayOpen} />
      }

      <div id='map' className='w-full h-screen' />
    </>
  )
}

export default MapComponent
