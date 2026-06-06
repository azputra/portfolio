import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDeskInteraction } from '../../context/DeskInteractionContext'
import { useTheme } from '../../context/ThemeContext'
import { getYearsExperienceLabel, profile } from '../../data/profile'
import { projects } from '../../data/projects'

type CodeLine = { parts: { t: string; c: string }[] }

const CODE_MAIN: CodeLine[] = [
  {
    parts: [
      { t: 'import', c: '#c792ea' },
      { t: ' { useRef, useState } ', c: '#89ddff' },
      { t: 'from', c: '#c792ea' },
      { t: ' "react"', c: '#c3e88d' },
    ],
  },
  {
    parts: [
      { t: 'import', c: '#c792ea' },
      { t: ' { Canvas, useFrame } ', c: '#89ddff' },
      { t: 'from', c: '#c792ea' },
      { t: ' "@react-three/fiber"', c: '#c3e88d' },
    ],
  },
  {
    parts: [
      { t: 'import', c: '#c792ea' },
      { t: ' { ScrollControls } ', c: '#89ddff' },
      { t: 'from', c: '#c792ea' },
      { t: ' "@react-three/drei"', c: '#c3e88d' },
    ],
  },
  { parts: [{ t: 'import * as THREE from "three"', c: '#c792ea' }] },
  { parts: [{ t: '', c: '#546e7a' }] },
  {
    parts: [
      { t: 'export function', c: '#c792ea' },
      { t: ' PortfolioScene', c: '#ffcb6b' },
      { t: '({ scroll }: Props) {', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '  const', c: '#c792ea' },
      { t: ' rig', c: '#89ddff' },
      { t: ' = ', c: '#89ddff' },
      { t: 'useRef<THREE.Group>(null)', c: '#c3e88d' },
    ],
  },
  {
    parts: [
      { t: '  const', c: '#c792ea' },
      { t: ' [neon, setNeon]', c: '#89ddff' },
      { t: ' = ', c: '#89ddff' },
      { t: 'useState(false)', c: '#c3e88d' },
    ],
  },
  { parts: [{ t: '', c: '#546e7a' }] },
  {
    parts: [
      { t: '  useFrame((_, delta) => {', c: '#c792ea' },
    ],
  },
  {
    parts: [
      { t: '    if (!rig.current) return', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '    rig.current.rotation.y = THREE.MathUtils.damp(', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '      rig.current.rotation.y,', c: '#c3e88d' },
    ],
  },
  {
    parts: [
      { t: '      scroll.hero * Math.PI * 0.12,', c: '#f78c6c' },
    ],
  },
  {
    parts: [
      { t: '      4, delta', c: '#f78c6c' },
    ],
  },
  {
    parts: [
      { t: '    )', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '  })', c: '#89ddff' },
    ],
  },
  { parts: [{ t: '', c: '#546e7a' }] },
  {
    parts: [
      { t: '  return (', c: '#c792ea' },
    ],
  },
  {
    parts: [
      { t: '    <Canvas shadows camera={{ position: [2.6, 1.1, 5.2] }}>', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '      <group ref={rig}>', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '        <RoomInterior />', c: '#ffcb6b' },
    ],
  },
  {
    parts: [
      { t: '        <DeskSetup />', c: '#ffcb6b' },
    ],
  },
  {
    parts: [
      { t: '        <AvatarModel introReady />', c: '#ffcb6b' },
    ],
  },
  {
    parts: [
      { t: '        <TechStackAcrylic lit={neon} onToggle={setNeon} />', c: '#ffcb6b' },
    ],
  },
  {
    parts: [
      { t: '      </group>', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '      <ScrollControls pages={3} damping={0.2} />', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '    </Canvas>', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '  )', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '}', c: '#89ddff' },
    ],
  },
]

