import { Suspense, useCallback, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import * as THREE from 'three'
import { LoadingDancer } from './LoadingDancer'
import './LoadingScene.scss'

const SCENE_BG = '#0f1218'

type ProgressBridgeProps = {
  onAssetProgress: (value: number) => void
}

function ProgressBridge({ onAssetProgress }: ProgressBridgeProps) {
  const { progress, active, loaded, total } = useProgress()
  const last = useRef(0)

  useEffect(() => {
    let next = last.current

    if (active) {
      next = Math.max(last.current, progress)
    } else if (total > 0 && loaded >= total) {
      next = 100
    } else if (!active && progress >= 99) {
      next = 100
    }

    if (next > last.current) {
      last.current = next
      onAssetProgress(next)
    }
  }, [progress, active, loaded, total, onAssetProgress])

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (last.current < 99) {
        last.current = 100
        onAssetProgress(100)
      }
    }, 1600)
    return () => window.clearTimeout(id)
  }, [onAssetProgress])

  return null
}

type LoadingSceneProps = {
  onAssetProgress: (value: number) => void
  onDancerReady: () => void
}

function DancerWithReady({ onReady }: { onReady: () => void }) {
  const called = useRef(false)
  const handleReady = useCallback(() => {
    if (called.current) return
    called.current = true
    onReady()
  }, [onReady])

  return <LoadingDancer onReady={handleReady} />
}

export function LoadingScene({ onAssetProgress, onDancerReady }: LoadingSceneProps) {
  return (
    <div className="loading-scene">
      <Canvas
        shadows
        frameloop="always"
        camera={{ position: [0, 0.82, 3.55], fov: 32, near: 0.1, far: 30 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(SCENE_BG)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          scene.background = new THREE.Color(SCENE_BG)
        }}
      >
        <Suspense fallback={null}>
          <DancerWithReady onReady={onDancerReady} />
        </Suspense>
        <ProgressBridge onAssetProgress={onAssetProgress} />
      </Canvas>
    </div>
  )
}
