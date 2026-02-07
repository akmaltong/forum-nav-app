import { useMemo, useRef } from 'react'
import { useAppStore } from '../store/appStore'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * Build a simple piecewise-linear path — pure straight segments with
 * small QuadraticBezier rounding only at inner waypoints (not start/end).
 */
function buildPath(points: THREE.Vector3[]): THREE.CurvePath<THREE.Vector3> {
  const path = new THREE.CurvePath<THREE.Vector3>()
  if (points.length < 2) return path

  if (points.length === 2) {
    path.add(new THREE.LineCurve3(points[0].clone(), points[1].clone()))
    return path
  }

  const R = 1.5 // corner rounding radius

  for (let i = 0; i < points.length - 1; i++) {
    const A = points[i]
    const B = points[i + 1]
    const seg = new THREE.Vector3().subVectors(B, A)
    const segLen = seg.length()

    if (segLen < 0.01) continue

    // Determine trim amounts at each end of this segment
    let trimStart = 0
    let trimEnd = 0

    // Trim end of segment (before next corner) — but not at the last segment
    if (i < points.length - 2) {
      trimEnd = Math.min(R, segLen * 0.3)
    }
    // Trim start of segment (after prev corner) — but not at the first segment
    if (i > 0) {
      trimStart = Math.min(R, segLen * 0.3)
    }

    const dir = seg.clone().normalize()
    const lineStart = A.clone().add(dir.clone().multiplyScalar(trimStart))
    const lineEnd = A.clone().add(dir.clone().multiplyScalar(segLen - trimEnd))

    // Straight line for this segment
    if (lineStart.distanceTo(lineEnd) > 0.01) {
      path.add(new THREE.LineCurve3(lineStart, lineEnd))
    }

    // Add corner curve at point B (if there's a next segment)
    if (i < points.length - 2) {
      const C = points[i + 2]
      const nextDir = new THREE.Vector3().subVectors(C, B).normalize()
      const nextSegLen = new THREE.Vector3().subVectors(C, B).length()
      const nextTrim = Math.min(R, nextSegLen * 0.3)

      const cornerStart = lineEnd
      const cornerEnd = B.clone().add(nextDir.clone().multiplyScalar(nextTrim))

      path.add(new THREE.QuadraticBezierCurve3(cornerStart, B.clone(), cornerEnd))
    }
  }

  return path
}

function AnimatedArrows({ path, pathLength }: { path: THREE.CurvePath<THREE.Vector3>; pathLength: number }) {
  const groupRef = useRef<THREE.Group>(null)

  const arrows = useMemo(() => {
    const spacing = 3.5
    const count = Math.max(3, Math.floor(pathLength / spacing))
    const items: { id: number; offset: number }[] = []
    for (let i = 0; i < count; i++) {
      items.push({ id: i, offset: i / count })
    }
    return items
  }, [pathLength])

  useFrame((_state, delta) => {
    if (!groupRef.current) return

    groupRef.current.children.forEach((arrow, i) => {
      const data = arrows[i]
      if (!data) return

      data.offset = (data.offset + delta * 0.1) % 1.0

      try {
        const t = Math.max(0.001, Math.min(0.999, data.offset))
        const point = path.getPointAt(t)
        const tangent = path.getTangentAt(t)

        arrow.position.set(point.x, point.y + 0.2, point.z)
        arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent.normalize())

        // Fade in/out at edges for smooth look
        const edgeFade = Math.min(t * 5, (1 - t) * 5, 1)
        const opacity = 0.5 + edgeFade * 0.4
        const scale = 0.7 + edgeFade * 0.3
        arrow.scale.setScalar(scale);
        (arrow as any).material && ((arrow as any).material.opacity = opacity)
      } catch {
        // skip
      }
    })
  })

  return (
    <group ref={groupRef}>
      {arrows.map((item) => (
        <mesh key={item.id}>
          <coneGeometry args={[0.25, 0.6, 3]} />
          <meshBasicMaterial
            color="#ff8c00"
            transparent
            opacity={0.8}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function PulsingDestination({ position }: { position: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const pinRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.15
      ringRef.current.scale.set(scale, scale, 1)
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 2) * 0.1
    }
    if (pinRef.current) {
      pinRef.current.position.y = 1.5 + Math.sin(t * 1.5) * 0.3
    }
  })

  return (
    <group position={position}>
      <mesh ref={ringRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.8, 32]} />
        <meshBasicMaterial color="#ff8c00" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#ff8c00" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={pinRef} position={[0, 1.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.4, 1.2, 16]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#ffaa44" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

export default function RouteVisualization() {
  const currentRoute = useAppStore(state => state.currentRoute)
  const userLocation = useAppStore(state => state.userLocation)

  const { path, pathLength, lineGeometry } = useMemo(() => {
    if (!currentRoute || !userLocation) {
      return { path: null, pathLength: 0, lineGeometry: null }
    }

    const rawPoints = [
      new THREE.Vector3(...userLocation.position),
      ...currentRoute.waypoints.map(p => new THREE.Vector3(...p)),
      new THREE.Vector3(...currentRoute.to)
    ]

    // Remove near-duplicate points to prevent micro-hooks
    const points: THREE.Vector3[] = [rawPoints[0]]
    for (let i = 1; i < rawPoints.length; i++) {
      if (rawPoints[i].distanceTo(points[points.length - 1]) > 1.0) {
        points.push(rawPoints[i])
      }
    }
    if (points.length < 2) {
      points.push(rawPoints[rawPoints.length - 1])
    }

    const curvePath = buildPath(points)
    const len = curvePath.getLength()

    const numPoints = Math.max(20, Math.floor(len * 2))
    const linePoints: THREE.Vector3[] = []
    for (let i = 0; i <= numPoints; i++) {
      try {
        linePoints.push(curvePath.getPointAt(i / numPoints))
      } catch {
        // skip
      }
    }

    const geo = new THREE.BufferGeometry().setFromPoints(linePoints)
    return { path: curvePath, pathLength: len, lineGeometry: geo }
  }, [currentRoute, userLocation])

  if (!path || !lineGeometry) return null

  return (
    <group>
      {/* Main path line — orange */}
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
        color: "#ff8c00",
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
      }))} />

      {/* Animated directional arrows — orange */}
      <AnimatedArrows path={path} pathLength={pathLength} />

      {/* Destination marker */}
      {currentRoute && (
        <PulsingDestination position={currentRoute.to} />
      )}
    </group>
  )
}
