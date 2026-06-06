import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CHARACTER_X = 2.1

type FallbackCharacterProps = {
  mouse: React.MutableRefObject<{ x: number; y: number }>
}

export function FallbackCharacter({ mouse }: FallbackCharacterProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.current.x * 0.35,
      delta * 3,
    )
  })

  return (
    <group ref={group} position={[CHARACTER_X, -0.05, 0]}>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#c8d6e5" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.28, 0.55, 8, 16]} />
        <meshStandardMaterial color="#5eead4" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[-0.38, 0.9, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
        <meshStandardMaterial color="#5eead4" />
      </mesh>
      <mesh position={[0.38, 0.9, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
        <meshStandardMaterial color="#5eead4" />
      </mesh>
      <mesh position={[-0.14, 0.05, 0]}>
        <capsuleGeometry args={[0.09, 0.5, 4, 8]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      <mesh position={[0.14, 0.05, 0]}>
        <capsuleGeometry args={[0.09, 0.5, 4, 8]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    </group>
  )
}
