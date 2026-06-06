export type ThemeMode = 'light' | 'dark'

export type ScenePalette = {
  bg: string
  wall: string
  wallDark: string
  floor: string
  ceiling: string
  trim: string
  carpet: string
  carpetBorder: string
  carpetAccent: string
  ambient: number
  hemisphereSky: string
  hemisphereGround: string
  hemisphereIntensity: number
  directional: number
  directionalColor: string
  ceilingLight: number
  ceilingEmissive: number
  fogNear: number
  fogFar: number
}

export const SCENE_PALETTES: Record<ThemeMode, ScenePalette> = {
  light: {
    bg: '#e8e2d8',
    wall: '#ebe5db',
    wallDark: '#e0d9ce',
    floor: '#ddd6c8',
    ceiling: '#f3efe8',
    trim: '#1a2b4a',
    carpet: '#c4b49a',
    carpetBorder: '#9a8b78',
    carpetAccent: '#b5a48c',
    ambient: 0.75,
    hemisphereSky: '#fff8f0',
    hemisphereGround: '#e8e2d8',
    hemisphereIntensity: 0.85,
    directional: 1.15,
    directionalColor: '#fffaf5',
    ceilingLight: 0.88,
    ceilingEmissive: 0.55,
    fogNear: 5,
    fogFar: 14,
  },
  dark: {
    bg: '#0c0e14',
    wall: '#161b26',
    wallDark: '#12161f',
    floor: '#141820',
    ceiling: '#0f1218',
    trim: '#2a3550',
    carpet: '#1e2638',
    carpetBorder: '#121820',
    carpetAccent: '#243048',
    ambient: 0.3,
    hemisphereSky: '#1a2438',
    hemisphereGround: '#0c0e14',
    hemisphereIntensity: 0.5,
    directional: 0.42,
    directionalColor: '#8aa4c8',
    ceilingLight: 0.1,
    ceilingEmissive: 0.06,
    fogNear: 4,
    fogFar: 12,
  },
}
