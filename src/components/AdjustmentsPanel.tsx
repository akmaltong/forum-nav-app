import { useState } from 'react'
import { useAppStore } from '../store/appStore'

const hdriOptions = [
    { label: 'Env Map', value: '/textures/env/env_map.hdr' },
    { label: 'Studio Small 08', value: '/studio_small_08_4k.hdr' },
    { label: 'Shanghai Bund', value: '/shanghai_bund_1k.hdr' },
    { label: 'Industrial Sunset', value: '/industrial_sunset_02_1k.hdr' },
    { label: 'Broadway Hall', value: '/photo_studio_broadway_hall_1k.hdr' },
    { label: 'Monochrome', value: '/monochrome_studio_02_1k.hdr' },
    { label: 'Kominka', value: '/studio_kominka_02_1k.hdr' },
    { label: 'Ferndale 01', value: '/ferndale_studio_01_1k.hdr' },
    { label: 'Ferndale 02', value: '/ferndale_studio_02_1k.hdr' },
    { label: 'Ferndale 04', value: '/ferndale_studio_04_1k.hdr' },
    { label: 'Ferndale 05', value: '/ferndale_studio_05_1k.hdr' },
    { label: 'Ferndale 06', value: '/ferndale_studio_06_1k.hdr' },
    { label: 'Ferndale 07', value: '/ferndale_studio_07_1k.hdr' },
    { label: 'Ferndale 11', value: '/ferndale_studio_11_1k.hdr' },
    { label: 'Ferndale 12', value: '/ferndale_studio_12_1k.hdr' },
    { label: 'Wooden 05', value: '/wooden_studio_05_1k.hdr' },
    { label: 'Wooden 08', value: '/wooden_studio_08_1k.hdr' },
    { label: 'Wooden 15', value: '/wooden_studio_15_1k.hdr' },
    { label: 'Wooden 19', value: '/wooden_studio_19_1k.hdr' },
    { label: 'Studio Small 01', value: '/studio_small_01_1k.hdr' },
    { label: 'Studio Small 02', value: '/studio_small_02_1k.hdr' },
    { label: 'Studio Small 04', value: '/studio_small_04_1k.hdr' },
]

const presets = [
    { label: 'Утро', time: 8, orientation: 90, icon: '🌅' },
    { label: 'Полдень', time: 12, orientation: 180, icon: '☀️' },
    { label: 'День', time: 14, orientation: 200, icon: '🌤️' },
    { label: 'Закат', time: 18, orientation: 270, icon: '🌇' },
    { label: 'Ночь', time: 22, orientation: 0, icon: '🌙' },
]

const toneMappingOptions = ['ACES', 'AgX', 'Neutral', 'Reinhard', 'Cineon', 'Linear']

function formatTime(hours: number): string {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    const period = h < 12 ? 'AM' : 'PM'
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
}

type PanelMode = 'lighting' | 'environment' | 'effects' | 'atmosphere'

// Compact slider component
function MiniSlider({ label, value, min, max, step, onChange, displayValue }: {
    label: string; value: number; min: number; max: number; step: number;
    onChange: (v: number) => void; displayValue?: string
}) {
    return (
        <div className="flex-1 min-w-[60px] sm:min-w-0">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] sm:text-[9px] text-white/50 font-medium tracking-wider uppercase">{label}</span>
                {displayValue && <span className="text-[8px] sm:text-[9px] text-white/40 font-mono">{displayValue}</span>}
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-white"
            />
        </div>
    )
}

