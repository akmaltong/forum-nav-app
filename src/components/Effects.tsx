import { Suspense } from 'react'
import {
  Bloom,
  EffectComposer as R3FEffectComposer,
  BrightnessContrast,
  SMAA,
  SSAO,
  Vignette,
  HueSaturation,
} from '@react-three/postprocessing'
import { useAppStore } from '../store/appStore'
import { BlendFunction } from 'postprocessing'

// Effects pipeline with SSAO and Bloom
function EffectsPipeline() {
  const bloomIntensity = useAppStore(state => state.bloomIntensity)
  const bloomThreshold = useAppStore(state => state.bloomThreshold)
  const ssaaoEnabled = useAppStore(state => state.ssaaoEnabled)
  const colorBrightness = useAppStore(state => state.colorBrightness)
  const colorContrast = useAppStore(state => state.colorContrast)
  const colorSaturation = useAppStore(state => state.colorSaturation)
  const vignetteIntensity = useAppStore(state => state.vignetteIntensity)

  return (
    <R3FEffectComposer multisampling={2} enableNormalPass={ssaaoEnabled}>
      {/* SSAO - Optimized settings for architectural geometry */}
      {ssaaoEnabled && (
        <SSAO
          samples={16}
          rings={3}
          distanceThreshold={0.5}
          distanceFalloff={0.1}
          rangeThreshold={0.015}
          rangeFalloff={0.01}
          luminanceInfluence={0.7}
          radius={5}
          intensity={2.0}
          bias={0.01}
          color="black"
        />
      )}

      {/* Bloom for emissive materials */}
      <Bloom
        luminanceThreshold={bloomThreshold}
        mipmapBlur={true}
        intensity={bloomIntensity}
        radius={0.5}
      />

      {/* Vignette effect - subtle darkening at edges */}
      {vignetteIntensity > 0 && (
        <Vignette
          offset={0.5}
          darkness={vignetteIntensity}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Color adjustments - only apply if values are significantly non-zero */}
      {(Math.abs(colorBrightness) > 0.01 || Math.abs(colorContrast) > 0.01) && (
        <BrightnessContrast
          brightness={colorBrightness}
          contrast={colorContrast}
        />
      )}

      {/* Saturation - only apply if value is significantly non-zero */}
      {Math.abs(colorSaturation) > 0.01 && (
        <HueSaturation
          saturation={colorSaturation}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Anti-aliasing with optimized quality */}
      <SMAA />
    </R3FEffectComposer>
  )
}

export default function Effects() {
  return (
    <Suspense fallback={null}>
      <EffectsPipeline />
    </Suspense>
  )
}
