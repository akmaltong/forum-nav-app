import { useAppStore } from '../store/appStore'

export default function AdjustmentsPanel() {
  const store = useAppStore()
  const setActiveBottomPanel = useAppStore(state => state.setActiveBottomPanel)

  return (
    <div
      className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-auto select-none w-[95%] sm:w-auto max-w-[900px] shadow-2xl m-2"
      style={{ 
        backgroundColor: 'rgba(40, 40, 40, 0.4)',
        backdropFilter: 'blur(12px) saturate(180%) brightness(0.7)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%) brightness(0.7)',
        borderRadius: '25px',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), inset 0 -1px 0 0 rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.4)',
        padding: '12px 16px',
      }}
    >
      <style>{`
        @keyframes slideUpIn {
          from { opacity: 0; transform: translate(-50%, 30px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .settings-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 10px;
          outline: none;
          background: linear-gradient(to right, rgba(255,200,120,0.15), rgba(255,200,120,0.35) 50%, rgba(255,200,120,0.15));
        }
        .settings-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff, #e0d8c8);
          border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,200,120,0.2);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .settings-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .settings-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff, #e0d8c8);
          border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          cursor: pointer;
        }
      `}</style>

      {/* Main panel */}
      <div
        style={{
          maxWidth: '700px',
          position: 'relative',
        }}
      >
        {/* Single column layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Environment section */}
          <div>
            <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Окружение
            </div>
            
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => {
                  store.setHdriFile('textures/env/neutral_HDR.jpg')
                  store.setHdriIntensity(store.neutralIntensity)
                  store.setHdriBlur(store.neutralBlur)
                  store.setShowHdriBackground(true)
                }}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: store.hdriFile === 'textures/env/neutral_HDR.jpg' ? 600 : 400,
                  color: 'white',
                  background: store.hdriFile === 'textures/env/neutral_HDR.jpg'
                    ? 'rgba(255,200,120,0.2)'
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${store.hdriFile === 'textures/env/neutral_HDR.jpg' ? 'rgba(255,200,120,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  cursor: 'pointer',
                  transition: '0.2s',
                }}
              >
                Натуральный
              </button>

              <button
                onClick={() => {
                  store.setHdriFile('textures/env/kloppenheim_06_puresky_1k.hdr')
                  store.setHdriIntensity(store.skyIntensity)
                  store.setHdriBlur(store.skyBlur)
                  store.setShowHdriBackground(true)
                }}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: store.hdriFile === 'textures/env/kloppenheim_06_puresky_1k.hdr' ? 600 : 400,
                  color: 'white',
                  background: store.hdriFile === 'textures/env/kloppenheim_06_puresky_1k.hdr'
                    ? 'rgba(255,200,120,0.2)'
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${store.hdriFile === 'textures/env/kloppenheim_06_puresky_1k.hdr' ? 'rgba(255,200,120,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  cursor: 'pointer',
                  transition: '0.2s',
                }}
              >
                Небо
              </button>
              
              {/* Background toggle inline */}
              <div className="flex items-center" style={{ gap: '8px', paddingLeft: '12px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                  Фон
                </span>
                <button
                  onClick={() => store.setShowHdriBackground(!store.showHdriBackground)}
                  style={{
                    width: '36px',
                    height: '20px',
                    borderRadius: '10px',
                    background: store.showHdriBackground 
                      ? 'rgba(255, 200, 120, 0.4)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 200, 120, 0.5)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: '0.2s',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '3px',
                      left: store.showHdriBackground ? '18px' : '3px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 30%, rgb(255, 255, 255), rgb(240, 216, 152))',
                      transition: '0.2s',
                      boxShadow: 'rgba(255, 200, 120, 0.3) 0px 1px 4px',
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Brightness Slider */}
            <div style={{ marginBottom: '12px' }}>
              <div className="flex justify-between items-center mb-1">
                <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Яркость
                </span>
                <span style={{ fontSize: '9px', color: 'rgba(255,200,120,0.5)', fontFamily: 'monospace' }}>
                  {store.hdriFile === 'textures/env/neutral_HDR.jpg' ? store.neutralIntensity.toFixed(2) : store.skyIntensity.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={2.0}
                step={0.05}
                value={store.hdriFile === 'textures/env/neutral_HDR.jpg' ? store.neutralIntensity : store.skyIntensity}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value)
                  if (store.hdriFile === 'textures/env/neutral_HDR.jpg') {
                    store.setNeutralIntensity(newValue)
                    store.setHdriIntensity(newValue)
                  } else {
                    store.setSkyIntensity(newValue)
                    store.setHdriIntensity(newValue)
                  }
                }}
                className="settings-slider"
              />
            </div>

            {/* Blur and Rotation in one row */}
            <div style={{ display: 'flex', gap: '16px' }}>
              {/* Blur Slider */}
              <div style={{ flex: '1 1 0%' }}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Размытие
                  </span>
                  <span style={{ fontSize: '9px', color: 'rgba(255,200,120,0.5)', fontFamily: 'monospace' }}>
                    {store.hdriFile === 'textures/env/neutral_HDR.jpg' ? store.neutralBlur.toFixed(2) : store.skyBlur.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.05}
                  value={store.hdriFile === 'textures/env/neutral_HDR.jpg' ? store.neutralBlur : store.skyBlur}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    if (store.hdriFile === 'textures/env/neutral_HDR.jpg') {
                      store.setNeutralBlur(newValue)
                      store.setHdriBlur(newValue)
                    } else {
                      store.setSkyBlur(newValue)
                      store.setHdriBlur(newValue)
                    }
                  }}
                  className="settings-slider"
                />
              </div>

              {/* Rotation Slider */}
              <div style={{ flex: '1 1 0%' }}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Вращение фона
                  </span>
                  <span style={{ fontSize: '9px', color: 'rgba(255,200,120,0.5)', fontFamily: 'monospace' }}>
                    {Math.round(store.hdriRotation)}°
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={5}
                  value={store.hdriRotation}
                  onChange={(e) => store.setHdriRotation(parseFloat(e.target.value))}
                  className="settings-slider"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
