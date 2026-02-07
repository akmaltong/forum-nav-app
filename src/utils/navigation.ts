import type { Route } from '../types'

interface NavNode {
  id: string
  position: [number, number, number]
}

// Enhanced navigation graph with corridor spine + branch corridors to rooms
// The building runs X: -128 to +56, with rooms branching off the main corridor (Z=0)
// Branches lead through doorways to zones on both sides (Z: -15 to +15)

const navNodes: NavNode[] = [
  // === Main corridor spine (Z = 0, ground level) ===
  { id: 'spine-1', position: [-127, 0, 0] },    // Registration end
  { id: 'spine-2', position: [-105, 0, 0] },
  { id: 'spine-3', position: [-85, 0, 0] },
  { id: 'spine-4', position: [-63, 0, 0] },
  { id: 'spine-5', position: [-45, 0, 0] },
  { id: 'spine-6', position: [-30, 0, 0] },
  { id: 'spine-7', position: [-15, 0, 0] },
  { id: 'spine-8', position: [0, 0, 0] },
  { id: 'spine-9', position: [15, 0, 0] },
  { id: 'spine-10', position: [30, 0, 0] },
  { id: 'spine-11', position: [42, 0, 0] },
  { id: 'spine-12', position: [55, 0, 0] },

  // === Branch corridors — doorway access points ===
  // Registration area (X ~ -128, south side)
  { id: 'door-reg-1', position: [-127, 0, -5] },

  // Conference halls area (X ~ -105 to -63)
  { id: 'door-conf-n1', position: [-105, 0, 8] },   // North conf hall door
  { id: 'door-conf-s1', position: [-105, 0, -8] },   // South conf hall door
  { id: 'door-conf-n2', position: [-85, 0, 8] },
  { id: 'door-conf-s2', position: [-85, 0, -8] },
  { id: 'door-conf-n3', position: [-63, 0, 10] },
  { id: 'door-conf-s3', position: [-63, 0, -10] },

  // Exhibition / food area (X ~ -45 to -15)
  { id: 'door-exh-n1', position: [-45, 0, 8] },
  { id: 'door-exh-s1', position: [-45, 0, -8] },
  { id: 'door-food-n', position: [-30, 0, 10] },
  { id: 'door-food-s', position: [-30, 0, -10] },
  { id: 'door-exh-n2', position: [-15, 0, 8] },
  { id: 'door-exh-s2', position: [-15, 0, -8] },

  // Central area (X ~ 0 to 15)
  { id: 'door-central-n', position: [0, 0, 10] },
  { id: 'door-central-s', position: [0, 0, -10] },
  { id: 'door-press-n', position: [15, 0, 10] },
  { id: 'door-press-s', position: [15, 0, -10] },

  // Plenary hall area (X ~ 30)
  { id: 'door-plenary-n', position: [30, 0, 10] },
  { id: 'door-plenary-s', position: [30, 0, -10] },

  // VIP area (X ~ 42–55)
  { id: 'door-vip-n', position: [42, 0, 6] },
  { id: 'door-vip-s', position: [42, 0, -6] },
  { id: 'door-vip-end', position: [55, 0, 5] },

  // === Room waypoints — inside rooms (reached through doors) ===
  { id: 'room-reg', position: [-127, 0, -7] },
  { id: 'room-conf-n1', position: [-105, 0, 12] },
  { id: 'room-conf-s1', position: [-105, 0, -12] },
  { id: 'room-conf-n2', position: [-85, 0, 12] },
  { id: 'room-conf-s2', position: [-85, 0, -12] },
  { id: 'room-conf-n3', position: [-63, 0, 14] },
  { id: 'room-conf-s3', position: [-63, 0, -14] },
  { id: 'room-exh-n1', position: [-45, 0, 12] },
  { id: 'room-exh-s1', position: [-45, 0, -12] },
  { id: 'room-food-n', position: [-30, 0, 14] },
  { id: 'room-food-s', position: [-30, 0, -14] },
  { id: 'room-exh-n2', position: [-15, 0, 12] },
  { id: 'room-exh-s2', position: [-15, 0, -12] },
  { id: 'room-central-n', position: [0, 0, 14] },
  { id: 'room-central-s', position: [0, 0, -14] },
  { id: 'room-press-n', position: [15, 0, 14] },
  { id: 'room-press-s', position: [15, 0, -14] },
  { id: 'room-plenary-n', position: [30, 0, 14] },
  { id: 'room-plenary-s', position: [30, 0, -14] },
  { id: 'room-vip-n', position: [42, 0, 10] },
  { id: 'room-vip-s', position: [42, 0, -10] },
  { id: 'room-vip-end', position: [55, 0, 8] },
]

