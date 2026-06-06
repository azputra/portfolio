import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import type { PortfolioScroll } from '../../hooks/usePortfolioScroll'
import { dampBlend } from './motion'
import { getDoorOpenAmount } from './exitPath'
import { getExitProgress } from './scrollProgress'

const TRIM = '#f5f0e8'
const DOOR_WOOD = '#c9a66b'
const DOOR_WOOD_DARK = '#a8844f'
const BRASS = '#c9a227'

const DOOR_W = 0.74
const DOOR_H = 1.38
const OPENING_BOTTOM = 0.02
const WALL_T = 0.06
const OPENING_Z = DOOR_W + 0.1

type ExitDoorProps = {
  scroll: React.MutableRefObject<PortfolioScroll>
}

function DoorPanel() {
  const insetMat = { color: DOOR_WOOD_DARK, roughness: 0.62, metalness: 0.02 }
  const faceMat = { color: DOOR_WOOD, roughness: 0.48, metalness: 0.03 }

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.036, DOOR_H, DOOR_W]} />
        <meshStandardMaterial {...faceMat} />
      </mesh>

      <mesh position={[0.02, 0.38, 0]} castShadow>
        <boxGeometry args={[0.01, 0.44, 0.58]} />
        <meshStandardMaterial {...insetMat} />
      </mesh>
      <mesh position={[0.02, -0.3, 0]} castShadow>
        <boxGeometry args={[0.01, 0.4, 0.58]} />
        <meshStandardMaterial {...insetMat} />
      </mesh>

      <group position={[0.026, 0.04, DOOR_W * 0.32]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.1, 12]} />
          <meshStandardMaterial color={BRASS} roughness={0.25} metalness={0.75} />
        </mesh>
        <mesh position={[0.05, 0, 0]} castShadow>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color={BRASS} roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0.05, -0.05, 0]} castShadow>
          <boxGeometry args={[0.008, 0.06, 0.02]} />
          <meshStandardMaterial color={BRASS} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {[0.5, 0.08, -0.38].map((y, i) => (
        <group key={i} position={[-0.016, y, -DOOR_W / 2 + 0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.016, 0.05, 0.036]} />
            <meshStandardMaterial color="#8a8a8a" roughness={0.35} metalness={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function DoorFrame() {
  const trim = { color: TRIM, roughness: 0.55 }
  const halfW = DOOR_W / 2 + 0.04

  return (
    <group>
      <mesh position={[0.01, OPENING_BOTTOM + DOOR_H + 0.03, 0]} castShadow>
        <boxGeometry args={[WALL_T + 0.02, 0.06, OPENING_Z]} />
        <meshStandardMaterial {...trim} />
      </mesh>

      <mesh position={[0.01, OPENING_BOTTOM + DOOR_H / 2, -halfW]} castShadow>
        <boxGeometry args={[WALL_T + 0.02, DOOR_H + 0.04, 0.05]} />
        <meshStandardMaterial {...trim} />
      </mesh>

      <mesh position={[0.01, OPENING_BOTTOM + DOOR_H / 2, halfW]} castShadow>
        <boxGeometry args={[WALL_T + 0.02, DOOR_H + 0.04, 0.05]} />
        <meshStandardMaterial {...trim} />
      </mesh>

      <mesh position={[0.012, OPENING_BOTTOM + 0.008, 0]} receiveShadow>
        <boxGeometry args={[WALL_T + 0.04, 0.016, OPENING_Z - 0.02]} />
        <meshStandardMaterial color={DOOR_WOOD_DARK} roughness={0.75} />
      </mesh>
    </group>
  )
}

export function ExitDoor({ scroll }: ExitDoorProps) {
  const doorPivot = useRef<THREE.Group>(null)
  const smoothHero = useRef(0)
  const smoothExit = useRef(0)
  const smoothOpen = useRef(0)

  useFrame((_, delta) => {
    smoothHero.current = dampBlend(smoothHero.current, scroll.current.hero, 2, delta)
    const exitRaw = getExitProgress(smoothHero.current, scroll.current.about)
    smoothExit.current = dampBlend(smoothExit.current, exitRaw, 2.5, delta)

    const targetOpen = getDoorOpenAmount(smoothExit.current)
    smoothOpen.current = dampBlend(smoothOpen.current, targetOpen, 4, delta)

    if (doorPivot.current) {
      doorPivot.current.rotation.y = smoothOpen.current * (Math.PI / 2) * 0.92
    }
  })

  const doorX = 2.55
  const doorZ = 0.28

  return (
    <group position={[doorX, 0, doorZ]}>
      <DoorFrame />

      <group
        ref={doorPivot}
        position={[0.008, OPENING_BOTTOM + DOOR_H / 2, -DOOR_W / 2]}
      >
        <group position={[0, 0, DOOR_W / 2]}>
          <DoorPanel />
        </group>
      </group>
    </group>
  )
}