const CODE_SIDE: CodeLine[] = [
  { parts: [{ t: '// src/api/routes/projects.ts', c: '#546e7a' }] },
  {
    parts: [
      { t: 'import', c: '#c792ea' },
      { t: ' { Router } ', c: '#89ddff' },
      { t: 'from', c: '#c792ea' },
      { t: ' "express"', c: '#c3e88d' },
    ],
  },
  {
    parts: [
      { t: 'import', c: '#c792ea' },
      { t: ' { authenticate } ', c: '#89ddff' },
      { t: 'from', c: '#c792ea' },
      { t: ' "../middleware/auth"', c: '#c3e88d' },
    ],
  },
  {
    parts: [
      { t: 'import', c: '#c792ea' },
      { t: ' { ProjectService } ', c: '#89ddff' },
      { t: 'from', c: '#c792ea' },
      { t: ' "../services/project"', c: '#c3e88d' },
    ],
  },
  { parts: [{ t: '', c: '#546e7a' }] },
  {
    parts: [
      { t: 'const', c: '#c792ea' },
      { t: ' router', c: '#89ddff' },
      { t: ' = ', c: '#89ddff' },
      { t: 'Router()', c: '#c3e88d' },
    ],
  },
  { parts: [{ t: '', c: '#546e7a' }] },
  {
    parts: [
      { t: "router.get('/api/v1/projects', authenticate, async (req, res) => {", c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '  const { page = 1, limit = 20, status } = req.query', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '  const projects = await ProjectService.findAll({', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '    page: Number(page),', c: '#c3e88d' },
    ],
  },
  {
    parts: [
      { t: '    limit: Number(limit),', c: '#c3e88d' },
    ],
  },
  {
    parts: [
      { t: '    status: status as string,', c: '#c3e88d' },
    ],
  },
  {
    parts: [
      { t: '    ownerId: req.user.id,', c: '#c3e88d' },
    ],
  },
  {
    parts: [
      { t: '  })', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '  return res.status(200).json({ success: true, data: projects })', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '})', c: '#89ddff' },
    ],
  },
  { parts: [{ t: '', c: '#546e7a' }] },
  {
    parts: [
      { t: "router.post('/api/v1/projects', authenticate, async (req, res) => {", c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '  const created = await ProjectService.create(req.body, req.user.id)', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '  return res.status(201).json({ success: true, data: created })', c: '#89ddff' },
    ],
  },
  {
    parts: [
      { t: '})', c: '#89ddff' },
    ],
  },
  { parts: [{ t: '', c: '#546e7a' }] },
  { parts: [{ t: '$ npm run dev --workspace=api', c: '#5eead4' }] },
  { parts: [{ t: '✓ API ready  http://localhost:4000', c: '#c3e88d' }] },
  { parts: [{ t: '✓ PostgreSQL connected', c: '#c3e88d' }] },
]

const SITE_COLORS = ['#00f5ff', '#c084fc', '#5eead4', '#f472b6', '#60a5fa', '#f0c060']

function drawGlowOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha: number,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.globalAlpha = alpha
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
}

function drawGlowText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fill: string,
  glow: string,
  blur = 14,
) {
  ctx.shadowColor = glow
  ctx.shadowBlur = blur
  ctx.fillStyle = fill
  ctx.fillText(text, x, y)
  ctx.shadowBlur = 0
}

function drawSubtleGrid(ctx: CanvasRenderingContext2D, w: number, h: number, top: number) {
  ctx.strokeStyle = 'rgba(94, 234, 212, 0.06)'
  ctx.lineWidth = 1
  for (let x = 0; x < w; x += 28) {
    ctx.beginPath()
    ctx.moveTo(x, top)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let y = top; y < h; y += 28) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
}

const LIGHT_CARD_COLORS = ['#7ec8ff', '#6ee7b7', '#f0c060']

