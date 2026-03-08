'use client'

import { useState } from 'react'
import type { RightPanelProps, RightPanelTabId } from '@/types'
import ContentTab from '@/components/ContentTab'
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
    <aside className="flex min-h-0 min-w-0 flex-1 flex-col border-l border-level-3 bg-level-1 overflow-hidden">
      <div className="flex border-b border-level-3">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 px-2 text-sm font-medium ${activeTab === 'content'
              ? 'border-b-2 border-accent text-accent'
              : 'text-level-4 hover:text-level-5'
            }`}
        >
          Data
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-2 text-sm font-medium ${activeTab === 'settings'
              ? 'border-b-2 border-accent text-accent'
              : 'text-level-4 hover:text-level-5'
            }`}
        >
          Settings
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-start overflow-y-auto p-4 min-h-0 mt-6">
        <div className="min-h-full flex flex-col">
          {activeTab === 'content' && (
            <ContentTab
              selectedMarker={selectedMarker}
              onPrev={onPrev}
              onNext={onNext}
              onStartTrek={onStartTrek}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              onChange={onSettingsChange}
            />
          )}
        </div>
      </div>
    </aside>
  )
}
