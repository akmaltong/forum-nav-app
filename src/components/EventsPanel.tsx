import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { events } from '../data/mockData'
import { format, differenceInMinutes } from 'date-fns'
import { calculateRoute } from '../utils/navigation'
import { createNavigationNotification } from '../utils/notifications'

type FilterType = 'all' | 'favorites' | 'now'

export default function EventsPanel() {
  const setActivePanel = useAppStore(state => state.setActivePanel)
  const selectedEvent = useAppStore(state => state.selectedEvent)
  const setSelectedEvent = useAppStore(state => state.setSelectedEvent)
  const favoriteEvents = useAppStore(state => state.favoriteEvents)
  const toggleFavoriteEvent = useAppStore(state => state.toggleFavoriteEvent)
  const zones = useAppStore(state => state.zones)
  const setRoute = useAppStore(state => state.setRoute)
  const setSelectedZone = useAppStore(state => state.setSelectedZone)

  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  useEffect(() => {
    useAppStore.setState({ events })
  }, [])

  // Update event statuses and filter based on active tab
  const eventsWithStatus = useMemo(() => {
    const now = new Date()
    let filtered = events.map(event => {
      const minutesToStart = differenceInMinutes(event.startTime, now)
      const minutesToEnd = differenceInMinutes(event.endTime, now)

      let status: 'upcoming' | 'ongoing' | 'completed' = 'upcoming'
      if (minutesToEnd < 0) status = 'completed'
      else if (minutesToStart <= 0) status = 'ongoing'

      return { ...event, status, minutesToStart }
    })

    // Filter by tab
    if (activeFilter === 'favorites') {
      filtered = filtered.filter(e => favoriteEvents.includes(e.id))
    } else if (activeFilter === 'now') {
      filtered = filtered.filter(e => e.status === 'ongoing' || (e.status === 'upcoming' && e.minutesToStart <= 30))
    }

    return filtered.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  }, [activeFilter, favoriteEvents])

  const handleNavigateToEvent = (event: typeof events[0]) => {
    const zone = zones.find(z => z.id === event.zoneId)
    const userLocation = useAppStore.getState().userLocation

    if (zone && userLocation) {
      setSelectedZone(zone)

      // Set view to FPS for immersive navigation
      useAppStore.getState().setViewMode('first-person')

      // Fly camera to zone
      const { setCameraTarget } = useAppStore.getState()
      setCameraTarget(zone.id)

      // Use navigation utility
      const route = calculateRoute(userLocation.position, zone.position)
      setRoute(route)

      // Create notification
      const { addNotification } = useAppStore.getState()
      addNotification(createNavigationNotification(zone.name, route.distance, route.estimatedTime))

      setActivePanel(null)
    }
  }

  return (
    <div className="max-h-[calc(100vh-60px)] bg-gray-900/95 backdrop-blur-md text-white overflow-hidden flex flex-col rounded-br-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold">📅 Расписание</h2>
        <button
          onClick={() => setActivePanel(null)}
          className="text-white hover:bg-white/20 rounded-full p-1"
        >
          ✕
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800/80 shrink-0">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-1 text-xs font-medium border-b-2 transition-colors ${activeFilter === 'all' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Все
        </button>
        <button
          onClick={() => setActiveFilter('favorites')}
          className={`flex-1 py-1 text-xs font-medium border-b-2 transition-colors ${activeFilter === 'favorites' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Избранное
        </button>
        <button
          onClick={() => setActiveFilter('now')}
          className={`flex-1 py-1 text-xs font-medium border-b-2 transition-colors ${activeFilter === 'now' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Сейчас
        </button>
      </div>

      {/* Events list */}
      <div className="overflow-y-auto p-1.5 space-y-1">
        {eventsWithStatus.length > 0 ? (
          eventsWithStatus.map(event => {
            const isFavorite = favoriteEvents.includes(event.id)
            const zone = zones.find(z => z.id === event.zoneId)

            return (
              <div
                key={event.id}
                className={`bg-gray-800/80 rounded-lg px-2 py-1.5 cursor-pointer transition-all hover:bg-gray-700/80 ${event.status === 'ongoing'
                  ? 'border-l-[3px] border-green-500 bg-green-900/20'
                  : event.status === 'completed'
                    ? 'border-l-[3px] border-gray-600 opacity-60'
                    : 'border-l-[3px] border-blue-500'
                  } ${selectedEvent?.id === event.id ? 'ring-1 ring-blue-400' : ''}`}
                onClick={() => setSelectedEvent(event.id === selectedEvent?.id ? null : event)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs leading-tight truncate">{event.title}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <span>{format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}</span>
                      {zone && (
                        <>
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: zone.color }}
                          />
                          <span className="truncate">{zone.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavoriteEvent(event.id)
                    }}
                    className="text-sm p-0.5 shrink-0"
                  >
                    {isFavorite ? '⭐' : '☆'}
                  </button>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {event.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-1 py-0 bg-gray-700/60 text-gray-500 text-[9px] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {selectedEvent?.id === event.id && (
                  <div className="mt-1.5 pt-1.5 border-t border-gray-700">
                    <p className="text-[10px] text-gray-400 mb-1.5">{event.description}</p>

                    {event.speakers && event.speakers.length > 0 && (
                      <div className="mb-1.5 text-[10px]">
                        <span className="text-gray-500">Спикеры: </span>
                        <span className="text-gray-300">{event.speakers.join(', ')}</span>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNavigateToEvent(event)
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded font-medium transition-colors text-[10px]"
                    >
                      🧭 Проложить маршрут
                    </button>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-500">
            <div className="text-2xl mb-1 opacity-20">
              {activeFilter === 'favorites' ? '⭐' : activeFilter === 'now' ? '📅' : '📂'}
            </div>
            <p className="text-xs">
              {activeFilter === 'favorites'
                ? 'В избранном пока пусто'
                : activeFilter === 'now'
                  ? 'Нет текущих событий'
                  : 'Список пуст'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
