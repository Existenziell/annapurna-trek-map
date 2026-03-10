'use client'

import { XIcon } from '@/components/Icons'

export interface InfoPanelProps {
  open: boolean
  onClose: () => void
}

export default function InfoPanel({ open, onClose }: InfoPanelProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-30 flex justify-end bg-black/20 md:bg-black/10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Info"
    >
      <div
        className="info-panel-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-level-6">Info</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-level-4 hover:text-level-5 rounded focus-ring"
            aria-label="Close info"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="max-w-md w-full mx-auto">
          <div className="card flex flex-col gap-4 text-sm text-left">
            <section className="text-left">
              <h3 className="font-medium mb-2 text-lg">Map controls:</h3>
              <ul className="leading-relaxed space-y-0.5 list-none">
                <li>Hold left mouse button to drag</li>
                <li>Hold right mouse button to pan / rotate</li>
                <li>Mouse wheel to zoom</li>
                <li>Click a marker to view details</li>
                <li>Click an image to enlarge it</li>
                <li>Drag the left of the image to resize</li>
              </ul>
            </section>

            <section className="pt-6 mt-2 text-left border-t border-level-3">
              <h3 className="font-medium mb-2 text-lg">About this map</h3>
              <p className="leading-relaxed text-level-5">
                This map shows the Annapurna trek route with markers along the way. Each marker has photos and details from the trail. Use the controls above to explore.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
