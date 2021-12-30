export const createMarkerHtml = (data) => {
  const { altitude } = data.properties
  return `
      <div>
        <img src='/trek/${data.id}.jpg' alt='Trek Image No. ${data.id}' />
        <p>Altitude: ${altitude}m</p>
      </div>
  `
}
