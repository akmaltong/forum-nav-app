import { useMemo } from 'react'
import { useAppStore } from '../store/appStore'
import * as THREE from 'three'

export function AtmosphereSky() {
  const timeOfDay = useAppStore(state => state.timeOfDay)
  const sunOrientation = useAppStore(state => state.sunOrientation)
  const nightLightsEnabled = useAppStore(state => state.nightLightsEnabled)
  const lightingMode = useAppStore(state => state.lightingMode)

  const lighting = useMemo(() => {
    const hours = timeOfDay
    
    // Calculate sun position based on time
    // 6am = sunrise (0), 12pm = noon (PI/2), 6pm = sunset (PI)
    const dayProgress = (hours - 6) / 12 // 0 at 6am, 0.5 at noon, 1 at 6pm
    const sunAngle = dayProgress * Math.PI
    
    // Add orientation offset
    const orientationRad = (sunOrientation * Math.PI) / 180
    
    // Sun position calculation
    const sunX = Math.cos(sunAngle) * Math.cos(orientationRad) * 100
    const sunY = Math.sin(sunAngle) * 100
    const sunZ = Math.cos(sunAngle) * Math.sin(orientationRad) * 100
    
    const sunPosition: [number, number, number] = [sunX, Math.max(sunY, -20), sunZ]
    
    // Calculate colors based on time
    let sunColor = '#ffffff'
    let ambientColor = '#ffffff'
    let skyColor = '#87CEEB'
    
    if (hours < 5 || hours > 21) {
      // Night
      sunColor = '#1a1a2e'
      ambientColor = '#0f0f1a'
      skyColor = '#0a0a15'
    } else if (hours < 7) {
      // Sunrise
      const t = (hours - 5) / 2
      sunColor = `rgb(${255}, ${100 + t * 155}, ${50 + t * 205})`
      ambientColor = `rgb(${20 + t * 80}, ${15 + t * 85}, ${30 + t * 70})`
      skyColor = `rgb(${30 + t * 100}, ${20 + t * 80}, ${40 + t * 110})`
    } else if (hours > 19) {
      // Sunset
      const t = (21 - hours) / 2
      sunColor = `rgb(${255}, ${100 + t * 155}, ${50 + t * 205})`
      ambientColor = `rgb(${20 + t * 80}, ${15 + t * 85}, ${30 + t * 70})`
      skyColor = `rgb(${50 + t * 80}, ${30 + t * 60}, ${60 + t * 90})`
    } else if (hours >= 10 && hours <= 16) {
      // Noon - bright
      sunColor = '#fffef0'
      ambientColor = '#e8f4ff'
      skyColor = '#4a90e2'
    } else {
      // Day
      sunColor = '#fff8e7'
      ambientColor = '#f0f8ff'
      skyColor = '#87CEEB'
    }
    
    // Intensity calculations
    const heightFactor = Math.max(0, Math.sin(sunAngle))
    const sunIntensity = 0.5 + heightFactor * 2.5 // 0.5 to 3.0
    const ambientIntensity = 0.2 + heightFactor * 0.8 // 0.2 to 1.0
    
    const isNight = hours < 6 || hours > 20
    const isGoldenHour = (hours >= 5 && hours <= 8) || (hours >= 17 && hours <= 20)
    
    return { 
      sunPosition, 
      sunIntensity, 
      sunColor,
      ambientIntensity, 
      ambientColor,
      skyColor,
      isNight,
      isGoldenHour,
      heightFactor 
    }
  }, [timeOfDay, sunOrientation])

  // In HDRI mode, no extra lights needed — Scene3D handles HDRI-synced lighting
  if (lightingMode === 'hdri') {
    return null
  }

  // Sun / Sky mode - full dynamic lighting system
  return (
    <>
      {/* Hemisphere light for sky/ground ambient */}
      <hemisphereLight
        args={[lighting.skyColor, lighting.isNight ? '#1a1a2e' : '#666666', lighting.ambientIntensity]}
      />
      
      {/* Main sun light */}
      <directionalLight
        position={lighting.sunPosition}
        intensity={lighting.sunIntensity}
        color={lighting.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-bias={-0.0005}
      />

      {/* Fill light from opposite side (sky reflection) */}
      <directionalLight
        position={[-lighting.sunPosition[0], Math.abs(lighting.sunPosition[1]) * 0.5, -lighting.sunPosition[2]]}
        intensity={lighting.sunIntensity * 0.4}
        color={lighting.isGoldenHour ? '#ffaa66' : '#b8d4ff'}
      />

      {/* Ground bounce light */}
      <directionalLight
        position={[0, -30, 0]}
        intensity={lighting.sunIntensity * 0.2}
        color={lighting.isNight ? '#1a1a3e' : '#8b7355'}
      />

      {/* Ambient fill */}
      <ambientLight 
        intensity={lighting.ambientIntensity * 0.3} 
        color={lighting.ambientColor}
      />

      {/* Night lights */}
      {nightLightsEnabled && lighting.isNight && (
        <>
          <pointLight position={[0, 15, 0]} intensity={1.2} color="#ffddaa" distance={80} decay={1.2} />
          <pointLight position={[-20, 12, 20]} intensity={0.6} color="#ffcc88" distance={50} decay={1.2} />
          <pointLight position={[20, 12, -20]} intensity={0.6} color="#ffcc88" distance={50} decay={1.2} />
          <pointLight position={[-20, 12, -20]} intensity={0.4} color="#ffaa66" distance={40} decay={1.5} />
          <pointLight position={[20, 12, 20]} intensity={0.4} color="#ffaa66" distance={40} decay={1.5} />
        </>
      )}
    </>
  )
}

export default AtmosphereSky