function drawWebsiteLight(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const barH = 34
  const heroH = 138
  const pulse = 0.5 + Math.sin(time * 2.5) * 0.5
  const years = getYearsExperienceLabel()

  ctx.fillStyle = '#e8e2d8'
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#f3efe8'
  ctx.fillRect(0, 0, w, barH)
  ctx.fillStyle = '#ddd6c8'
  ctx.fillRect(0, barH - 1, w, 1)

  ;['#ff6b6b', '#ffd166', '#6ee7b7'].forEach((c, i) => {
    ctx.beginPath()
    ctx.arc(16 + i * 14, barH / 2, 4.5, 0, Math.PI * 2)
    ctx.fillStyle = c
    ctx.fill()
  })

  roundRect(ctx, 62, 9, w - 80, 16, 8)
  ctx.fillStyle = '#ebe5db'
  ctx.fill()
  ctx.font = '500 10px "Outfit", system-ui, sans-serif'
  ctx.fillStyle = '#6a7280'
  ctx.fillText('azputra.dev', 88, 21)

  const heroY = barH
  ctx.fillStyle = '#1a2b4a'
  ctx.fillRect(14, heroY + 10, w - 28, heroH - 16)

  const [firstName, ...restName] = profile.name.split(' ')
  const lastName = restName.join(' ')

  ctx.font = '800 28px "Outfit", system-ui, sans-serif'
  ctx.fillStyle = '#f7f7f2'
  ctx.fillText(firstName, 28, heroY + 68)
  ctx.font = '700 16px "Outfit", system-ui, sans-serif'
  ctx.fillStyle = '#c9d4e8'
  ctx.fillText(lastName, 28, heroY + 90)
  ctx.font = '500 11px "Outfit", system-ui, sans-serif'
  ctx.fillStyle = '#9ecae8'
  ctx.fillText(profile.role, 28, heroY + 112)

  const pillY = heroY + 24
  ;['About', 'Work', 'Contact'].forEach((label, i) => {
    const nx = w - 28 - (3 - i) * 62
    const active = i === 0
    roundRect(ctx, nx, pillY, 54, 18, 9)
    ctx.fillStyle = active ? '#f0c060' : 'rgba(255,255,255,0.12)'
    ctx.fill()
    ctx.font = '600 9px "Outfit", system-ui, sans-serif'
    ctx.fillStyle = active ? '#1a2b4a' : '#e8e2d8'
    ctx.textAlign = 'center'
    ctx.fillText(label, nx + 27, pillY + 12)
    ctx.textAlign = 'left'
  })

  const statsY = barH + heroH + 6
  const stats = [
    { v: years, l: 'Years' },
    { v: '4', l: 'Countries' },
    { v: '6+', l: 'Clients' },
    { v: '100%', l: 'Remote' },
  ]
  const statW = (w - 56 - 24) / 4
  stats.forEach((s, i) => {
    const sx = 28 + i * (statW + 8)
    roundRect(ctx, sx, statsY, statW, 32, 8)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.font = '800 13px "Outfit", system-ui, sans-serif'
    ctx.fillStyle = '#1a2b4a'
    ctx.textAlign = 'center'
    ctx.fillText(s.v, sx + statW / 2, statsY + 14)
    ctx.font = '500 8px "Outfit", system-ui, sans-serif'
    ctx.fillStyle = '#8a8f9a'
    ctx.fillText(s.l, sx + statW / 2, statsY + 25)
    ctx.textAlign = 'left'
  })

  const sectionY = barH + heroH + 48
  ctx.font = '700 12px "Outfit", system-ui, sans-serif'
  ctx.fillStyle = '#1a2b4a'
  ctx.fillText('Featured Work', 28, sectionY)

  const cardW = (w - 56 - 16) / 3
  const cardH = 82
  const cardY = sectionY + 10
  projects.slice(0, 3).forEach((project, i) => {
    const cx = 28 + i * (cardW + 8)
    const color = LIGHT_CARD_COLORS[i % LIGHT_CARD_COLORS.length]

    roundRect(ctx, cx, cardY, cardW, cardH, 10)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.fillStyle = color
    ctx.globalAlpha = 0.22
    roundRect(ctx, cx, cardY, cardW, 30, 10)
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.font = '700 9px "Outfit", system-ui, sans-serif'
    ctx.fillStyle = '#1a2b4a'
    const title = project.title.length > 22 ? `${project.title.slice(0, 20)}…` : project.title
    ctx.fillText(title, cx + 10, cardY + 20)
    ctx.font = '500 8px "Outfit", system-ui, sans-serif'
    ctx.fillStyle = '#8a8f9a'
    const desc = project.subtitle.length > 30 ? `${project.subtitle.slice(0, 28)}…` : project.subtitle
    ctx.fillText(desc, cx + 10, cardY + 46)
    ctx.font = '600 7px "JetBrains Mono", monospace'
    ctx.fillStyle = '#6a7280'
    ctx.fillText(project.tags.slice(0, 2).join(' · '), cx + 10, cardY + 62)
  })

  ctx.fillStyle = `rgba(126, 200, 255, ${0.04 + pulse * 0.06})`
  ctx.fillRect(14, heroY + 10, w - 28, heroH - 16)
}

