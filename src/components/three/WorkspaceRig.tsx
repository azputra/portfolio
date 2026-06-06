import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PortfolioScroll } from '../../hooks/usePortfolioScroll'
import { dampBlend } from './motion'
import { useSmoothPointer } from './useSmoothPointer'

type WorkspaceRigProps = {
  mouse: React.MutableRefObject<{ x: number; y: number }>
  scroll: React.MutableRefObject<PortfolioScroll>
  children: React.ReactNode
}

export function WorkspaceRig({ mouse, scroll, children }: WorkspaceRigProps) {
  const group = useRef<THREE.Group>(null)
  const smooth = useSmoothPointer(mouse, 4)
  const smoothHero = useRef(0)

  useFrame((state, delta) => {
    if (!group.current) return

    smoothHero.current = dampBlend(smoothHero.current, scroll.current.hero, 2, delta)
    const codingFocus = 1 - Math.min(1, smoothHero.current * 2.5)
    const t = state.clock.elapsedTime
    const mx = smooth.current.x
    const my = smooth.current.y

    group.current.rotation.y = dampBlend(
      group.current.rotation.y,
      mx * 0.02 * codingFocus,
      3.5,
      delta,
    )
    group.current.rotation.x = dampBlend(
      group.current.rotation.x,
      my * 0.006 * codingFocus,
      3.5,
      delta,
    )
    group.current.position.x = dampBlend(
      group.current.position.x,
      mx * 0.04 * codingFocus,
      3.5,
      delta,
    )
    group.current.position.y = dampBlend(
      group.current.position.y,
      Math.sin(t * 0.6) * 0.004 * codingFocus,
      2.5,
      delta,
    )
  })

  return <group ref={group}>{children}</group>
}
