import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneHover } from '../../context/SceneHoverContext'
import { useTheme } from '../../context/ThemeContext'

export function LightSwitch() {
  const { isDark, toggleTheme } = useTheme()
  const lever = useRef<THREE.Group>(null)
  const glow = useRef<THREE.PointLight>(null)
  const { pointerEnter, pointerLeave } = useSceneHover()
  const lampOn = !isDark
  const smooth = useRef(lampOn ? 1 : 0)

  useFrame((_, delta) => {
    const target = lampOn ? 1 : 0
    smooth.current = THREE.MathUtils.damp(smooth.current, target, 8, delta)

    if (lever.current) {
      lever.current.rotation.x = THREE.MathUtils.lerp(-0.42, 0.42, smooth.current)
    }

    if (glow.current) {
      glow.current.intensity = THREE.MathUtils.damp(
        glow.current.intensity,
        lampOn ? 0.55 : 0.08,
        6,
        delta,
      )
    }
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    toggleTheme()
  }

  return (
    <group position={[2.58, 1.12, -0.38]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.004]}>
        <boxGeometry args={[0.1, 0.14, 0.008]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.55} />
      </mesh>

      <mesh position={[0, 0, 0.001]}>
        <boxGeometry args={[0.088, 0.128, 0.01]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.45} />
      </mesh>

      <mesh position={[0, 0.028, 0.006]}>
        <boxGeometry args={[0.07, 0.05, 0.004]} />
        <meshStandardMaterial color="#1a2b4a" roughness={0.35} />
      </mesh>

      <group ref={lever} position={[0, -0.01, 0.008]}>
        <mesh position={[0, 0.018, 0.012]} rotation={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.018, 0.05, 0.022]} />
          <meshStandardMaterial
            color={lampOn ? '#f0c060' : '#d8d0c4'}
            emissive={lampOn ? '#f0c060' : '#000000'}
            emissiveIntensity={lampOn ? 0.35 : 0}
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>
      </group>

      <mesh
        position={[0, 0, 0.012]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          pointerEnter()
        }}
        onPointerOut={() => pointerLeave()}
      >
        <planeGeometry args={[0.12, 0.16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <pointLight
        ref={glow}
        position={[0, 0, 0.18]}
        color="#fff4d6"
        intensity={0.08}
        distance={1.4}
        decay={2}
      />
    </group>
  )
}
