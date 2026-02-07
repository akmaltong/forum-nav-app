import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAppStore } from '../store/appStore'

import {
  Atmosphere,
  Sky,
  Stars,
  SunLight,
  SkyLight,
  type AtmosphereApi,
} from '@takram/three-atmosphere/r3f'

// ============================================================================
// AtmosphereScene — Wraps the entire scene in <Atmosphere> context.
//
// Uses @takram/three-atmosphere for physically-accurate:
//   - Sky dome (Bruneton 2017 precomputed atmospheric scattering)
//   - Star field (from stars.bin catalog)
//   - Sun directional light (position computed from date/time)
//   - Sky ambient light (irradiance from sky hemisphere)
//
// The EffectComposer with ToneMapping/SMAA/AerialPerspective is in Effects.tsx.
// ============================================================================

interface AtmosphereSceneProps {
  children: React.ReactNode
}

export function AtmosphereScene({ children }: AtmosphereSceneProps) {
  const atmosphereRef = useRef<AtmosphereApi>(null)
  const timeOfDay = useAppStore(state => state.timeOfDay)
  const sunOrientation = useAppStore(state => state.sunOrientation)
  const atmosphereEnabled = useAppStore(state => state.atmosphereEnabled)
  const backgroundMode = useAppStore(state => state.backgroundMode)

  const isActive = atmosphereEnabled && backgroundMode === 'sky'

  // Compute a Date from timeOfDay + sunOrientation
  // Following the reference implementation's approach:
  // - timeOfDay controls the hour (0-24)
  // - sunOrientation varies the day-of-year for azimuth variety
  const targetDate = useMemo(() => {
    const year = new Date().getFullYear()
    // Use UTC-based epoch like the reference to avoid timezone issues
    const epoch = Date.UTC(year, 0, 1, 0, 0, 0, 0)
    // sunOrientation maps to day-of-year (0-365)
    const dayOfYear = Math.floor((sunOrientation / 360) * 365) + 1
    // Convert timeOfDay (0-24) to milliseconds offset
    const ms = epoch + (dayOfYear * 24 + timeOfDay) * 3600000
    return new Date(ms)
  }, [timeOfDay, sunOrientation])

  useFrame(({ gl }) => {
    // Sync exposure
    const exposure = useAppStore.getState().toneMappingExposure
    gl.toneMappingExposure = exposure

    // Update sun/moon position from date
    if (atmosphereRef.current && isActive) {
      atmosphereRef.current.updateByDate(targetDate)
    }
  })

  // If atmosphere is off, just render children without the wrapper
  if (!isActive) {
    return <>{children}</>
  }

  return (
    <Atmosphere ref={atmosphereRef} correctAltitude>
      {/* Sky dome — physically-accurate atmospheric scattering background */}
      <Sky />
      <Stars data="atmosphere/stars.bin" />

      {/* Physical sun and sky light sources */}
      <SunLight intensity={2} castShadow />
      <SkyLight intensity={0.5} />

      {/* All scene content goes here */}
      {children}
    </Atmosphere>
  )
}

// Default export kept for backward compatibility
export default function AtmosphereEffects() {
  return null
}
