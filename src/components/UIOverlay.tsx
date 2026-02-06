import { useAppStore } from '../store/appStore'
import MiniMap from './MiniMap'
import BottomNav from './BottomNav'
import EventsPanel from './EventsPanel'
import ZonesPanel from './ZonesPanel'
import FriendsPanel from './FriendsPanel'
import MenuPanel from './MenuPanel'
import NotificationBar from './NotificationBar'
import ARView from './ARView'
import ZoneEditor from './ZoneEditor'
import ZoneDetailOverlay from './ZoneDetailOverlay'
import AdjustmentsPanel from './AdjustmentsPanel'

export default function UIOverlay() {
  const activePanel = useAppStore(state => state.activePanel)
  const arMode = useAppStore(state => state.arMode)
  const showMiniMap = useAppStore(state => state.showMiniMap)
  const showAdjustments = useAppStore(state => state.showAdjustments)
  const setShowAdjustments = useAppStore(state => state.setShowAdjustments)

  if (arMode) {
    return <ARView />
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar with notifications */}
      <NotificationBar />

      {/* Header Info (as in example) */}
      <div className="absolute top-4 left-4 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-bold text-sm tracking-tight opacity-90">МФФ</span>
          <span className="text-gray-400 text-sm">|</span>
          <span className="text-gray-300 text-sm font-medium">3D Навигация</span>
        </div>
        <div className="text-[10px] text-gray-400 leading-tight">
          Московский Финансовый Форум<br />
          Интерактивная навигация по площадке
        </div>
      </div>

      {/* Settings Toggle Button (Top Right) */}
      <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setShowAdjustments(!showAdjustments)}
          className={`p-2 rounded border transition-all ${showAdjustments ? 'bg-blue-600 border-blue-400 text-white' : 'bg-gray-900/80 border-gray-700 text-gray-400'
            }`}
          title="Toggle Settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>
        <div className="bg-gray-900/80 border border-gray-700 rounded p-1.5 text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          </svg>
        </div>
      </div>

      {/* Adjustments Panel */}
      {showAdjustments && <AdjustmentsPanel />}

      {/* Zone Editor */}
      <ZoneEditor />

      {/* Zone Details */}
      <ZoneDetailOverlay />

      {/* Mini map (Hidden if settings are open to avoid overlap) */}
      {showMiniMap && !showAdjustments && (
        <div className="absolute top-4 right-4 pointer-events-auto mt-16 scale-75 origin-top-right opacity-50">
          <MiniMap />
        </div>
      )}

      {/* Side panels */}
      <div className={`absolute top-0 left-0 max-h-full w-full md:w-80 transition-transform duration-300 pointer-events-auto ${activePanel ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {activePanel === 'events' && <EventsPanel />}
        {activePanel === 'zones' && <ZonesPanel />}
        {activePanel === 'friends' && <FriendsPanel />}
        {activePanel === 'menu' && <MenuPanel />}
      </div>

      {/* Bottom navigation */}
      {!showAdjustments && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
          <BottomNav />
        </div>
      )}
    </div>
  )
}
