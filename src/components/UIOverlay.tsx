import { useState, useEffect } from 'react'
import MiniMap from './MiniMap'
import BottomNav from './BottomNav'
import NotificationBar from './NotificationBar'
import { useAppStore } from '../store/appStore'
import AdjustmentsPanel from './AdjustmentsPanel'
import EventsPanel from './EventsPanel'
import ZonesPanel from './ZonesPanel'
import FriendsPanel from './FriendsPanel'
import MenuPanel from './MenuPanel'
import ZoneEditor from './ZoneEditor'
import ZoneDetailOverlay from './ZoneDetailOverlay'
import ARView from './ARView'
import SettingsPanel from './SettingsPanel'
import { FPSDisplay } from './FPSCounter'

export default function UIOverlay() {
  const activePanel = useAppStore(state => state.activePanel)
  const arMode = useAppStore(state => state.arMode)
  const showMiniMap = useAppStore(state => state.showMiniMap)
  const showFPS = useAppStore(state => state.showFPS)
  const activeBottomPanel = useAppStore(state => state.activeBottomPanel)
  const viewMode = useAppStore(state => state.viewMode)
  const selectedZone = useAppStore(state => state.selectedZone)
  const isFullscreen = useAppStore(state => state.isFullscreen)
  const showUIInFullscreen = useAppStore(state => state.showUIInFullscreen)
  const toggleUIInFullscreen = useAppStore(state => state.toggleUIInFullscreen)
  
  // Track previous panel for smooth closing animation
  const [lastActivePanel, setLastActivePanel] = useState<string | null>(null)
  const [lastBottomPanel, setLastBottomPanel] = useState<string | null>(null)

  // Debug logging
  console.log('UIOverlay render:', { activeBottomPanel, lastBottomPanel })

  useEffect(() => {
    if (activePanel) {
      setLastActivePanel(activePanel)
    } else {
      // Delay clearing to allow animation to complete
      const timer = setTimeout(() => setLastActivePanel(null), 300)
      return () => clearTimeout(timer)
    }
  }, [activePanel])

  useEffect(() => {
    if (activePanel) {
      setLastActivePanel(activePanel)
    } else {
      // Delay clearing to allow animation to complete
      const timer = setTimeout(() => setLastActivePanel(null), 300)
      return () => clearTimeout(timer)
    }
  }, [activePanel])

  useEffect(() => {
    if (activeBottomPanel) {
      setLastBottomPanel(activeBottomPanel)
    } else {
      // Delay clearing to allow animation to complete
      const timer = setTimeout(() => setLastBottomPanel(null), 300)
      return () => clearTimeout(timer)
    }
  }, [activeBottomPanel])

  const panelToShow = activePanel || lastActivePanel
  const bottomPanelToShow = activeBottomPanel || lastBottomPanel

  if (arMode) {
    return <ARView />
  }

  const hasFloatingPanel = activeBottomPanel === 'lighting' || activeBottomPanel === 'settings'

  // Minimap visibility: show only when no panels/overlays are open, not in first-person, and on desktop
  const showMiniMapVisible = showMiniMap && !hasFloatingPanel && !activePanel && !selectedZone && viewMode !== 'first-person'

  // Hide UI in fullscreen mode unless toggled
  const shouldShowUI = !isFullscreen || showUIInFullscreen

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Fullscreen UI toggle button - always visible in fullscreen */}
      {isFullscreen && (
        <div className="absolute pointer-events-auto" style={{ bottom: '20px', right: '20px', zIndex: 9999 }}>
          <button
            onClick={toggleUIInFullscreen}
            className="transition-all duration-300 hover:scale-110 active:scale-95 relative"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: showUIInFullscreen ? 'rgba(212, 175, 55, 0.9)' : 'rgba(40, 40, 40, 0.95)',
              backdropFilter: 'blur(12px)',
              border: showUIInFullscreen ? '2px solid rgba(212, 175, 55, 1)' : '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(212, 175, 55, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              animation: showUIInFullscreen ? 'none' : 'pulse 2s infinite',
            }}
            title={showUIInFullscreen ? 'Скрыть UI' : 'Показать UI'}
          >
            {showUIInFullscreen ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>

      {shouldShowUI && (
        <>
          {/* Top bar with notifications */}
          <NotificationBar />

      {/* Header Info */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pt-safe pl-safe">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-white font-bold text-xs sm:text-sm tracking-tight opacity-90">MFF</span>
          <span className="text-gray-400 text-xs sm:text-sm">|</span>
          <span className="text-gray-300 text-xs sm:text-sm font-medium">3D Navigation</span>
        </div>
        <div className="text-[9px] text-white/30 font-mono tracking-wide">v1.2.0</div>
        {showFPS && <FPSDisplay />}
      </div>

      {/* Mini map - aligned with header text */}
      {showMiniMapVisible && (
        <div
          className="absolute top-3 sm:top-4 right-3 sm:right-4 pointer-events-auto scale-50 sm:scale-75 origin-top-right transition-opacity duration-500 pt-safe pr-safe"
          style={{ opacity: 0.6 }}
        >
          <MiniMap />
        </div>
      )}

      {/* Floating bottom panels */}
      {activeBottomPanel === 'lighting' && <AdjustmentsPanel />}
      {activeBottomPanel === 'settings' && <SettingsPanel />}

      {/* Zone Editor */}
      <ZoneEditor />

      {/* Zone Details */}
      <ZoneDetailOverlay />

      {/* Side panels with smooth open/close animation */}
      <div 
        className={`absolute left-0 w-[85%] sm:w-80 transition-transform duration-300 ease-in-out pointer-events-auto z-40 ${
          activePanel ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          top: '80px',
          bottom: '120px',
          maxHeight: 'calc(100vh - 200px)'
        }}
      >
        {panelToShow === 'events' && <EventsPanel />}
        {panelToShow === 'zones' && <ZonesPanel />}
        {panelToShow === 'friends' && <FriendsPanel />}
        {panelToShow === 'menu' && <MenuPanel />}
      </div>

      {/* Backdrop overlay - close panels on tap */}
      {activePanel && (
        <div
          className="absolute inset-0 pointer-events-auto z-30"
          onClick={() => {
            useAppStore.getState().setActivePanel(null)
          }}
        />
      )}

      {/* Bottom navigation - always visible with extra padding */}
      <div className="absolute left-0 right-0 pointer-events-auto z-50" style={{ bottom: '-42px' }}>
        <BottomNav />
      </div>
        </>
      )}
    </div>
  )
}