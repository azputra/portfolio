import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useRoomAudio } from '../../context/RoomAudioContext'
import { useSceneHover } from '../../context/SceneHoverContext'
import { DESK_SURFACE_Y } from './DeskSetup'
import { SpeakerMusicNotes } from './SpeakerMusicNotes'

const BODY = '#2a2a2e'
const GRILL = '#1a1a1e'
const ACCENT = '#5eead4'

export function RoomSpeaker() {
  const { isPlaying, toggleMusic } = useRoomAudio()
  const { pointerEnter, pointerLeave } = useSceneHover()
  const cone = useRef<THREE.MeshStandardMaterial>(null)
  const led = useRef<THREE.MeshStandardMaterial>(null)
  const glow = useRef<THREE.PointLight>(null)
  const pulse = useRef(0)

  useFrame(({ clock }, delta) => {
    pulse.current = isPlaying ? Math.sin(clock.elapsedTime * 5.5) * 0.5 + 0.5 : 0

    if (cone.current) {
      cone.current.emissiveIntensity = THREE.MathUtils.damp(
        cone.current.emissiveIntensity,
        isPlaying ? 0.18 + pulse.current * 0.22 : 0,
        8,
        delta,
      )
    }

    if (led.current) {
      led.current.emissiveIntensity = THREE.MathUtils.damp(
        led.current.emissiveIntensity,
        isPlaying ? 0.55 + pulse.current * 0.35 : 0.04,
        8,
        delta,
      )
    }

    if (glow.current) {
      glow.current.intensity = THREE.MathUtils.damp(
        glow.current.intensity,
        isPlaying ? 0.12 + pulse.current * 0.18 : 0,
        6,
        delta,
      )
    }
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    toggleMusic()
  }

  return (
    <group position={[-0.72, DESK_SURFACE_Y + 0.067, 0.02]} rotation={[0, 0.22, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.13, 0.08]} />
        <meshStandardMaterial color={BODY} roughness={0.42} metalness={0.18} />
      </mesh>

      <mesh position={[0, 0.018, 0.042]} castShadow>
        <cylinderGeometry args={[0.032, 0.034, 0.012, 20]} />
        <meshStandardMaterial color={GRILL} roughness={0.55} metalness={0.25} />
      </mesh>

      <mesh position={[0, 0.018, 0.048]}>
        <cylinderGeometry args={[0.024, 0.024, 0.006, 20]} />
        <meshStandardMaterial
          ref={cone}
          color="#3a3a42"
          emissive={ACCENT}
          emissiveIntensity={0}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0.034, 0.048, 0.042]}>
        <sphereGeometry args={[0.006, 10, 10]} />
        <meshStandardMaterial
          ref={led}
          color={isPlaying ? ACCENT : '#555'}
          emissive={ACCENT}
          emissiveIntensity={0.04}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 0.058, 0.038]}>
        <boxGeometry args={[0.04, 0.008, 0.004]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>

      <mesh
        position={[0, 0.02, 0.05]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          pointerEnter()
        }}
        onPointerOut={() => pointerLeave()}
      >
        <boxGeometry args={[0.12, 0.16, 0.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <pointLight ref={glow} position={[0, 0.05, 0.12]} color={ACCENT} intensity={0} distance={0.9} decay={2} />
      <SpeakerMusicNotes />
    </group>
  )
}
