import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { PortfolioScroll } from '../../hooks/usePortfolioScroll'
import { dampBlend, easeInOutCubic, smootherstep } from './motion'
import { getExitProgress } from './scrollProgress'
import { useSmoothPointer } from './useSmoothPointer'

const MOBILE_POS_OFFSET = new THREE.Vector3(-0.85, 0.04, 0.55)
const MOBILE_LOOK_OFFSET = new THREE.Vector3(-0.35, 0, 0)

const INTRO_POS = new THREE.Vector3(2.65, 1.06, 5.25)
const CODING_POS = new THREE.Vector3(2.5, 1.02, 4.85)
const WALK_POS = new THREE.Vector3(3.05, 1.02, 4.15)
const DOOR_POS = new THREE.Vector3(3.35, 1.0, 3.85)
const EXIT_POS = new THREE.Vector3(3.85, 0.96, 3.35)
const INTRO_LOOK = new THREE.Vector3(1.52, 0.92, 0.18)
const WALK_LOOK = new THREE.Vector3(2.2, 0.88, 0.1)
const DOOR_LOOK = new THREE.Vector3(2.85, 0.86, 0.22)
const EXIT_LOOK = new THREE.Vector3(3.45, 0.82, 0.28)

type CameraRigProps = {
  mouse: React.MutableRefObject<{ x: number; y: number }>
  scroll: React.MutableRefObject<PortfolioScroll>
}

export function CameraRig({ mouse, scroll }: CameraRigProps) {
  const { camera } = useThree()
  const smooth = useSmoothPointer(mouse, 3.5)
  const smoothHero = useRef(0)
  const lookAt = useRef(INTRO_LOOK.clone())

  useFrame((_, delta) => {
    const mx = smooth.current.x
    const my = smooth.current.y
    smoothHero.current = dampBlend(smoothHero.current, scroll.current.hero, 2, delta)
    const h = smoothHero.current
    const exitT = easeInOutCubic(getExitProgress(h, scroll.current.about))

    const walkT = smootherstep(0.16, 0.42, h)
    const deskT = smootherstep(0, 0.16, h)

    const targetPos = new THREE.Vector3()
    if (exitT > 0.001) {
      if (exitT < 0.55) {
        targetPos.lerpVectors(WALK_POS, DOOR_POS, exitT / 0.55)
      } else {
        targetPos.lerpVectors(DOOR_POS, EXIT_POS, (exitT - 0.55) / 0.45)
      }
    } else if (walkT > 0.001) {
      targetPos.lerpVectors(CODING_POS, WALK_POS, walkT)
    } else {
      targetPos.lerpVectors(INTRO_POS, CODING_POS, deskT)
    }

    const isMobile = window.innerWidth < 768
    if (isMobile) {
      targetPos.add(MOBILE_POS_OFFSET)
    }

    targetPos.x += mx * (isMobile ? 0.12 : 0.22)
    targetPos.y += my * (isMobile ? 0.05 : 0.09)
    targetPos.z += my * (isMobile ? 0.04 : 0.07)

    const posDamp = exitT > 0.001 ? 5 : 3
    camera.position.x = dampBlend(camera.position.x, targetPos.x, posDamp, delta)
    camera.position.y = dampBlend(camera.position.y, targetPos.y, posDamp, delta)
    camera.position.z = dampBlend(camera.position.z, targetPos.z, posDamp, delta)

    const targetLook = new THREE.Vector3()
    if (exitT > 0.001) {
      const midT = Math.min(1, exitT * 1.6)
      if (midT < 0.55) {
        targetLook.lerpVectors(WALK_LOOK, DOOR_LOOK, midT / 0.55)
      } else {
        targetLook.lerpVectors(DOOR_LOOK, EXIT_LOOK, (midT - 0.55) / 0.45)
      }
    } else {
      targetLook.lerpVectors(INTRO_LOOK, WALK_LOOK, walkT)
    }
    if (isMobile) {
      targetLook.add(MOBILE_LOOK_OFFSET)
    }

    targetLook.x += mx * (isMobile ? 0.03 : 0.06)
    targetLook.y += my * (isMobile ? 0.02 : 0.04)

    const lookDamp = exitT > 0.001 ? 5 : 3.5
    lookAt.current.x = dampBlend(lookAt.current.x, targetLook.x, lookDamp, delta)
    lookAt.current.y = dampBlend(lookAt.current.y, targetLook.y, lookDamp, delta)
    lookAt.current.z = dampBlend(lookAt.current.z, targetLook.z, lookDamp, delta)

    camera.lookAt(lookAt.current)
  })

  return null
}
