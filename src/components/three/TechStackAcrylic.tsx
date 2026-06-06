import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useNeonLit } from '../../hooks/useNeonLit'
import { useSceneHover } from '../../context/SceneHoverContext'
import * as THREE from 'three'
import { profile } from '../../data/profile'

const NEON_PALETTE = [
  '#00f5ff',
  '#c084fc',
  '#60a5fa',
  '#34d399',
  '#38bdf8',
  '#818cf8',
  '#f472b6',
  '#e879f9',
  '#a78bfa',
  '#22d3ee',
  '#4ade80',
  '#fb923c',
  '#facc15',
  '#67e8f9',
  '#f9a8d4',
  '#86efac',
  '#93c5fd',
  '#fda4af',
]

const STACK = profile.skills.map((name, i) => ({
  label: name.toUpperCase(),
  color: NEON_PALETTE[i % NEON_PALETTE.length],
  key: name === 'Three.js',
}))

const FONT_SKILL = 26
const FONT_SKILL_LONG = 24
const FONT_TITLE = 28

const BORDER_PX = 16
const COLS = 2
const ROW_H = 54
const TITLE_AREA = 52
const BOTTOM_PAD = 18
const ROW_COUNT = Math.ceil(STACK.length / COLS)

const CANVAS_W = 620
const CANVAS_H = BORDER_PX * 2 + TITLE_AREA + ROW_COUNT * ROW_H + BOTTOM_PAD

const CONTENT_W = 0.74
const CONTENT_H = CONTENT_W * (CANVAS_H / CANVAS_W)
const FRAME_INSET = 0.018
const OUTER_PAD = 0.012
const PANEL_W = CONTENT_W + FRAME_INSET * 2
const PANEL_H = CONTENT_H + FRAME_INSET * 2

function drawSkillPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  lit: boolean,
  color: string,
) {
  const top = y - h + 6
  ctx.fillStyle = lit ? 'rgba(0, 0, 0, 0.45)' : 'rgba(20, 28, 48, 0.75)'
  ctx.fillRect(x - w / 2, top, w, h)

  ctx.strokeStyle = lit ? color : 'rgba(120, 140, 180, 0.35)'
  ctx.lineWidth = lit ? 1.5 : 1
  ctx.strokeRect(x - w / 2, top, w, h)
}

