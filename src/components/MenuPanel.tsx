import { useAppStore } from '../store/appStore'

export default function MenuPanel() {
  const setActivePanel = useAppStore(state => state.setActivePanel)
  const viewMode = useAppStore(state => state.viewMode)
  const setViewMode = useAppStore(state => state.setViewMode)
  const showMiniMap = useAppStore(state => state.showMiniMap)
  const toggleMiniMap = useAppStore(state => state.toggleMiniMap)
  const setEditMode = (enabled: boolean) => useAppStore.setState({ editMode: enabled })
  const setPoiEditMode = (enabled: boolean) => useAppStore.setState({ poiEditMode: enabled })

  const viewModes: { id: string; label: string; icon: React.ReactNode }[] = [
    {
      id: 'top',
      label: 'Сверху',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      ),
    },
    {
      id: 'angle',
      label: 'Под углом',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      id: 'first-person',
      label: 'От первого лица',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ]

  const menuItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      title: 'Главная',
      description: 'Вернуться к обзору',
      action: () => {
        setViewMode('angle')
        setActivePanel(null)
      },
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
      title: 'Редактор зон',
      description: 'Настройка позиций зон',
      action: () => {
        setEditMode(true)
        setActivePanel(null)
      },
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ),
      title: 'Режим POI',
      description: 'Настройка точек обзора',
      action: () => {
        setPoiEditMode(true)
        setActivePanel(null)
      },
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      ),
      title: showMiniMap ? 'Скрыть мини-карту' : 'Показать мини-карту',
      description: 'Переключить отображение',
      action: () => toggleMiniMap(),
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      title: 'О форуме',
      description: 'Информация о мероприятии',
      action: () => alert('Московский Финансовый Форум 2026'),
    },
  ]

  return (
    <div className="max-h-[calc(100vh-60px)] bg-black/40 backdrop-blur-xl text-white overflow-hidden flex flex-col rounded-2xl m-2 border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-200">Настройки</h2>
        </div>
        <button
          onClick={() => setActivePanel(null)}
          className="text-gray-500 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* View mode selector */}
      <div className="px-3 py-2 border-b border-white/[0.06]">
        <div className="text-[10px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Режим просмотра</div>
        <div className="flex gap-1.5">
          {viewModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl font-medium transition-all text-[10px] ${viewMode === mode.id
                ? 'bg-white/10 text-white border border-white/10'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
            >
              <div className={viewMode === mode.id ? 'text-blue-400' : ''}>{mode.icon}</div>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-3 transition-all text-left group"
          >
            <div className="text-gray-500 group-hover:text-gray-300 transition-colors">{item.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs leading-tight text-gray-200">{item.title}</div>
              <div className="text-[10px] text-gray-500 truncate">{item.description}</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 group-hover:text-gray-500 transition-colors shrink-0">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 text-center text-[10px] text-gray-600 border-t border-white/[0.06]">
        <div className="mb-0.5">Московский Финансовый Форум 2026</div>
        <div className="text-gray-700">v1.0.0</div>
      </div>
    </div>
  )
}
