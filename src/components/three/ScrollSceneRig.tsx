import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PortfolioScroll } from '../../hooks/usePortfolioScroll'
import { dampBlend } from './motion'

type ScrollSceneRigProps = {
  scroll: React.MutableRefObject<PortfolioScroll>
  children: React.ReactNode
}

export function ScrollSceneRig({ scroll, children }: ScrollSceneRigProps) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (!group.current) return
    group.current.position.y = dampBlend(
      group.current.position.y,
      scroll.current.smoothHero * -0.12,
      3.5,
      delta,
    )
  })

  return <group ref={group}>{children}</group>
}
