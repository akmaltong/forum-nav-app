import { useState, useEffect } from 'react'
import Scene3D from './components/Scene3D'
import UIOverlay from './components/UIOverlay'
import StoreInitializer from './components/StoreInitializer'
import { useAppStore } from './store/appStore'
import { useEventNotifications } from './hooks/useEventNotifications'

function App() {
  // Enable event notifications
  useEventNotifications()
  const [isLoading, setIsLoading] = useState(true)
  const [showQRScan, setShowQRScan] = useState(true)

  useEffect(() => {
    // Simulate QR scan or direct entry
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleEnter = () => {
    setShowQRScan(false)
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark">
        <div className="text-white text-2xl">Загрузка...</div>
      </div>
    )
  }

  if (showQRScan) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Московский Финансовый Форум</h1>
          <p className="text-blue-200 text-lg">3D Навигация по площадке</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8">
          <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-xl">
            <div className="text-gray-500 text-center">
              <div className="text-6xl mb-2">📱</div>
              <div className="text-sm">Отсканируйте QR-код<br />на входе</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleEnter}
          className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 transition-all transform hover:scale-105"
        >
          Войти в навигацию
        </button>

        <div className="mt-8 text-blue-200 text-sm text-center max-w-md">
          <p>После сканирования QR-кода вы получите доступ к:</p>
          <ul className="mt-2 space-y-1">
            <li>✓ 3D карте форума</li>
            <li>✓ Навигации в реальном времени</li>
            <li>✓ AR направлениям</li>
            <li>✓ Расписанию мероприятий</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <StoreInitializer />
      <Scene3D />
      <UIOverlay />
    </div>
  )
}

export default App
