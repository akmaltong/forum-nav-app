import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Zone, Event, Friend, Route, UserLocation, ViewMode, UIPanel, Notification } from '../types'

export type GraphicsQuality = 'high' | 'performance'

interface AppState {
  // User state
  userLocation: UserLocation | null
  setUserLocation: (location: UserLocation) => void

  // Zones
  zones: Zone[]
  setZones: (zones: Zone[]) => void
  selectedZone: Zone | null
  setSelectedZone: (zone: Zone | null) => void

  // Events
  events: Event[]
  selectedEvent: Event | null
  setSelectedEvent: (event: Event | null) => void
  favoriteEvents: string[]
  toggleFavoriteEvent: (eventId: string) => void

  // Friends
  friends: Friend[]
  selectedFriend: Friend | null
  setSelectedFriend: (friend: Friend | null) => void

  // Navigation
  currentRoute: Route | null
  setRoute: (route: Route | null) => void
  isNavigating: boolean
  setIsNavigating: (isNavigating: boolean) => void

  // UI
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  activePanel: UIPanel
  setActivePanel: (panel: UIPanel) => void
  showMiniMap: boolean
  toggleMiniMap: () => void

  // Camera
  cameraTarget: string | null
  setCameraTarget: (target: string | null) => void
  cameraPosition: [number, number, number] | null
  setCameraPosition: (position: [number, number, number] | null) => void
  cameraTargetPosition: [number, number, number] | null
  setCameraTargetPosition: (position: [number, number, number] | null) => void

  // Edit mode
  editMode: boolean
  setEditMode: (enabled: boolean) => void

  // POI Edit mode
  poiEditMode: boolean
  setPoiEditMode: (enabled: boolean) => void

  // Adjustments Toggle
  showAdjustments: boolean
  setShowAdjustments: (show: boolean) => void

  // AR
  arMode: boolean
  setArMode: (enabled: boolean) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void

  // HDRI Settings
  hdriIntensity: number
  setHdriIntensity: (intensity: number) => void
  hdriMix: number
  setHdriMix: (mix: number) => void
  hdriProcedural: number
  setHdriProcedural: (procedural: number) => void
  hdriHue: number
  setHdriHue: (hue: number) => void
  hdriSaturation: number
  setHdriSaturation: (saturation: number) => void
  hdriBlur: number
  setHdriBlur: (blur: number) => void
  hdriRotation1: number
  setHdriRotation1: (rotation: number) => void
  hdriRotation2: number
  setHdriRotation2: (rotation: number) => void
  showHdriBackground: boolean
  setShowHdriBackground: (show: boolean) => void
  hdriFile: string
  setHdriFile: (file: string) => void

  // Background mode: 'sky' for procedural sky, 'hdri' for HDRI environment map
  backgroundMode: 'sky' | 'hdri'
  setBackgroundMode: (mode: 'sky' | 'hdri') => void

  // Sun / Time of Day
  timeOfDay: number // 0-24 hours
  setTimeOfDay: (time: number) => void
  sunOrientation: number // 0-360 degrees
  setSunOrientation: (orientation: number) => void
  showLightingPanel: boolean
  setShowLightingPanel: (show: boolean) => void

  // Graphics Settings
  graphicsQuality: GraphicsQuality
  setGraphicsQuality: (quality: GraphicsQuality) => void

  // Material Settings
  materialColor: string
  setMaterialColor: (color: string) => void
  materialRoughness: number
  setMaterialRoughness: (roughness: number) => void
  materialMetalness: number
  setMaterialMetalness: (metalness: number) => void
  materialOpacity: number
  setMaterialOpacity: (opacity: number) => void

  // Post-processing / Color Correction
  toneMapping: string
  setToneMapping: (mapping: string) => void
  toneMappingExposure: number
  setToneMappingExposure: (exposure: number) => void
  bloomIntensity: number
  setBloomIntensity: (intensity: number) => void
  bloomThreshold: number
  setBloomThreshold: (threshold: number) => void
  vignetteIntensity: number
  setVignetteIntensity: (intensity: number) => void
  ssaoEnabled: boolean
  setSsaoEnabled: (enabled: boolean) => void
  ssaoIntensity: number
  setSsaoIntensity: (intensity: number) => void
  dofEnabled: boolean
  setDofEnabled: (enabled: boolean) => void
  dofFocusDistance: number
  setDofFocusDistance: (distance: number) => void
  dofFocalLength: number
  setDofFocalLength: (length: number) => void
  dofBokehScale: number
  setDofBokehScale: (scale: number) => void
  chromaticAberration: number
  setChromaticAberration: (amount: number) => void
  colorBrightness: number
  setColorBrightness: (brightness: number) => void
  colorContrast: number
  setColorContrast: (contrast: number) => void
  colorSaturation: number
  setColorSaturation: (saturation: number) => void

