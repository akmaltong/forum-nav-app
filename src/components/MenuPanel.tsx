import { useAppStore } from '../store/appStore'

export default function MenuPanel() {
  const setActivePanel = useAppStore(state => state.setActivePanel)
  const viewMode = useAppStore(state => state.viewMode)
  const setViewMode = useAppStore(state => state.setViewMode)
  const showMiniMap = useAppStore(state => state.showMiniMap)
  const toggleMiniMap = useAppStore(state => state.toggleMiniMap)
  const setEditMode = (enabled: boolean) => useAppStore.setState({ editMode: enabled })
  const setPoiEditMode = (enabled: boolean) => useAppStore.setState({ poiEditMode: enabled })
  const editMode = useAppStore(state => state.editMode)
  const poiEditMode = useAppStore(state => state.poiEditMode)

  const menuItems = [
    {
      icon: '🏠',
      title: 'Главная',
      description: 'Вернуться к обзору',
      action: () => {
        setViewMode('angle')
        setActivePanel(null)
      }
    },
    {
      icon: '✏️',
      title: 'Редактор зон',
      description: 'Настройка позиций зон',
      action: () => {
        setEditMode(true)
        setActivePanel(null)
      }
    },
    {
      icon: '🎥',
      title: 'Режим POI',
      description: 'Настройка точек обзора',
      action: () => {
        setPoiEditMode(true)
        setActivePanel(null)
      }
    },
    {
      icon: '🗺️',
      title: showMiniMap ? 'Скрыть мини-карту' : 'Показать мини-карту',
      description: 'Переключить отображение',
      action: () => toggleMiniMap()
    },
    {
      icon: 'ℹ️',
      title: 'О форуме',
      description: 'Информация о мероприятии',
      action: () => alert('Московский Финансовый Форум 2026')
    },
  ]

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 flex items-center justify-between">
        <h2 className="text-base font-bold">☰ Меню</h2>
        <button
          onClick={() => setActivePanel(null)}
          className="text-white hover:bg-white/20 rounded-full p-2"
        >
          ✕
        </button>
      </div>

      {/* View mode selector */}
      <div className="bg-gray-800 p-2 border-b border-gray-700">
        <div className="text-[11px] text-gray-500 mb-1">Режим просмотра</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setViewMode('top')}
            className={`py-1.5 rounded-lg font-medium transition-all ${viewMode === 'top'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <div className="text-lg mb-0.5">⬇️</div>
            <div className="text-[10px]">Сверху (Ортo)</div>
          </button>
          <button
            onClick={() => setViewMode('angle')}
            className={`py-1.5 rounded-lg font-medium transition-all ${viewMode === 'angle'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <div className="text-lg mb-0.5">📐</div>
            <div className="text-[10px]">Под углом</div>
          </button>
          <button
            onClick={() => setViewMode('first-person')}
            className={`py-1.5 rounded-lg font-medium transition-all col-span-2 ${viewMode === 'first-person'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <div className="text-lg mb-0.5">👁️</div>
            <div className="text-[10px]">От первого лица</div>
          </button>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full bg-gray-800 hover:bg-gray-750 rounded-lg p-2 flex items-center gap-2.5 transition-all text-left"
          >
            <div className="text-xl">{item.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-sm leading-tight">{item.title}</div>
              <div className="text-[11px] text-gray-500 line-clamp-1">{item.description}</div>
            </div>
            <div className="text-gray-700">›</div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-2 text-center text-[10px] text-gray-600 border-t border-gray-700">
        <div className="mb-0.5">Московский Финансовый Форум 2026</div>
        <div>Версия 1.0.0</div>
      </div>
    </div>
  )
}
