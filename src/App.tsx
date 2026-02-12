import { useState, useEffect } from 'react'
import Scene3D from './components/Scene3D'
import UIOverlay from './components/UIOverlay'
import StoreInitializer from './components/StoreInitializer'
import FullscreenToggle from './components/FullscreenToggle'
import { useEventNotifications } from './hooks/useEventNotifications'

function App() {
  // Enable event notifications
  useEventNotifications()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Quick loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center" 
           style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a24 100%)' }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
               style={{
                 background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.1) 100%)',
                 border: '2px solid rgba(212,175,55,0.3)',
                 boxShadow: '0 0 30px rgba(212,175,55,0.2)'
               }}>
            <div className="w-8 h-8 rounded-full animate-pulse"
                 style={{
                   background: 'linear-gradient(135deg, #D4AF37 0%, #F4E8C1 50%, #D4AF37 100%)'
                 }}>
            </div>
          </div>
          <div className="gold-shine-text text-xl font-bold">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative" style={{ background: '#0a0a0f' }}>
      <StoreInitializer />
      <Scene3D />
      <UIOverlay />
      <FullscreenToggle />
    </div>
  )
}

export default App