function drawWebsiteDark(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const barH = 34
  const heroH = 138
  const pulse = 0.5 + Math.sin(time * 2.8) * 0.5
  const years = getYearsExperienceLabel()

  // background
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#060a14')
  bg.addColorStop(0.55, '#0b1224')
  bg.addColorStop(1, '#08061a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  drawSubtleGrid(ctx, w, h, barH)

  // animated orbs
  drawGlowOrb(ctx, w * 0.82 + Math.sin(time * 0.7) * 24, barH + 48 + Math.cos(time * 0.9) * 16, 90, '#00f5ff', 0.16 + pulse * 0.06)
  drawGlowOrb(ctx, w * 0.18 + Math.cos(time * 0.6) * 20, barH + 110 + Math.sin(time * 0.8) * 12, 70, '#c084fc', 0.14 + pulse * 0.05)
  drawGlowOrb(ctx, w * 0.55 + Math.sin(time * 1.1) * 18, barH + 72, 55, '#5eead4', 0.1 + pulse * 0.04)

  // floating particles
  for (let i = 0; i < 18; i++) {
    const px = ((i * 97 + time * 22) % w)
    const py = barH + ((i * 53 + time * 18) % (h - barH - 20))
    const size = 1 + (i % 3) * 0.6
    ctx.globalAlpha = 0.15 + Math.sin(time * 2 + i) * 0.1
    ctx.fillStyle = SITE_COLORS[i % SITE_COLORS.length]
    ctx.beginPath()
    ctx.arc(px, py, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // browser chrome
  ctx.fillStyle = 'rgba(12, 18, 36, 0.92)'
  ctx.fillRect(0, 0, w, barH)
  ctx.fillStyle = 'rgba(94, 234, 212, 0.12)'
  ctx.fillRect(0, barH - 1, w, 1)

  ;['#ff6b6b', '#ffd166', '#34d399'].forEach((c, i) => {
    ctx.beginPath()
    ctx.arc(16 + i * 14, barH / 2, 4.5, 0, Math.PI * 2)
    ctx.fillStyle = c
    ctx.fill()
  })

  roundRect(ctx, 62, 9, w - 80, 16, 8)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fill()
  roundRect(ctx, 62, 9, w - 80, 16, 8)
  ctx.strokeStyle = 'rgba(94, 234, 212, 0.2)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.font = '500 10px "JetBrains Mono", monospace'
  ctx.fillStyle = '#5eead4'
  ctx.fillText('🔒', 72, 21)
  ctx.fillStyle = 'rgba(200, 220, 255, 0.75)'
  ctx.fillText('azputra.dev', 88, 21)

  // hero panel
  const heroY = barH
  roundRect(ctx, 14, heroY + 10, w - 28, heroH - 16, 14)
  ctx.fillStyle = 'rgba(8, 12, 28, 0.72)'
  ctx.fill()
  roundRect(ctx, 14, heroY + 10, w - 28, heroH - 16, 14)
  ctx.strokeStyle = `rgba(0, 245, 255, ${0.22 + pulse * 0.18})`
  ctx.lineWidth = 1.5
  ctx.stroke()

  // nav pills
  const navY = heroY + 24
  ;['About', 'Work', 'Contact'].forEach((label, i) => {
    const nx = w - 28 - (3 - i) * 62
    const active = i === 0
    roundRect(ctx, nx, navY, 54, 18, 9)
    ctx.fillStyle = active ? `rgba(0, 245, 255, ${0.18 + pulse * 0.08})` : 'rgba(255,255,255,0.04)'
    ctx.fill()
    if (active) {
      roundRect(ctx, nx, navY, 54, 18, 9)
      ctx.strokeStyle = `rgba(0, 245, 255, ${0.5 + pulse * 0.3})`
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.font = '600 9px "Outfit", system-ui, sans-serif'
    ctx.fillStyle = active ? '#5eead4' : 'rgba(180, 200, 230, 0.55)'
    ctx.textAlign = 'center'
    ctx.fillText(label, nx + 27, navY + 12)
    ctx.textAlign = 'left'
  })

  // badge
  roundRect(ctx, 28, heroY + 22, 108, 20, 10)
  ctx.fillStyle = 'rgba(192, 132, 252, 0.15)'
  ctx.fill()
  roundRect(ctx, 28, heroY + 22, 108, 20, 10)
  ctx.strokeStyle = `rgba(192, 132, 252, ${0.4 + pulse * 0.2})`
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.font = '600 9px "JetBrains Mono", monospace'
  ctx.fillStyle = '#c084fc'
  ctx.fillText('● OPEN TO WORK', 38, heroY + 35)

  // name & role
  const [firstName, ...restName] = profile.name.split(' ')
  const lastName = restName.join(' ')

  ctx.font = '800 30px "Outfit", system-ui, sans-serif'
  drawGlowText(ctx, firstName, 28, heroY + 72, '#f0f4ff', '#00f5ff', 16)
  ctx.font = '700 18px "Outfit", system-ui, sans-serif'
  drawGlowText(ctx, lastName, 28, heroY + 96, '#c084fc', '#c084fc', 12)

  ctx.font = '500 11px "Outfit", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(180, 210, 240, 0.8)'
  ctx.fillText(profile.role, 28, heroY + 114)

  // CTA button
  const ctaW = 118
  const ctaX = w - 28 - ctaW
  const ctaY = heroY + 100
  roundRect(ctx, ctaX, ctaY, ctaW, 24, 12)
  const ctaGrad = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaW, ctaY)
  ctaGrad.addColorStop(0, '#00f5ff')
  ctaGrad.addColorStop(1, '#c084fc')
  ctx.fillStyle = ctaGrad
  ctx.globalAlpha = 0.85 + pulse * 0.15
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.font = '700 10px "Outfit", system-ui, sans-serif'
  ctx.fillStyle = '#060a14'
  ctx.fillText('View Projects →', ctaX + 18, ctaY + 16)

  // stats row
  const statsY = barH + heroH + 6
  const stats = [
    { v: years, l: 'Years' },
    { v: '4', l: 'Countries' },
    { v: '6+', l: 'Clients' },
    { v: '100%', l: 'Remote' },
  ]
  const statW = (w - 56 - 24) / 4
  stats.forEach((s, i) => {
    const sx = 28 + i * (statW + 8)
    roundRect(ctx, sx, statsY, statW, 32, 8)
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    ctx.fill()
    roundRect(ctx, sx, statsY, statW, 32, 8)
    ctx.strokeStyle = `rgba(94, 234, 212, ${0.12 + (i === 0 ? pulse * 0.2 : 0)})`
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.font = '800 13px "Outfit", system-ui, sans-serif'
    ctx.fillStyle = SITE_COLORS[i % SITE_COLORS.length]
    ctx.textAlign = 'center'
    ctx.fillText(s.v, sx + statW / 2, statsY + 14)
    ctx.font = '500 8px "Outfit", system-ui, sans-serif'
    ctx.fillStyle = 'rgba(160, 180, 210, 0.6)'
    ctx.fillText(s.l, sx + statW / 2, statsY + 25)
    ctx.textAlign = 'left'
  })

  // projects section
  const sectionY = barH + heroH + 48
  ctx.font = '700 12px "Outfit", system-ui, sans-serif'
  ctx.fillStyle = '#e8eeff'
  ctx.fillText('Featured Work', 28, sectionY)
  ctx.font = '500 9px "Outfit", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(140, 165, 200, 0.55)'
  ctx.fillText('Selected builds', w - 28 - ctx.measureText('Selected builds').width, sectionY)

  const cardW = (w - 56 - 16) / 3
  const cardH = 82
  const cardY = sectionY + 10
  projects.slice(0, 3).forEach((project, i) => {
    const cx = 28 + i * (cardW + 8)
    const color = SITE_COLORS[i % SITE_COLORS.length]
    const glow = 0.35 + Math.sin(time * 2.2 + i * 1.4) * 0.25

    roundRect(ctx, cx, cardY, cardW, cardH, 10)
    ctx.fillStyle = 'rgba(10, 16, 32, 0.85)'
    ctx.fill()
    roundRect(ctx, cx, cardY, cardW, cardH, 10)
    ctx.strokeStyle =
      i === 0
        ? `rgba(0, 245, 255, ${glow})`
        : i === 1
          ? `rgba(192, 132, 252, ${glow})`
          : `rgba(94, 234, 212, ${glow})`
    ctx.lineWidth = 1.2
    ctx.stroke()

    // card header gradient
    roundRect(ctx, cx + 1, cardY + 1, cardW - 2, 30, 9)
    const hdr = ctx.createLinearGradient(cx, cardY, cx + cardW, cardY + 30)
    hdr.addColorStop(0, color + '33')
    hdr.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = hdr
    ctx.fill()

    ctx.font = '700 9px "Outfit", system-ui, sans-serif'
    ctx.fillStyle = '#eef2ff'
    const title = project.title.length > 22 ? `${project.title.slice(0, 20)}…` : project.title
    ctx.fillText(title, cx + 10, cardY + 20)

    ctx.font = '500 8px "JetBrains Mono", monospace'
    ctx.fillStyle = 'rgba(150, 175, 210, 0.65)'
    ctx.fillText(project.year, cx + cardW - 10 - ctx.measureText(project.year).width, cardY + 20)

    ctx.font = '500 8px "Outfit", system-ui, sans-serif'
    ctx.fillStyle = 'rgba(170, 190, 220, 0.7)'
    const desc = project.subtitle.length > 30 ? `${project.subtitle.slice(0, 28)}…` : project.subtitle
    ctx.fillText(desc, cx + 10, cardY + 46)

    // tags
    project.tags.slice(0, 2).forEach((tag, ti) => {
      const tx = cx + 10 + ti * 54
      const ty = cardY + 58
      roundRect(ctx, tx, ty, 48, 14, 7)
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.fill()
      ctx.font = '600 7px "JetBrains Mono", monospace'
      ctx.fillStyle = color
      ctx.globalAlpha = 0.85
      ctx.fillText(tag, tx + 6, ty + 10)
      ctx.globalAlpha = 1
    })
  })

  // scan line
  const scanY = barH + ((time * 60) % (h - barH))
  const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20)
  scanGrad.addColorStop(0, 'rgba(0, 245, 255, 0)')
  scanGrad.addColorStop(0.5, `rgba(0, 245, 255, ${0.04 + pulse * 0.03})`)
  scanGrad.addColorStop(1, 'rgba(0, 245, 255, 0)')
  ctx.fillStyle = scanGrad
  ctx.fillRect(0, scanY - 20, w, 40)

  // vignette
  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.85)
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(0,0,0,0.45)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, w, h)
}