  // Night mode lighting
  nightLightsEnabled: boolean
  setNightLightsEnabled: (enabled: boolean) => void
  nightLightsIntensity: number
  setNightLightsIntensity: (intensity: number) => void

  // Contact shadows
  contactShadowsEnabled: boolean
  setContactShadowsEnabled: (enabled: boolean) => void

  // Atmosphere (inspired by @takram/three-atmosphere)
  atmosphereEnabled: boolean
  setAtmosphereEnabled: (enabled: boolean) => void
  atmosphereIntensity: number
  setAtmosphereIntensity: (intensity: number) => void
  atmosphereTurbidity: number
  setAtmosphereTurbidity: (turbidity: number) => void
  atmosphereMieCoeff: number
  setAtmosphereMieCoeff: (coeff: number) => void
  atmosphereRayleighScale: number
  setAtmosphereRayleighScale: (scale: number) => void

  // Clouds (inspired by @takram/three-clouds)
  cloudsEnabled: boolean
  setCloudsEnabled: (enabled: boolean) => void
  cloudCoverage: number
  setCloudCoverage: (coverage: number) => void
  cloudDensity: number
  setCloudDensity: (density: number) => void
  cloudScale: number
  setCloudScale: (scale: number) => void
  cloudSpeed: number
  setCloudSpeed: (speed: number) => void
  cloudAltitude: number
  setCloudAltitude: (altitude: number) => void
  cloudOpacity: number
  setCloudOpacity: (opacity: number) => void

  // Fog
  fogEnabled: boolean
  setFogEnabled: (enabled: boolean) => void
  fogDensity: number
  setFogDensity: (density: number) => void
  fogHeight: number
  setFogHeight: (height: number) => void

  // God Rays
  godRaysEnabled: boolean
  setGodRaysEnabled: (enabled: boolean) => void
  godRaysIntensity: number
  setGodRaysIntensity: (intensity: number) => void
}

