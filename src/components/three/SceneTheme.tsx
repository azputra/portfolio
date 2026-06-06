import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'
import { SCENE_PALETTES } from '../../theme/scenePalette'

export function SceneTheme() {
  const { theme } = useTheme()
  const { scene } = useThree()
  const ambient = useRef<THREE.AmbientLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const dir = useRef<THREE.DirectionalLight>(null)
  const palette = SCENE_PALETTES[theme]
  const bg = useRef(new THREE.Color(palette.bg))
  const targetBg = useRef(palette.bg)

  useEffect(() => {
    targetBg.current = palette.bg
  }, [palette.bg])

  useFrame((_, delta) => {
    bg.current.lerp(new THREE.Color(targetBg.current), Math.min(1, delta * 4))
    scene.background = bg.current
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(bg.current)
    }

    if (ambient.current) {
      ambient.current.intensity = THREE.MathUtils.damp(
        ambient.current.intensity,
        palette.ambient,
        6,
        delta,
      )
    }

    if (hemi.current) {
      hemi.current.intensity = THREE.MathUtils.damp(
        hemi.current.intensity,
        palette.hemisphereIntensity,
        6,
        delta,
      )
    }

    if (dir.current) {
      dir.current.intensity = THREE.MathUtils.damp(
        dir.current.intensity,
        palette.directional,
        6,
        delta,
      )
    }
  })

  return (
    <>
      <ambientLight ref={ambient} intensity={palette.ambient} color="#fff8f0" />
      <hemisphereLight
        ref={hemi}
        args={[palette.hemisphereSky, palette.hemisphereGround, palette.hemisphereIntensity]}
      />
      <directionalLight
        ref={dir}
        position={[5, 10, 6]}
        intensity={palette.directional}
        color={palette.directionalColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 3, 2]} intensity={0.3} color="#c8d8ff" />
      <fog attach="fog" args={[palette.bg, palette.fogNear, palette.fogFar]} />
    </>
  )
}
