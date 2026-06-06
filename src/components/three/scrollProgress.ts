import { smootherstep } from './motion'

export const ABOUT_REVEAL = 0.38
export const HERO_EXIT_END = 0.92

/** 0 = di posisi About me (kanan), 1 = sudah keluar layar kanan */
export function getExitProgress(hero: number, about: number) {
  if (hero < ABOUT_REVEAL) return 0
  if (hero < 0.995) {
    return smootherstep(ABOUT_REVEAL, HERO_EXIT_END, hero) * 0.82
  }
  return 0.82 + smootherstep(0, 0.75, about) * 0.18
}
