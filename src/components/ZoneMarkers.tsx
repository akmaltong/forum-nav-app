import { useEffect } from 'react'
import { Html } from '@react-three/drei'
import { useAppStore } from '../store/appStore'
import { zones } from '../data/mockData'
import ZoneMarkerHighlight from './ZoneMarkerHighlight'

export default function ZoneMarkers() {
  const zonesFromStore = useAppStore(state => state.zones)
  const selectedZone = useAppStore(state => state.selectedZone)
  const setSelectedZone = useAppStore(state => state.setSelectedZone)
  const setCameraTarget = useAppStore(state => state.setCameraTarget)

  // Load zones into store initially
  useEffect(() => {
    if (zonesFromStore.length === 0) {
      useAppStore.setState({ zones })
    }
  }, [zonesFromStore.length])

  // Use zones from store (will update when edited)
  const currentZones = zonesFromStore.length > 0 ? zonesFromStore : zones

  return (
    <>
      {currentZones.map(zone => {
        const isSelected = selectedZone?.id === zone.id

        const handleClick = () => {
          setSelectedZone(zone)
          setCameraTarget(zone.id)
        }

        return (
          <group key={zone.id} position={[zone.position[0], zone.position[1], zone.position[2]]}>
            {/* Invisible clickable area */}
            <mesh
              position={[0, 2, 0]}
              onClick={handleClick}
            >
              <cylinderGeometry args={[3, 3, 4, 32]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Highlight sphere for selected zone */}
            {isSelected && (
              <ZoneMarkerHighlight position={[0, 0, 0]} color={zone.color} />
            )}

            {/* Zone label - HTML with sprite for camera-facing */}
            <Html
              position={[0, 8, 0]}
              style={{ pointerEvents: 'none' }}
              occlude={false}
              transform
              sprite
            >
              <div
                className={`px-4 py-3 rounded-xl font-bold whitespace-nowrap shadow-2xl transition-all pointer-events-auto ${isSelected
                    ? 'bg-white text-gray-900 scale-125'
                    : 'bg-gray-900/95 text-white hover:bg-gray-800/100'
                  }`}
                style={{
                  borderLeft: `5px solid ${zone.color}`,
                  fontSize: '18px',
                  maxWidth: '300px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(6px)',
                  transform: 'scale(1.2)'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
              >
                {zone.name}
              </div>
            </Html>
          </group>
        )
      })}
    </>
  )
}
