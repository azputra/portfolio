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
const FLOOR_Y = 0.003
const OPENING_BOTTOM = FLOOR_Y
const WALL_T = 0.06
const OPENING_Z = DOOR_W + 0.1

type ExitDoorProps = {
  scroll: React.MutableRefObject<PortfolioScroll>
}

function RoundKnob({ side }: { side: 'outside' | 'inside' }) {
  const brass = { color: BRASS, roughness: 0.2, metalness: 0.86 }
  const dir = side === 'outside' ? 1 : -1
  const halfThick = 0.018
  const knobR = 0.03

  return (
    <group position={[dir * halfThick, 0, 0]}>
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.006, 18]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      <mesh position={[dir * 0.024, 0, 0]} castShadow>
        <sphereGeometry args={[knobR, 18, 18]} />
        <meshStandardMaterial {...brass} />
      </mesh>
    </group>
  )
}

function DoorHandle() {
  const brass = { color: BRASS, roughness: 0.25, metalness: 0.8 }

  return (
    <group position={[0, 0.02, -DOOR_W * 0.36]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.042, 10]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      <RoundKnob side="outside" />
      <RoundKnob side="inside" />
    </group>
  )
}

function DoorHinges() {
  const hingeMat = { color: '#8a8a8a', roughness: 0.32, metalness: 0.72 }

  return (
    <>
      {[0.5, 0.08, -0.38].map((y, i) => (
        <group key={i} position={[0.002, y, DOOR_W / 2 - 0.012]}>
          <mesh castShadow>
            <boxGeometry args={[0.014, 0.052, 0.034]} />
            <meshStandardMaterial {...hingeMat} />
          </mesh>
          <mesh position={[0.008, 0, 0.012]} castShadow>
            <cylinderGeometry args={[0.006, 0.006, 0.018, 8]} />
            <meshStandardMaterial {...hingeMat} />
          </mesh>
        </group>
      ))}
    </>
  )
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

      <DoorHandle />
      <DoorHinges />
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

      <mesh position={[0.012, FLOOR_Y + 0.006, 0]} receiveShadow>
        <boxGeometry args={[WALL_T + 0.04, 0.012, OPENING_Z - 0.02]} />
        <meshStandardMaterial color={DOOR_WOOD_DARK} roughness={0.75} />
      </mesh>
    </group>
  )
}

export function ExitDoor({ scroll }: ExitDoorProps) {
  const doorPivot = useRef<THREE.Group>(null)
  const smoothExit = useRef(0)
  const smoothOpen = useRef(0)

  useFrame((_, delta) => {
    const exitRaw = getExitProgress(scroll.current.smoothHero, scroll.current.smoothAbout)
    smoothExit.current = dampBlend(smoothExit.current, exitRaw, 4.5, delta)

    const targetOpen = getDoorOpenAmount(smoothExit.current)
    smoothOpen.current = dampBlend(smoothOpen.current, targetOpen, 4, delta)

    if (doorPivot.current) {
      doorPivot.current.rotation.y = -smoothOpen.current * (Math.PI / 2) * 0.96
    }
  })

  const doorX = 2.55
  const doorZ = 0.28

  return (
    <group position={[doorX, 0, doorZ]}>
      <DoorFrame />

      <group
        ref={doorPivot}
        position={[0.008, OPENING_BOTTOM + DOOR_H / 2, DOOR_W / 2]}
      >
        <group position={[0, 0, -DOOR_W / 2]}>
          <DoorPanel />
        </group>
      </group>
    </group>
  )
}
