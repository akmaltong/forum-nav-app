import { useAppStore } from '../store/appStore'

export default function BottomNav() {
  const activePanel = useAppStore(state => state.activePanel)
  const setActivePanel = useAppStore(state => state.setActivePanel)
  const arMode = useAppStore(state => state.arMode)
  const setArMode = useAppStore(state => state.setArMode)
  const viewMode = useAppStore(state => state.viewMode)
  const setViewMode = useAppStore(state => state.setViewMode)
  const userLocation = useAppStore(state => state.userLocation)

  const buttons = [
    { id: 'events', icon: '📅', label: 'События' },
    { id: 'zones', icon: '🗺️', label: 'Зоны' },
    { id: 'angle', icon: '👁️', label: 'Обзор' },
    { id: 'first-person', icon: '🚶', label: 'Пешком' },
    { id: 'friends', icon: '👥', label: 'Друзья' },
    { id: 'menu', icon: '☰', label: 'Меню' },
  ]

  const handleClick = (id: string) => {
    if (id === 'ar') {
      setArMode(!arMode)
    } else if (id === 'angle' || id === 'first-person') {
      setViewMode(id as any)
      // When switching to first-person via bottom nav, reset camera to user location
      if (id === 'first-person' && userLocation) {
        useAppStore.getState().setCameraTarget(null) // Stop any active flights
      }
    } else {
      setActivePanel(activePanel === id ? null : id as any)
    }
  }

  return (
    <div className="bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pt-4 pb-safe">
      <div className="flex justify-around items-center px-2 pb-2">
        {buttons.map(button => {
          const isActive = button.id === 'ar'
            ? arMode
            : (button.id === 'angle' || button.id === 'first-person')
              ? viewMode === button.id
              : activePanel === button.id

          return (
            <button
              key={button.id}
              onClick={() => handleClick(button.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-xl transition-all ${isActive
                ? 'bg-blue-600 text-white scale-110'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              <span className="text-xl">{button.icon}</span>
              <span className="text-xs font-medium">{button.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
