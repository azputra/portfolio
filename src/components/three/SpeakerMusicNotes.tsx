import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRoomAudio } from '../../context/RoomAudioContext'

const NOTE_COLORS = ['#f0b89a', '#e8a0a8', '#9ecae8', '#f5d0a8', '#b8d4f0']
const MAX_NOTES = 14

type NoteKind = 'eighth' | 'beamed' | 'quarter'

type FloatingNote = {
  mesh: THREE.Mesh
  life: number
  maxLife: number
  velocity: THREE.Vector3
  spin: number
}

function drawNote(ctx: CanvasRenderingContext2D, kind: NoteKind, color: string) {
  const w = 64
  const h = 64
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (kind === 'beamed') {
    ctx.beginPath()
    ctx.ellipse(18, 46, 9, 7, -0.35, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(34, 40, 8, 6, -0.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(40, 12, 3.5, 30)
    ctx.fillRect(24, 18, 3.5, 28)
    ctx.beginPath()
    ctx.moveTo(24, 18)
    ctx.lineTo(44, 12)
    ctx.lineTo(44, 18)
    ctx.lineTo(24, 24)
    ctx.closePath()
    ctx.fill()
  } else if (kind === 'quarter') {
    ctx.beginPath()
    ctx.ellipse(22, 48, 10, 8, -0.25, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(30, 10, 4, 38)
  } else {
    ctx.beginPath()
    ctx.ellipse(20, 46, 10, 8, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(28, 12, 4, 34)
    ctx.beginPath()
    ctx.moveTo(32, 12)
    ctx.quadraticCurveTo(46, 18, 40, 30)
    ctx.stroke()
  }
}

function createNoteTexture(kind: NoteKind, color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  drawNote(ctx, kind, color)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

const KINDS: NoteKind[] = ['eighth', 'beamed', 'quarter']

export function SpeakerMusicNotes() {
  const { isPlaying } = useRoomAudio()
  const group = useRef<THREE.Group>(null)
  const pool = useRef<FloatingNote[]>([])
  const spawnTimer = useRef(0)

  const materials = useMemo(() => {
    return NOTE_COLORS.flatMap((color) =>
      KINDS.map((kind) => {
        const map = createNoteTexture(kind, color)
        return new THREE.MeshBasicMaterial({
          map: map ?? undefined,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          toneMapped: false,
        })
      }),
    )
  }, [])

  useFrame(({ camera }, delta) => {
    if (!group.current) return

    if (isPlaying) {
      spawnTimer.current += delta
      if (spawnTimer.current > 0.38 && pool.current.length < MAX_NOTES) {
        spawnTimer.current = 0
        const mat = materials[Math.floor(Math.random() * materials.length)]
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.055, 0.055), mat)
        mesh.position.set(
          (Math.random() - 0.5) * 0.04,
          0.07 + Math.random() * 0.02,
          0.05 + Math.random() * 0.02,
        )
        mesh.rotation.z = (Math.random() - 0.5) * 0.8
        group.current.add(mesh)

        pool.current.push({
          mesh,
          life: 0,
          maxLife: 1.6 + Math.random() * 0.8,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.12,
            0.22 + Math.random() * 0.12,
            (Math.random() - 0.5) * 0.04,
          ),
          spin: (Math.random() - 0.5) * 2.2,
        })
      }
    } else {
      spawnTimer.current = 0
    }

    const alive: FloatingNote[] = []
    for (const note of pool.current) {
      note.life += delta
      const t = note.life / note.maxLife

      if (t >= 1) {
        group.current.remove(note.mesh)
        note.mesh.geometry.dispose()
        continue
      }

      note.mesh.position.addScaledVector(note.velocity, delta)
      note.mesh.rotation.z += note.spin * delta
      note.mesh.lookAt(camera.position)

      const fade = t < 0.12 ? t / 0.12 : t > 0.72 ? (1 - t) / 0.28 : 1
      const scale = 0.75 + fade * 0.45
      note.mesh.scale.setScalar(scale)
      ;(note.mesh.material as THREE.MeshBasicMaterial).opacity = fade * 0.92

      alive.push(note)
    }
    pool.current = alive
  })

  return <group ref={group} position={[0, 0, 0]} />
}
