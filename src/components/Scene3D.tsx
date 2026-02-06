import { Canvas, useThree, extend } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, OrthographicCamera, useTexture, Stats, Environment, Sky } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { WebGLRenderer, Matrix4 } from 'three'
import { useAppStore } from '../store/appStore'
import VenueModel from './VenueModel'
import UserMarker from './UserMarker'
import ZoneMarkers from './ZoneMarkers'
import FriendMarkers from './FriendMarkers'
import RouteVisualization from './RouteVisualization'
import FirstPersonControls from './FirstPersonControls'
import CameraController, { setOrbitControls } from './CameraController'

// HDRI Environment Component — environment-only (no background override, sky stays visible)
function HDRIEnvironment() {
  const hdriIntensity = useAppStore(state => state.hdriIntensity)
  const hdriRotation1 = useAppStore(state => state.hdriRotation1)
  const hdriMix = useAppStore(state => state.hdriMix)
  const hdriHue = useAppStore(state => state.hdriHue)
  const hdriSaturation = useAppStore(state => state.hdriSaturation)
  const hdriFile = useAppStore(state => state.hdriFile)

  const smoothIntensity = hdriIntensity * hdriIntensity
  const envIntensity = smoothIntensity * Math.max(0, 1 + hdriMix)

  return (
    <>
      <Environment
        key={hdriFile}
        files={hdriFile}
        background={false}
        environmentIntensity={envIntensity}
        environmentRotation={[0, hdriRotation1, 0]}
      />
      <SceneColorAdjust hue={hdriHue} saturation={hdriSaturation} />
    </>
  )
}

// Apply hue/saturation adjustments to the scene
function SceneColorAdjust({ hue, saturation }: { hue: number; saturation: number }) {
  const { scene } = useThree()

  useEffect(() => {
    if (hue === 0 && saturation === 1) {
      scene.overrideMaterial = null
      return
    }
    // Apply tint via scene fog/background color shift
    // We adjust directional light color as a proxy for hue shift
  }, [scene, hue, saturation])

  return null
}

// Component to capture OrbitControls ref
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

      // Add listener for real-time updates
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
      minDistance={1} // Changed from 10
      maxDistance={100} // Changed from 200
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={0}
      enableRotate={!isTopView} // Disable rotation for top view
      enablePan={!arMode} // Changed to use arMode
      enableZoom={true}
      // Adjust zoom speed for orthographic camera if needed
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
    }, 100) // Update every 100ms

    return () => clearInterval(interval)
  }, [camera, setCameraPosition, setCameraTargetPosition])

  return null
}

// Helper: compute sun position vector from timeOfDay and sunOrientation
function useSunPosition() {
  const timeOfDay = useAppStore(state => state.timeOfDay)
  const sunOrientation = useAppStore(state => state.sunOrientation)

  const hours = timeOfDay
  const normalizedTime = Math.max(0, Math.min(1, (hours - 5) / 16)) // 0 at 5AM, 1 at 9PM
  const elevation = Math.sin(normalizedTime * Math.PI) * 80 // max 80 degrees
  const elevationRad = (Math.max(elevation, 2) * Math.PI) / 180
  const azimuthRad = (sunOrientation * Math.PI) / 180

  const distance = 80
  const x = distance * Math.cos(elevationRad) * Math.sin(azimuthRad)
  const y = distance * Math.sin(elevationRad)
  const z = distance * Math.cos(elevationRad) * Math.cos(azimuthRad)

  // sunProgress: 0 at sunrise/sunset, 1 at midday
  const sunProgress = Math.max(0, Math.sin(normalizedTime * Math.PI))

  return { x, y, z, sunProgress, normalizedTime, elevation }
}

// Procedural Sky background driven by time of day
function ProceduralSky() {
  const { x, y, z, sunProgress } = useSunPosition()

  // Turbidity: higher at sunrise/sunset for warm haze, lower at midday
  const turbidity = 2 + (1 - sunProgress) * 8
  // Rayleigh: controls blue sky scattering
  const rayleigh = 0.5 + sunProgress * 2
  // Mie: atmospheric haze
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

// Dynamic sun based on time of day and orientation
function SunLight() {
  const { x, y, z, sunProgress } = useSunPosition()

  const warmth = 1 - sunProgress // 1 at sunrise/sunset, 0 at noon
  const r = 1
  const g = 0.85 + sunProgress * 0.15
  const b = 0.6 + sunProgress * 0.4
  const sunColor = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`

  // Intensity fades to 0 at night
  const intensity = sunProgress * 1.5
  const ambientIntensity = sunProgress * 0.5

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={warmth > 0.5 ? '#ffd4a0' : '#ffffff'} />
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
      {/* Fill light from opposite side */}
      <directionalLight
        position={[-x * 0.5, y * 0.3, -z * 0.5]}
        intensity={intensity * 0.15}
        color="#8090c0"
      />
    </>
  )
}

function Floor() {
  const floorTexture = useTexture('/textures/grid.png')
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(50, 50)

  return (
    <>
      {/* Ground Plane - Receiving Shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#ffffff"
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Grid helper */}
      <gridHelper args={[1000, 100, '#333338', '#222228']} position={[0, -0.05, 0]} />
    </>
  )
}

export default function Scene3D() {
  const viewMode = useAppStore(state => state.viewMode)
  const showHdriBackground = useAppStore(state => state.showHdriBackground)
  const backgroundMode = useAppStore(state => state.backgroundMode)

  const getCameraPosition = (): [number, number, number] => {
    switch (viewMode) {
      case 'top':
        return [-20, 150, 0]
      case 'angle':
        return [-20, 80, 80]
      default:
        return [-20, 80, 80]
    }
  }

  const isOrthographic = viewMode === 'top'

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        className="w-full h-full"
        gl={{
          toneMapping: THREE.LinearToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
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
            key={viewMode} // Re-create camera when mode changes to get initial position from prop
            makeDefault
            position={viewMode === 'first-person' ? undefined : getCameraPosition()}
            fov={viewMode === 'first-person' ? 75 : 50}
          />
        )}

        {/* Sky with sun — always visible in both modes */}
        <ProceduralSky />

        {/* HDRI environment map for reflections (no background override) */}
        {backgroundMode === 'hdri' && showHdriBackground && <HDRIEnvironment />}

        {/* Dynamic Sun Light — always active */}
        <SunLight />

        {/* Real-time Stats */}
        <Stats className="!top-auto !bottom-4 !left-4" />

        {/* Ground and Grid */}
        <Floor />

        {/* 3D Model of Venue */}
        <Suspense fallback={null}>
          <VenueModel />
        </Suspense>

        {/* Markers and Routes */}
        <UserMarker />
        <ZoneMarkers />
        <FriendMarkers />
        <RouteVisualization />

        {/* Controls */}
        {viewMode === 'first-person' ? (
          <FirstPersonControls />
        ) : (
          <OrbitControlsWithRef viewMode={viewMode} />
        )}
        <CameraStateTracker />
        <CameraController />

        {/* Post-processing Effects - disabled due to compatibility issues */}

        {/* ContactShadows removed to avoid washing out directional shadows */}
      </Canvas>
    </div>
  )
}
