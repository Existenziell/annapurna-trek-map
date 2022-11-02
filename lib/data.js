const markers = [
  {
    altitude: 760,
    coordinates: [84.376144, 28.231316],
  },
  {
    altitude: 800,
    coordinates: [84.365696, 28.257915],
  },
  {
    altitude: 823.5,
    coordinates: [84.377694, 28.292472],
  },
  {
    altitude: 1011.6,
    coordinates: [84.401635, 28.387061],
  },
  {
    altitude: 1220.3,
    coordinates: [84.408028, 28.413297],
  },
  {
    altitude: 1377.5,
    coordinates: [84.375778, 28.452500],
  },
  {
    altitude: 817.5,
    coordinates: [84.377603, 28.292464],
  },
  {
    altitude: 1224,
    coordinates: [84.40804, 28.414],
  },
  {
    altitude: 1294.3,
    coordinates: [84.406783, 28.413211],
  },
  {
    altitude: 1296.2,
    coordinates: [84.406997, 28.413342],
  },
  {
    altitude: 1352,
    coordinates: [84.3615, 28.5],
  },
  {
    altitude: 1661,
    coordinates: [84.372156, 28.460669],
  },
  {
    altitude: 1621,
    coordinates: [84.373672, 28.468578],
  },
  {
    altitude: 1702,
    coordinates: [84.373679, 28.470578],
  },
  {
    altitude: 1627.7,
    coordinates: [84.371881, 28.463000],
  },
  {
    altitude: 1669.5,
    coordinates: [84.374367, 28.469653],
  },
  {
    altitude: 1677.3,
    coordinates: [84.374336, 28.469853],
  },
  {
    altitude: 1769.4,
    coordinates: [84.358750, 28.516211],
  },
  {
    altitude: 1841.2,
    coordinates: [84.358703, 28.516311],
  },
  {
    altitude: 1824.1,
    coordinates: [84.355583, 28.526017],
  },
  {
    altitude: 1859.2,
    coordinates: [84.350617, 28.532228],
  },
  {
    altitude: 2174.9,
    coordinates: [84.337547, 28.535922],
  },
  {
    altitude: 2131.5,
    coordinates: [84.336800, 28.535928],
  },
  {
    altitude: 2464.7,
    coordinates: [84.317725, 28.526067],
  },
  {
    altitude: 2527.6,
    coordinates: [84.309928, 28.526347],
  },
  {
    altitude: 2576.4,
    coordinates: [84.269333, 28.551406],
  },
  {
    altitude: 2439.3,
    coordinates: [84.267144, 28.551647],
  },
  {
    altitude: 2442,
    coordinates: [84.265144, 28.551647],
  },
  {
    altitude: 2799.5,
    coordinates: [84.241111, 28.552086],
  },
  {
    altitude: 2785.5,
    coordinates: [84.241036, 28.552058],
  },
  {
    altitude: 3156,
    coordinates: [84.171822, 28.604744],
  },
  {
    altitude: 3158.8,
    coordinates: [84.171769, 28.604947],
  },
  {
    altitude: 3200.2,
    coordinates: [84.166214, 28.608344],
  },
  {
    altitude: 3225.2,
    coordinates: [84.159394, 28.611403],
  },
  {
    altitude: 3301.2,
    coordinates: [84.153214, 28.615908],
  },
  {
    altitude: 3284,
    coordinates: [84.153306, 28.616047],
  },
  {
    altitude: 3278.1,
    coordinates: [84.153306, 28.616147],
  },
  {
    altitude: 3340.1,
    coordinates: [84.154053, 28.616081],
  },
  {
    altitude: 3357.4,
    coordinates: [84.154281, 28.615989],
  },
  {
    altitude: 3334,
    coordinates: [84.153503, 28.615819],
  },
  {
    altitude: 3321.9,
    coordinates: [84.153411, 28.615967],
  },
  {
    altitude: 3602.1,
    coordinates: [84.138200, 28.639286],
  },
  {
    altitude: 3655.9,
    coordinates: [84.137383, 28.640106],
  },
  {
    altitude: 3697.9,
    coordinates: [84.137200, 28.640828],
  },
  {
    altitude: 3623.8,
    coordinates: [84.134575, 28.645869],
  },
  {
    altitude: 3715.6,
    coordinates: [84.134086, 28.646161],
  },
  {
    altitude: 3739.1,
    coordinates: [84.133583, 28.646403],
  },
  {
    altitude: 3728.7,
    coordinates: [84.133597, 28.646367],
  },
  {
    altitude: 3733.1,
    coordinates: [84.131111, 28.644728],
  },
  {
    altitude: 3730.2,
    coordinates: [84.116058, 28.641461],
  },
  {
    altitude: 3729.2,
    coordinates: [84.116103, 28.641286],
  },
  {
    altitude: 3699.7,
    coordinates: [84.109139, 28.645081],
  },
  {
    altitude: 3672.1,
    coordinates: [84.104972, 28.644967],
  },
  {
    altitude: 3640,
    coordinates: [84.104294, 28.648308],
  },
  {
    altitude: 3673.3,
    coordinates: [84.101075, 28.648975],
  },
  {
    altitude: 3748.1,
    coordinates: [84.095200, 28.656917],
  },
  {
    altitude: 3710.2,
    coordinates: [84.091981, 28.656522],
  },
  {
    altitude: 3693,
    coordinates: [84.091408, 28.656686],
  },
  {
    altitude: 3612.6,
    coordinates: [84.089600, 28.657069],
  },
  {
    altitude: 3482.3,
    coordinates: [84.082489, 28.652650],
  },
  {
    altitude: 3454.9,
    coordinates: [84.078056, 28.649717],
  },
  {
    altitude: 3460.2,
    coordinates: [84.057725, 28.647800],
  },
  {
    altitude: 3461.6,
    coordinates: [84.056756, 28.648158],
  },
  {
    altitude: 3442.1,
    coordinates: [84.053878, 28.649422],
  },
  {
    altitude: 3455.4,
    coordinates: [84.053903, 28.649514],
  },
  {
    altitude: 3457.5,
    coordinates: [84.042747, 28.654536],
  },
  {
    altitude: 3463,
    coordinates: [84.041892, 28.655303],
  },
  {
    altitude: 3471,
    coordinates: [84.041047, 28.656667],
  },
  {
    altitude: 3504,
    coordinates: [84.022592, 28.665300],
  },
  {
    altitude: 3554,
    coordinates: [84.022178, 28.666844],
  },
  {
    altitude: 3553,
    coordinates: [84.021942, 28.667044],
  },
  {
    altitude: 3573.6,
    coordinates: [84.043419, 28.659692],
  },
  {
    altitude: 3606,
    coordinates: [84.045708, 28.658642],
  },
  {
    altitude: 3846.1,
    coordinates: [84.051881, 28.658117],
  },
  {
    altitude: 3880,
    coordinates: [84.050683, 28.660003],
  },
  {
    altitude: 4227,
    coordinates: [84.050683, 28.666169],
  },
  {
    altitude: 4238,
    coordinates: [84.051528, 28.666169],
  },
  {
    altitude: 4620.9,
    coordinates: [84.059462, 28.678561],
  },
  {
    altitude: 4621,
    coordinates: [84.059952, 28.678572],
  },
  {
    altitude: 4619,
    coordinates: [84.059625, 28.678501],
  },
  {
    altitude: 3988,
    coordinates: [84.050628, 28.661269],
  },
  {
    altitude: 3847,
    coordinates: [84.052117, 28.658444],
  },
  {
    altitude: 3609.2,
    coordinates: [84.044906, 28.659064],
  },
  {
    altitude: 4107.6,
    coordinates: [83.970894, 28.728292],
  },
  {
    altitude: 4217,
    coordinates: [83.973131, 28.735919],
  },
  {
    altitude: 4201,
    coordinates: [83.972664, 28.736844],
  },
  {
    altitude: 4340.7,
    coordinates: [83.969688, 28.752093],
  },
  {
    altitude: 4344,
    coordinates: [83.969650, 28.752350],
  },
  {
    altitude: 4399.1,
    coordinates: [83.967544, 28.764342],
  },
  {
    altitude: 4398.5,
    coordinates: [83.968339, 28.768653],
  },
  {
    altitude: 4501,
    coordinates: [83.971847, 28.774703],
  },
  {
    altitude: 4530.1,
    coordinates: [83.972511, 28.776839],
  },
  {
    altitude: 5009.8,
    coordinates: [83.961403, 28.786392],
  },
  {
    altitude: 5058,
    coordinates: [83.958122, 28.787119],
  },
  {
    altitude: 5416,
    coordinates: [83.938736, 28.793428],
  },
  {
    altitude: 3660,
    coordinates: [83.861969, 28.815461],
  },
  {
    altitude: 3661,
    coordinates: [83.860886, 28.814889],
  },
  {
    altitude: 3666.2,
    coordinates: [83.860969, 28.814819],
  },
  {
    altitude: 3662,
    coordinates: [83.859906, 28.814776],
  },
  {
    altitude: 3656.0,
    coordinates: [83.858108, 28.814639],
  },
  {
    altitude: 3581.7,
    coordinates: [83.855186, 28.816408],
  },
  {
    altitude: 3572,
    coordinates: [83.854697, 28.816586],
  },
  {
    altitude: 3508,
    coordinates: [83.848419, 28.818511],
  },
  {
    altitude: 3508.2,
    coordinates: [83.848053, 28.818164],
  },
  {
    altitude: 3443,
    coordinates: [83.842850, 28.817172],
  },
  {
    altitude: 3439.2,
    coordinates: [83.842492, 28.817317],
  },
  {
    altitude: 3439.2,
    coordinates: [83.830239, 28.819986],
  },
  {
    altitude: 3351,
    coordinates: [83.824617, 28.820817],
  },
  {
    altitude: 3353.8,
    coordinates: [83.822753, 28.821317],
  },
  {
    altitude: 3343,
    coordinates: [83.821083, 28.821803],
  },
  {
    altitude: 3341,
    coordinates: [83.819197, 28.822742],
  },
  {
    altitude: 3261,
    coordinates: [83.811311, 28.827233],
  },
  {
    altitude: 3260.7,
    coordinates: [83.811927, 28.827233],
  },
  {
    altitude: 3019,
    coordinates: [83.785058, 28.826581],
  },
  {
    altitude: 2985,
    coordinates: [83.783653, 28.825797],
  },
  {
    altitude: 3001,
    coordinates: [83.782439, 28.824233],
  },
  {
    altitude: 2829.9,
    coordinates: [83.776047, 28.819450],
  },
  {
    altitude: 2850,
    coordinates: [83.771667, 28.816969],
  },
  {
    altitude: 2804,
    coordinates: [83.769050, 28.816142],
  },
  {
    altitude: 2760,
    coordinates: [83.748328, 28.787544],
  },
  {
    altitude: 2743,
    coordinates: [83.734275, 28.784936],
  },
  {
    altitude: 2748,
    coordinates: [83.736336, 28.784953],
  },
  {
    altitude: 2743,
    coordinates: [83.734361, 28.785028],
  },
  {
    altitude: 2526,
    coordinates: [83.590614, 28.666392],
  },
  {
    altitude: 2264,
    coordinates: [83.627164, 28.623718],
  },
  {
    altitude: 1237,
    coordinates: [83.655067, 28.498572],
  },
]

export const data = {
  type: "FeatureCollection",
  features: markers.map((marker, idx) => (
    {
      type: "Feature",
      id: idx + 1,
      properties: {
        altitude: marker.altitude,
        cluster: false,
        event_count: 1,
        venue: "trek",
      },
      geometry: {
        type: "Point",
        coordinates: marker.coordinates
      }
    }
  ))
}
