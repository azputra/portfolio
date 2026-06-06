import { CodeScreen } from './CodeScreen'
import { DeskMouse } from './DeskMouse'
import { KaabaBox } from './KaabaBox'
import { RoomSpeaker } from './RoomSpeaker'

const WOOD = '#b8956a'
const WOOD_DARK = '#9a7d58'
const DESK = '#f7f7f2'
const DESK_EDGE = '#e8e4dc'
const METAL = '#3a3a42'
const MONITOR = '#2a2a2e'

export const WORKSPACE_Y_ROT = 0.35
export const WORKSPACE_Z_SKEW = 0
export const AVATAR_POS: [number, number, number] = [0, 0, 0.36]
export const DESK_TOP_Y = 0.56
const DESK_THICKNESS = 0.038
export const DESK_SURFACE_Y = DESK_TOP_Y + DESK_THICKNESS / 2
const LEG_HEIGHT = 0.56
const LEG_CENTER_Y = LEG_HEIGHT / 2

const DESK_W = 1.72
const DESK_D = 0.44
const DESK_HALF_W = DESK_W / 2 - 0.08

function DeskLeg({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, LEG_CENTER_Y, 0]} castShadow>
        <boxGeometry args={[0.05, LEG_HEIGHT, 0.05]} />
        <meshStandardMaterial color={WOOD} roughness={0.62} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.018, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.032, 0.036, 12]} />
        <meshStandardMaterial color={METAL} roughness={0.28} metalness={0.72} />
      </mesh>
      <mesh position={[0, LEG_HEIGHT - 0.02, 0]} castShadow>
        <boxGeometry args={[0.058, 0.04, 0.058]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.55} />
      </mesh>
    </group>
  )
}

function DeskFrame() {
  const apronY = DESK_TOP_Y - DESK_THICKNESS / 2 - 0.05

  return (
    <group>
      <mesh position={[0, DESK_TOP_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[DESK_W, DESK_THICKNESS, DESK_D]} />
        <meshStandardMaterial color={DESK} roughness={0.28} metalness={0.02} />
      </mesh>

      <mesh position={[0, DESK_TOP_Y - 0.004, DESK_D / 2 - 0.008]} castShadow>
        <boxGeometry args={[DESK_W - 0.04, 0.01, 0.014]} />
        <meshStandardMaterial color={DESK_EDGE} roughness={0.4} />
      </mesh>

      <mesh position={[0, apronY, -DESK_D / 2 + 0.02]} castShadow>
        <boxGeometry args={[DESK_W - 0.12, 0.08, 0.018]} />
        <meshStandardMaterial color={DESK_EDGE} roughness={0.45} />
      </mesh>

      <mesh position={[0, apronY - 0.01, 0]} castShadow>
        <boxGeometry args={[DESK_W - 0.2, 0.05, 0.012]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.58} />
      </mesh>

      <DeskLeg x={-DESK_HALF_W} z={-DESK_D / 2 + 0.04} />
      <DeskLeg x={DESK_HALF_W} z={-DESK_D / 2 + 0.04} />
      <DeskLeg x={-DESK_HALF_W} z={DESK_D / 2 - 0.04} />
      <DeskLeg x={DESK_HALF_W} z={DESK_D / 2 - 0.04} />
    </group>
  )
}

function MonitorUnit({
  x,
  z,
  rotY,
  screenW,
  screenH,
  variant,
  scrollSpeed,
}: {
  x: number
  z: number
  rotY: number
  screenW: number
  screenH: number
  variant: 'main' | 'side'
  scrollSpeed?: number
}) {
  const bezelH = screenH + 0.035
  const standH = 0.09
  const baseH = 0.012
  const footOnDeskY = DESK_SURFACE_Y + bezelH / 2 + standH + baseH / 2 + 0.001

  const monitorMat = { color: MONITOR, roughness: 0.3, metalness: 0.3 }

  return (
    <group position={[x, footOnDeskY, z]} rotation={[0, rotY, 0]}>
      <mesh castShadow>
        <boxGeometry args={[screenW + 0.04, bezelH, 0.035]} />
        <meshStandardMaterial {...monitorMat} />
      </mesh>
      <group position={[0, 0, 0.022]}>
        <CodeScreen width={screenW} height={screenH} variant={variant} scrollSpeed={scrollSpeed} />
      </group>

      <mesh position={[0, -bezelH / 2 - standH / 2, 0]}>
        <cylinderGeometry args={[0.022, 0.03, standH, 12]} />
        <meshStandardMaterial color={MONITOR} roughness={0.5} />
      </mesh>
      <mesh position={[0, -bezelH / 2 - standH - baseH / 2, 0.025]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[Math.min(screenW * 0.5, 0.26), baseH, 0.08]} />
        <meshStandardMaterial color={MONITOR} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Keyboard() {
  return (
    <group position={[0, DESK_SURFACE_Y + 0.009, 0.1]}>
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.018, 0.11]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[0.34, 0.004, 0.09]} />
        <meshStandardMaterial color="#d8d8d8" roughness={0.6} />
      </mesh>
    </group>
  )
}

export function DeskSetup() {
  return (
    <group>
      <DeskFrame />

      <MonitorUnit
        x={-0.3}
        z={-0.08}
        rotY={0.05}
        screenW={0.68}
        screenH={0.36}
        variant="main"
        scrollSpeed={10}
      />
      <MonitorUnit
        x={0.46}
        z={-0.08}
        rotY={0.04}
        screenW={0.48}
        screenH={0.3}
        variant="side"
        scrollSpeed={6}
      />

      <mesh position={[0, DESK_SURFACE_Y + 0.004, 0.1]} receiveShadow>
        <boxGeometry args={[0.48, 0.008, 0.2]} />
        <meshStandardMaterial color="#1a2b4a" roughness={0.75} />
      </mesh>
      <Keyboard />
      <DeskMouse />
      <RoomSpeaker />
      <KaabaBox />
    </group>
  )
}
