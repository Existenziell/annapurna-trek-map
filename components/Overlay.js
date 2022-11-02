import { useState } from "react"

const Overlay = ({ overlayOpen, setOverlayOpen }) => {
  const [showControls, setShowControls] = useState(false)

  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/30 z-20 backdrop-blur">
      <div className="bg-white rounded-sm shadow p-6 max-w-lg w-lg">
        <h1 className='mb-4 text-2xl'>Namaste,</h1>
        <p className='mb-6'>
          This is the Annapurna Circuit, one the the most stunning routes in the Himalayas.
          A trek between 160–230 km long encircling the Annapurna Massif in Central Nepal.
          I walked this trek solo in Novemver 2019 and want to share some visual impressions.
        </p>
        <button onClick={() => setOverlayOpen(!overlayOpen)} className='button mb-4'>Start Trek</button>

        <div>
          <button onClick={() => setShowControls(current => !current)} className='text-sm link'>
            {showControls ? `Hide Controls` : `Show Controls`}
          </button>
          {showControls &&
            <p className='text-xs bg-gray-100 rounded-sm p-4 text-left max-w-max mx-auto leading-4'>
              Hold Left Mouse Button to Drag<br />
              Hold Right Mouse Button to Pan/Rotate<br />
              Mouse Wheel to Zoom<br />
              Click on an image to enlarge it
            </p>
          }
        </div>
      </div>
    </div>
  )
}

export default Overlay
