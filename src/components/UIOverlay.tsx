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

      {/* Header Info */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-white font-bold text-xs sm:text-sm tracking-tight opacity-90">МФФ</span>
          <span className="text-gray-400 text-xs sm:text-sm">|</span>
          <span className="text-gray-300 text-xs sm:text-sm font-medium">3D Навигация</span>
        </div>
        <div className="text-[9px] sm:text-[10px] text-gray-400 leading-tight hidden sm:block">
          Московский Финансовый Форум<br />
          Интерактивная навигация по площадке
        </div>
      </div>

      {/* Settings Toggle Button (Top Right) */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setShowAdjustments(!showAdjustments)}
          className={`p-2 rounded-xl border transition-all backdrop-blur-xl ${showAdjustments
            ? 'bg-white/15 border-white/20 text-white'
            : 'bg-black/30 border-white/[0.08] text-gray-400 hover:text-white hover:bg-black/40'
            }`}
          title="Toggle Settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>
      </div>

      {/* Adjustments Panel */}
      {showAdjustments && <AdjustmentsPanel />}

      {/* Zone Editor */}
      <ZoneEditor />

      {/* Zone Details */}
      <ZoneDetailOverlay />

      {/* Mini map (Hidden if settings are open to avoid overlap) */}
      {showMiniMap && !showAdjustments && (
        <div className="absolute top-4 right-4 pointer-events-auto mt-16 scale-75 origin-top-right opacity-50 hidden sm:block">
          <MiniMap />
        </div>
      )}

      {/* Side panels — full width on mobile, fixed width on desktop */}
      <div className={`absolute top-0 left-0 max-h-full w-full sm:w-80 transition-transform duration-300 pointer-events-auto z-40 ${activePanel ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {activePanel === 'events' && <EventsPanel />}
        {activePanel === 'zones' && <ZonesPanel />}
        {activePanel === 'friends' && <FriendsPanel />}
        {activePanel === 'menu' && <MenuPanel />}
      </div>

      {/* Backdrop overlay for mobile when panel is open */}
      {activePanel && (
        <div
          className="absolute inset-0 bg-black/30 sm:hidden pointer-events-auto z-30"
          onClick={() => useAppStore.getState().setActivePanel(null)}
        />
      )}

      {/* Bottom navigation */}
      {!showAdjustments && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-auto z-20">
          <BottomNav />
        </div>
      )}
    </div>
  )
}
