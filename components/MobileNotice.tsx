'use client'

import { useState } from 'react'

export default function MobileNotice() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-notice-title"
    >
      <div className="w-full max-w-sm rounded-lg bg-level-2 p-6 shadow-xl">
        <h2
          id="mobile-notice-title"
          className="text-lg font-medium text-level-6"
        >
          Optimized for desktop
        </h2>
        <p className="mt-2 text-sm text-level-4">
          This app works best on a larger screen. You can continue here, but
          for the best experience we recommend using a desktop or tablet.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="button mt-4 w-full"
        >
          OK
        </button>
      </div>
    </div>
  )
}
