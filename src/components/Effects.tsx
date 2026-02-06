import { Bloom, Vignette, EffectComposer } from '@react-three/postprocessing'
import { useAppStore } from '../store/appStore'

export default function Effects() {
    const graphicsQuality = useAppStore(state => state.graphicsQuality)

    if (graphicsQuality === 'performance') {
        return null
    }

    return (
        <EffectComposer>
            {/* Bloom: Glowing highlights - subtle and cinematic */}
            <Bloom
                luminanceThreshold={1.0}
                mipmapBlur
                intensity={0.4}
                radius={0.6}
            />

            {/* Vignette: Cinematic border */}
            <Vignette offset={0.3} darkness={0.4} eskil={false} />
        </EffectComposer>
    )
}
