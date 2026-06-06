import { type ThreeEvent } from '@react-three/fiber'
import { useDeskInteraction } from '../../context/DeskInteractionContext'
import { useSceneHover } from '../../context/SceneHoverContext'
import { DESK_SURFACE_Y } from './DeskSetup'

export function DeskMouse() {
  const { toggleSideWebsite } = useDeskInteraction()
  const { pointerEnter, pointerLeave } = useSceneHover()

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    toggleSideWebsite()
  }

  return (
    <group position={[0.22, DESK_SURFACE_Y + 0.011, 0.12]} rotation={[0, -0.15, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.055, 0.022, 0.08]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.012, -0.01]}>
        <boxGeometry args={[0.018, 0.008, 0.025]} />
        <meshStandardMaterial color="#2a2a2e" roughness={0.4} />
      </mesh>

      <mesh
        position={[0, 0.01, 0]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          pointerEnter()
        }}
        onPointerOut={() => pointerLeave()}
      >
        <boxGeometry args={[0.08, 0.05, 0.12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