// Build adjacency: spine chain + door branches + room connections
const navEdges: Record<string, string[]> = {}

function addEdge(a: string, b: string) {
  if (!navEdges[a]) navEdges[a] = []
  if (!navEdges[b]) navEdges[b] = []
  if (!navEdges[a].includes(b)) navEdges[a].push(b)
  if (!navEdges[b].includes(a)) navEdges[b].push(a)
}

// Spine chain
for (let i = 1; i <= 11; i++) {
  addEdge(`spine-${i}`, `spine-${i + 1}`)
}

// Door connections: spine <-> door <-> room
const branchConnections: [string, string, string][] = [
  // [spineNode, doorNode, roomNode]
  ['spine-1', 'door-reg-1', 'room-reg'],

  ['spine-2', 'door-conf-n1', 'room-conf-n1'],
  ['spine-2', 'door-conf-s1', 'room-conf-s1'],
  ['spine-3', 'door-conf-n2', 'room-conf-n2'],
  ['spine-3', 'door-conf-s2', 'room-conf-s2'],
  ['spine-4', 'door-conf-n3', 'room-conf-n3'],
  ['spine-4', 'door-conf-s3', 'room-conf-s3'],

  ['spine-5', 'door-exh-n1', 'room-exh-n1'],
  ['spine-5', 'door-exh-s1', 'room-exh-s1'],
  ['spine-6', 'door-food-n', 'room-food-n'],
  ['spine-6', 'door-food-s', 'room-food-s'],
  ['spine-7', 'door-exh-n2', 'room-exh-n2'],
  ['spine-7', 'door-exh-s2', 'room-exh-s2'],

  ['spine-8', 'door-central-n', 'room-central-n'],
  ['spine-8', 'door-central-s', 'room-central-s'],
  ['spine-9', 'door-press-n', 'room-press-n'],
  ['spine-9', 'door-press-s', 'room-press-s'],

  ['spine-10', 'door-plenary-n', 'room-plenary-n'],
  ['spine-10', 'door-plenary-s', 'room-plenary-s'],

  ['spine-11', 'door-vip-n', 'room-vip-n'],
  ['spine-11', 'door-vip-s', 'room-vip-s'],
  ['spine-12', 'door-vip-end', 'room-vip-end'],
]

for (const [spine, door, room] of branchConnections) {
  addEdge(spine, door)
  addEdge(door, room)
}

// Index nodes for fast lookup
const nodeMap = new Map<string, NavNode>()
for (const node of navNodes) {
  nodeMap.set(node.id, node)
}

function findNearestNode(pos: [number, number, number]): string {
  let nearestId = navNodes[0].id
  let minDistance = Infinity

  for (const node of navNodes) {
    const d = calculateDistance(pos, node.position)
    if (d < minDistance) {
      minDistance = d
      nearestId = node.id
    }
  }

  return nearestId
}

/**
 * Dijkstra shortest path on the navigation graph
 */
