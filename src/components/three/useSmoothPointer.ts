import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Pointer = { x: number; y: number }

export function useSmoothPointer(source: React.MutableRefObject<Pointer>, damping = 5) {
  const smooth = useRef<Pointer>({ x: 0, y: 0 })

  useFrame((_, delta) => {
    smooth.current.x = THREE.MathUtils.damp(smooth.current.x, source.current.x, damping, delta)
    smooth.current.y = THREE.MathUtils.damp(smooth.current.y, source.current.y, damping, delta)
  })

  return smooth
}
