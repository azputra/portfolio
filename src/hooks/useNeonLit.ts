import { useCallback, useEffect, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { useTheme } from '../context/ThemeContext'

/** Neon ikut lampu (dark=nyala), bisa di-override dengan klik. */
export function useNeonLit() {
  const { isDark } = useTheme()
  const [override, setOverride] = useState<boolean | null>(null)

  useEffect(() => {
    setOverride(null)
  }, [isDark])

  const lit = override ?? isDark

  const toggle = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      setOverride((prev) => !(prev ?? isDark))
    },
    [isDark],
  )

  return { lit, toggle }
}