export const useAppStore = create<AppState>()(persist((set) => ({
  // User
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),

  // Zones - initialized with empty array, will be loaded from mockData
  zones: [],
  selectedZone: null,
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  setZones: (zones) => set({ zones }),

  // Events
  events: [],
  selectedEvent: null,
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  favoriteEvents: [],
  toggleFavoriteEvent: (eventId) => set((state) => ({
    favoriteEvents: state.favoriteEvents.includes(eventId)
      ? state.favoriteEvents.filter(id => id !== eventId)
      : [...state.favoriteEvents, eventId]
  })),

  // Friends
  friends: [],
  selectedFriend: null,
  setSelectedFriend: (friend) => set({ selectedFriend: friend }),

  // Navigation
  currentRoute: null,
  setRoute: (route) => set({ currentRoute: route }),
  isNavigating: false,
  setIsNavigating: (isNavigating) => set({ isNavigating }),

  // UI
  viewMode: 'angle',
  setViewMode: (mode) => set({ viewMode: mode }),
  activePanel: null,
  setActivePanel: (panel) => set({ activePanel: panel }),
  showMiniMap: true,
  toggleMiniMap: () => set((state) => ({ showMiniMap: !state.showMiniMap })),

  // AR
  arMode: false,
  setArMode: (enabled) => set({ arMode: enabled }),

  // Camera
  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  cameraPosition: null,
  setCameraPosition: (position) => set({ cameraPosition: position }),
  cameraTargetPosition: null,
  setCameraTargetPosition: (position) => set({ cameraTargetPosition: position }),

  // Edit mode
  editMode: false,
  setEditMode: (enabled) => set({ editMode: enabled }),

  // POI Edit mode
  poiEditMode: false,
  setPoiEditMode: (enabled) => set({ poiEditMode: enabled }),

  // Adjustments Toggle
  showAdjustments: true, // Default to true for user visibility
  setShowAdjustments: (show) => set({ showAdjustments: show }),

  // Notifications
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  // HDRI Settings
  hdriIntensity: 1.0,
  setHdriIntensity: (intensity) => set({ hdriIntensity: intensity }),
  hdriMix: 0.0,
  setHdriMix: (mix) => set({ hdriMix: mix }),
  hdriProcedural: 0.5,
  setHdriProcedural: (procedural) => set({ hdriProcedural: procedural }),
  hdriHue: 0.0,
  setHdriHue: (hue) => set({ hdriHue: hue }),
  hdriSaturation: 1.0,
  setHdriSaturation: (saturation) => set({ hdriSaturation: saturation }),
  hdriBlur: 0.0,
  setHdriBlur: (blur) => set({ hdriBlur: blur }),
  hdriRotation1: 0.0,
  setHdriRotation1: (rotation) => set({ hdriRotation1: rotation }),
  hdriRotation2: 0.0,
  setHdriRotation2: (rotation) => set({ hdriRotation2: rotation }),
  showHdriBackground: true,
  setShowHdriBackground: (show) => set({ showHdriBackground: show }),
  hdriFile: '/textures/env/env_map.hdr',
  setHdriFile: (file) => set({ hdriFile: file }),

  // Background mode
  backgroundMode: 'sky',
  setBackgroundMode: (mode) => set({ backgroundMode: mode }),

  // Sun / Time of Day
  timeOfDay: 14, // 2 PM default
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  sunOrientation: 180,
  setSunOrientation: (orientation) => set({ sunOrientation: orientation }),
  showLightingPanel: false,
  setShowLightingPanel: (show) => set({ showLightingPanel: show }),

  // Graphics Settings
  graphicsQuality: 'high', // Default to high quality with effects
  setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),

  // Material Settings
  materialColor: '#bcbcbc',
  setMaterialColor: (color) => set({ materialColor: color }),
  materialRoughness: 0.25,
  setMaterialRoughness: (roughness) => set({ materialRoughness: roughness }),
  materialMetalness: 0.02,
  setMaterialMetalness: (metalness) => set({ materialMetalness: metalness }),
  materialOpacity: 1.0,
  setMaterialOpacity: (opacity) => set({ materialOpacity: opacity }),

  // Post-processing / Color Correction
  toneMapping: 'ACES',
  setToneMapping: (mapping) => set({ toneMapping: mapping }),
  toneMappingExposure: 2,
  setToneMappingExposure: (exposure) => set({ toneMappingExposure: exposure }),
  bloomIntensity: 0.5,
  setBloomIntensity: (intensity) => set({ bloomIntensity: intensity }),
  bloomThreshold: 0.9,
  setBloomThreshold: (threshold) => set({ bloomThreshold: threshold }),
  vignetteIntensity: 0.35,
  setVignetteIntensity: (intensity) => set({ vignetteIntensity: intensity }),
  ssaoEnabled: false,
  setSsaoEnabled: (enabled) => set({ ssaoEnabled: enabled }),
  ssaoIntensity: 1.5,
  setSsaoIntensity: (intensity) => set({ ssaoIntensity: intensity }),
  dofEnabled: false,
  setDofEnabled: (enabled) => set({ dofEnabled: enabled }),
  dofFocusDistance: 0.02,
  setDofFocusDistance: (distance) => set({ dofFocusDistance: distance }),
  dofFocalLength: 0.05,
  setDofFocalLength: (length) => set({ dofFocalLength: length }),
  dofBokehScale: 3,
  setDofBokehScale: (scale) => set({ dofBokehScale: scale }),
  chromaticAberration: 0.002,
  setChromaticAberration: (amount) => set({ chromaticAberration: amount }),
  colorBrightness: 0.0,
  setColorBrightness: (brightness) => set({ colorBrightness: brightness }),
  colorContrast: 0.05,
  setColorContrast: (contrast) => set({ colorContrast: contrast }),
  colorSaturation: 0.1,
  setColorSaturation: (saturation) => set({ colorSaturation: saturation }),

  // Night mode lighting
  nightLightsEnabled: true,
  setNightLightsEnabled: (enabled) => set({ nightLightsEnabled: enabled }),
  nightLightsIntensity: 1.0,
  setNightLightsIntensity: (intensity) => set({ nightLightsIntensity: intensity }),

  // Contact shadows
  contactShadowsEnabled: true,
  setContactShadowsEnabled: (enabled) => set({ contactShadowsEnabled: enabled }),

  // Atmosphere
  atmosphereEnabled: true,
  setAtmosphereEnabled: (enabled) => set({ atmosphereEnabled: enabled }),
  atmosphereIntensity: 0.4,
  setAtmosphereIntensity: (intensity) => set({ atmosphereIntensity: intensity }),
  atmosphereTurbidity: 2.0,
  setAtmosphereTurbidity: (turbidity) => set({ atmosphereTurbidity: turbidity }),
  atmosphereMieCoeff: 0.003,
  setAtmosphereMieCoeff: (coeff) => set({ atmosphereMieCoeff: coeff }),
  atmosphereRayleighScale: 1.0,
  setAtmosphereRayleighScale: (scale) => set({ atmosphereRayleighScale: scale }),

  // Clouds
  cloudsEnabled: true,
  setCloudsEnabled: (enabled) => set({ cloudsEnabled: enabled }),
  cloudCoverage: 0.45,
  setCloudCoverage: (coverage) => set({ cloudCoverage: coverage }),
  cloudDensity: 0.7,
  setCloudDensity: (density) => set({ cloudDensity: density }),
  cloudScale: 1.0,
  setCloudScale: (scale) => set({ cloudScale: scale }),
  cloudSpeed: 0.02,
  setCloudSpeed: (speed) => set({ cloudSpeed: speed }),
  cloudAltitude: 80,
  setCloudAltitude: (altitude) => set({ cloudAltitude: altitude }),
  cloudOpacity: 0.5,
  setCloudOpacity: (opacity) => set({ cloudOpacity: opacity }),

  // Fog
  fogEnabled: false,
  setFogEnabled: (enabled) => set({ fogEnabled: enabled }),
  fogDensity: 0.3,
  setFogDensity: (density) => set({ fogDensity: density }),
  fogHeight: 5,
  setFogHeight: (height) => set({ fogHeight: height }),

  // God Rays
  godRaysEnabled: false,
  setGodRaysEnabled: (enabled) => set({ godRaysEnabled: enabled }),
  godRaysIntensity: 0.5,
  setGodRaysIntensity: (intensity) => set({ godRaysIntensity: intensity }),
}), {
  name: 'mff-lighting-settings',
  version: 4, // Bump for takram atmosphere migration
  migrate: (persistedState: any) => persistedState, // Accept any old state shape
  partialize: (state) => ({
    // Only persist lighting and effects settings
    timeOfDay: state.timeOfDay,
    sunOrientation: state.sunOrientation,
    hdriIntensity: state.hdriIntensity,
    hdriFile: state.hdriFile,
    hdriBlur: state.hdriBlur,
    hdriRotation1: state.hdriRotation1,
    hdriProcedural: state.hdriProcedural,
    backgroundMode: state.backgroundMode,
    showHdriBackground: state.showHdriBackground,
    graphicsQuality: state.graphicsQuality,
    toneMapping: state.toneMapping,
    toneMappingExposure: state.toneMappingExposure,
    bloomIntensity: state.bloomIntensity,
    bloomThreshold: state.bloomThreshold,
    vignetteIntensity: state.vignetteIntensity,
    ssaoEnabled: state.ssaoEnabled,
    ssaoIntensity: state.ssaoIntensity,
    dofEnabled: state.dofEnabled,
    dofFocusDistance: state.dofFocusDistance,
    dofFocalLength: state.dofFocalLength,
    dofBokehScale: state.dofBokehScale,
    chromaticAberration: state.chromaticAberration,
    colorBrightness: state.colorBrightness,
    colorContrast: state.colorContrast,
    colorSaturation: state.colorSaturation,
    nightLightsEnabled: state.nightLightsEnabled,
    nightLightsIntensity: state.nightLightsIntensity,
    contactShadowsEnabled: state.contactShadowsEnabled,
    materialColor: state.materialColor,
    materialRoughness: state.materialRoughness,
    materialMetalness: state.materialMetalness,
    // Atmosphere & Clouds
    atmosphereEnabled: state.atmosphereEnabled,
    atmosphereIntensity: state.atmosphereIntensity,
    atmosphereTurbidity: state.atmosphereTurbidity,
    atmosphereMieCoeff: state.atmosphereMieCoeff,
    atmosphereRayleighScale: state.atmosphereRayleighScale,
    cloudsEnabled: state.cloudsEnabled,
    cloudCoverage: state.cloudCoverage,
    cloudDensity: state.cloudDensity,
    cloudScale: state.cloudScale,
    cloudSpeed: state.cloudSpeed,
    cloudAltitude: state.cloudAltitude,
    cloudOpacity: state.cloudOpacity,
    fogEnabled: state.fogEnabled,
    fogDensity: state.fogDensity,
    fogHeight: state.fogHeight,
    godRaysEnabled: state.godRaysEnabled,
    godRaysIntensity: state.godRaysIntensity,
  }),
}))
