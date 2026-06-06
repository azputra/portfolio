import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneHover } from '../../context/SceneHoverContext'
import { PlantWaterDrips } from './PlantWaterDrips'

const POT_WHITE = '#f4f4ef'
const POT_BODY = '#a39688'
const SOIL = '#4a3528'
const SOIL_WET = '#3a2a1e'
const LEAF = '#b8d45a'
const LEAF_DARK = '#8fb83a'
const STEM = '#6a8f3c'

/** Lantai kanan meja, dekat dinding belakang */
const FLOOR_POS: [number, number, number] = [2.22, 0.008, -0.5]
const FLOOR_ROT_Y = -0.55
const INITIAL_GROWTH = 0.04
const FULL_GROWTH = 1

const potWhiteMat = { color: POT_WHITE, roughness: 0.48, flatShading: true }
const potBodyMat = { color: POT_BODY, roughness: 0.55, flatShading: true }
const stemMat = { color: STEM, roughness: 0.7, flatShading: true }

function createLeafGeometry(width: number, height: number) {
  const shape = new THREE.Shape()
  const w = width / 2
  const h = height

  shape.moveTo(0, 0)
  shape.bezierCurveTo(w * 1.15, h * 0.28, w * 0.95, h * 0.78, 0, h)
  shape.bezierCurveTo(-w * 0.95, h * 0.78, -w * 1.15, h * 0.28, 0, 0)

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
  })
  geo.translate(0, -height / 2, -0.0175)
  return geo
}

type LeafProps = {
  width?: number
  height?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  stemHeight?: number
  stemTilt?: [number, number, number]
}

function PlantLeaf({
  width = 0.26,
  height = 0.48,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  stemHeight = 0.12,
  stemTilt = [0.12, 0, 0],
}: LeafProps) {
  const leafGeo = useMemo(() => createLeafGeometry(width, height), [width, height])

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, stemHeight / 2, 0]} rotation={stemTilt} castShadow>
        <cylinderGeometry args={[0.014, 0.018, stemHeight, 6]} />
        <meshStandardMaterial {...stemMat} />
      </mesh>

      <group position={[0, stemHeight, 0]} rotation={stemTilt}>
        <mesh geometry={leafGeo} castShadow>
          <meshStandardMaterial color={LEAF} roughness={0.68} flatShading />
        </mesh>
        <mesh position={[0, height * 0.08, 0.02]} castShadow>
          <boxGeometry args={[0.01, height * 0.82, 0.005]} />
          <meshStandardMaterial color={LEAF_DARK} roughness={0.72} flatShading />
        </mesh>
      </group>
    </group>
  )
}

function TieredPot({ soilMatRef }: { soilMatRef: RefObject<THREE.MeshStandardMaterial | null> }) {
  return (
    <group>
      <mesh position={[0, 0.028, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.155, 0.056, 16]} />
        <meshStandardMaterial {...potWhiteMat} />
      </mesh>

      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.175, 0.13, 0.2, 16]} />
        <meshStandardMaterial {...potBodyMat} />
      </mesh>

      <mesh position={[0, 0.278, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.175, 0.052, 16]} />
        <meshStandardMaterial {...potWhiteMat} />
      </mesh>

      <mesh position={[0, 0.302, 0]} receiveShadow>
        <cylinderGeometry args={[0.165, 0.165, 0.018, 16]} />
        <meshStandardMaterial ref={soilMatRef} color={SOIL} roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

const LEAVES: LeafProps[] = [
  {
    height: 0.52,
    width: 0.28,
    position: [0, 0.06, -0.02],
    rotation: [-0.18, 0, 0],
    stemHeight: 0.14,
    stemTilt: [0.05, 0, 0],
  },
  {
    height: 0.46,
    width: 0.25,
    position: [-0.06, 0.04, 0.04],
    rotation: [-0.1, -0.42, -0.12],
    stemHeight: 0.1,
    stemTilt: [0.22, -0.08, 0],
  },
  {
    height: 0.46,
    width: 0.25,
    position: [0.06, 0.04, 0.04],
    rotation: [-0.1, 0.42, 0.12],
    stemHeight: 0.1,
    stemTilt: [0.22, 0.08, 0],
  },
  {
    height: 0.32,
    width: 0.18,
    position: [-0.1, 0.02, 0.08],
    rotation: [0.08, -0.65, -0.2],
    stemHeight: 0.07,
    stemTilt: [0.35, -0.12, 0],
  },
  {
    height: 0.32,
    width: 0.18,
    position: [0.1, 0.02, 0.08],
    rotation: [0.08, 0.65, 0.2],
    stemHeight: 0.07,
    stemTilt: [0.35, 0.12, 0],
  },
]

function leafGrowthThreshold(index: number) {
  return 0.16 + index * 0.13
}

type Phase = 'idle' | 'watering' | 'growing' | 'full'