function findPath(startId: string, endId: string): [number, number, number][] {
  if (startId === endId) return []

  const distances: Record<string, number> = {}
  const previous: Record<string, string | null> = {}
  const nodes = new Set<string>()

  for (const node of navNodes) {
    distances[node.id] = node.id === startId ? 0 : Infinity
    previous[node.id] = null
    nodes.add(node.id)
  }

  while (nodes.size > 0) {
    let closestNodeId: string | null = null
    for (const nodeId of nodes) {
      if (closestNodeId === null || distances[nodeId] < distances[closestNodeId]) {
        closestNodeId = nodeId
      }
    }

    if (!closestNodeId || distances[closestNodeId] === Infinity) break
    if (closestNodeId === endId) break

    nodes.delete(closestNodeId)

    for (const neighborId of navEdges[closestNodeId] || []) {
      const neighbor = nodeMap.get(neighborId)!
      const closestNode = nodeMap.get(closestNodeId)!
      const alt = distances[closestNodeId] + calculateDistance(closestNode.position, neighbor.position)

      if (alt < distances[neighborId]) {
        distances[neighborId] = alt
        previous[neighborId] = closestNodeId
      }
    }
  }

  const path: [number, number, number][] = []
  let curr: string | null = endId
  while (curr) {
    const node = nodeMap.get(curr)!
    path.unshift(node.position)
    curr = previous[curr]
  }

  return path
}

/**
 * Simplify path by removing collinear waypoints (straight segments)
 */
function simplifyPath(points: [number, number, number][]): [number, number, number][] {
  if (points.length <= 2) return points

  const result: [number, number, number][] = [points[0]]

  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1]
    const curr = points[i]
    const next = points[i + 1]

    // Check if prev->curr->next are roughly collinear (same direction)
    const dx1 = curr[0] - prev[0]
    const dz1 = curr[2] - prev[2]
    const dx2 = next[0] - curr[0]
    const dz2 = next[2] - curr[2]

    const len1 = Math.sqrt(dx1 * dx1 + dz1 * dz1)
    const len2 = Math.sqrt(dx2 * dx2 + dz2 * dz2)

    if (len1 < 0.01 || len2 < 0.01) {
      result.push(curr)
      continue
    }

    // Cross product magnitude — measures deviation from straight line
    const cross = Math.abs((dx1 / len1) * (dz2 / len2) - (dz1 / len1) * (dx2 / len2))

    if (cross > 0.05) {
      // Significant turn — keep this waypoint
      result.push(curr)
    }
    // Otherwise skip (collinear)
  }

  result.push(points[points.length - 1])
  return result
}

/**
 * Calculate route between two points using the navigation graph.
 * Paths go through corridors and door openings, avoiding walls.
 */
export function calculateRoute(
  from: [number, number, number],
  to: [number, number, number]
): Route {
  const startNodeId = findNearestNode(from)
  const endNodeId = findNearestNode(to)

  const graphPath = findPath(startNodeId, endNodeId)

  // Remove waypoints too close to start or end
  const cleanedWaypoints = graphPath.filter(p =>
    calculateDistance(from, p) > 2 && calculateDistance(to, p) > 2
  )

  // Simplify: remove collinear points for straighter paths
  const simplified = simplifyPath(cleanedWaypoints)

  const allPoints: [number, number, number][] = [from, ...simplified, to]

  // Calculate total distance
  let totalDistance = 0
  for (let i = 0; i < allPoints.length - 1; i++) {
    totalDistance += calculateDistance(allPoints[i], allPoints[i + 1])
  }

  // Walking speed ~1.4 m/s
  const estimatedTime = Math.ceil(totalDistance / 84) // minutes

  return {
    from,
    to,
    waypoints: simplified,
    distance: Math.round(totalDistance),
    estimatedTime
  }
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  from: [number, number, number],
  to: [number, number, number]
): number {
  return Math.sqrt(
    Math.pow(to[0] - from[0], 2) +
    Math.pow(to[1] - from[1], 2) +
    Math.pow(to[2] - from[2], 2)
  )
}

/**
 * Get direction from one point to another (in radians)
 */
export function getDirection(
  from: [number, number, number],
  to: [number, number, number]
): number {
  return Math.atan2(to[2] - from[2], to[0] - from[0])
}

/**
 * Check if user is near destination
 */
export function isNearDestination(
  userPos: [number, number, number],
  destination: [number, number, number],
  threshold: number = 5
): boolean {
  return calculateDistance(userPos, destination) < threshold
}
