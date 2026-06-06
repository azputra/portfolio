import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'
import type { PortfolioScroll } from '../../hooks/usePortfolioScroll'
import { SCENE_PALETTES } from '../../theme/scenePalette'
import { AvatarModel, CHARACTER_X } from './AvatarModel'
import { CameraRig } from './CameraRig'
import { DeskFade, ScrollSceneRig } from './ScrollSceneRig'
import { DeskSetup, WORKSPACE_Y_ROT } from './DeskSetup'
import { ExitDoor } from './ExitDoor'
import { RoomInterior } from './RoomInterior'
import { SceneDecor } from './SceneDecor'
import { SceneTheme } from './SceneTheme'
import { StylizedAvatar } from './StylizedAvatar'
import { WorkspaceRig } from './WorkspaceRig'
import './Experience.scss'

function SceneBackdrop() {
  const { theme } = useTheme()
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const palette = SCENE_PALETTES[theme]
  const color = useRef(new THREE.Color(palette.bg))

  useEffect(() => {
    color.current.set(palette.bg)
    if (mat.current) mat.current.color.copy(color.current)
  }, [palette.bg])

  useFrame((_, delta) => {
    if (!mat.current) return
    color.current.set(palette.bg)
    mat.current.color.lerp(color.current, Math.min(1, delta * 4))
  })

  return (
    <mesh position={[0, 1.4, -4]} receiveShadow>
      <planeGeometry args={[14, 8]} />
      <meshStandardMaterial ref={mat} color={palette.bg} roughness={1} metalness={0} />
    </mesh>
  )
}

function MonitorGlow() {
  const { isDark } = useTheme()
  const main = useRef<THREE.PointLight>(null)
  const side = useRef<THREE.PointLight>(null)

  useFrame(({ clock }, delta) => {
    const pulse = 0.85 + Math.sin(clock.elapsedTime * 2.2) * 0.1
    const base = isDark ? 0.55 : 0.35
    const sideBase = isDark ? 0.4 : 0.22
    if (main.current) {
      main.current.intensity = THREE.MathUtils.damp(
        main.current.intensity,
        base * pulse,
        6,
        delta,
      )
    }
    if (side.current) {
      side.current.intensity = THREE.MathUtils.damp(
        side.current.intensity,
        sideBase * pulse,
        6,
        delta,
      )
    }
  })

  return (
    <group position={[CHARACTER_X, 0, 0]} rotation={[0, WORKSPACE_Y_ROT, 0]}>
      <pointLight
        ref={main}
        position={[-0.44, 0.92, -0.06]}
        color="#7ec8ff"
        intensity={0.55}
        distance={1.8}
        decay={2}
      />
      <pointLight
        ref={side}
        position={[0.44, 0.92, -0.06]}
        color="#6ee7b7"
        intensity={0.4}
        distance={1.6}
        decay={2}
      />
    </group>
  )
}

type ExperienceProps = {
  mouse: React.MutableRefObject<{ x: number; y: number }>
  introReady: boolean
  scroll: React.MutableRefObject<PortfolioScroll>
}

function Scene({ mouse, introReady, scroll }: ExperienceProps) {
  return (
    <ScrollSceneRig scroll={scroll}>
      <SceneTheme />
      <CameraRig mouse={mouse} scroll={scroll} />

      <SceneBackdrop />
      <MonitorGlow />

      <group position={[CHARACTER_X, 0, 0]} rotation={[0, WORKSPACE_Y_ROT, 0]}>
        <RoomInterior />
        <SceneDecor />
        <ExitDoor scroll={scroll} />
      </group>

      <WorkspaceRig mouse={mouse} scroll={scroll}>
        <group position={[CHARACTER_X, 0, 0]} rotation={[0, WORKSPACE_Y_ROT, 0]}>
          <DeskFade scroll={scroll}>
            <DeskSetup />
          </DeskFade>
          <Suspense fallback={<StylizedAvatar mouse={mouse} atDesk localOrigin />}>
            <AvatarModel mouse={mouse} introReady={introReady} scroll={scroll} />
          </Suspense>
        </group>
      </WorkspaceRig>
    </ScrollSceneRig>
  )
}

export function Experience({ mouse, introReady, scroll }: ExperienceProps) {
  const { theme } = useTheme()
  const initialBg = SCENE_PALETTES[theme].bg

  return (
    <div className="experience">
      <Canvas
        shadows
        camera={{ position: [2.75, 1.12, 5.4], fov: 36, near: 0.1, far: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(initialBg)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          scene.background = new THREE.Color(initialBg)
        }}
      >
        <Scene mouse={mouse} introReady={introReady} scroll={scroll} />
      </Canvas>
    </div>
  )
}

export function useSceneMouse() {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      mouse.current.x = Math.max(-1, Math.min(1, nx))
      mouse.current.y = Math.max(-1, Math.min(1, ny))
    }

    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return
      const t = e.touches[0]
      mouse.current.x = (t.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (t.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return mouse
}
