import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, OrthographicCamera, useTexture, Stats, Environment, Sky, ContactShadows } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useAppStore } from '../store/appStore'
import VenueModel from './VenueModel'
import UserMarker from './UserMarker'
import ZoneMarkers from './ZoneMarkers'
import FriendMarkers from './FriendMarkers'
import RouteVisualization from './RouteVisualization'
import FirstPersonControls from './FirstPersonControls'
import CameraController, { setOrbitControls } from './CameraController'
import Effects from './Effects'
import { AtmosphereScene } from './AtmosphereEffects'

// HDRI Environment Component — shows as background + provides reflections
function HDRIEnvironment() {
  const hdriIntensity = useAppStore(state => state.hdriIntensity)
  const hdriRotation1 = useAppStore(state => state.hdriRotation1)
  const hdriBlur = useAppStore(state => state.hdriBlur)
  const hdriFile = useAppStore(state => state.hdriFile)
  const showHdriBackground = useAppStore(state => state.showHdriBackground)

  return (
    <Environment
      key={hdriFile}
      files={hdriFile}
      background={showHdriBackground}
      backgroundBlurriness={hdriBlur}
      backgroundIntensity={hdriIntensity}
      backgroundRotation={[0, hdriRotation1, 0]}
      environmentIntensity={hdriIntensity}
      environmentRotation={[0, hdriRotation1, 0]}
    />
  )
}

// Component to capture OrbitControls ref (used in non-atmosphere mode)
function OrbitControlsWithRef({ viewMode }: { viewMode: string }) {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const setCameraPosition = useAppStore(state => state.setCameraPosition)
  const setCameraTargetPosition = useAppStore(state => state.setCameraTargetPosition)
  const arMode = useAppStore(state => state.arMode)

  useEffect(() => {
    const controls = controlsRef.current
    if (controls) {
      console.log('OrbitControls ref captured')
      setOrbitControls(controls)

      const handleChange = () => {
        const pos = camera.position
        setCameraPosition([pos.x, pos.y, pos.z])

        if (controls.target) {
          setCameraTargetPosition([controls.target.x, controls.target.y, controls.target.z])
        }
      }

      controls.addEventListener('change', handleChange)

      return () => {
        controls.removeEventListener('change', handleChange)
      }
    }
  }, [camera, setCameraPosition, setCameraTargetPosition])

  const isTopView = viewMode === 'top'

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={1}
      maxDistance={300}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={0}
      enableRotate={!isTopView}
      enablePan={!arMode}
      enableZoom={true}
      zoomSpeed={1.0}
    />
  )
}

