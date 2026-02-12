import { OrbitControls, PerspectiveCamera, OrthographicCamera, ContactShadows } from '@react-three/drei'
import { useThree, Canvas } from '@react-three/fiber'
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
import AtmosphereSky from './AtmosphereSky'
import HDRIEnvironment from './HDRIEnvironment'
import Effects from './Effects'

// Component to capture OrbitControls ref
function OrbitControlsWithRef({ viewMode }: { viewMode: string }) {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const setCameraPosition = useAppStore(state => state.setCameraPosition)
  const setCameraTargetPosition = useAppStore(state => state.setCameraTargetPosition)
  const setViewMode = useAppStore(state => state.setViewMode)

  useEffect(() => {
    const controls = controlsRef.current
    if (controls) {
      setOrbitControls(controls)

      const handleChange = () => {
        const pos = camera.position
        setCameraPosition([pos.x, pos.y, pos.z])

        // DEBUG: Log camera position on every change
        console.log('Camera position:', [pos.x, pos.y, pos.z])
        console.log('Camera target:', controls.target ? [controls.target.x, controls.target.y, controls.target.z] : 'no target')

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

  // Set initial camera target and reset camera on view mode change
  useEffect(() => {
    const controls = controlsRef.current
    if (controls && camera) {
      if (viewMode === 'top') {
        // Reset camera to strict top-down position
        camera.position.set(0, 10, 0)
        camera.up.set(0, 1, 0)
        camera.lookAt(0, 0, 0)
        controls.target.set(0, 0, 0)
        controls.update()
      } else if (viewMode === 'angle') {
        // Set proper target for angle view
        controls.target.set(-41, -7, 6)
        controls.update()
      } else {
        // For other modes, just set the target without moving camera
        controls.target.set(0, 0, 0)
        controls.update()
      }
    }
  }, [viewMode, camera])

  // Switch to perspective view on left mouse button click in top view
  useEffect(() => {
    if (viewMode !== 'top') return

    const canvas = document.querySelector('canvas')
    if (!canvas) return

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        setViewMode('angle')
      }
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    return () => canvas.removeEventListener('mousedown', handleMouseDown)
  }, [viewMode, setViewMode])

  const isTopView = viewMode === 'top'

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      enableRotate={!isTopView}
      enablePan
      enableZoom
      minPolarAngle={0.1}
      maxPolarAngle={isTopView ? 0 : Math.PI * 0.45}
      mouseButtons={{
        LEFT: isTopView ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      }}
    />
  )
}

function SceneContent() {
  const viewMode = useAppStore(state => state.viewMode)
  const hdriRotation = useAppStore(state => state.hdriRotation)
  const contactShadowsEnabled = useAppStore(state => state.contactShadowsEnabled)

  // Calculate light position based on HDRI rotation
  const rotationRad = (hdriRotation * Math.PI) / 180
  const lightDistance = 30
  const lightX = Math.sin(rotationRad) * lightDistance
  const lightZ = Math.cos(rotationRad) * lightDistance
  const lightY = 20

  return (
    <>
      <AtmosphereSky />

      {/* HDRI Environment */}
      <Suspense fallback={null}>
        <HDRIEnvironment />
      </Suspense>

      {/* HemisphereLight - natural ambient lighting */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#444444"
        intensity={0.6}
      />

      {/* Main directional light with soft smooth shadows */}
      <directionalLight
        position={[lightX, lightY, lightZ]}
        intensity={2.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-camera-near={1}
        shadow-camera-far={500}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-radius={2}
      />

      {/* Contact Shadows for better ground contact */}
      {contactShadowsEnabled && (
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.3}
          scale={300}
          blur={2}
          far={100}
          resolution={256}
          color="#000000"
        />
      )}

      {/* Model */}
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
        <>
          <OrbitControlsWithRef viewMode={viewMode} />
          <CameraController />
        </>
      )}

      {/* Post-processing */}
      <Effects />
    </>
  )
}

export default function Scene3D() {
  const viewMode = useAppStore(state => state.viewMode)
  const toneMapping = useAppStore(state => state.toneMapping)
  const toneMappingExposure = useAppStore(state => state.toneMappingExposure)
  const activeBottomPanel = useAppStore(state => state.activeBottomPanel)
  const setActiveBottomPanel = useAppStore(state => state.setActiveBottomPanel)
  
  // Log current view mode and camera position
  useEffect(() => {
    console.log('Current view mode:', viewMode)
    const camPos = getCameraPosition()
    console.log('Camera position:', camPos)
  }, [viewMode])

  // Handle window resize to ensure proper canvas sizing
  useEffect(() => {
    const handleResize = () => {
      // Force canvas to recalculate size
      const canvas = document.querySelector('canvas')
      if (canvas) {
        canvas.style.width = '100%'
        canvas.style.height = '100%'
      }
    }

    window.addEventListener('resize', handleResize)
    // Initial call
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close bottom panels on click in empty space
  const handleSceneClick = () => {
    if (activeBottomPanel) {
      setActiveBottomPanel(null)
    }
  }

  const getCameraPosition = (): [number, number, number] => {
    switch (viewMode) {
      case 'top':
        return [0, 10, 0]
      case 'angle':
        return [-66, 241, 6]
      default:
        return [-66, 241, 6]
    }
  }

  const isOrthographic = viewMode === 'top'

  // Get tone mapping type
  const getToneMapping = () => {
    switch (toneMapping) {
      case 'Linear':
        return THREE.LinearToneMapping
      case 'Reinhard':
        return THREE.ReinhardToneMapping
      case 'ACES':
      default:
        return THREE.ACESFilmicToneMapping
    }
  }

  return (
    <div className="w-full h-full relative" onClick={handleSceneClick}>
      <Canvas
        shadows
        className="w-full h-full"
        style={{ background: '#0a0a0f', display: 'block', width: '100%', height: '100%' }}
        gl={{
          toneMapping: getToneMapping(),
          toneMappingExposure: toneMappingExposure,
          outputColorSpace: THREE.SRGBColorSpace,
          antialias: true,
          powerPreference: 'high-performance',
          stencil: true,
          depth: true,
        }}
        onCreated={(state) => {
          // Configure renderer for smooth shadows
          state.gl.shadowMap.enabled = true
          state.gl.shadowMap.type = THREE.PCFSoftShadowMap
          state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          
          // Performance optimizations
          state.gl.powerPreference = 'high-performance'
          state.gl.antialias = true
          
          // Ensure proper initial sizing
          state.gl.setSize(window.innerWidth, window.innerHeight)
          if (state.camera instanceof THREE.PerspectiveCamera) {
            state.camera.aspect = window.innerWidth / window.innerHeight
            state.camera.updateProjectionMatrix()
          }
        }}
        dpr={[1, 2]} // Limit pixel ratio for performance
      >
        {/* Camera setup */}
        {isOrthographic ? (
          <OrthographicCamera
            makeDefault
            position={[0, 10, 0]}
            zoom={6.0}
            near={0.1}
            far={1000}
            up={[0, 1, 0]}
          />
        ) : (
          <PerspectiveCamera
            key={viewMode}
            makeDefault
            position={viewMode === 'first-person' ? undefined : getCameraPosition()}
            fov={viewMode === 'first-person' ? 75 : 55}
          />
        )}

        <SceneContent />
      </Canvas>
    </div>
  )
}
