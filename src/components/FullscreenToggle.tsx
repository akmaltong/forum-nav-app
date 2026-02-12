import { useAppStore } from '../store/appStore'

export default function FullscreenToggle() {
  const isFullscreen = useAppStore(state => state.isFullscreen)
  const showUIInFullscreen = useAppStore(state => state.showUIInFullscreen)
  const toggleUIInFullscreen = useAppStore(state => state.toggleUIInFullscreen)

  // Only show in fullscreen mode
  if (!isFullscreen) return null

  return (
    <div 
      className="fixed pointer-events-auto" 
      style={{ 
        bottom: '20px', 
        right: '20px', 
        zIndex: 99999
      }}
    >
      <button
        onClick={toggleUIInFullscreen}
        className="group relative flex items-center justify-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-full border hover:scale-105 active:scale-95"
        style={{
          width: '48px',
          height: '48px',
          minWidth: '48px',
          minHeight: '48px',
          backgroundColor: 'rgba(40,40,40,0.7)',
          borderColor: 'rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), inset 0 -1px 0 0 rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.4)',
        }}
        title={showUIInFullscreen ? 'Скрыть UI' : 'Показать UI'}
      >
        <div className="shrink-0 text-white flex items-center justify-center" style={{ width: '24px', height: '24px' }}>
          {showUIInFullscreen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </div>
      </button>
    </div>
  )
}
