import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useAppStore } from '../store/appStore'
import * as THREE from 'three'

let orbitControlsRef: any = null

export function setOrbitControls(controls: any) {
  orbitControlsRef = controls
}

export default function CameraController() {
  const { camera } = useThree()
  const cameraTarget = useAppStore(state => state.cameraTarget)
  const setCameraTarget = useAppStore(state => state.setCameraTarget)
  const zones = useAppStore(state => state.zones)
  const animationRef = useRef<number | null>(null)
  const startPosRef = useRef<THREE.Vector3 | null>(null)
  const startTargetRef = useRef<THREE.Vector3 | null>(null)

  useEffect(() => {
    console.log('=== CameraController START ===')
    console.log('cameraTarget:', cameraTarget)
    console.log('zones count:', zones.length)

    if (!cameraTarget || typeof cameraTarget !== 'string') {
      console.log('=== CameraController END - invalid target ===')
      return
    }

    const zone = zones.find(z => z.id === cameraTarget)

    console.log('Found zone:', zone?.name, zone?.id)
    console.log('Zone position:', zone?.position)
    console.log('Zone POI:', zone?.poi)

    if (!zone) {
      console.error('Zone not found:', cameraTarget)
      setCameraTarget(null)
      console.log('=== CameraController END - zone not found ===')
      return
    }

    const poi = zone?.poi

    if (!poi || !poi.cameraPosition || !poi.targetPosition) {
      console.error('POI data missing or invalid:', poi)
      setCameraTarget(null)
      console.log('=== CameraController END - POI missing ===')
      return
    }

    console.log('POI cameraPosition:', poi.cameraPosition)
    console.log('POI targetPosition:', poi.targetPosition)

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const cameraTargetPos = new THREE.Vector3(...poi.cameraPosition)
    const targetVec = new THREE.Vector3(...poi.targetPosition)

    console.log('Current camera position:', camera.position)
    console.log('Target camera position:', cameraTargetPos)
    console.log('OrbitControls target before:', orbitControlsRef?.target)
    console.log('New OrbitControls target:', targetVec)
    console.log('OrbitControls ref exists:', !!orbitControlsRef)

    startPosRef.current = camera.position.clone()
    startTargetRef.current = orbitControlsRef?.target?.clone() || new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)

    const startTime = Date.now()
    const duration = 2000

    // Determine if we are in top-down mode
    const isTopDown = useAppStore.getState().viewMode === 'top'

    // For Top-Down, we want to PAN to the target, keeping current height and rotation
    // For 3D/POI, we use the POI data

    let targetCamPos: THREE.Vector3
    let targetLookAt: THREE.Vector3

    if (isTopDown) {
      // In top-down, target is the zone position (or poi target), but camera maintains relative offset
      // We assume poi.targetPosition is the center of interest
      targetLookAt = new THREE.Vector3(...poi.targetPosition)

      // Calculate delta to move camera
      const currentTarget = orbitControlsRef?.target || new THREE.Vector3(0, 0, 0)
      const delta = new THREE.Vector3().subVectors(targetLookAt, currentTarget)

      // Move camera by same delta to preserve angle/height
      targetCamPos = camera.position.clone().add(delta)

      console.log('Top-Down navigation: Panning to', targetLookAt)
    } else {
      // Normal POI navigation
      targetCamPos = new THREE.Vector3(...poi.cameraPosition)
      targetLookAt = new THREE.Vector3(...poi.targetPosition)
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

      if (startPosRef.current) {
        camera.position.lerpVectors(startPosRef.current, targetCamPos, eased)

        if (orbitControlsRef && orbitControlsRef.target) {
          orbitControlsRef.target.lerpVectors(startTargetRef.current!, targetLookAt, eased)
          orbitControlsRef.update()
        } else {
          camera.lookAt(targetLookAt)
        }

        // Console log removed to reduce noise
        // console.log(`Animation progress: ...`)
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setCameraTarget(null)
        animationRef.current = null
        console.log('=== Animation completed ===')
      }
    }

    animate()

    console.log('=== CameraController STARTING ANIMATION ===')
    console.log('=== CameraController END ===')
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [cameraTarget, camera, setCameraTarget, zones])

  return null
}
