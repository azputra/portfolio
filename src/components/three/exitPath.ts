import { smootherstep } from './motion'

export const DOOR_APPROACH_X = 2.38
export const DOOR_APPROACH_Z = 0.28
export const EXIT_X = 3.2
export const EXIT_Z = 0.38

const WAYPOINTS = [
  { x: 0.05, z: 0.44 },
  { x: 0.55, z: 0.4 },
  { x: 1.2, z: 0.34 },
  { x: 1.85, z: 0.3 },
  { x: DOOR_APPROACH_X, z: DOOR_APPROACH_Z },
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

/** Pintu tertutup sampai karakter mendekat, baru terbuka */
export function getDoorOpenAmount(exitProgress: number) {
  if (exitProgress < 0.42) return 0
  return smootherstep(0.42, 0.78, exitProgress)
}

export function getExitPosition(exitProgress: number, homeX: number, homeZ: number) {
  const t = smootherstep(0, 1, exitProgress)
  return sampleWaypoints(t, homeX, homeZ)
}
