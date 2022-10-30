export const createMarkerHtml = (data) => {
  const { altitude } = data.properties
  const MAX = 66
  return `
      <div class='popup-wrapper'>
        <img src='/trek/${data.id}.jpg' alt='Trek Image No. ${data.id}' class='popup-image' />
        <p>Altitude: ${altitude}m</p>
        <div class='popup-nav'>
          ${data.id > 1 ? `<button class='prev' data-id='${data.id}'>&lsaquo; Prev</button>` : `<div></div>`}
          ${data.id < MAX ? `<button class='next' data-id='${data.id}'>Next &rsaquo;</button>` : ``}
        </div>
      </div>
  `
}
