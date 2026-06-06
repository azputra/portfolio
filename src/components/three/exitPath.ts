import { smootherstep } from './motion'

export const DOOR_APPROACH_X = 2.36
export const DOOR_APPROACH_Z = 0.28
export const DOOR_PASS_Z = 0.42
export const DOOR_CLEAR_X = 2.72
export const EXIT_X = 3.2
export const EXIT_Z = 0.44

const WAYPOINTS = [
  { x: 0.05, z: 0.44 },
  { x: 0.55, z: 0.4 },
  { x: 1.15, z: 0.35 },
  { x: 1.75, z: 0.31 },
  { x: 2.1, z: 0.29 },
  { x: DOOR_APPROACH_X, z: DOOR_APPROACH_Z },
  { x: 2.56, z: 0.35 },
  { x: 2.74, z: DOOR_PASS_Z },
  { x: EXIT_X, z: EXIT_Z },
] as const

function sampleWaypoints(t: number, homeX: number, homeZ: number) {
  const pts = WAYPOINTS.map((p, i) => (i === 0 ? { x: homeX, z: homeZ } : { ...p }))
  const scaled = t * (pts.length - 1)
  const idx = Math.min(pts.length - 2, Math.floor(scaled))
  const local = scaled - idx
  const eased = smootherstep(0, 1, local)

  return {
    x: pts[idx].x + (pts[idx + 1].x - pts[idx].x) * eased,
    z: pts[idx].z + (pts[idx + 1].z - pts[idx].z) * eased,
  }
}

/** Pintu mulai buka sedikit sebelum karakter sampai */
export function getDoorOpenAmount(exitProgress: number) {
  if (exitProgress < 0.22) return 0
  return smootherstep(0.22, 0.62, exitProgress)
}

export function getExitPosition(exitProgress: number, homeX: number, homeZ: number) {
  const t = smootherstep(0, 1, exitProgress)
  return sampleWaypoints(t, homeX, homeZ)
}

export function hasPassedDoor(charX: number) {
  return charX >= DOOR_CLEAR_X
}
