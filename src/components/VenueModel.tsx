import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../store/appStore'

function LoadedModel() {
  const gltf = useGLTF('/SM_MFF.glb')

  const materialColor = useAppStore(state => state.materialColor)
  const materialRoughness = useAppStore(state => state.materialRoughness)
  const materialMetalness = useAppStore(state => state.materialMetalness)
  const materialOpacity = useAppStore(state => state.materialOpacity)

  // Apply materials to loaded model
  useEffect(() => {
    if (gltf?.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          // Update material with store values
          child.material = new THREE.MeshPhysicalMaterial({
            color: materialColor,
            roughness: materialRoughness,
            metalness: materialMetalness,
            opacity: materialOpacity,
            transparent: materialOpacity < 1,
            envMapIntensity: 1.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            side: THREE.DoubleSide
          })
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [gltf, materialColor, materialRoughness, materialMetalness, materialOpacity])

  return (
    <primitive
      object={gltf.scene}
      scale={1}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

export default function VenueModel() {
  // Render loaded model (Suspense will handle loading)
  return <LoadedModel />
}

