import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const CHARACTER_X = 1.65

const SKIN = '#c8956c'
const HAIR = '#141010'
const SHIRT = '#efefef'
const PANTS = '#2c2c34'

type StylizedAvatarProps = {
  mouse: React.MutableRefObject<{ x: number; y: number }>
  atDesk?: boolean
  localOrigin?: boolean
}

export function StylizedAvatar({ mouse, atDesk = true, localOrigin = false }: StylizedAvatarProps) {
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return

    const targetRot = atDesk ? -0.35 + mouse.current.x * 0.15 : mouse.current.x * 0.4
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRot, delta * 3)

    if (body.current) {
      body.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.015
    }
  })

  const bodyY = atDesk ? 0.38 : 0
  const legRotX = atDesk ? -1.1 : 0
  const legZ = atDesk ? 0.22 : 0

  const origin: [number, number, number] = localOrigin
    ? [0.05, 0, atDesk ? 0.44 : 0]
    : [CHARACTER_X, 0, atDesk ? 0.32 : 0]

  return (
    <group
      ref={group}
      position={origin}
      rotation={[0, atDesk ? -0.2 : 0, 0]}
      scale={atDesk ? 0.88 : 1}
    >
      <group ref={body} position={[0, bodyY, 0]}>
        {/* Kaki */}
        <mesh position={[-0.13, 0.42, legZ]} rotation={[legRotX, 0, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.38, 8, 16]} />
          <meshStandardMaterial color={PANTS} roughness={0.85} />
        </mesh>
        <mesh position={[0.13, 0.42, legZ]} rotation={[legRotX, 0, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.38, 8, 16]} />
          <meshStandardMaterial color={PANTS} roughness={0.85} />
        </mesh>
        {/* Sepatu */}
        <mesh position={[-0.13, atDesk ? 0.18 : 0.08, atDesk ? 0.42 : 0.02]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.16]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.6} />
        </mesh>
        <mesh position={[0.13, atDesk ? 0.18 : 0.08, atDesk ? 0.42 : 0.02]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.16]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.6} />
        </mesh>

        {/* Badan */}
        <mesh position={[0, 0.95, atDesk ? -0.05 : 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.42, 12, 20]} />
          <meshStandardMaterial color={SHIRT} roughness={0.75} />
        </mesh>

        <mesh position={[0, 1.22, atDesk ? 0.02 : 0.08]}>
          <boxGeometry args={[0.18, 0.06, 0.04]} />
          <meshStandardMaterial color={SHIRT} roughness={0.8} />
        </mesh>
        {[0, -0.05, -0.1].map((y, i) => (
          <mesh key={i} position={[0, 1.18 + y, atDesk ? 0.05 : 0.11]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#d8d8d8" roughness={0.4} metalness={0.1} />
          </mesh>
        ))}

        {/* Lengan ke keyboard */}
        <mesh
          position={[-0.28, 0.88, atDesk ? 0.18 : 0]}
          rotation={atDesk ? [0.6, 0, 0.3] : [0, 0, 0.15]}
          castShadow
        >
          <capsuleGeometry args={[0.07, 0.28, 8, 12]} />
          <meshStandardMaterial color={SHIRT} roughness={0.75} />
        </mesh>
        <mesh
          position={[0.28, 0.88, atDesk ? 0.18 : 0]}
          rotation={atDesk ? [0.6, 0, -0.3] : [0, 0, -0.15]}
          castShadow
        >
          <capsuleGeometry args={[0.07, 0.28, 8, 12]} />
          <meshStandardMaterial color={SHIRT} roughness={0.75} />
        </mesh>

        <mesh position={[-0.32, atDesk ? 0.78 : 0.72, atDesk ? 0.28 : 0.02]} castShadow>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
        <mesh position={[0.32, atDesk ? 0.78 : 0.72, atDesk ? 0.28 : 0.02]} castShadow>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>

        {/* Kepala */}
        <group position={[0, 1.52, atDesk ? -0.08 : 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial color={SKIN} roughness={0.55} />
          </mesh>
          <mesh position={[-0.09, 0.02, 0.22]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#2a1a10" roughness={0.3} />
          </mesh>
          <mesh position={[0.09, 0.02, 0.22]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#2a1a10" roughness={0.3} />
          </mesh>
          <mesh position={[-0.075, 0.04, 0.255]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.105, 0.04, 0.255]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.09, 0.1, 0.23]} rotation={[0, 0, -0.08]}>
            <boxGeometry args={[0.1, 0.028, 0.02]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          <mesh position={[0.09, 0.1, 0.23]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.1, 0.028, 0.02]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.12, -0.02]} scale={[1.05, 0.85, 1]}>
            <sphereGeometry args={[0.29, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={HAIR} roughness={0.85} />
          </mesh>
          <mesh position={[0.14, 0.08, 0.06]} rotation={[0, -0.4, 0.2]} scale={[1.1, 0.7, 0.9]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={HAIR} roughness={0.85} />
          </mesh>
          <mesh position={[-0.1, 0.06, 0.02]} rotation={[0, 0.3, -0.1]} scale={[0.7, 0.55, 0.8]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color={HAIR} roughness={0.85} />
          </mesh>
          <mesh position={[-0.04, 0.2, 0.18]} rotation={[0.2, 0, 0.5]}>
            <boxGeometry args={[0.04, 0.22, 0.02]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
