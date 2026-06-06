import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import type { PortfolioScroll } from '../../hooks/usePortfolioScroll'
import { AVATAR_POS } from './DeskSetup'
import { dampBlend, easeInOutCubic } from './motion'
import { getExitPosition } from './exitPath'
import { ABOUT_REVEAL, getExitProgress } from './scrollProgress'
import { useSmoothPointer } from './useSmoothPointer'

export const CHARACTER_X = 1.65

const MESHY = '/models/Meshy_AI_Chibi_Gentleman_in_Wh_biped'
const DANCE_URL = `${MESHY}/Meshy_AI_Chibi_Gentleman_in_Wh_biped_Animation_Boom_Dance_withSkin.glb`
const CASUAL_URL = `${MESHY}/Meshy_AI_Chibi_Gentleman_in_Wh_biped_Animation_Casual_Walk_withSkin.glb`
const WALK_URL = `${MESHY}/Meshy_AI_Chibi_Gentleman_in_Wh_biped_Animation_Walking_withSkin.glb`

const TARGET_HEIGHT = 1.22
const MODEL_SCALE = TARGET_HEIGHT / 1.7
const CODING_POSE_TIME = 0.35

const WAVE_ROT_Y = 0.85
const CODING_ROT_Y = Math.PI
const WALK_ROT_Y = -Math.PI / 2
const WALK_FACE_RIGHT = WALK_ROT_Y + Math.PI
const WALK_FACE_LEFT = WALK_ROT_Y
const DANCE_DURATION = 1.6
const TURN_DURATION = 0.7
const DOOR_VANISH_AT = 0.76

const DESK_END = 0.08

type AvatarModelProps = {
  mouse: React.MutableRefObject<{ x: number; y: number }>
  introReady: boolean
  scroll: React.MutableRefObject<PortfolioScroll>
}

type IntroPhase = 'waiting' | 'wave' | 'turn' | 'coding'
type BlendKey = 'dance' | 'casual' | 'walk'
type BlendWeights = Record<BlendKey, number>

function fitModel(root: THREE.Object3D) {
  root.scale.setScalar(MODEL_SCALE)
  root.position.set(0, 0, 0)
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })
}

function setLayerOpaque(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return
    const mesh = child as THREE.Mesh
    const raw = mesh.material
    const mats = (Array.isArray(raw) ? raw : [raw]) as THREE.Material[]
    mats.forEach((mat) => {
      if (!(mat instanceof THREE.MeshStandardMaterial)) return
      mat.transparent = false
      mat.opacity = 1
      mat.depthWrite = true
    })
  })
}

function pickActiveLayer(blend: BlendWeights): BlendKey {
  let active: BlendKey = 'dance'
  let max = -1
  ;(['dance', 'casual', 'walk'] as BlendKey[]).forEach((key) => {
    if (blend[key] > max) {
      max = blend[key]
      active = key
    }
  })
  return active
}

type MeshyLayerProps = {
  url: string
  blendKey: BlendKey
  activeLayerRef: React.MutableRefObject<BlendKey>
  loop?: boolean
  timeScaleRef: React.MutableRefObject<number>
  poseTimeRef?: React.MutableRefObject<number | null>
}

function MeshyLayer({
  url,
  blendKey,
  activeLayerRef,
  loop = true,
  timeScaleRef,
  poseTimeRef,
}: MeshyLayerProps) {
  const root = useRef<THREE.Group>(null)
  const gltf = useGLTF(url)
  const clone = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene])
  const { actions, names } = useAnimations(gltf.animations, root)
  const playing = useRef(false)
  const clipName = names[0]

  useLayoutEffect(() => {
    fitModel(clone)
  }, [clone])

  useFrame((_, delta) => {
    if (!root.current) return

    const isActive = activeLayerRef.current === blendKey
    root.current.visible = isActive
    if (isActive) setLayerOpaque(root.current)

    const action = clipName ? actions[clipName] : undefined
    if (!action) return

    if (!isActive) {
      if (playing.current) {
        action.fadeOut(0.35)
        playing.current = false
      }
      return
    }

    const timeScale = timeScaleRef.current
    const frozen = Math.abs(timeScale) < 0.02

    if (!playing.current) {
      action.reset()
      action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity)
      action.clampWhenFinished = false
      action.setEffectiveWeight(1)
      action.enabled = true
      action.fadeIn(0.4)
      action.play()
      playing.current = true
    } else if (!action.isRunning()) {
      action.play()
    }

    if (frozen) {
      action.paused = true
      if (poseTimeRef?.current != null) {
        action.time = poseTimeRef.current
      }
      return
    }

    action.paused = false
    action.timeScale = THREE.MathUtils.damp(action.timeScale, timeScale, 6, delta)
  })

  return (
    <group ref={root}>
      <primitive object={clone} />
    </group>
  )
}

