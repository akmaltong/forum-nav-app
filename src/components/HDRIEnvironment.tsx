import { Environment, useTexture } from '@react-three/drei'
import { useAppStore } from '../store/appStore'
import * as THREE from 'three'

// List of available HDRI files
const AVAILABLE_HDRI_FILES = [
  'neutral',  // Built-in Drei preset (matches model-viewer neutral)
  'textures/env/citrus_orchard_road_puresky_1k.hdr',
  'textures/env/env_map.hdr',
  'textures/env/kloppenheim_06_puresky_1k.hdr',
  'textures/env/qwantani_sunset_puresky_1k.hdr',
  'textures/env/white_furnace.hdr',
  'textures/env/neutral_HDR.jpg'
]

// Built-in Drei presets (no file needed)
const DREI_PRESETS = ['sunset', 'dawn', 'night', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby', 'warehouse']

// Lighting presets from Model Viewer
const LIGHTING_PRESETS = {
  neutral_balance: {
    intensity: 1.0,
    rotation: 0,
    blur: 0.1,
    description: 'Balanced, even lighting'
  },
  white: {
    intensity: 1.2,
    rotation: 0,
    blur: 0.05,
    description: 'Pure white environment lighting'
  },
  neutral: {
    intensity: 1.0,
    rotation: 0,
    blur: 0.1,
    description: 'Balanced neutral lighting'
  },
  model_viewer_neutral: {
    intensity: 1.0,
    rotation: 0,
    blur: 0,
    shadowIntensity: 0.3,
    exposure: 1.0,
    description: 'Model Viewer neutral lighting (geoplanter style)'
  },
  studio: {
    intensity: 1.5,
    rotation: 45,
    blur: 0.05,
    description: 'Bright, controlled studio lighting'
  },
  warehouse: {
    intensity: 0.8,
    rotation: 180,
    blur: 0.3,
    description: 'Industrial warehouse lighting'
  },
  outdoor: {
    intensity: 1.2,
    rotation: 270,
    blur: 0.2,
    description: 'Natural outdoor lighting'
  }
}

// HDRI Environment component - Only active in HDRI mode
export function HDRIEnvironment() {
  const hdriFile = useAppStore(state => state.hdriFile)
  const lightingMode = useAppStore(state => state.lightingMode)
  const hdriIntensity = useAppStore(state => state.hdriIntensity)
  const hdriRotation = useAppStore(state => state.hdriRotation)
  const hdriBlur = useAppStore(state => state.hdriBlur)
  const showHdriBackground = useAppStore(state => state.showHdriBackground)

  // Only show HDRI in HDRI mode
  if (lightingMode !== 'hdri') return null

  // Check if the requested file/preset is in the available list
  const isValidFile = AVAILABLE_HDRI_FILES.includes(hdriFile)

  // If file is not valid, don't render Environment
  if (!isValidFile) {
    console.warn(`HDRI file not found: ${hdriFile}. Available files:`, AVAILABLE_HDRI_FILES)
    return null
  }

  // Convert rotation degrees to radians
  const rotationRad = (hdriRotation * Math.PI) / 180

  // Check if using built-in Drei preset
  const isDreiPreset = DREI_PRESETS.includes(hdriFile)

  // Reduce background intensity in orthographic mode for better visibility
  const backgroundIntensityMultiplier = 0.3 // Darker background

  if (isDreiPreset) {
    // Use built-in Drei preset (e.g., 'neutral' like model-viewer)
    return (
      <Environment
        preset={hdriFile as any}
        background={showHdriBackground}
        backgroundIntensity={hdriIntensity * backgroundIntensityMultiplier}
        backgroundBlurriness={hdriBlur}
        backgroundRotation={[0, rotationRad, 0]}
        environmentIntensity={hdriIntensity}
        environmentRotation={[0, rotationRad, 0]}
        frames={1}
        resolution={1024}
      />
    )
  }

  // Use custom HDRI file
  // Handle 'neutral' specifically to use local file since it's removed from DREI_PRESETS
  const environmentFile = hdriFile === 'neutral' ? 'textures/env/neutral_HDR.jpg' : hdriFile

  return (
    <Environment
      files={`/${environmentFile}`}
      background={showHdriBackground}
      backgroundIntensity={hdriIntensity * backgroundIntensityMultiplier}
      backgroundBlurriness={hdriBlur}
      backgroundRotation={[0, rotationRad, 0]}
      environmentIntensity={hdriIntensity}
      environmentRotation={[0, rotationRad, 0]}
      frames={1}
      resolution={1024}
    />
  )
}

export default HDRIEnvironment
