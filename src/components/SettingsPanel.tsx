import { useAppStore } from '../store/appStore'

export default function SettingsPanel() {
  const setActivePanel = useAppStore(state => state.setActivePanel)
  const store = useAppStore()

  const resetAll = () => {
    store.setHdriIntensity(1)
    store.setShowHdriBackground(true)
    store.setMaterialColor('#bcbcbc')
    store.setMaterialRoughness(0.25)
    store.setMaterialMetalness(0.02)
    store.setToneMapping('ACES')
    store.setToneMappingExposure(1.4)
    store.setBloomIntensity(0.5)
    store.setBloomThreshold(0.9)
    store.setVignetteIntensity(0.35)
    store.setDofEnabled(false)
    store.setChromaticAberration(0.002)
    store.setColorBrightness(0.0)
    store.setColorContrast(0.05)
    store.setColorSaturation(0.1)
    store.setNightLightsEnabled(true)
    store.setContactShadowsEnabled(true)
    store.setTimeOfDay(14)
    store.setSunOrientation(180)
  }

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 flex items-center justify-between">
        <h2 className="text-base font-bold">Settings</h2>
        <button
          onClick={() => setActivePanel(null)}
          className="text-white hover:bg-white/20 rounded-full p-2"
          title="Close"
        >
          X
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
        {/* Environment Settings */}
        <div className="bg-gray-800 rounded-lg p-2.5">
          <h3 className="text-sm font-bold mb-3 text-blue-400">Environment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Show Background</span>
              <button
                onClick={() => store.setShowHdriBackground(!store.showHdriBackground)}
                className={`w-10 h-5 rounded-full transition-colors relative ${store.showHdriBackground ? 'bg-blue-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${store.showHdriBackground ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <SliderRow label="Intensity" value={store.hdriIntensity} min={0} max={5} step={0.1} onChange={store.setHdriIntensity} />
            <SliderRow label="Exposure" value={store.toneMappingExposure} min={0.2} max={3} step={0.05} onChange={store.setToneMappingExposure} />
          </div>
        </div>

        {/* Graphics Quality Section */}
        <div className="bg-gray-800 rounded-lg p-2.5">
          <h3 className="text-sm font-bold mb-3 text-green-400">Performance</h3>
          <div className="flex bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => store.setGraphicsQuality('high')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${store.graphicsQuality === 'high'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              High Quality
            </button>
            <button
              onClick={() => store.setGraphicsQuality('performance')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${store.graphicsQuality === 'performance'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              Performance
            </button>
          </div>
          {store.graphicsQuality === 'high' && (
            <div className="mt-3 space-y-2">
              <ToggleRow label="Depth of Field" value={store.dofEnabled} onChange={store.setDofEnabled} />
              <ToggleRow label="Contact Shadows" value={store.contactShadowsEnabled} onChange={store.setContactShadowsEnabled} />
              <ToggleRow label="Night Lights" value={store.nightLightsEnabled} onChange={store.setNightLightsEnabled} />
            </div>
          )}
        </div>

        {/* Material Settings Section */}
        <div className="bg-gray-800 rounded-lg p-2.5">
          <h3 className="text-sm font-bold mb-3 text-orange-400">Model Material</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Color</label>
              <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: store.materialColor }} />
            </div>
            <input
              type="color"
              value={store.materialColor}
              onChange={(e) => store.setMaterialColor(e.target.value)}
              className="w-full h-8 rounded-lg cursor-pointer bg-gray-700"
            />
          </div>
          <SliderRow label="Roughness" value={store.materialRoughness} min={0} max={1} step={0.01} onChange={store.setMaterialRoughness} />
          <SliderRow label="Metalness" value={store.materialMetalness} min={0} max={1} step={0.01} onChange={store.setMaterialMetalness} />
        </div>

        {/* Reset Button */}
        <button
          onClick={resetAll}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Reset to Default
        </button>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-3 text-center text-xs text-gray-600 border-t border-gray-700">
        <div>Forum Navigator v1.1.0 — Enhanced Lighting</div>
      </div>
    </div>
  )
}

function SliderRow({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1 mb-3">
      <div className="flex justify-between text-xs text-white/50">
        <span>{label}</span>
        <span className="font-mono">{value.toFixed(2)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  )
}

function ToggleRow({ label, value, onChange }: {
  label: string; value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/70">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full transition-colors relative ${value ? 'bg-blue-500' : 'bg-white/10'}`}
      >
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${value ? 'left-5' : 'left-1'}`} />
      </button>
    </div>
  )
}
