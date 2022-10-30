export function addDataLayer(map, data) {
  // Add elevation data
  map.addSource('mapbox-dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512,
    maxzoom: 14
  })
  // add the DEM source as a terrain layer with exaggerated height
  map.setTerrain({ source: 'mapbox-dem', exaggeration: 0.5 })

  // add a sky layer that will show when the map is highly pitched
  map.addLayer({
    id: 'sky',
    type: 'sky',
    paint: {
      'sky-type': 'atmosphere',
      'sky-atmosphere-sun': [0.0, 0.0],
      'sky-atmosphere-sun-intensity': 15
    }
  })

  map.addSource('trek', {
    type: 'geojson',
    data,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    clusterProperties: {
      sum: ['+', ['get', 'event_count']],
    },
  })

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'trek',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#282b29',
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      'circle-opacity': 0.75,
      'circle-stroke-width': 4,
      'circle-stroke-color': '#fff',
      'circle-stroke-opacity': 0.5,
    },
  })

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'trek',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{sum}',
      'text-font': ['Open Sans Bold'],
      'text-size': 16,
    },
    paint: {
      'text-color': 'white',
    },
  })

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'trek',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': ['step', ['get', 'event_count'], 20, 100, 30, 750, 40],
      'circle-color': '#282b29',
      'circle-opacity': 0.75,
      'circle-stroke-width': 4,
      'circle-stroke-color': '#fff',
      'circle-stroke-opacity': 0.5,
    },
  })

  map.addLayer({
    id: 'event-count',
    type: 'symbol',
    source: 'trek',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': '{event_count}',
      'text-font': ['Open Sans Bold'],
      'text-size': 16,
    },
    paint: {
      'text-color': 'white',
    },
  })
}
