import { useRef, useMemo, useEffect, useState, type ComponentRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useAppStore } from '../store/appStore'

import {
  Atmosphere,
  Sky,
  Stars,
  AerialPerspective,
  type AtmosphereApi,
} from '@takram/three-atmosphere/r3f'
import {
  Ellipsoid,
  Geodetic,
  PointOfView,
  radians,
} from '@takram/three-geospatial'
import {
  Dithering,
  LensFlare,
} from '@takram/three-geospatial-effects/r3f'
import { EastNorthUpFrame, EllipsoidMesh } from '@takram/three-geospatial/r3f'
import { SMAA, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { Fragment } from 'react'

import { AtmosphereEffectComposer } from './Effects'
import { setOrbitControls } from './CameraController'

// Moscow coordinates: 55.75°N, 37.62°E, altitude 200m (building height)
const geodetic = new Geodetic(radians(37.62), radians(55.75), 200)
const position = geodetic.toECEF()

// ============================================================================
// AtmosphereScene — Full geospatial atmosphere scene
//
// When atmosphere is active, replaces the entire scene setup with:
// - Earth-scale coordinate system (ECEF + ENU frame)
// - Physically-accurate sky, stars, sun/sky light
// - AerialPerspective post-processing for atmospheric scattering
// - LensFlare, Dithering, AGX tone mapping
// - EllipsoidMesh for Earth ground surface
//
// When atmosphere is OFF, just passes children through.
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
  const setCameraPosition = useAppStore(state => state.setCameraPosition)
  const setCameraTargetPosition = useAppStore(state => state.setCameraTargetPosition)

  const isActive = atmosphereEnabled && backgroundMode === 'sky'

  // Compute date from timeOfDay + sunOrientation (same as reference)
  const targetDate = useMemo(() => {
    const year = new Date().getFullYear()
    const epoch = Date.UTC(year, 0, 1, 0, 0, 0, 0)
    const dayOfYear = Math.floor((sunOrientation / 360) * 365) + 1
    const ms = epoch + (dayOfYear * 24 + timeOfDay) * 3600000
    return new Date(ms)
  }, [timeOfDay, sunOrientation])

  // Setup camera position using PointOfView (same as reference)
  const camera = useThree(({ camera }) => camera)
  const [controls, setControls] = useState<ComponentRef<typeof OrbitControls> | null>(null)

  useEffect(() => {
    if (!isActive) return
    // Position camera looking at the building from above at an angle
    const pov = new PointOfView(800, radians(-90), radians(-25))
    pov.decompose(position, camera.position, camera.quaternion, camera.up)
    if (controls != null) {
      controls.target.copy(position)
      controls.update()
      setOrbitControls(controls)

      // Sync store with initial camera position
      const pos = camera.position
      setCameraPosition([pos.x, pos.y, pos.z])
      setCameraTargetPosition([position.x, position.y, position.z])

      // Track changes
      const handleChange = () => {
        const p = camera.position
        setCameraPosition([p.x, p.y, p.z])
        if (controls.target) {
          setCameraTargetPosition([controls.target.x, controls.target.y, controls.target.z])
        }
      }
      controls.addEventListener('change', handleChange)
      return () => {
        controls.removeEventListener('change', handleChange)
      }
    }
  }, [camera, controls, isActive, setCameraPosition, setCameraTargetPosition])

  // Update atmosphere date every frame
  useFrame(({ gl }) => {
    const exposure = useAppStore.getState().toneMappingExposure
    gl.toneMappingExposure = exposure

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
      <OrbitControls ref={setControls} />

      {/* Background: physically-accurate sky dome + stars */}
      <Sky />
      <Stars data="atmosphere/stars.bin" />

      {/* Earth ground surface */}
      <EllipsoidMesh args={[Ellipsoid.WGS84.radii, 360, 180]}>
        <meshBasicMaterial color="gray" />
      </EllipsoidMesh>

      {/* All scene content in East-North-Up frame at Moscow */}
      <EastNorthUpFrame {...geodetic}>
        {children}
      </EastNorthUpFrame>

      {/* Post-processing: AerialPerspective + LensFlare + ToneMapping */}
      <AtmosphereEffectComposer multisampling={0}>
        <Fragment key="atmosphere-effects">
          <AerialPerspective
            sunLight={true}
            skyLight={true}
            transmittance={true}
            inscatter={true}
          />
          <LensFlare />
          <ToneMapping mode={ToneMappingMode.AGX} />
          <SMAA />
          <Dithering />
        </Fragment>
      </AtmosphereEffectComposer>
    </Atmosphere>
  )
}

// Default export kept for backward compatibility
export default function AtmosphereEffects() {
  return null
}
