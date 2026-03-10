'use client'

import { GearIcon } from '@/components/Icons'

export interface SettingsButtonProps {
  onClick: () => void
}

export default function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-icon-secondary"
      aria-label="Settings"
    >
      <GearIcon className="w-4 h-4" />
    </button>
  )
}