export function FlowerVase() {
  const foliage = useRef<THREE.Group>(null)
  const leafRefs = useRef<(THREE.Group | null)[]>([])
  const mainStem = useRef<THREE.Mesh>(null)
  const soilMat = useRef<THREE.MeshStandardMaterial>(null)
  const growth = useRef(INITIAL_GROWTH)
  const targetGrowth = useRef(INITIAL_GROWTH)
  const wobble = useRef(0)
  const swayBoost = useRef(0)
  const phase = useRef<Phase>('idle')
  const soilWet = useRef(0)
  const drySoil = useRef(new THREE.Color(SOIL))
  const wetSoil = useRef(new THREE.Color(SOIL_WET))
  const [watering, setWatering] = useState(false)
  const { pointerEnter, pointerLeave } = useSceneHover()

  const resetPlant = () => {
    growth.current = INITIAL_GROWTH
    targetGrowth.current = INITIAL_GROWTH
    phase.current = 'idle'
    soilWet.current = 0
    leafRefs.current.forEach((leaf) => {
      if (!leaf) return
      leaf.scale.setScalar(0.01)
      leaf.visible = false
    })
    if (mainStem.current) {
      mainStem.current.scale.y = 0.15
      mainStem.current.position.y = 0.006
    }
    if (soilMat.current) {
      soilMat.current.color.set(SOIL)
    }
  }

  const isMature = () =>
    phase.current === 'full' || growth.current >= FULL_GROWTH - 0.05

  const startWatering = () => {
    if (phase.current === 'watering') return

    phase.current = 'watering'
    setWatering(true)
    wobble.current = 1.1

    if (isMature()) {
      swayBoost.current = 2
      return
    }

    swayBoost.current = 0.4
  }

  const onWaterComplete = () => {
    setWatering(false)
    wobble.current = 1
    swayBoost.current = Math.max(swayBoost.current, 1.4)

    if (isMature()) {
      phase.current = 'full'
      targetGrowth.current = FULL_GROWTH
      return
    }

    phase.current = 'growing'
    targetGrowth.current = FULL_GROWTH
  }

  useLayoutEffect(() => {
    resetPlant()
  }, [])

  useFrame(({ clock }, delta) => {
    growth.current = THREE.MathUtils.damp(growth.current, targetGrowth.current, 3.2, delta)
    wobble.current = THREE.MathUtils.damp(wobble.current, 0, 5, delta)
    swayBoost.current = THREE.MathUtils.damp(swayBoost.current, 0, 2.2, delta)

    if (phase.current === 'watering') {
      soilWet.current = THREE.MathUtils.damp(soilWet.current, 1, 4, delta)
    } else {
      soilWet.current = THREE.MathUtils.damp(soilWet.current, 0, 1.5, delta)
    }

    if (soilMat.current) {
      soilMat.current.color.copy(drySoil.current).lerp(wetSoil.current, soilWet.current)
    }

    const g = growth.current
    const stemScale = 0.12 + g * 0.88

    if (mainStem.current) {
      mainStem.current.scale.y = stemScale
      mainStem.current.position.y = (0.08 * stemScale) / 2
    }

    leafRefs.current.forEach((leaf, i) => {
      if (!leaf) return
      const threshold = leafGrowthThreshold(i)
      const leafG = THREE.MathUtils.smoothstep(g, threshold, threshold + 0.2)
      const s = 0.1 + leafG * 0.9
      leaf.scale.set(s, s, s)
      leaf.visible = leafG > 0.02
    })

    if (foliage.current) {
      const swayAmp = (0.01 + swayBoost.current * 0.06) * Math.max(g, 0.25)
      const swaySpeed = 1.5 + swayBoost.current * 0.7
      const sway = Math.sin(clock.elapsedTime * swaySpeed) * swayAmp
      const swayX = Math.sin(clock.elapsedTime * swaySpeed * 0.85 + 0.6) * swayAmp * 0.55
      foliage.current.rotation.z = sway + wobble.current * 0.06
      foliage.current.rotation.x = swayX + wobble.current * 0.04
    }

    if (phase.current === 'growing' && g >= FULL_GROWTH - 0.02) {
      phase.current = 'full'
    }
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    startWatering()
  }

  return (
    <group position={FLOOR_POS} rotation={[0, FLOOR_ROT_Y, 0]}>
      <TieredPot soilMatRef={soilMat} />

      <PlantWaterDrips active={watering} onComplete={onWaterComplete} />

      <group position={[0, 0.31, 0]}>
        <mesh ref={mainStem} position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.028, 0.08, 6]} />
          <meshStandardMaterial {...stemMat} />
        </mesh>

        <group ref={foliage}>
          {LEAVES.map((leaf, i) => (
            <group
              key={i}
              ref={(node) => {
                leafRefs.current[i] = node
              }}
            >
              <PlantLeaf {...leaf} />
            </group>
          ))}
        </group>
      </group>

      <mesh
        position={[0, 0.2, 0]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          pointerEnter()
        }}
        onPointerOut={() => pointerLeave()}
      >
        <cylinderGeometry args={[0.22, 0.2, 0.42, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