// Component to track camera position
function CameraStateTracker() {
  const { camera } = useThree()
  const setCameraPosition = useAppStore(state => state.setCameraPosition)
  const setCameraTargetPosition = useAppStore(state => state.setCameraTargetPosition)

  useEffect(() => {
    const interval = setInterval(() => {
      if (camera) {
        const pos = camera.position
        const target = (camera as any).controls?.target
        setCameraPosition([pos.x, pos.y, pos.z] as [number, number, number])
        if (target) {
          setCameraTargetPosition([target.x, target.y, target.z] as [number, number, number])
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [camera, setCameraPosition, setCameraTargetPosition])

  return null
}

// Helper: compute sun position vector from timeOfDay and sunOrientation
function useSunPosition() {
  const timeOfDay = useAppStore(state => state.timeOfDay)
  const sunOrientation = useAppStore(state => state.sunOrientation)

  const hours = timeOfDay
  const normalizedTime = Math.max(0, Math.min(1, (hours - 5) / 16))

  const elevation = Math.sin(normalizedTime * Math.PI) * 80
  const elevationRad = (Math.max(elevation, 2) * Math.PI) / 180

  const sunAzimuth = 90 + normalizedTime * 180
  const totalAzimuth = sunAzimuth + sunOrientation
  const azimuthRad = (totalAzimuth * Math.PI) / 180

  const distance = 80
  const x = distance * Math.cos(elevationRad) * Math.sin(azimuthRad)
  const y = distance * Math.sin(elevationRad)
  const z = distance * Math.cos(elevationRad) * Math.cos(azimuthRad)

  const sunProgress = Math.max(0, Math.sin(normalizedTime * Math.PI))

  return { x, y, z, sunProgress, normalizedTime, elevation }
}

// Procedural Sky background driven by time of day (used when atmosphere is OFF)
function ProceduralSky() {
  const { x, y, z, sunProgress } = useSunPosition()

  const turbidity = 2 + (1 - sunProgress) * 8
  const rayleigh = 0.5 + sunProgress * 2
  const mieCoefficient = 0.005 + (1 - sunProgress) * 0.02
  const mieDirectionalG = 0.8

  return (
    <>
      <Sky
        sunPosition={[x, y, z]}
        turbidity={turbidity}
        rayleigh={rayleigh}
        mieCoefficient={mieCoefficient}
        mieDirectionalG={mieDirectionalG}
        inclination={undefined}
        azimuth={undefined}
      />
    </>
  )
}

// Dynamic sun based on time of day and orientation (used when atmosphere is OFF)
function LocalSunLight() {
  const { x, y, z, sunProgress } = useSunPosition()

  const warmth = 1 - sunProgress
  const r = 1
  const g = 0.85 + sunProgress * 0.15
  const b = 0.6 + sunProgress * 0.4
  const sunColor = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`

  const intensity = sunProgress * 1.5
  const ambientIntensity = Math.max(0.08, sunProgress * 0.5)

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={sunProgress < 0.2 ? '#1a2040' : warmth > 0.5 ? '#ffd4a0' : '#ffffff'} />
      <directionalLight
        position={[x, y, z]}
        intensity={intensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-bias={-0.001}
        shadow-normalBias={0.05}
      />
      <directionalLight
        position={[-x * 0.5, y * 0.3, -z * 0.5]}
        intensity={intensity * 0.15}
        color="#8090c0"
      />
      <hemisphereLight
        args={[
          sunProgress > 0.3 ? '#b1e1ff' : '#1a1a3e',
          '#3a2a1a',
          sunProgress > 0.3 ? 0.3 : 0.15
        ]}
      />
    </>
  )
}

// Night mode lights
function NightLights() {
  const { sunProgress } = useSunPosition()
  const nightLightsEnabled = useAppStore(state => state.nightLightsEnabled)
  const nightLightsIntensity = useAppStore(state => state.nightLightsIntensity)

  const nightFactor = Math.max(0, 1 - sunProgress / 0.3) * nightLightsIntensity

  if (!nightLightsEnabled || nightFactor < 0.01) return null

  const lightPositions: [number, number, number][] = [
    [0, 8, 0],
    [-15, 3, 10],
    [15, 3, 10],
    [-15, 3, -10],
    [15, 3, -10],
    [0, 3, 20],
    [0, 3, -20],
  ]

  return (
    <group>
      {lightPositions.map((pos, i) => (
        <pointLight
          key={i}
          position={pos}
          intensity={nightFactor * (i === 0 ? 2 : 1.2)}
          color={i === 0 ? '#ffeedd' : '#ffcc88'}
          distance={40}
          decay={2}
        />
      ))}
      <spotLight
        position={[0, 15, 25]}
        target-position={[0, 0, 15]}
        intensity={nightFactor * 3}
        color="#ffe0b0"
        angle={0.5}
        penumbra={0.8}
        distance={60}
        decay={2}
      />
    </group>
  )
}

// Dynamic contact shadows
function DynamicContactShadows() {
  const contactShadowsEnabled = useAppStore(state => state.contactShadowsEnabled)
  const { sunProgress } = useSunPosition()

  if (!contactShadowsEnabled) return null

  return (
    <ContactShadows
      position={[0, -0.09, 0]}
      opacity={Math.min(0.3, sunProgress * 0.4)}
      scale={300}
      blur={3}
      far={30}
      resolution={256}
      color="#000020"
    />
  )
}

function Floor() {
  const floorTexture = useTexture('/textures/grid.png')
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(50, 50)

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#ffffff"
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>
      <gridHelper args={[1000, 100, '#333338', '#222228']} position={[0, -0.05, 0]} />
    </>
  )
}

// Sync tone mapping exposure with store
function ToneMappingSync() {
  const { gl } = useThree()
  const toneMappingExposure = useAppStore(state => state.toneMappingExposure)
  const graphicsQuality = useAppStore(state => state.graphicsQuality)

  useEffect(() => {
    if (graphicsQuality === 'performance') {
      gl.toneMapping = THREE.ACESFilmicToneMapping
    } else {
      gl.toneMapping = THREE.NoToneMapping
    }
    gl.toneMappingExposure = toneMappingExposure
  }, [gl, toneMappingExposure, graphicsQuality])

  return null
}

// Scene content — rendered inside Canvas
// When atmosphere is active, AtmosphereScene wraps this in EastNorthUpFrame
// and provides its own OrbitControls, camera, lights, floor (EllipsoidMesh)
function SceneContent() {
  const viewMode = useAppStore(state => state.viewMode)
  const backgroundMode = useAppStore(state => state.backgroundMode)
  const atmosphereEnabled = useAppStore(state => state.atmosphereEnabled)

  const isAtmosphereActive = atmosphereEnabled && backgroundMode === 'sky'

  return (
    <>
      {/* Sync tone mapping with store */}
      <ToneMappingSync />

      {/* === Non-atmosphere mode only: sky, HDRI, lights, floor === */}
      {!isAtmosphereActive && (
        <>
          {backgroundMode === 'sky' && <ProceduralSky />}
          {backgroundMode === 'hdri' && <HDRIEnvironment />}
          <LocalSunLight />
          <NightLights />
          <Floor />
          <DynamicContactShadows />
        </>
      )}

      {/* Real-time Stats */}
      <Stats className="!top-4 !left-auto !right-14 !bottom-auto" />

      {/* 3D Model of Venue */}
      <Suspense fallback={null}>
        <VenueModel />
      </Suspense>

      {/* Markers and Routes */}
      <UserMarker />
      <ZoneMarkers />
      <FriendMarkers />
      <RouteVisualization />

      {/* Controls — in atmosphere mode, AtmosphereScene provides its own OrbitControls */}
      {!isAtmosphereActive && (
        <>
          {viewMode === 'first-person' ? (
            <FirstPersonControls />
          ) : (
            <OrbitControlsWithRef viewMode={viewMode} />
          )}
          <CameraStateTracker />
          <CameraController />
        </>
      )}

      {/* Post-processing — returns null when atmosphere is active */}
      <Effects />
    </>
  )
}

export default function Scene3D() {
  const viewMode = useAppStore(state => state.viewMode)
  const toneMappingExposure = useAppStore(state => state.toneMappingExposure)
  const atmosphereEnabled = useAppStore(state => state.atmosphereEnabled)
  const backgroundMode = useAppStore(state => state.backgroundMode)

  const isAtmosphereActive = atmosphereEnabled && backgroundMode === 'sky'

  const getCameraPosition = (): [number, number, number] => {
    switch (viewMode) {
      case 'top':
        return [-35, 200, 0]
      case 'angle':
        return [-40, 120, 140]
      default:
        return [-40, 120, 140]
    }
  }

  const isOrthographic = viewMode === 'top' && !isAtmosphereActive

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows={!isAtmosphereActive}
        className="w-full h-full"
        gl={{
          // When atmosphere is active: logarithmic depth buffer required for Earth-scale
          depth: isAtmosphereActive ? false : undefined,
          logarithmicDepthBuffer: isAtmosphereActive,
          toneMapping: THREE.NoToneMapping,
          toneMappingExposure: toneMappingExposure,
          outputColorSpace: THREE.SRGBColorSpace,
          antialias: !isAtmosphereActive,
          powerPreference: 'high-performance',
        }}
        // When atmosphere is active, use Earth-scale camera range
        camera={isAtmosphereActive ? { near: 100, far: 1e6 } : undefined}
      >
        {/* Camera setup for non-atmosphere mode only */}
        {!isAtmosphereActive && (
          <>
            {isOrthographic ? (
              <OrthographicCamera
                makeDefault
                position={[-20, 150, 0]}
                zoom={1.5}
                near={0.1}
                far={1000}
                up={[0, 1, 0]}
              />
            ) : (
              <PerspectiveCamera
                key={viewMode}
                makeDefault
                position={viewMode === 'first-person' ? undefined : getCameraPosition()}
                fov={viewMode === 'first-person' ? 75 : 50}
              />
            )}
          </>
        )}

        {/* AtmosphereScene wraps everything when atmosphere is enabled.
            It provides: Atmosphere context, OrbitControls, EastNorthUpFrame,
            EllipsoidMesh, Sky, Stars, AerialPerspective EffectComposer.
            When OFF, children are rendered directly. */}
        <AtmosphereScene>
          <SceneContent />
        </AtmosphereScene>
      </Canvas>
    </div>
  )
}