// Toggle switch
function MiniToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!value)}
            className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all border whitespace-nowrap ${value
                ? 'bg-blue-500/30 border-blue-400/40 text-blue-300'
                : 'bg-white/5 border-white/10 text-white/40'
                }`}
        >
            {label}
        </button>
    )
}

// Close button component to avoid repetition
function CloseButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
    return (
        <button
            onClick={onClick}
            className={`shrink-0 p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors ${className}`}
        >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </button>
    )
}

export default function AdjustmentsPanel() {
    const [mode, setMode] = useState<PanelMode>('lighting')

    const store = useAppStore()

    const applyPreset = (preset: typeof presets[0]) => {
        store.setTimeOfDay(preset.time)
        store.setSunOrientation(preset.orientation)
    }

    return (
        <div className="fixed bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none w-[calc(100%-16px)] sm:w-auto">
            {/* Mode tabs — scrollable on mobile */}
            <div className="flex justify-center mb-2 gap-1 overflow-x-auto no-scrollbar">
                {([
                    { key: 'lighting' as PanelMode, label: 'Освещение', action: () => store.setBackgroundMode('sky') },
                    { key: 'atmosphere' as PanelMode, label: 'Атмосфера', action: () => store.setBackgroundMode('sky') },
                    { key: 'environment' as PanelMode, label: 'Окружение', action: () => store.setBackgroundMode('hdri') },
                    { key: 'effects' as PanelMode, label: 'Эффекты', action: () => {} },
                ]).map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => { setMode(tab.key); tab.action() }}
                        className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium transition-all whitespace-nowrap ${mode === tab.key
                            ? 'bg-white/20 text-white backdrop-blur-md'
                            : 'text-white/50 hover:text-white/80'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Glass panel — responsive width */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl px-3 sm:px-5 py-3 w-full sm:min-w-[520px] sm:max-w-[780px] max-h-[50vh] overflow-y-auto">

                {mode === 'lighting' ? (
                    /* LIGHTING MODE */
                    <div className="space-y-3 sm:space-y-0">
                        {/* Mobile: stack, Desktop: single row */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5">
                            {/* Time display */}
                            <div className="shrink-0 text-center">
                                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
                                    {formatTime(store.timeOfDay).split(' ')[0]}
                                </div>
                                <div className="text-[10px] text-white/50 font-medium tracking-wider">
                                    {formatTime(store.timeOfDay).split(' ')[1]}
                                </div>
                            </div>

                            {/* Preset buttons inline */}
                            <div className="shrink-0 flex gap-1">
                                {presets.map((preset) => (
                                    <button
                                        key={preset.label}
                                        onClick={() => applyPreset(preset)}
                                        title={preset.label}
                                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all border ${
                                            Math.abs(store.timeOfDay - preset.time) < 1
                                                ? 'bg-white/20 border-white/30'
                                                : 'bg-white/5 border-white/10 hover:bg-white/15'
                                        }`}
                                    >
                                        {preset.icon}
                                    </button>
                                ))}
                            </div>

                            {/* Time of Day slider */}
                            <div className="flex-1 min-w-0 w-full sm:w-auto">
                                <div className="text-[9px] text-white/50 font-medium tracking-wider uppercase mb-1.5">
                                    TIME OF DAY
                                </div>
                                <input
                                    type="range"
                                    min={5}
                                    max={21}
                                    step={0.1}
                                    value={store.timeOfDay}
                                    onChange={(e) => store.setTimeOfDay(parseFloat(e.target.value))}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: 'linear-gradient(to right, #1a1a3e, #4a3a6e, #c98030, #f0c040, #ffe870, #f0c040, #c98030, #4a3a6e, #1a1a3e)',
                                    }}
                                />
                            </div>

                            {/* Sun Orientation */}
                            <div className="w-full sm:w-[90px] shrink-0">
                                <div className="text-[9px] text-white/50 font-medium tracking-wider uppercase mb-1.5">
                                    ORIENTATION
                                </div>
                                <input
                                    type="range" min={0} max={360} step={1}
                                    value={store.sunOrientation}
                                    onChange={(e) => store.setSunOrientation(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-white/15 rounded-full appearance-none cursor-pointer accent-white"
                                />
                            </div>

                            {/* Night lights toggle */}
                            <MiniToggle label="🏮" value={store.nightLightsEnabled} onChange={store.setNightLightsEnabled} />

                            {/* Close */}
                            <CloseButton onClick={() => store.setShowAdjustments(false)} />
                        </div>
                    </div>
                ) : mode === 'environment' ? (
                    /* ENVIRONMENT MODE */
                    <div className="space-y-3 sm:space-y-0">
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
                            {/* HDRI selector */}
                            <div className="shrink-0 w-full sm:w-auto sm:min-w-[120px]">
                                <div className="text-[9px] text-white/50 font-medium tracking-wider uppercase mb-1.5">HDRI</div>
                                <select
                                    value={store.hdriFile}
                                    onChange={(e) => store.setHdriFile(e.target.value)}
                                    className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-white text-[10px] cursor-pointer focus:outline-none hover:bg-white/15 transition-colors"
                                >
                                    {hdriOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value} className="bg-gray-900">
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <MiniSlider label="BLUR" value={store.hdriBlur} min={0} max={1} step={0.01} onChange={store.setHdriBlur} />
                            <MiniSlider label="INTENSITY" value={store.hdriIntensity} min={0.05} max={5} step={0.01} onChange={store.setHdriIntensity} displayValue={store.hdriIntensity.toFixed(1)} />
                            <MiniSlider label="ROTATION" value={store.hdriRotation1} min={0} max={6.28} step={0.01} onChange={store.setHdriRotation1} />
                            <MiniSlider label="EXPOSURE" value={store.toneMappingExposure} min={0.2} max={20} step={0.1} onChange={store.setToneMappingExposure} displayValue={store.toneMappingExposure.toFixed(1)} />

                            <CloseButton onClick={() => store.setShowAdjustments(false)} />
                        </div>
                    </div>
                ) : mode === 'atmosphere' ? (
                    /* ATMOSPHERE MODE */
                    <div className="space-y-3">
                        {/* Row 1: Toggles */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <MiniToggle label="☁️ Облака" value={store.cloudsEnabled} onChange={store.setCloudsEnabled} />
                            <MiniToggle label="🌫️ Атмосфера" value={store.atmosphereEnabled} onChange={store.setAtmosphereEnabled} />
                            <MiniToggle label="🌁 Туман" value={store.fogEnabled} onChange={store.setFogEnabled} />
                            <MiniToggle label="☀️ Лучи" value={store.godRaysEnabled} onChange={store.setGodRaysEnabled} />
                            <CloseButton onClick={() => store.setShowAdjustments(false)} className="ml-auto" />
                        </div>

                        {/* Row 2: Cloud controls */}
                        {store.cloudsEnabled && (
                            <div className="flex flex-wrap items-end gap-2 sm:gap-3">
                                <MiniSlider label="ПОКРЫТИЕ" value={store.cloudCoverage} min={0} max={1} step={0.01} onChange={store.setCloudCoverage} displayValue={`${Math.round(store.cloudCoverage * 100)}%`} />
                                <MiniSlider label="ПЛОТНОСТЬ" value={store.cloudDensity} min={0} max={1} step={0.01} onChange={store.setCloudDensity} displayValue={store.cloudDensity.toFixed(2)} />
                                <MiniSlider label="МАСШТАБ" value={store.cloudScale} min={0.3} max={3} step={0.1} onChange={store.setCloudScale} displayValue={store.cloudScale.toFixed(1)} />
                                <MiniSlider label="СКОРОСТЬ" value={store.cloudSpeed} min={0} max={0.1} step={0.001} onChange={store.setCloudSpeed} displayValue={store.cloudSpeed.toFixed(3)} />
                                <MiniSlider label="ВЫСОТА" value={store.cloudAltitude} min={30} max={200} step={5} onChange={store.setCloudAltitude} displayValue={`${store.cloudAltitude}м`} />
                                <MiniSlider label="ПРОЗР." value={store.cloudOpacity} min={0} max={1} step={0.01} onChange={store.setCloudOpacity} displayValue={store.cloudOpacity.toFixed(2)} />
                            </div>
                        )}

                        {/* Row 3: Atmosphere + Fog + God Rays controls */}
                        {(store.atmosphereEnabled || store.fogEnabled || store.godRaysEnabled) && (
                            <div className="flex flex-wrap items-end gap-2 sm:gap-3">
                                {store.atmosphereEnabled && (
                                    <>
                                        <MiniSlider label="ИНТЕНС." value={store.atmosphereIntensity} min={0} max={1} step={0.01} onChange={store.setAtmosphereIntensity} displayValue={store.atmosphereIntensity.toFixed(2)} />
                                        <MiniSlider label="МУТНОСТЬ" value={store.atmosphereTurbidity} min={0.5} max={10} step={0.1} onChange={store.setAtmosphereTurbidity} displayValue={store.atmosphereTurbidity.toFixed(1)} />
                                        <MiniSlider label="РЭЛЕЙ" value={store.atmosphereRayleighScale} min={0.1} max={3} step={0.1} onChange={store.setAtmosphereRayleighScale} displayValue={store.atmosphereRayleighScale.toFixed(1)} />
                                    </>
                                )}
                                {store.fogEnabled && (
                                    <>
                                        <MiniSlider label="ТУМАН" value={store.fogDensity} min={0} max={1} step={0.01} onChange={store.setFogDensity} displayValue={store.fogDensity.toFixed(2)} />
                                        <MiniSlider label="ВЫСОТА ТУМ." value={store.fogHeight} min={0} max={20} step={0.5} onChange={store.setFogHeight} displayValue={`${store.fogHeight}м`} />
                                    </>
                                )}
                                {store.godRaysEnabled && (
                                    <MiniSlider label="ЛУЧИ" value={store.godRaysIntensity} min={0} max={1} step={0.01} onChange={store.setGodRaysIntensity} displayValue={store.godRaysIntensity.toFixed(2)} />
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    /* EFFECTS MODE */
                    <div className="space-y-3">
                        {/* Row 1: Quality + Tone mapping */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
                            {/* Quality toggle */}
                            <div className="shrink-0">
                                <button
                                    onClick={() => store.setGraphicsQuality(store.graphicsQuality === 'high' ? 'performance' : 'high')}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                        store.graphicsQuality === 'high'
                                            ? 'bg-green-500/20 border-green-400/40 text-green-300'
                                            : 'bg-red-500/10 border-red-400/20 text-red-300'
                                    }`}
                                >
                                    {store.graphicsQuality === 'high' ? '✦ HIGH' : '⚡ PERF'}
                                </button>
                            </div>

                            {/* Tone mapping selector */}
                            <div className="shrink-0">
                                <div className="text-[9px] text-white/50 font-medium tracking-wider uppercase mb-1">TONE MAP</div>
                                <div className="flex gap-0.5 flex-wrap">
                                    {toneMappingOptions.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => store.setToneMapping(opt)}
                                            className={`px-1.5 py-0.5 rounded text-[9px] transition-all ${
                                                store.toneMapping === opt
                                                    ? 'bg-white/20 text-white'
                                                    : 'text-white/30 hover:text-white/60'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <MiniSlider label="EXPOSURE" value={store.toneMappingExposure} min={0.2} max={20} step={0.1} onChange={store.setToneMappingExposure} displayValue={store.toneMappingExposure.toFixed(1)} />

                            <CloseButton onClick={() => store.setShowAdjustments(false)} className="ml-auto" />
                        </div>

                        {/* Row 2: Effect sliders */}
                        {store.graphicsQuality === 'high' && (
                            <div className="flex flex-wrap items-end gap-2 sm:gap-3">
                                <MiniSlider label="BLOOM" value={store.bloomIntensity} min={0} max={2} step={0.01} onChange={store.setBloomIntensity} displayValue={store.bloomIntensity.toFixed(2)} />
                                <MiniSlider label="VIGNETTE" value={store.vignetteIntensity} min={0} max={1} step={0.01} onChange={store.setVignetteIntensity} displayValue={store.vignetteIntensity.toFixed(2)} />
                                <MiniSlider label="CHROMA" value={store.chromaticAberration} min={0} max={0.01} step={0.0001} onChange={store.setChromaticAberration} />
                                <MiniToggle label="DOF" value={store.dofEnabled} onChange={store.setDofEnabled} />
                                <MiniToggle label="SHADOW" value={store.contactShadowsEnabled} onChange={store.setContactShadowsEnabled} />
                            </div>
                        )}

                        {/* Row 3: Color correction */}
                        {store.graphicsQuality === 'high' && (
                            <div className="flex flex-wrap items-end gap-2 sm:gap-3">
                                <MiniSlider label="BRIGHTNESS" value={store.colorBrightness} min={-0.3} max={0.3} step={0.01} onChange={store.setColorBrightness} displayValue={store.colorBrightness.toFixed(2)} />
                                <MiniSlider label="CONTRAST" value={store.colorContrast} min={-0.3} max={0.5} step={0.01} onChange={store.setColorContrast} displayValue={store.colorContrast.toFixed(2)} />
                                <MiniSlider label="SATURATION" value={store.colorSaturation} min={-1} max={1} step={0.01} onChange={store.setColorSaturation} displayValue={store.colorSaturation.toFixed(2)} />
                                {store.dofEnabled && (
                                    <>
                                        <MiniSlider label="FOCUS" value={store.dofFocusDistance} min={0} max={0.1} step={0.001} onChange={store.setDofFocusDistance} />
                                        <MiniSlider label="BOKEH" value={store.dofBokehScale} min={0} max={10} step={0.1} onChange={store.setDofBokehScale} displayValue={store.dofBokehScale.toFixed(1)} />
                                    </>
                                )}
                            </div>
                        )}

                        {store.graphicsQuality === 'performance' && (
                            <div className="text-center text-white/30 text-[10px] py-1">
                                Включите режим HIGH для настройки эффектов
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