function drawWebsite(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  dark: boolean,
) {
  if (dark) drawWebsiteDark(ctx, w, h, time)
  else drawWebsiteLight(ctx, w, h, time)
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function drawCode(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  lines: CodeLine[],
  scroll: number,
  blink: boolean,
  fontSize: number,
) {
  ctx.fillStyle = '#1a1b26'
  ctx.fillRect(0, 0, w, h)

  const lineH = fontSize + 8
  const blockH = lines.length * lineH
  const offset = scroll % blockH
  ctx.font = `${fontSize}px "JetBrains Mono", monospace`

  let y = 16 - offset
  for (let pass = 0; pass < 2; pass++) {
    lines.forEach((line) => {
      if (y > -lineH && y < h + lineH) {
        let x = 14
        line.parts.forEach((part) => {
          ctx.fillStyle = part.c
          ctx.fillText(part.t, x, y)
          x += ctx.measureText(part.t).width
        })
      }
      y += lineH
    })
    y = 16 - offset + blockH
  }

  if (blink) {
    const cursorY = h - 24
    ctx.fillStyle = '#5eead4'
    ctx.fillRect(14, cursorY, 8, fontSize)
  }
}

function createCurvedScreenGeometry(width: number, height: number, arc: number, inset = 0.018) {
  const segments = 48
  const radius = width / arc
  const innerR = radius - inset
  const geo = new THREE.PlaneGeometry(width, height, segments, 1)
  const pos = geo.attributes.position
  const halfW = width / 2

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const angle = (x / halfW) * (arc / 2)
    pos.setX(i, Math.sin(angle) * innerR)
    pos.setZ(i, Math.cos(angle) * innerR)
    pos.setY(i, y)
  }

  geo.computeVertexNormals()
  return { geometry: geo, innerR }
}

