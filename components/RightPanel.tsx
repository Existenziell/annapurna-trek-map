'use client'

import { useState } from 'react'
import type { RightPanelProps, RightPanelTabId } from '@/types'
import ContentTab from '@/components/ContentTab'
import ControlsTab from '@/components/ControlsTab'
import SettingsTab from '@/components/SettingsTab'

export default function RightPanel({
  selectedMarker,
  onPrev,
  onNext,
  onStartTrek,
  settings,
  onSettingsChange,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<RightPanelTabId>('content')

  return (
    <aside className="flex min-w-0 flex-[2] flex-col border-l border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/90 md:min-w-[280px] overflow-hidden">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 px-2 text-sm font-medium ${activeTab === 'content'
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('controls')}
          className={`flex-1 py-3 px-2 text-sm font-medium ${activeTab === 'controls'
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          Controls
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-2 text-sm font-medium ${activeTab === 'settings'
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          Settings
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-center overflow-y-auto p-4 min-h-0">
        {activeTab === 'content' && (
          <ContentTab
            selectedMarker={selectedMarker}
            onPrev={onPrev}
            onNext={onNext}
            onStartTrek={onStartTrek}
          />
        )}
        {activeTab === 'controls' && <ControlsTab />}
        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            onChange={onSettingsChange}
          />
        )}
      </div>
    </aside>
  )
}
