import type { Route } from '../types'

interface NavNode {
  id: string
  position: [number, number, number]
}

// spine-1 to spine-8 represent the main corridor (axis) of the building
const navNodes: NavNode[] = [
  { id: 'spine-1', position: [-127, 0, 0] },
  { id: 'spine-2', position: [-85, 0, 0] },
  { id: 'spine-3', position: [-63, 0, 0] },
  { id: 'spine-4', position: [-40, 0, 0] },
  { id: 'spine-5', position: [-20, 0, 0] },
  { id: 'spine-6', position: [0, 0, 0] },
  { id: 'spine-7', position: [30, 0, 0] },
  { id: 'spine-8', position: [55, 0, 0] },
]

const navEdges: Record<string, string[]> = {
  'spine-1': ['spine-2'],
  'spine-2': ['spine-1', 'spine-3'],
  'spine-3': ['spine-2', 'spine-4'],
  'spine-4': ['spine-3', 'spine-5'],
  'spine-5': ['spine-4', 'spine-6'],
  'spine-6': ['spine-5', 'spine-7'],
  'spine-7': ['spine-6', 'spine-8'],
  'spine-8': ['spine-7'],
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
 * Basic Dijkstra algorithm for pathfinding on the navigation graph
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
      const neighbor = navNodes.find(n => n.id === neighborId)!
      const closestNode = navNodes.find(n => n.id === closestNodeId)!
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
    const node = navNodes.find(n => n.id === curr)!
    path.unshift(node.position)
    curr = previous[curr]
  }

  return path
}

/**
 * Calculate route between two points using the navigation graph
 */
export function calculateRoute(
  from: [number, number, number],
  to: [number, number, number]
): Route {
  const startNodeId = findNearestNode(from)
  const endNodeId = findNearestNode(to)

  const graphPath = findPath(startNodeId, endNodeId)

  // Combine start point, graph path, and end point
  // We remove waypoints that are too close to the start or end to avoid sharp turns
  const cleanedWaypoints = graphPath.filter(p =>
    calculateDistance(from, p) > 2 && calculateDistance(to, p) > 2
  )

  const allPoints: [number, number, number][] = [from, ...cleanedWaypoints, to]

  // Calculate total distance
  let totalDistance = 0
  for (let i = 0; i < allPoints.length - 1; i++) {
    totalDistance += calculateDistance(allPoints[i], allPoints[i + 1])
  }

  // Estimate time: ~1 meter per second walking speed
  const estimatedTime = Math.ceil(totalDistance / 60) // minutes

  return {
    from,
    to,
    waypoints: cleanedWaypoints,
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
