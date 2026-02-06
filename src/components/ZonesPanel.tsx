import { useAppStore } from '../store/appStore'
import { calculateRoute } from '../utils/navigation'
import { createNavigationNotification } from '../utils/notifications'

export default function ZonesPanel() {
  const zones = useAppStore(state => state.zones)
  const selectedZone = useAppStore(state => state.selectedZone)
  const setSelectedZone = useAppStore(state => state.setSelectedZone)
  const setActivePanel = useAppStore(state => state.setActivePanel)
  const events = useAppStore(state => state.events)
  const setViewMode = useAppStore(state => state.setViewMode)
  const setRoute = useAppStore(state => state.setRoute)

  const handleTeleport = (zone: typeof zones[0]) => {
    setSelectedZone(zone)
    setViewMode('angle')

    // Fly camera to zone
    const { setCameraTarget } = useAppStore.getState()
    setCameraTarget(zone.id)

    setActivePanel(null)
  }

  const handleNavigate = (zone: typeof zones[0]) => {
    const userLocation = useAppStore.getState().userLocation

    if (userLocation) {
      setSelectedZone(zone)

      // Use navigation utility
      const route = calculateRoute(userLocation.position, zone.position)
      setRoute(route)

      // Create notification
      const { addNotification } = useAppStore.getState()
      addNotification(createNavigationNotification(zone.name, route.distance, route.estimatedTime))

      setActivePanel(null)
    }
  }

  const getZoneEvents = (zoneId: string) => {
    return events.filter(e => e.zoneId === zoneId)
  }

  return (
    <div className="max-h-[calc(100vh-60px)] bg-gray-900/95 backdrop-blur-md text-white overflow-hidden flex flex-col rounded-br-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-2 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold">🗺️ Зоны форума</h2>
        <button
          onClick={() => setActivePanel(null)}
          className="text-white hover:bg-white/20 rounded-full p-1"
        >
          ✕
        </button>
      </div>

      {/* Zones list */}
      <div className="overflow-y-auto p-1.5 space-y-1">
        {zones.map(zone => {
          const zoneEvents = getZoneEvents(zone.id)
          const isSelected = selectedZone?.id === zone.id

          return (
            <div
              key={zone.id}
              className={`bg-gray-800/80 rounded-lg px-2 py-1.5 border-l-3 cursor-pointer transition-all hover:bg-gray-700/80 ${isSelected ? 'ring-1 ring-purple-400' : ''
                }`}
              style={{ borderLeftColor: zone.color, borderLeftWidth: '3px' }}
              onClick={() => {
                if (!isSelected) {
                  handleTeleport(zone)
                } else {
                  setSelectedZone(null)
                }
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm shrink-0">
                  {zone.type === 'conference' && '🎤'}
                  {zone.type === 'exhibition' && '🏢'}
                  {zone.type === 'food' && '🍽️'}
                  {zone.type === 'registration' && '📝'}
                  {zone.type === 'lounge' && '☕'}
                  {zone.type === 'other' && '📍'}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs leading-tight truncate">{zone.name}</h3>
                  <p className="text-[10px] text-gray-500 truncate">{zone.description}</p>
                </div>
              </div>

              {isSelected && (
                <div className="mt-1 pt-1 border-t border-gray-700 flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNavigate(zone)
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-0.5 rounded font-medium transition-colors text-[10px]"
                  >
                    🧭 Маршрут
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTeleport(zone)
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-0.5 rounded font-medium transition-colors text-[10px]"
                  >
                    👁️ Обзор
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
