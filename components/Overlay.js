const Overlay = ({ overlayOpen, setOverlayOpen }) => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/30 z-20 backdrop-blur">
      <div className="bg-white rounded-sm shadow p-6 max-w-lg w-lg">
        <h1 className='mb-2 text-2xl'>Namaste,</h1>
        <p className='mb-4'>This is the Annapurna Circuit Trek in Nepal, a Visual Journey through parts of the Himalayas.</p>
        <p className='mb-4 text-xs'>Mouse Controls:<br />Hold Left Mouse Button to Drag.<br />Hold Right Mouse Button to Pan/Rotate.<br />Mouse Wheel to Zoom.</p>
        <button onClick={() => setOverlayOpen(!overlayOpen)} className='button'>Start Trek</button>
      </div>
    </div>
  )
}

export default Overlay
