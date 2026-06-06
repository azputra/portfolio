import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useDeskInteraction } from '../../context/DeskInteractionContext'
import { useSceneHover } from '../../context/SceneHoverContext'
import { DESK_SURFACE_Y } from './DeskSetup'
import { KaabaSparkles } from './KaabaSparkles'

const GOLD = '#c9a227'
const KAABA_BLACK = '#0f0d0a'

export function KaabaBox() {
  const w = 0.1
  const h = 0.12
  const d = 0.1
  const { triggerKaabaSparkle } = useDeskInteraction()
  const { pointerEnter, pointerLeave } = useSceneHover()
  const goldMat = useRef<THREE.MeshStandardMaterial>(null)
  const glow = useRef(0)

  useFrame((_, delta) => {
    glow.current = THREE.MathUtils.damp(glow.current, 0, 3, delta)
    if (goldMat.current) {
      goldMat.current.emissiveIntensity = 0.14 + glow.current * 0.55
    }
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    glow.current = 1
    triggerKaabaSparkle()
  }

  return (
    <group position={[0.62, DESK_SURFACE_Y + h / 2 + 0.002, -0.04]} rotation={[0, -0.35, 0]}>
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={KAABA_BLACK} roughness={0.78} metalness={0.08} />
      </mesh>
      <mesh position={[0, h * 0.14, 0]} castShadow>
        <boxGeometry args={[w * 1.02, h * 0.34, d * 1.02]} />
        <meshStandardMaterial
          ref={goldMat}
          color={GOLD}
          roughness={0.28}
          metalness={0.72}
          emissive="#7a6010"
          emissiveIntensity={0.14}
        />
      </mesh>
      <mesh position={[0, -h * 0.1, d * 0.5 + 0.001]}>
        <planeGeometry args={[w * 0.3, h * 0.42]} />
        <meshStandardMaterial color="#d4af37" metalness={0.75} roughness={0.28} />
      </mesh>

      <KaabaSparkles />

      <mesh
        position={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          pointerEnter()
        }}
        onPointerOut={() => pointerLeave()}
      >
        <boxGeometry args={[w * 1.35, h * 1.35, d * 1.35]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
