import { data } from './data'
import { mapbox } from './mapbox.js'
import { createMarkerHtml } from './createMarkerHtml.js'

export const openPopup = (id, direction, map) => {
  const targetId = direction === 'prev' ? id - 1 : id + 1
  const targetElement = data.features.filter(d => parseInt(d.id) === targetId)[0]
  const coordinates = targetElement.geometry.coordinates.slice()
  const html = createMarkerHtml(targetElement)
  const pop = new mapbox.Popup().setLngLat(coordinates).setHTML(html).addTo(map)

  map.flyTo({
    center: coordinates,
    speed: 0.6,
    essential: true,
  })

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
    btnNext.addEventListener("click", () => {
      pop.remove()
      openPopup(targetId, 'next', map)
    })
  }
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      pop.remove()
      openPopup(targetId, 'prev', map)
    })
  }
}
