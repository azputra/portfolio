import { useEffect, useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = 'https://threejs.org/examples/models/gltf/Michelle.glb'
const TARGET_HEIGHT = 1.85
export const CHARACTER_X = 2.1

type CharacterProps = {
  mouse: React.MutableRefObject<{ x: number; y: number }>
}

export function Character({ mouse }: CharacterProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODEL_URL)
  const { actions } = useAnimations(animations, group)

  useLayoutEffect(() => {
    if (!group.current) return

    const box = new THREE.Box3().setFromObject(group.current)
    const size = box.getSize(new THREE.Vector3())
    const scale = TARGET_HEIGHT / size.y

    group.current.scale.setScalar(scale)
    group.current.position.set(
      CHARACTER_X,
      -box.min.y * scale,
      0,
    )

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    const clipName = animations[0]?.name
    const action = clipName ? actions[clipName] : Object.values(actions)[0]
    action?.reset().fadeIn(0.4).play()
  }, [actions, animations])

  useFrame((_, delta) => {
    if (!group.current) return

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.current.x * 0.45,
      delta * 3,
    )
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