type CodeScreenProps = {
  width?: number
  height?: number
  variant?: 'main' | 'side'
  scrollSpeed?: number
  curved?: boolean
  curveArc?: number
}

export function CodeScreen({
  width = 0.52,
  height = 0.39,
  variant = 'main',
  scrollSpeed = 12,
  curved = false,
  curveArc = 0.48,
}: CodeScreenProps) {
  const { showSideWebsite } = useDeskInteraction()
  const { isDark } = useTheme()
  const showWebsite = variant === 'side' && showSideWebsite
  const lines = variant === 'main' ? CODE_MAIN : CODE_SIDE
  const isPortrait = height > width
  const fontSize = variant === 'main' ? 15 : isPortrait ? 12 : 13
  const canvasW = isPortrait ? 450 : 800
  const canvasH = isPortrait ? 800 : 450

  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = canvasW
    c.height = canvasH
    return c
  }, [canvasW, canvasH])

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.generateMipmaps = false
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [canvas])

  const screenGeometry = useMemo(() => {
    if (!curved) return null
    return createCurvedScreenGeometry(width, height, curveArc)
  }, [curved, width, height, curveArc])

  const scroll = useRef(0)
  const blink = useRef(true)

  useEffect(() => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (showWebsite) {
      drawWebsite(ctx, canvas.width, canvas.height, 0, isDark)
    } else {
      drawCode(ctx, canvas.width, canvas.height, lines, scroll.current, true, fontSize)
    }
    texture.needsUpdate = true
  }, [canvas, lines, fontSize, texture, showWebsite, isDark])

  useFrame(({ clock }, delta) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (showWebsite) {
      drawWebsite(ctx, canvas.width, canvas.height, clock.elapsedTime, isDark)
      texture.needsUpdate = true
      return
    }

    scroll.current += delta * scrollSpeed
    blink.current = Math.sin(performance.now() * 0.006) > 0
    drawCode(ctx, canvas.width, canvas.height, lines, scroll.current, blink.current, fontSize)
    texture.needsUpdate = true
  })

  const screenMat = <meshBasicMaterial map={texture} toneMapped={false} />

  if (curved && screenGeometry) {
    return (
      <mesh position={[0, 0, 0.016]} renderOrder={3} geometry={screenGeometry.geometry}>
        {screenMat}
      </mesh>
    )
  }

  return (
    <mesh position={[0, 0, 0.014]} renderOrder={3}>
      <planeGeometry args={[width, height]} />
      {screenMat}
    </mesh>
  )
}
