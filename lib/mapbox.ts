import mapbox from 'mapbox-gl'

const token: string =
  typeof process !== 'undefined'
    ? String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '')
    : ''
mapbox.accessToken = token

export { mapbox }
