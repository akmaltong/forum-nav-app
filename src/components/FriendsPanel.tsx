import { useAppStore } from '../store/appStore'
import { calculateRoute } from '../utils/navigation'
import { createNavigationNotification } from '../utils/notifications'

export default function FriendsPanel() {
  const friends = useAppStore(state => state.friends)
  const selectedFriend = useAppStore(state => state.selectedFriend)
  const setSelectedFriend = useAppStore(state => state.setSelectedFriend)
  const setActivePanel = useAppStore(state => state.setActivePanel)
  const setRoute = useAppStore(state => state.setRoute)

  const handleNavigateToFriend = (friend: typeof friends[0]) => {
    const userLocation = useAppStore.getState().userLocation

    if (userLocation) {
      // Use navigation utility
      const route = calculateRoute(userLocation.position, friend.location.position)
      setRoute(route)

      // Create notification
      const { addNotification } = useAppStore.getState()
      addNotification(createNavigationNotification(friend.name, route.distance, route.estimatedTime))

      setActivePanel(null)
    }
  }

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-2.5 flex items-center justify-between">
        <h2 className="text-base font-bold">👥 Друзья на форуме</h2>
        <button
          onClick={() => setActivePanel(null)}
          className="text-white hover:bg-white/20 rounded-full p-2"
        >
          ✕
        </button>
      </div>

      {/* Online count */}
      <div className="bg-gray-800 p-1.5 text-center text-xs">
        <span className="text-green-400 font-bold">
          {friends.filter(f => f.isOnline).length} онлайн
        </span>
        <span className="text-gray-500"> из {friends.length}</span>
      </div>

      {/* Friends list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {friends.map(friend => {
          const isSelected = selectedFriend?.id === friend.id

          return (
            <div
              key={friend.id}
              className={`bg-gray-800 rounded-lg p-2 cursor-pointer transition-all hover:bg-gray-750 ${isSelected ? 'ring-2 ring-green-400' : ''
                } ${!friend.isOnline ? 'opacity-50' : ''}`}
              onClick={() => setSelectedFriend(isSelected ? null : friend)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-lg">
                    👤
                  </div>
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-sm leading-tight">{friend.name}</h3>
                  <p className="text-[11px] text-gray-500">
                    {friend.isOnline ? '🟢 В сети' : '⚫ Не в сети'}
                  </p>
                </div>
              </div>

              {isSelected && friend.isOnline && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-[11px] text-gray-500 mb-2">
                    Местоположение: Главная площадка
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNavigateToFriend(friend)
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg font-medium transition-colors text-xs"
                    >
                      🧭 Найти на карте
                    </button>
                    <button
                      className="px-3 bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded-lg font-medium transition-colors"
                    >
                      💬
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {friends.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <div className="text-6xl mb-4">👥</div>
            <p>У вас пока нет друзей на форуме</p>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Добавить друзей
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
