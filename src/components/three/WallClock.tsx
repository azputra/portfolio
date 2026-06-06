import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useNeonLit } from '../../hooks/useNeonLit'
import { useSceneHover } from '../../context/SceneHoverContext'
import * as THREE from 'three'

function formatDate(now: Date) {
  return now.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function drawDigitalClock(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  now: Date,
  lit: boolean,
) {
  ctx.clearRect(0, 0, w, h)

  ctx.fillStyle = lit ? '#08061a' : '#1a2b4a'
  ctx.fillRect(6, 6, w - 12, h - 12)

  ctx.strokeStyle = lit ? '#5eead4' : '#2a3f5f'
  ctx.lineWidth = lit ? 4 : 3
  ctx.strokeRect(6, 6, w - 12, h - 12)

  if (lit) {
    ctx.shadowColor = '#00f5ff'
    ctx.shadowBlur = 18
  }

  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = '600 26px "Outfit", system-ui, sans-serif'
  ctx.fillStyle = lit ? '#c084fc' : '#89ddff'
  ctx.fillText(formatDate(now), w / 2, 40)

  ctx.font = 'bold 82px "JetBrains Mono", "Outfit", monospace'
  if (lit) {
    ctx.globalAlpha = 0.45
    ctx.fillStyle = '#00f5ff'
    ctx.fillText(`${hh}:${mm}`, w / 2, h / 2 + 6)
    ctx.globalAlpha = 0.9
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${hh}:${mm}`, w / 2, h / 2 + 6)
    ctx.globalAlpha = 1
    ctx.fillStyle = '#5eead4'
    ctx.fillText(`${hh}:${mm}`, w / 2, h / 2 + 6)
  } else {
    ctx.fillStyle = '#5eead4'
    ctx.fillText(`${hh}:${mm}`, w / 2, h / 2 + 6)
  }

  ctx.font = '500 32px "JetBrains Mono", monospace'
  ctx.fillStyle = lit ? '#f0abfc' : '#a5f3fc'
  ctx.fillText(ss, w / 2, h - 36)

  ctx.shadowBlur = 0
}

const CANVAS_W = 400
const CANVAS_H = 210

export function WallClock() {
  const { lit, toggle } = useNeonLit()
  const { pointerEnter, pointerLeave } = useSceneHover()
  const frameMat = useRef<THREE.MeshStandardMaterial>(null)
  const glowCyan = useRef<THREE.PointLight>(null)
  const glowPurple = useRef<THREE.PointLight>(null)
  const pulse = useRef(0)

  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = CANVAS_W
    c.height = CANVAS_H
    return c
  }, [])

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.minFilter = THREE.LinearFilter
    return t
  }, [canvas])

  const lastSecond = useRef(-1)

  const redraw = (force = false) => {
    const sec = new Date().getSeconds()
    if (!force && sec === lastSecond.current) return
    lastSecond.current = sec

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawDigitalClock(ctx, CANVAS_W, CANVAS_H, new Date(), lit)
    texture.needsUpdate = true
  }

  useLayoutEffect(() => {
    redraw(true)
  }, [canvas, texture, lit])

  useFrame(({ clock }, delta) => {
    redraw()

    pulse.current = lit ? 0.5 + Math.sin(clock.elapsedTime * 3.5) * 0.5 : 0

    if (glowCyan.current) {
      const target = lit ? 1.4 + pulse.current * 0.45 : 0.12
      glowCyan.current.intensity = THREE.MathUtils.damp(glowCyan.current.intensity, target, 6, delta)
    }

    if (glowPurple.current) {
      const target = lit ? 0.95 + pulse.current * 0.3 : 0.08
      glowPurple.current.intensity = THREE.MathUtils.damp(
        glowPurple.current.intensity,
        target,
        6,
        delta,
      )
    }

    if (frameMat.current) {
      const target = lit ? 0.4 + pulse.current * 0.25 : 0
      frameMat.current.emissiveIntensity = THREE.MathUtils.damp(
        frameMat.current.emissiveIntensity,
        target,
        6,
        delta,
      )
    }
  })

  return (
    <group position={[-0.15, 1.72, -0.87]}>
      <mesh castShadow>
        <boxGeometry args={[0.62, 0.32, 0.025]} />
        <meshStandardMaterial
          ref={frameMat}
          color="#e8e2d8"
          roughness={0.5}
          emissive="#5eead4"
          emissiveIntensity={0}
        />
      </mesh>
      <mesh position={[0, 0, 0.014]}>
        <planeGeometry args={[0.58, 0.28]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <mesh
        position={[0, 0, 0.02]}
        onClick={toggle}
        onPointerOver={(e) => {
          e.stopPropagation()
          pointerEnter()
        }}
        onPointerOut={() => pointerLeave()}
      >
        <planeGeometry args={[0.62, 0.32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <pointLight
        ref={glowCyan}
        position={[0, 0.05, 0.35]}
        color="#00f5ff"
        intensity={0.12}
        distance={2.2}
        decay={2}
      />
      <pointLight
        ref={glowPurple}
        position={[0, -0.05, 0.32]}
        color="#c084fc"
        intensity={0.08}
        distance={2}
        decay={2}
      />
    </group>
  )
}
