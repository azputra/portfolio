import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'

const MESHY = '/models/Meshy_AI_Chibi_Gentleman_in_Wh_biped'
export const DANCE_URL = `${MESHY}/Meshy_AI_Chibi_Gentleman_in_Wh_biped_Animation_Boom_Dance_withSkin.glb`
export const CASUAL_URL = `${MESHY}/Meshy_AI_Chibi_Gentleman_in_Wh_biped_Animation_Casual_Walk_withSkin.glb`
export const WALK_URL = `${MESHY}/Meshy_AI_Chibi_Gentleman_in_Wh_biped_Animation_Walking_withSkin.glb`

const TARGET_HEIGHT = 1.02
const MODEL_SCALE = TARGET_HEIGHT / 1.7
const SCENE_BG = '#0f1218'
const FLOOR = '#141820'
const WALL = '#161b26'
const DANCE_SPEED = 1.05
const FACE_ROT_Y = 0.85

function fitDancer(root: THREE.Object3D) {
  root.scale.setScalar(MODEL_SCALE)
  root.position.set(0, 0, 0)
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
      const raw = mesh.material
      const mats = (Array.isArray(raw) ? raw : [raw]) as THREE.Material[]
      mats.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return
        mat.transparent = false
        mat.opacity = 1
        mat.depthWrite = true
      })
    }
  })
}

function LoadingStage() {
  const { camera } = useThree()

  useLayoutEffect(() => {
    camera.position.set(0, 0.82, 3.55)
    camera.lookAt(0, 0.62, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  return (
    <>
      <color attach="background" args={[SCENE_BG]} />
      <ambientLight intensity={0.32} color="#8aa4c8" />
      <hemisphereLight args={['#1a2438', '#0c0e14', 0.48]} />
      <directionalLight position={[2, 6, 4]} intensity={0.5} color="#8aa4c8" castShadow />
      <directionalLight position={[-2, 3, 2]} intensity={0.22} color="#5eead4" />
      <pointLight position={[0.8, 1.8, 1.6]} color="#7ec8ff" intensity={0.35} distance={5} />
      <pointLight position={[-1.2, 1.2, 2]} color="#c084fc" intensity={0.18} distance={4} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[2.2, 64]} />
        <meshStandardMaterial color={FLOOR} roughness={1} />
      </mesh>
      <mesh position={[0, 1.3, -2.8]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
    </>
  )
}

type LoadingDancerProps = {
  onReady?: () => void
}

export function LoadingDancer({ onReady }: LoadingDancerProps) {
  const rig = useRef<THREE.Group>(null)
  const gltf = useGLTF(DANCE_URL)
  const clone = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene])
  const { actions, names } = useAnimations(gltf.animations, rig)
  const actionRef = useRef<THREE.AnimationAction | null>(null)
  const playing = useRef(false)
  const readySent = useRef(false)

  useLayoutEffect(() => {
    fitDancer(clone)
  }, [clone])

  useEffect(() => {
    const clip = names[0]
    const action = clip ? actions[clip] : undefined
    if (!action) return

    actionRef.current = action
    action.reset()
    action.setLoop(THREE.LoopRepeat, Infinity)
    action.clampWhenFinished = false
    action.setEffectiveWeight(1)
    action.enabled = true
    action.timeScale = 0
    action.fadeIn(0.65)
    action.play()
    playing.current = true

    if (!readySent.current) {
      readySent.current = true
      onReady?.()
    }

    return () => {
      action.fadeOut(0.3)
      playing.current = false
    }
  }, [actions, names, onReady])

  useFrame((_, delta) => {
    const action = actionRef.current
    if (action && playing.current) {
      action.timeScale = THREE.MathUtils.damp(action.timeScale, DANCE_SPEED, 3.2, delta)
    }
  })

  return (
    <>
      <LoadingStage />
      <group ref={rig} position={[0, 0, 0]} rotation={[0, FACE_ROT_Y, 0]}>
        <primitive object={clone} />
      </group>
    </>
  )
}

useGLTF.preload(DANCE_URL)
useGLTF.preload(CASUAL_URL)
useGLTF.preload(WALK_URL)
