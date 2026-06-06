import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDeskInteraction } from '../../context/DeskInteractionContext'

const SPARKLE_COLORS = ['#fff8dc', '#f0c060', '#d4af37', '#ffe9a8', '#ffffff']
const MAX_SPARKLES = 36

type Sparkle = {
  mesh: THREE.Mesh
  life: number
  maxLife: number
  velocity: THREE.Vector3
  spin: number
}

function createSparkleTexture(color: string) {
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const cx = size / 2
  const cy = size / 2
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2)
  grad.addColorStop(0, color)
  grad.addColorStop(0.35, color)
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = '#fffef5'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx, 4)
  ctx.lineTo(cx, size - 4)
  ctx.moveTo(4, cy)
  ctx.lineTo(size - 4, cy)
  ctx.stroke()

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

export function KaabaSparkles() {
  const { kaabaSparkleKey } = useDeskInteraction()
  const group = useRef<THREE.Group>(null)
  const pool = useRef<Sparkle[]>([])

  const materials = useMemo(
    () =>
      SPARKLE_COLORS.map((color) => {
        const map = createSparkleTexture(color)
        return new THREE.MeshBasicMaterial({
          map: map ?? undefined,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        })
      }),
    [],
  )

  const burst = (count: number) => {
    if (!group.current) return
    for (let i = 0; i < count; i++) {
      if (pool.current.length >= MAX_SPARKLES) break
      const mat = materials[Math.floor(Math.random() * materials.length)]
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.018, 0.018), mat)
      const angle = Math.random() * Math.PI * 2
      const speed = 0.35 + Math.random() * 0.55
      mesh.position.set(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.05,
      )
      group.current.add(mesh)
      pool.current.push({
        mesh,
        life: 0,
        maxLife: 0.9 + Math.random() * 0.7,
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed * 0.35,
          0.25 + Math.random() * 0.45,
          Math.sin(angle) * speed * 0.35,
        ),
        spin: (Math.random() - 0.5) * 8,
      })
    }
  }

  useEffect(() => {
    if (kaabaSparkleKey === 0) return
    burst(28)
  }, [kaabaSparkleKey])

  useFrame(({ camera }, delta) => {
    if (!group.current) return

    const alive: Sparkle[] = []
    for (const spark of pool.current) {
      spark.life += delta
      const t = spark.life / spark.maxLife
      if (t >= 1) {
        group.current.remove(spark.mesh)
        spark.mesh.geometry.dispose()
        continue
      }

      spark.mesh.position.addScaledVector(spark.velocity, delta)
      spark.velocity.y -= delta * 0.08
      spark.mesh.rotation.z += spark.spin * delta
      spark.mesh.lookAt(camera.position)

      const fade = t < 0.1 ? t / 0.1 : t > 0.55 ? (1 - t) / 0.45 : 1
      const scale = 0.5 + fade * 1.1
      spark.mesh.scale.setScalar(scale)
      ;(spark.mesh.material as THREE.MeshBasicMaterial).opacity = fade

      alive.push(spark)
    }
    pool.current = alive
  })

  return <group ref={group} />
}
