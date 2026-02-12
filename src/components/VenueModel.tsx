import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../store/appStore'

function LoadedModel() {
  const gltf = useGLTF('/SM_MFF.glb')
  const { scene } = gltf
  
  // Log loading status
  useEffect(() => {
    console.log('GLTF Loading Status:', { hasScene: !!scene })
    if (scene) {
      console.log('GLTF Model loaded successfully')
      // Log scene info
      console.log('Scene children count:', scene.children?.length)
    }
  }, [scene])
  
  // Get material settings from store
  const materialColor = useAppStore(state => state.materialColor)
  const materialRoughness = useAppStore(state => state.materialRoughness)
  const materialMetalness = useAppStore(state => state.materialMetalness)

  // Create material with store settings - using MeshStandardMaterial for PBR
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(materialColor),
      roughness: materialRoughness,
      metalness: materialMetalness,
      envMapIntensity: 1.2,
      flatShading: false,
      side: THREE.DoubleSide, // Double-sided to fix inverted normals
      // Enable better normal mapping for SSAO
      normalMapType: THREE.TangentSpaceNormalMap,
    })
  }, [materialColor, materialRoughness, materialMetalness])

  // Apply materials to loaded model
  useEffect(() => {
    if (gltf?.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          // Clone material for each mesh
          const mat = material.clone()
          child.material = mat
          child.castShadow = true
          child.receiveShadow = true
          
          // Optimize geometry
          if (child.geometry) {
            child.geometry.computeBoundingSphere()
            child.geometry.computeVertexNormals()
            
            // Enable anisotropic filtering for textures
            if (child.material.map) {
              child.material.map.anisotropy = 16
            }
            if (child.material.normalMap) {
              child.material.normalMap.anisotropy = 16
            }
          }
        }
      })
    }
  }, [gltf, material])

  return (
    <>
      {/* Original model */}
      <primitive
        object={scene}
        scale={1}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </>
  )
}

export default function VenueModel() {
  return <LoadedModel />
}
