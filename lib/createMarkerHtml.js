import { data } from "./data"

export const createMarkerHtml = (marker) => {
  const { altitude } = marker.properties
  const MAX = data.features.length

  return `
      <div class='popup-wrapper'>
        <img src='/trek/${marker.id}.jpg' alt='Trek Image No. ${marker.id}' class='popup-image' />
        <p>Altitude: ${altitude}m</p>
        <div class='popup-nav'>
          ${marker.id > 1 ? `<button class='prev' data-id='${marker.id}'>&lsaquo; Prev</button>` : `<div></div>`}
          ${marker.id < MAX ? `<button class='next' data-id='${marker.id}'>Next &rsaquo;</button>` : ``}
        </div>
      </div>
  `
}
