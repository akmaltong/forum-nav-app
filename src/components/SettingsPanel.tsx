import { useAppStore } from '../store/appStore'

export default function SettingsPanel() {
  const setActivePanel = useAppStore(state => state.setActivePanel)
  const {
    materialColor,
    setMaterialColor,
    materialRoughness,
    setMaterialRoughness,
    materialMetalness,
    setMaterialMetalness,
    graphicsQuality,
    setGraphicsQuality,
    hdriIntensity,
    setHdriIntensity,
    showHdriBackground,
    setShowHdriBackground
  } = useAppStore(state => ({
    materialColor: state.materialColor,
    setMaterialColor: state.setMaterialColor,
    materialRoughness: state.materialRoughness,
    setMaterialRoughness: state.setMaterialRoughness,
    materialMetalness: state.materialMetalness,
    setMaterialMetalness: state.setMaterialMetalness,
    graphicsQuality: state.graphicsQuality,
    setGraphicsQuality: state.setGraphicsQuality,
    hdriIntensity: state.hdriIntensity,
    setHdriIntensity: state.setHdriIntensity,
    showHdriBackground: state.showHdriBackground,
    setShowHdriBackground: state.setShowHdriBackground
  }))

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 flex items-center justify-between">
        <h2 className="text-base font-bold">⚙️ Settings</h2>
        <button
          onClick={() => setActivePanel(null)}
          className="text-white hover:bg-white/20 rounded-full p-2"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
        {/* Environment Settings */}
        <div className="bg-gray-800 rounded-lg p-2.5">
          <h3 className="text-sm font-bold mb-3 text-blue-400">🌅 Environment</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Show Background</span>
              <button
                onClick={() => setShowHdriBackground(!showHdriBackground)}
                className={`w-10 h-5 rounded-full transition-colors relative ${showHdriBackground ? 'bg-blue-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${showHdriBackground ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/50">
                <span>Intensity</span>
                <span>{hdriIntensity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={hdriIntensity}
                onChange={(e) => setHdriIntensity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Graphics Quality Section */}
        <div className="bg-gray-800 rounded-lg p-2.5">
          <h3 className="text-sm font-bold mb-3 text-green-400">🚀 Performance</h3>

          <div className="flex bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setGraphicsQuality('high')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${graphicsQuality === 'high'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              High Quality
            </button>
            <button
              onClick={() => setGraphicsQuality('performance')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${graphicsQuality === 'performance'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              Performance
            </button>
          </div>
        </div>

        {/* Material Settings Section */}
        <div className="bg-gray-800 rounded-lg p-2.5">
          <h3 className="text-sm font-bold mb-3 text-orange-400">🏢 Model Material</h3>

          {/* Material Color Picker */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Color</label>
              <div
                className="w-6 h-6 rounded border border-white/20"
                style={{ backgroundColor: materialColor }}
              />
            </div>
            <input
              type="color"
              value={materialColor}
              onChange={(e) => setMaterialColor(e.target.value)}
              className="w-full h-8 rounded-lg cursor-pointer bg-gray-700"
            />
          </div>

          {/* Roughness Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Roughness</label>
              <span className="text-sm text-orange-400 font-mono">{materialRoughness.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.01"
              value={materialRoughness}
              onChange={(e) => setMaterialRoughness(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Metalness Slider */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Metalness</label>
              <span className="text-sm text-orange-400 font-mono">{materialMetalness.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.01"
              value={materialMetalness}
              onChange={(e) => setMaterialMetalness(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setHdriIntensity(1)
            setShowHdriBackground(true)
            setMaterialColor('#ffffff')
            setMaterialRoughness(0.2)
            setMaterialMetalness(0.5)
          }}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors text-sm"
        >
          🔄 Reset to Default
        </button>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-3 text-center text-xs text-gray-600 border-t border-gray-700">
        <div>Forum Navigator v1.0.0</div>
      </div>
    </div>
  )
}
