import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'
import { SCENE_PALETTES } from '../../theme/scenePalette'

export function RoomInterior() {
  const { theme } = useTheme()
  const palette = SCENE_PALETTES[theme]

  const floorMat = useRef<THREE.MeshStandardMaterial>(null)
  const ceilingMat = useRef<THREE.MeshStandardMaterial>(null)
  const wallMat = useRef<THREE.MeshStandardMaterial>(null)
  const trimMat = useRef<THREE.MeshStandardMaterial>(null)
  const leftWallMat = useRef<THREE.MeshStandardMaterial>(null)
  const carpetMat = useRef<THREE.MeshStandardMaterial>(null)
  const carpetBorderMat = useRef<THREE.MeshStandardMaterial>(null)
  const carpetAccentMat = useRef<THREE.MeshStandardMaterial>(null)
  const lampMat = useRef<THREE.MeshStandardMaterial>(null)
  const ceilingLight = useRef<THREE.PointLight>(null)

  useEffect(() => {
    floorMat.current?.color.set(palette.floor)
    ceilingMat.current?.color.set(palette.ceiling)
    wallMat.current?.color.set(palette.wall)
    trimMat.current?.color.set(palette.trim)
    leftWallMat.current?.color.set(palette.wallDark)
    carpetMat.current?.color.set(palette.carpet)
    carpetBorderMat.current?.color.set(palette.carpetBorder)
    carpetAccentMat.current?.color.set(palette.carpetAccent)
    if (lampMat.current) {
      lampMat.current.color.set('#f5f5f0')
      lampMat.current.emissiveIntensity = palette.ceilingEmissive
    }
    if (ceilingLight.current) {
      ceilingLight.current.intensity = palette.ceilingLight
    }
  }, [palette])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.55, 0.003, 0.15]} receiveShadow>
        <planeGeometry args={[3.8, 2.4]} />
        <meshStandardMaterial ref={floorMat} color={palette.floor} roughness={0.92} metalness={0} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0.55, 2.35, 0.1]} receiveShadow>
        <planeGeometry args={[3.8, 2.4]} />
        <meshStandardMaterial
          ref={ceilingMat}
          color={palette.ceiling}
          roughness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0.55, 1.18, -0.95]} castShadow receiveShadow>
        <boxGeometry args={[3.9, 2.38, 0.1]} />
        <meshStandardMaterial ref={wallMat} color={palette.wall} roughness={0.9} />
      </mesh>
      <mesh position={[0.55, 0.06, -0.9]} receiveShadow>
        <boxGeometry args={[3.9, 0.1, 0.06]} />
        <meshStandardMaterial ref={trimMat} color={palette.trim} roughness={0.6} />
      </mesh>

      <mesh position={[-1.35, 1.18, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 2.38, 2.5]} />
        <meshStandardMaterial ref={leftWallMat} color={palette.wallDark} roughness={0.9} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.02, 0.004, 0.22]} receiveShadow>
        <planeGeometry args={[2.18, 1.38]} />
        <meshStandardMaterial ref={carpetBorderMat} color={palette.carpetBorder} roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.02, 0.006, 0.22]} receiveShadow>
        <planeGeometry args={[1.92, 1.12]} />
        <meshStandardMaterial ref={carpetMat} color={palette.carpet} roughness={0.96} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.02, 0.007, 0.22]} receiveShadow>
        <planeGeometry args={[0.72, 0.42]} />
        <meshStandardMaterial ref={carpetAccentMat} color={palette.carpetAccent} roughness={0.94} />
      </mesh>

      <mesh position={[0.45, 2.28, 0.05]} castShadow>
        <boxGeometry args={[0.35, 0.04, 0.12]} />
        <meshStandardMaterial
          ref={lampMat}
          color="#f5f5f0"
          roughness={0.4}
          emissive="#fff8f0"
          emissiveIntensity={palette.ceilingEmissive}
        />
      </mesh>
      <pointLight
        ref={ceilingLight}
        position={[0.45, 2.15, 0.05]}
        color="#fff4d6"
        intensity={palette.ceilingLight}
        distance={4}
        decay={2}
      />
    </group>
  )
}