function drawNeonPanel(ctx: CanvasRenderingContext2D, w: number, h: number, lit: boolean) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const innerX = BORDER_PX
  const innerY = BORDER_PX
  const innerW = w - BORDER_PX * 2
  const innerH = h - BORDER_PX * 2

  ctx.fillStyle = lit ? '#08061a' : '#141c32'
  ctx.fillRect(innerX, innerY, innerW, innerH)

  ctx.strokeStyle = lit ? '#c084fc' : '#5a6a8a'
  ctx.lineWidth = lit ? 3 : 2
  ctx.strokeRect(innerX + 1, innerY + 1, innerW - 2, innerH - 2)

  ctx.font = `800 ${FONT_TITLE}px "Outfit", system-ui, sans-serif`
  ctx.fillStyle = lit ? '#f0abfc' : '#9bacc8'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('TECH STACK', w / 2, innerY + 36)

  const colW = innerW / COLS
  const pillW = colW - 12
  const pillH = 46
  const firstRowY = innerY + TITLE_AREA + pillH / 2

  STACK.forEach((item, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const x = innerX + col * colW + colW / 2
    const y = firstRowY + row * ROW_H
    const fontSize = item.label.length > 11 ? FONT_SKILL_LONG : FONT_SKILL

    drawSkillPill(ctx, x, y, pillW, pillH, lit, item.color)

    ctx.font = item.key
      ? `800 ${fontSize}px "JetBrains Mono", monospace`
      : `700 ${fontSize}px "JetBrains Mono", monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    if (lit) {
      ctx.globalAlpha = 0.5
      ctx.fillStyle = item.color
      ctx.fillText(item.label, x, y - pillH / 2 + 6)
      ctx.globalAlpha = 0.85
      ctx.fillStyle = '#ffffff'
      ctx.fillText(item.label, x, y - pillH / 2 + 6)
      ctx.globalAlpha = 1
      ctx.fillStyle = item.color
      ctx.fillText(item.label, x, y - pillH / 2 + 6)
    } else {
      ctx.fillStyle = item.color
      ctx.globalAlpha = 0.78
      ctx.fillText(item.label, x, y - pillH / 2 + 6)
      ctx.globalAlpha = 1
    }
  })
}

export function TechStackAcrylic() {
  const { lit, toggle } = useNeonLit()
  const { pointerEnter, pointerLeave } = useSceneHover()
  const glowCyan = useRef<THREE.PointLight>(null)
  const glowPurple = useRef<THREE.PointLight>(null)
  const panelMat = useRef<THREE.MeshStandardMaterial>(null)
  const pulse = useRef(0)

  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = CANVAS_W
    c.height = CANVAS_H
    return c
  }, [])

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.generateMipmaps = false
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [canvas])

  useLayoutEffect(() => {
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return
    drawNeonPanel(ctx, CANVAS_W, CANVAS_H, lit)
    texture.needsUpdate = true
  }, [canvas, texture, lit])

  useFrame(({ clock }, delta) => {
    pulse.current = lit ? 0.5 + Math.sin(clock.elapsedTime * 3.5) * 0.5 : 0

    if (glowCyan.current) {
      const target = lit ? 1.6 + pulse.current * 0.5 : 0.22
      glowCyan.current.intensity = THREE.MathUtils.damp(glowCyan.current.intensity, target, 6, delta)
    }

    if (glowPurple.current) {
      const target = lit ? 1.1 + pulse.current * 0.35 : 0.15
      glowPurple.current.intensity = THREE.MathUtils.damp(
        glowPurple.current.intensity,
        target,
        6,
        delta,
      )
    }

    if (panelMat.current) {
      const target = lit ? 0.35 + pulse.current * 0.2 : 0.08
      panelMat.current.emissiveIntensity = THREE.MathUtils.damp(
        panelMat.current.emissiveIntensity,
        target,
        6,
        delta,
      )
    }
  })

  return (
    <group position={[1.38, 1.26, -0.852]}>
      {/* bingkai luar — krem */}
      <mesh position={[0, 0, -0.005]}>
        <boxGeometry args={[PANEL_W + OUTER_PAD * 2, PANEL_H + OUTER_PAD * 2, 0.007]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.55} />
      </mesh>

      {/* bingkai navy */}
      <mesh position={[0, 0, -0.001]}>
        <boxGeometry args={[PANEL_W, PANEL_H, 0.006]} />
        <meshStandardMaterial color="#1a2b4a" roughness={0.4} />
      </mesh>

      {/* panel gelap */}
      <mesh position={[0, 0, 0.003]}>
        <boxGeometry args={[CONTENT_W + 0.004, CONTENT_H + 0.004, 0.008]} />
        <meshStandardMaterial
          ref={panelMat}
          color="#141c32"
          roughness={0.25}
          metalness={0.08}
          emissive="#5eead4"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* konten — pas dengan area dalam bingkai */}
      <mesh position={[0, 0, 0.009]} renderOrder={1}>
        <planeGeometry args={[CONTENT_W, CONTENT_H]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <mesh
        position={[0, 0, 0.012]}
        renderOrder={2}
        onClick={toggle}
        onPointerOver={(e) => {
          e.stopPropagation()
          pointerEnter()
        }}
        onPointerOut={() => pointerLeave()}
      >
        <planeGeometry args={[PANEL_W + OUTER_PAD * 2, PANEL_H + OUTER_PAD * 2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <pointLight
        ref={glowCyan}
        position={[0, 0.1, 0.42]}
        color="#00f5ff"
        intensity={0.22}
        distance={3}
        decay={2}
      />
      <pointLight
        ref={glowPurple}
        position={[0, -0.15, 0.38]}
        color="#c084fc"
        intensity={0.15}
        distance={2.8}
        decay={2}
      />
    </group>
  )
}
