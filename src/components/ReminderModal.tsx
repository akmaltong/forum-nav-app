import { useState } from 'react'

interface ReminderModalProps {
  eventTitle: string
  onClose: () => void
  onSetReminder: (minutesBefore: number) => void
  currentReminder?: number
}

export default function ReminderModal({ eventTitle, onClose, onSetReminder, currentReminder }: ReminderModalProps) {
  const [selectedMinutes, setSelectedMinutes] = useState(currentReminder || 15)

  const reminderOptions = [
    { label: 'За 5 минут', value: 5 },
    { label: 'За 15 минут', value: 15 },
    { label: 'За 30 минут', value: 30 },
    { label: 'За 1 час', value: 60 },
  ]

  const handleSet = () => {
    onSetReminder(selectedMinutes)
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative z-10 w-80 p-5 text-white"
        style={{
          backgroundColor: 'rgba(40, 40, 40, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%) brightness(0.7)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(0.7)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-2">
            <h3 className="text-sm font-semibold text-gray-200 mb-1">Напоминание</h3>
            <p className="text-xs text-gray-400 line-clamp-2">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-5">
          {reminderOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedMinutes(option.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedMinutes === option.value
                  ? 'bg-blue-500/30 text-blue-300 ring-1 ring-blue-400/50'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSet}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Установить
          </button>
        </div>
      </div>
    </div>
  )
}
