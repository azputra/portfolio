import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PortfolioScroll } from '../../hooks/usePortfolioScroll'
import { dampBlend, smootherstep } from './motion'

type ScrollSceneRigProps = {
  scroll: React.MutableRefObject<PortfolioScroll>
  children: React.ReactNode
}

export function ScrollSceneRig({ scroll, children }: ScrollSceneRigProps) {
  const group = useRef<THREE.Group>(null)
  const smoothHero = useRef(0)

  useFrame((_, delta) => {
    if (!group.current) return
    smoothHero.current = dampBlend(smoothHero.current, scroll.current.hero, 2.2, delta)
    group.current.position.y = dampBlend(
      group.current.position.y,
      smoothHero.current * -0.12,
      3.5,
      delta,
    )
  })

  return <group ref={group}>{children}</group>
}

type DeskFadeProps = {
  scroll: React.MutableRefObject<PortfolioScroll>
  children: React.ReactNode
}

export function DeskFade({ scroll, children }: DeskFadeProps) {
  const group = useRef<THREE.Group>(null)
  const smoothHero = useRef(0)

  useFrame((_, delta) => {
    if (!group.current) return

    smoothHero.current = dampBlend(smoothHero.current, scroll.current.hero, 2.2, delta)
    const fade = 1 - smootherstep(0.36, 0.52, smoothHero.current)

    group.current.visible = fade > 0.04
    const scale = dampBlend(group.current.scale.x, 0.88 + fade * 0.12, 4, delta)
    group.current.scale.setScalar(scale)
    group.current.position.y = dampBlend(group.current.position.y, (1 - fade) * -0.06, 4, delta)
  })

  return <group ref={group}>{children}</group>
}

type FloorFadeProps = {
  scroll: React.MutableRefObject<PortfolioScroll>
  children: React.ReactNode
}

export function FloorFade({ scroll, children }: FloorFadeProps) {
  const group = useRef<THREE.Group>(null)
  const smoothHero = useRef(0)

  useFrame((_, delta) => {
    if (!group.current) return

    smoothHero.current = dampBlend(smoothHero.current, scroll.current.hero, 2.2, delta)
    const fade = 1 - smootherstep(0.16, 0.34, smoothHero.current)

    group.current.visible = fade > 0.04
    group.current.position.y = dampBlend(group.current.position.y, (1 - fade) * -0.04, 4, delta)
  })

  return <group ref={group}>{children}</group>
}
