export function addDataLayer(map, data) {
  map.addSource('trek', {
    type: 'geojson',
    data: data,
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
