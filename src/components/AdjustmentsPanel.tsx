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
    { label: 'Утро', time: 8, orientation: 90 },
    { label: 'Полдень', time: 12, orientation: 180 },
    { label: 'День', time: 14, orientation: 200 },
    { label: 'Закат', time: 18, orientation: 270 },
    { label: 'Ночь', time: 22, orientation: 0 },
]

function formatTime(hours: number): string {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    const period = h < 12 ? 'AM' : 'PM'
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
}

type PanelMode = 'lighting' | 'environment'

export default function AdjustmentsPanel() {
    const [mode, setMode] = useState<PanelMode>('lighting')
    const [showPresets, setShowPresets] = useState(false)

    const {
        hdriBlur, setHdriBlur,
        hdriRotation1, setHdriRotation1,
        hdriMix, setHdriMix,
        hdriProcedural, setHdriProcedural,
        hdriIntensity, setHdriIntensity,
        hdriFile, setHdriFile,
        timeOfDay, setTimeOfDay,
        sunOrientation, setSunOrientation,
        setShowAdjustments,
        setBackgroundMode,
    } = useAppStore(state => ({
        hdriBlur: state.hdriBlur,
        setHdriBlur: state.setHdriBlur,
        hdriRotation1: state.hdriRotation1,
        setHdriRotation1: state.setHdriRotation1,
        hdriMix: state.hdriMix,
        setHdriMix: state.setHdriMix,
        hdriProcedural: state.hdriProcedural,
        setHdriProcedural: state.setHdriProcedural,
        hdriIntensity: state.hdriIntensity,
        setHdriIntensity: state.setHdriIntensity,
        hdriFile: state.hdriFile,
        setHdriFile: state.setHdriFile,
        timeOfDay: state.timeOfDay,
        setTimeOfDay: state.setTimeOfDay,
        sunOrientation: state.sunOrientation,
        setSunOrientation: state.setSunOrientation,
        setShowAdjustments: state.setShowAdjustments,
        setBackgroundMode: state.setBackgroundMode,
    }))

    const applyPreset = (preset: typeof presets[0]) => {
        setTimeOfDay(preset.time)
        setSunOrientation(preset.orientation)
        setShowPresets(false)
    }

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none">
            {/* Mode tabs */}
            <div className="flex justify-center mb-2 gap-1">
                <button
                    onClick={() => { setMode('lighting'); setBackgroundMode('sky') }}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${mode === 'lighting'
                        ? 'bg-white/20 text-white backdrop-blur-md'
                        : 'text-white/50 hover:text-white/80'
                        }`}
                >
                    Освещение
                </button>
                <button
                    onClick={() => { setMode('environment'); setBackgroundMode('hdri') }}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${mode === 'environment'
                        ? 'bg-white/20 text-white backdrop-blur-md'
                        : 'text-white/50 hover:text-white/80'
                        }`}
                >
                    Окружение
                </button>
            </div>

            {/* Glass panel */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl px-6 py-4 min-w-[500px] max-w-[700px]">

                {mode === 'lighting' ? (
                    /* LIGHTING MODE */
                    <div className="flex items-center gap-6">
                        {/* Time display */}
                        <div className="shrink-0 text-center">
                            <div className="text-3xl font-bold text-white tracking-tight leading-none">
                                {formatTime(timeOfDay).split(' ')[0]}
                            </div>
                            <div className="text-[10px] text-white/50 font-medium tracking-wider">
                                {formatTime(timeOfDay).split(' ')[1]}
                            </div>
                        </div>

                        {/* Preset button */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => setShowPresets(!showPresets)}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-medium transition-all flex items-center gap-1 border border-white/10"
                            >
                                PRESET
                                <svg className={`w-3 h-3 transition-transform ${showPresets ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                </svg>
                            </button>

                            {showPresets && (
                                <div className="absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden min-w-[120px]">
                                    {presets.map((preset) => (
                                        <button
                                            key={preset.label}
                                            onClick={() => applyPreset(preset)}
                                            className="w-full px-3 py-1.5 text-left text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Time of Day slider */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-white/60 font-medium tracking-wider uppercase mb-1.5">
                                TIME OF DAY
                            </div>
                            <div className="relative">
                                <input
                                    type="range"
                                    min={5}
                                    max={21}
                                    step={0.1}
                                    value={timeOfDay}
                                    onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: 'linear-gradient(to right, #1a1a3e, #4a3a6e, #c98030, #f0c040, #ffe870, #f0c040, #c98030, #4a3a6e, #1a1a3e)',
                                    }}
                                />
                                <div className="flex justify-between text-[8px] text-white/30 mt-1">
                                    <span>5 AM</span>
                                    <span>9 AM</span>
                                    <span>12 PM</span>
                                    <span>3 PM</span>
                                    <span>6 PM</span>
                                    <span>9 PM</span>
                                </div>
                            </div>
                        </div>

                        {/* Sun Orientation slider */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-white/60 font-medium tracking-wider uppercase mb-1.5">
                                SUN ORIENTATION
                            </div>
                            <div className="relative">
                                <input
                                    type="range"
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={sunOrientation}
                                    onChange={(e) => setSunOrientation(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                                />
                                <div className="flex justify-between text-[8px] text-white/30 mt-1">
                                    <span>0°</span>
                                    <span>90°</span>
                                    <span>180°</span>
                                    <span>270°</span>
                                    <span>360°</span>
                                </div>
                            </div>
                        </div>

                        {/* Close */}
                        <button
                            onClick={() => setShowAdjustments(false)}
                            className="shrink-0 p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    /* ENVIRONMENT MODE */
                    <div className="flex items-center gap-5">
                        {/* HDRI selector */}
                        <div className="shrink-0 min-w-[130px]">
                            <div className="text-[10px] text-white/60 font-medium tracking-wider uppercase mb-1.5">
                                HDRI
                            </div>
                            <select
                                value={hdriFile}
                                onChange={(e) => setHdriFile(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 text-white text-[11px] cursor-pointer focus:outline-none hover:bg-white/15 transition-colors"
                            >
                                {hdriOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-gray-900">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Blur */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-white/60 font-medium tracking-wider uppercase mb-1.5">
                                BLUR
                            </div>
                            <input
                                type="range" min={0} max={1} step={0.01} value={hdriBlur}
                                onChange={(e) => setHdriBlur(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                            />
                        </div>

                        {/* Sharpness / Procedural */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-white/60 font-medium tracking-wider uppercase mb-1.5">
                                ЧЕТКОСТЬ
                            </div>
                            <input
                                type="range" min={0} max={1} step={0.01} value={hdriProcedural}
                                onChange={(e) => setHdriProcedural(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                            />
                        </div>

                        {/* Intensity */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-white/60 font-medium tracking-wider uppercase mb-1.5">
                                INTENSITY
                            </div>
                            <input
                                type="range" min={0.05} max={5} step={0.01} value={hdriIntensity}
                                onChange={(e) => setHdriIntensity(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                            />
                        </div>

                        {/* Rotation */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-white/60 font-medium tracking-wider uppercase mb-1.5">
                                ROTATION
                            </div>
                            <input
                                type="range" min={0} max={6.28} step={0.01} value={hdriRotation1}
                                onChange={(e) => setHdriRotation1(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                            />
                        </div>

                        {/* Close */}
                        <button
                            onClick={() => setShowAdjustments(false)}
                            className="shrink-0 p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
