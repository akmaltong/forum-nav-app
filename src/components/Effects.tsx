import { Suspense, useLayoutEffect, useRef } from 'react'
import {
  Bloom,
  Vignette,
  EffectComposer as R3FEffectComposer,
  DepthOfField,
  ChromaticAberration,
  BrightnessContrast,
  HueSaturation,
  ToneMapping,
  SMAA,
  type EffectComposerProps,
} from '@react-three/postprocessing'
import {
  NormalPass,
  type EffectComposer as EffectComposerImpl,
} from 'postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useAppStore } from '../store/appStore'
import * as THREE from 'three'
import { HalfFloatType, type WebGLRenderTarget } from 'three'

import { reinterpretType } from '@takram/three-geospatial'
import { mergeRefs } from 'react-merge-refs'
import invariant from 'tiny-invariant'
import type { FC, RefAttributes } from 'react'

// Custom EffectComposer wrapper that provides half-float normal buffer
// Required by AerialPerspective for proper atmospheric scattering
// Exported so AtmosphereEffects.tsx can use it too
export const AtmosphereEffectComposer: FC<
  EffectComposerProps & RefAttributes<EffectComposerImpl>
> = ({ ref: forwardedRef, enableNormalPass = true, ...props }) => {
  const ref = useRef<EffectComposerImpl>(null)
  useLayoutEffect(() => {
    const composer = ref.current
    invariant(composer != null)
    const normalPass = composer.passes.find(pass => pass instanceof NormalPass)
    invariant(normalPass != null)
    reinterpretType<NormalPass & { renderTarget: WebGLRenderTarget }>(normalPass)
    normalPass.renderTarget.texture.type = HalfFloatType
  }, [])

  return (
    <R3FEffectComposer
      ref={mergeRefs([ref, forwardedRef])}
      {...props}
      enableNormalPass={enableNormalPass}
    />
  )
}

// Standard effects pipeline (non-atmosphere mode only)
function StandardEffectsPipeline() {
  const bloomIntensity = useAppStore(state => state.bloomIntensity)
  const bloomThreshold = useAppStore(state => state.bloomThreshold)
  const vignetteIntensity = useAppStore(state => state.vignetteIntensity)
  const dofEnabled = useAppStore(state => state.dofEnabled)
  const dofFocusDistance = useAppStore(state => state.dofFocusDistance)
  const dofFocalLength = useAppStore(state => state.dofFocalLength)
  const dofBokehScale = useAppStore(state => state.dofBokehScale)
  const chromaticAberration = useAppStore(state => state.chromaticAberration)
  const colorBrightness = useAppStore(state => state.colorBrightness)
  const colorContrast = useAppStore(state => state.colorContrast)
  const colorSaturation = useAppStore(state => state.colorSaturation)
  const toneMapping = useAppStore(state => state.toneMapping)

  const toneMappingMode = (() => {
    switch (toneMapping) {
      case 'ACES': return ToneMappingMode.ACES_FILMIC
      case 'AgX': return ToneMappingMode.AGX
      case 'Reinhard': return ToneMappingMode.REINHARD2
      case 'Cineon': return ToneMappingMode.OPTIMIZED_CINEON
      case 'Neutral': return ToneMappingMode.NEUTRAL
      case 'Linear': return ToneMappingMode.LINEAR
      default: return ToneMappingMode.ACES_FILMIC
    }
  })()

  return (
    <R3FEffectComposer multisampling={4}>
      <ToneMapping mode={toneMappingMode} />

      <Bloom
        luminanceThreshold={bloomThreshold}
        mipmapBlur
        intensity={bloomIntensity}
        radius={0.7}
      />

      {dofEnabled ? (
        <DepthOfField
          focusDistance={dofFocusDistance}
          focalLength={dofFocalLength}
          bokehScale={dofBokehScale}
        />
      ) : <></>}

      {chromaticAberration > 0.0001 ? (
        <ChromaticAberration
          offset={new THREE.Vector2(chromaticAberration, chromaticAberration)}
          radialModulation={true}
          modulationOffset={0.5}
        />
      ) : <></>}

      <BrightnessContrast
        brightness={colorBrightness}
        contrast={colorContrast}
      />

      <HueSaturation
        hue={0}
        saturation={colorSaturation}
      />

      {vignetteIntensity > 0.01 ? (
        <Vignette
          offset={0.3}
          darkness={vignetteIntensity}
          eskil={false}
        />
      ) : <></>}

      <SMAA />
    </R3FEffectComposer>
  )
}

export default function Effects() {
  const graphicsQuality = useAppStore(state => state.graphicsQuality)
  const atmosphereEnabled = useAppStore(state => state.atmosphereEnabled)
  const backgroundMode = useAppStore(state => state.backgroundMode)

  // When atmosphere is active, AtmosphereScene handles its own EffectComposer
  const isAtmosphereActive = atmosphereEnabled && backgroundMode === 'sky'
  if (isAtmosphereActive) {
    return null
  }

  if (graphicsQuality === 'performance') {
    return null
  }

  return (
    <Suspense fallback={null}>
      <StandardEffectsPipeline />
    </Suspense>
  )
}
