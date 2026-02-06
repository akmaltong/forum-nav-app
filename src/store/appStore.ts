import { create } from 'zustand'
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
}

export const useAppStore = create<AppState>((set) => ({
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
  graphicsQuality: 'performance', // Default to performance (WebGL)
  setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),

  // Material Settings
  materialColor: '#bcbcbc',
  setMaterialColor: (color) => set({ materialColor: color }),
  materialRoughness: 0.25,
  setMaterialRoughness: (roughness) => set({ materialRoughness: roughness }),
  materialMetalness: 0.02,
  setMaterialMetalness: (metalness) => set({ materialMetalness: metalness }),
  materialOpacity: 1.0,
  setMaterialOpacity: (opacity) => set({ materialOpacity: opacity })
}))
