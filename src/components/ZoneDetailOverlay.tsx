import { useAppStore } from '../store/appStore'
import { format, isPast, isFuture, isWithinInterval } from 'date-fns'
import { calculateRoute } from '../utils/navigation'
import { createNavigationNotification } from '../utils/notifications'

export default function ZoneDetailOverlay() {
    const selectedZone = useAppStore(state => state.selectedZone)
    const setSelectedZone = useAppStore(state => state.setSelectedZone)
    const events = useAppStore(state => state.events)
    const userLocation = useAppStore(state => state.userLocation)
    const setRoute = useAppStore(state => state.setRoute)
    const setCameraTarget = useAppStore(state => state.setCameraTarget)
    const addNotification = useAppStore(state => state.addNotification)
    const setActivePanel = useAppStore(state => state.setActivePanel)
    const viewMode = useAppStore(state => state.viewMode)
    const setViewMode = useAppStore(state => state.setViewMode)

    if (!selectedZone) return null

    const zoneEvents = events.filter(e => e.zoneId === selectedZone.id)
    const now = new Date()

    const currentEvents = zoneEvents.filter(e => isWithinInterval(now, { start: e.startTime, end: e.endTime }))
    const upcomingEvents = zoneEvents.filter(e => isFuture(e.startTime))
    const pastEvents = zoneEvents.filter(e => isPast(e.endTime))

    const handleNavigate = () => {
        if (userLocation) {
            const route = calculateRoute(userLocation.position, selectedZone.position)
            setRoute(route)
            addNotification(createNavigationNotification(selectedZone.name, route.distance, route.estimatedTime))

            // Requirements: Close window, switch to FPS, return camera to person ("You are here")
            setViewMode('first-person')
            setCameraTarget(null) // This will make camera follow user or stay at user position

            setSelectedZone(null)
            setActivePanel(null)
        }
    }

    return (
        <div className="absolute top-6 left-6 w-[95%] max-w-sm bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-5 pointer-events-auto animate-corner-fade-in overflow-hidden max-h-[85vh] flex flex-col z-50">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ backgroundColor: selectedZone.color + '30', border: `1px solid ${selectedZone.color}` }}
                    >
                        {selectedZone.type === 'conference' && '🎤'}
                        {selectedZone.type === 'exhibition' && '🏢'}
                        {selectedZone.type === 'food' && '🍽️'}
                        {selectedZone.type === 'registration' && '📝'}
                        {selectedZone.type === 'lounge' && '☕'}
                        {selectedZone.type === 'other' && '📍'}
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg leading-tight">{selectedZone.name}</h2>
                        <p className="text-gray-400 text-xs">{selectedZone.description}</p>
                    </div>
                </div>
                <button
                    onClick={() => setSelectedZone(null)}
                    className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors"
                >
                    ✕
                </button>
            </div>

            {/* Navigation Button */}
            <div className="mb-6 shrink-0">
                <button
                    onClick={handleNavigate}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 group"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform">🧭</span>
                    <span>ПОЕХАЛИ! (МАРШРУТ)</span>
                </button>
            </div>

            {/* Events List */}
            <div className="overflow-y-auto flex-1 space-y-4 pr-1 scrollbar-thin">
                {/* Ongoing */}
                {currentEvents.length > 0 && (
                    <div>
                        <h3 className="text-green-400 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Сейчас идет
                        </h3>
                        <div className="space-y-2">
                            {currentEvents.map(event => (
                                <div key={event.id} className="bg-white/5 rounded-lg p-3 border border-green-500/20">
                                    <div className="font-bold text-sm text-white">{event.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        до {format(event.endTime, 'HH:mm')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming */}
                {upcomingEvents.length > 0 && (
                    <div>
                        <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Скоро будет</h3>
                        <div className="space-y-2">
                            {upcomingEvents.map(event => (
                                <div key={event.id} className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <div className="font-bold text-sm text-gray-200">{event.title}</div>
                                    <div className="text-xs text-blue-400 mt-1 font-medium">
                                        {format(event.startTime, 'HH:mm')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Past */}
                {pastEvents.length > 0 && (
                    <div>
                        <h3 className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-2">Прошедшие</h3>
                        <div className="space-y-2 opacity-60">
                            {pastEvents.map(event => (
                                <div key={event.id} className="bg-white/5 rounded-lg p-3">
                                    <div className="font-bold text-sm text-gray-400 line-through">{event.title}</div>
                                    <div className="text-[10px] text-gray-600 mt-1">завершено</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {zoneEvents.length === 0 && (
                    <div className="py-8 text-center">
                        <div className="text-3xl mb-2 opacity-30">📅</div>
                        <p className="text-gray-500 text-sm">Событий не запланировано</p>
                    </div>
                )}
            </div>
        </div>
    )
}