export function AvatarModel({ mouse, introReady, scroll }: AvatarModelProps) {
  const rig = useRef<THREE.Group>(null)
  const phase = useRef<IntroPhase>('waiting')
  const phaseStart = useRef(0)
  const smooth = useSmoothPointer(mouse, 5)
  const smoothHero = useRef(0)
  const blend = useRef<BlendWeights>({ dance: 1, casual: 0, walk: 0 })
  const activeLayer = useRef<BlendKey>('dance')
  const turnProgress = useRef(0)
  const danceTimeScale = useRef(1.05)
  const casualTimeScale = useRef(0)
  const walkTimeScale = useRef(1.5)
  const codingPoseTime = useRef(CODING_POSE_TIME)
  const prevExitProgress = useRef(0)
  const walkFacing = useRef<'right' | 'left'>('right')

  const homeX = AVATAR_POS[0]
  const homeZ = AVATAR_POS[2]

  useEffect(() => {
    if (!introReady) return
    phase.current = 'wave'
    phaseStart.current = performance.now()
    turnProgress.current = 0
    blend.current = { dance: 1, casual: 0, walk: 0 }
  }, [introReady])

  useFrame((_, delta) => {
    if (!rig.current) return

    smoothHero.current = dampBlend(smoothHero.current, scroll.current.hero, 2.2, delta)
    const hero = smoothHero.current
    const now = performance.now()
    const elapsed = (now - phaseStart.current) / 1000
    const mx = smooth.current.x
    const my = smooth.current.y

    let targetBlend: BlendWeights = { dance: 0, casual: 1, walk: 0 }

    if (hero >= DESK_END) {
      const about = scroll.current.about
      const exitProgress = getExitProgress(hero, about)
      const isExitPhase = exitProgress > 0.001
      const exitDelta = exitProgress - prevExitProgress.current
      if (exitDelta > 0.0004) walkFacing.current = 'right'
      else if (exitDelta < -0.0004) walkFacing.current = 'left'
      prevExitProgress.current = exitProgress

      if (isExitPhase) {
        const walkRot = walkFacing.current === 'left' ? WALK_FACE_LEFT : WALK_FACE_RIGHT

        targetBlend = { dance: 0, casual: 0, walk: 1 }
        casualTimeScale.current = 0
        walkTimeScale.current = 1.4

        rig.current.visible = exitProgress < DOOR_VANISH_AT
        rig.current.rotation.y = dampBlend(rig.current.rotation.y, walkRot, 6, delta)
        rig.current.rotation.x = dampBlend(rig.current.rotation.x, 0, 4, delta)
        const exitPos = getExitPosition(exitProgress, homeX, homeZ)
        rig.current.position.x = dampBlend(rig.current.position.x, exitPos.x, 5.5, delta)
        rig.current.position.y = 0
        rig.current.position.z = dampBlend(rig.current.position.z, exitPos.z, 5.5, delta)
      } else {
        targetBlend = { dance: 0, casual: 1, walk: 0 }
        casualTimeScale.current = 0
        walkTimeScale.current = 0

        rig.current.visible = true
        rig.current.rotation.y = dampBlend(
          rig.current.rotation.y,
          CODING_ROT_Y + mx * 0.08,
          4,
          delta,
        )
        rig.current.rotation.x = dampBlend(rig.current.rotation.x, 0.03 + my * 0.01, 4, delta)
        rig.current.rotation.z = dampBlend(rig.current.rotation.z, 0, 4, delta)
        rig.current.position.x = dampBlend(rig.current.position.x, homeX, 4, delta)
        rig.current.position.y = dampBlend(rig.current.position.y, 0, 4, delta)
        rig.current.position.z = dampBlend(rig.current.position.z, homeZ, 4, delta)
      }

      if (hero < ABOUT_REVEAL) {
        prevExitProgress.current = 0
      }
    } else if (phase.current === 'waiting') {
      rig.current.visible = true
      targetBlend = { dance: 1, casual: 0, walk: 0 }
      danceTimeScale.current = 1.05
      rig.current.rotation.y = dampBlend(rig.current.rotation.y, WAVE_ROT_Y, 3.5, delta)
      rig.current.rotation.x = dampBlend(rig.current.rotation.x, 0, 5, delta)
      rig.current.rotation.z = dampBlend(rig.current.rotation.z, 0, 5, delta)
      rig.current.position.y = 0
    } else if (phase.current === 'wave') {
      rig.current.visible = true
      targetBlend = { dance: 1, casual: 0, walk: 0 }
      danceTimeScale.current = 1.05
      rig.current.rotation.y = dampBlend(
        rig.current.rotation.y,
        WAVE_ROT_Y + mx * 0.1,
        5,
        delta,
      )
      rig.current.rotation.x = dampBlend(rig.current.rotation.x, 0, 5, delta)
      rig.current.rotation.z = dampBlend(rig.current.rotation.z, 0, 5, delta)
      rig.current.position.y = 0

      if (elapsed > DANCE_DURATION) {
        phase.current = 'turn'
        phaseStart.current = now
        turnProgress.current = 0
      }
    } else if (phase.current === 'turn') {
      rig.current.visible = true
      const raw = Math.min(1, elapsed / TURN_DURATION)
      turnProgress.current = dampBlend(turnProgress.current, raw, 8, delta)
      const eased = easeInOutCubic(turnProgress.current)

      targetBlend =
        turnProgress.current > 0.62
          ? { dance: 0, casual: 1, walk: 0 }
          : { dance: 1, casual: 0, walk: 0 }
      danceTimeScale.current = 0.35
      casualTimeScale.current = 0

      rig.current.rotation.y = dampBlend(
        rig.current.rotation.y,
        THREE.MathUtils.lerp(WAVE_ROT_Y, CODING_ROT_Y, eased),
        6,
        delta,
      )
      rig.current.rotation.x = dampBlend(rig.current.rotation.x, 0, 5, delta)
      rig.current.rotation.z = dampBlend(rig.current.rotation.z, 0, 5, delta)

      if (turnProgress.current >= 0.99) {
        phase.current = 'coding'
      }
    } else {
      rig.current.visible = true
      targetBlend = { dance: 0, casual: 1, walk: 0 }
      casualTimeScale.current = 0
      rig.current.rotation.y = dampBlend(
        rig.current.rotation.y,
        CODING_ROT_Y + mx * 0.1,
        4,
        delta,
      )
      rig.current.rotation.x = dampBlend(rig.current.rotation.x, 0.03 + my * 0.01, 4, delta)
      rig.current.rotation.z = dampBlend(rig.current.rotation.z, 0, 4, delta)
      rig.current.position.x = dampBlend(rig.current.position.x, homeX, 4, delta)
      rig.current.position.y = dampBlend(rig.current.position.y, 0, 4, delta)
      rig.current.position.z = dampBlend(rig.current.position.z, homeZ, 4, delta)
    }

    blend.current.dance = dampBlend(blend.current.dance, targetBlend.dance, 8, delta)
    blend.current.casual = dampBlend(blend.current.casual, targetBlend.casual, 8, delta)
    blend.current.walk = dampBlend(blend.current.walk, targetBlend.walk, 8, delta)
    activeLayer.current = pickActiveLayer(blend.current)
  })

  return (
    <group ref={rig} position={[homeX, 0, homeZ]} rotation={[0, WAVE_ROT_Y, 0]}>
      <MeshyLayer
        url={DANCE_URL}
        blendKey="dance"
        activeLayerRef={activeLayer}
        loop
        timeScaleRef={danceTimeScale}
      />
      <MeshyLayer
        url={CASUAL_URL}
        blendKey="casual"
        activeLayerRef={activeLayer}
        loop
        timeScaleRef={casualTimeScale}
        poseTimeRef={codingPoseTime}
      />
      <MeshyLayer
        url={WALK_URL}
        blendKey="walk"
        activeLayerRef={activeLayer}
        loop
        timeScaleRef={walkTimeScale}
      />
    </group>
  )
}

useGLTF.preload(DANCE_URL)
useGLTF.preload(CASUAL_URL)
useGLTF.preload(WALK_URL)
