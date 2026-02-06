import { useMemo, useRef } from 'react'
import { useAppStore } from '../store/appStore'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

function AnimatedArrows({ curve }: { curve: THREE.Curve<THREE.Vector3> }) {
  const arrowsGroup = useRef<THREE.Group>(null)

  // Create once
  const arrows = useMemo(() => {
    const count = Math.floor(curve.getLength() / 4) // Fixed density
    const items = []
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        offset: i / count
      })
    }
    return items
  }, [curve])

  useFrame((_state, delta) => {
    if (!arrowsGroup.current) return

    arrowsGroup.current.children.forEach((arrow, i) => {
      const data = arrows[i]
      if (!data) return

      // Update offset for animation
      data.offset = (data.offset + delta * 0.05) % 1.0 // Slower velocity

      const point = curve.getPointAt(data.offset)
      const tangent = curve.getTangentAt(data.offset)

      arrow.position.set(point.x, point.y + 0.1, point.z)
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent)
    })
  })

  return (
    <group ref={arrowsGroup}>
      {arrows.map((item) => (
        <mesh key={item.id} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.3, 0.8, 4]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

export default function RouteVisualization() {
  const currentRoute = useAppStore(state => state.currentRoute)
  const userLocation = useAppStore(state => state.userLocation)

  const curve = useMemo(() => {
    if (!currentRoute || !userLocation) return null

    const points = [
      new THREE.Vector3(...userLocation.position),
      ...currentRoute.waypoints.map(p => new THREE.Vector3(...p)),
      new THREE.Vector3(...currentRoute.to)
    ]

    return new THREE.CatmullRomCurve3(points)
  }, [currentRoute, userLocation])

  if (!curve) return null

  // Main path line
  const pathPoints = curve.getPoints(100)
  const geometry = new THREE.BufferGeometry().setFromPoints(pathPoints)

  return (
    <group>
      {/* Subtle path line */}
      <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: "#ff6600",
        linewidth: 2,
        transparent: true,
        opacity: 0.3
      }))} />

      {/* Directional animated arrows */}
      <AnimatedArrows curve={curve} />

      {/* Destination marker moved slightly up */}
      {currentRoute && (
        <group position={[currentRoute.to[0], currentRoute.to[1], currentRoute.to[2]]}>
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2, 32]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.4} />
          </mesh>
          <mesh position={[0, 1.5, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.5, 1.5, 32]} />
            <meshBasicMaterial color="#ff6600" />
          </mesh>
        </group>
      )}
    </group>
  )
}
