import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { mapbox } from './mapbox.js'
import { createMarkerHtml } from './createMarkerHtml.js'
import { openPopup } from './openPopup.js'

export function initializeMap(map) {
  map.on('click', 'data', function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['data'],
    })
    const clusterId = features[0].properties.cluster_id
    map
      .getSource('trek')
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom,
        })
      })
  })

  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters'],
    })
    const clusterId = features[0].properties.cluster_id
    map
      .getSource('trek')
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom,
          essential: true,
        })
      })
  })

  map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice()
    const html = createMarkerHtml(e.features[0], false)
    const pop = new mapbox.Popup().setLngLat(coordinates).setHTML(html).addTo(map)

    const image = document.getElementsByClassName("popup-image")[0]
    const container = image.parentElement
    image.addEventListener("click", () => {
      if (image.classList.contains('fullscreen')) {
        document.body.removeChild(image)
        container.prepend(image)
      } else {
        document.body.append(image)
      }
      image.classList.toggle('fullscreen')
    })

    const btnPrev = document.getElementsByClassName("prev")[0]
    const btnNext = document.getElementsByClassName("next")[0]
    if (btnNext) {
      const id = parseInt(btnNext.getAttribute('data-id'))
      btnNext.addEventListener("click", () => {
        pop.remove()
        openPopup(id, 'next', map)
      })
    }
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        const id = parseInt(btnPrev.getAttribute('data-id'))
        pop.remove()
        openPopup(id, 'prev', map)
      })
    }
  })

  map.on('mouseenter', 'data', function () {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'data', function () {
    map.getCanvas().style.cursor = ''
  })
}
