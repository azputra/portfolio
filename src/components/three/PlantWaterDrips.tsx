import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const WATER_COLOR = '#7ed4ff'
const WATER_HIGHLIGHT = '#d4f4ff'
const SPLASH_COLOR = '#a8e4ff'
const CAN_BODY = '#6faa3a'
const CAN_DARK = '#4d7a28'
const CAN_TRIM = '#e8e2d8'

const DRIP_COUNT = 22
const WATER_DURATION = 1.45
const SPAWN_INTERVAL = 0.065
const SOIL_Y = 0.305
const GRAVITY = 2.1

type Drip = {
  mesh: THREE.Mesh
  active: boolean
  pos: THREE.Vector3
  vel: THREE.Vector3
}

type Splash = {
  mesh: THREE.Mesh
  life: number
  maxLife: number
}

function createTeardropGeometry() {
  const points = [
    new THREE.Vector2(0.0008, 0),
    new THREE.Vector2(0.0045, 0.008),
    new THREE.Vector2(0.0075, 0.016),
    new THREE.Vector2(0.007, 0.024),
    new THREE.Vector2(0.0035, 0.031),
    new THREE.Vector2(0.001, 0.034),
  ]
  const geo = new THREE.LatheGeometry(points, 10)
  geo.rotateX(Math.PI)
  return geo
}

/** Titik lubang pada rose — tetesan keluar dari sini */
const ROSE_HOLES: [number, number][] = [
  [0, 0],
  [0.006, 0.002],
  [-0.005, -0.002],
  [0.002, -0.005],
  [-0.003, 0.004],
]

type PlantWaterDripsProps = {
  active: boolean
  onComplete: () => void
}

export function PlantWaterDrips({ active, onComplete }: PlantWaterDripsProps) {
  const root = useRef<THREE.Group>(null)
  const canGroup = useRef<THREE.Group>(null)
  const spoutTip = useRef<THREE.Group>(null)
  const drips = useRef<Drip[]>([])
  const splashes = useRef<Splash[]>([])
  const elapsed = useRef(0)
  const spawnAcc = useRef(0)
  const spawnIndex = useRef(0)
  const finished = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const baseCanRot = useRef(new THREE.Euler(0.1, 0.42, -0.04))

  const _pourDir = useRef(new THREE.Vector3())
  const _holeLocal = useRef(new THREE.Vector3())
  const _spoutQuat = useRef(new THREE.Quaternion())
  const _rootQuat = useRef(new THREE.Quaternion())
  const _invRootQuat = useRef(new THREE.Quaternion())

  onCompleteRef.current = onComplete

  const teardropGeo = useMemo(() => createTeardropGeometry(), [])

  const dropMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: WATER_COLOR,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  )

  const splashMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: SPLASH_COLOR,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  )

  useEffect(() => {
    if (!root.current) return

    drips.current = Array.from({ length: DRIP_COUNT }, () => {
      const mesh = new THREE.Mesh(teardropGeo, dropMat.clone())
      mesh.visible = false
      mesh.renderOrder = 3
      root.current!.add(mesh)
      return {
        mesh,
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
      }
    })

    splashes.current = Array.from({ length: 12 }, () => {
      const mesh = new THREE.Mesh(new THREE.RingGeometry(0.003, 0.012, 10), splashMat.clone())
      mesh.rotation.x = -Math.PI / 2
      mesh.visible = false
      mesh.renderOrder = 2
      root.current!.add(mesh)
      return { mesh, life: 0, maxLife: 0.32 }
    })

    return () => {
      drips.current.forEach((d) => {
        root.current?.remove(d.mesh)
        ;(d.mesh.material as THREE.Material).dispose()
      })
      splashes.current.forEach((s) => {
        root.current?.remove(s.mesh)
        s.mesh.geometry.dispose()
        ;(s.mesh.material as THREE.Material).dispose()
      })
      drips.current = []
      splashes.current = []
    }
  }, [dropMat, splashMat, teardropGeo])

  useEffect(() => {
    if (!active) return

    elapsed.current = 0
    spawnAcc.current = 0
    spawnIndex.current = 0
    finished.current = false

    drips.current.forEach((d) => {
      d.active = false
      d.mesh.visible = false
    })
    splashes.current.forEach((s) => {
      s.life = 0
      s.mesh.visible = false
    })

    if (canGroup.current) {
      canGroup.current.visible = true
      canGroup.current.scale.setScalar(0.01)
    }
  }, [active])

  const worldDirToLocal = (dir: THREE.Vector3) => {
    if (!root.current) return dir
    root.current.getWorldQuaternion(_rootQuat.current)
    _invRootQuat.current.copy(_rootQuat.current).invert()
    return dir.applyQuaternion(_invRootQuat.current)
  }

  const spawnDrip = (holeIndex = 0) => {
    const drip = drips.current[spawnIndex.current % DRIP_COUNT]
    spawnIndex.current += 1
    if (!drip || !spoutTip.current || !root.current) return

    const hole = ROSE_HOLES[holeIndex % ROSE_HOLES.length]
    _holeLocal.current.set(hole[0], hole[1], 0)
    spoutTip.current.localToWorld(_holeLocal.current)
    root.current.worldToLocal(_holeLocal.current)
    drip.pos.copy(_holeLocal.current)

    spoutTip.current.getWorldQuaternion(_spoutQuat.current)
    _pourDir.current.set(0, -1, 0).applyQuaternion(_spoutQuat.current).normalize()
    worldDirToLocal(_pourDir.current)
    drip.vel
      .copy(_pourDir.current)
      .multiplyScalar(0.28 + Math.random() * 0.14)
    drip.vel.x += (Math.random() - 0.5) * 0.025
    drip.vel.z += (Math.random() - 0.5) * 0.025

    drip.active = true
    drip.mesh.visible = true
    drip.mesh.position.copy(drip.pos)

    const mat = drip.mesh.material as THREE.MeshBasicMaterial
    mat.opacity = 0.78 + Math.random() * 0.18
    const scale = 0.9 + Math.random() * 0.4
    drip.mesh.scale.set(scale, scale * 1.2, scale)

    drip.mesh.rotation.z = Math.atan2(drip.vel.x, -drip.vel.y) + (Math.random() - 0.5) * 0.15
    drip.mesh.rotation.x = (Math.random() - 0.5) * 0.12
  }

  const spawnSplash = (x: number, z: number) => {
    const splash = splashes.current.find((s) => s.life <= 0)
    if (!splash) return

    splash.life = splash.maxLife
    splash.mesh.visible = true
    splash.mesh.position.set(x, SOIL_Y + 0.004, z)
    splash.mesh.scale.setScalar(0.35)
    const mat = splash.mesh.material as THREE.MeshBasicMaterial
    mat.opacity = 0.5
  }

  useFrame((_, delta) => {
    if (!active || finished.current) {
      if (canGroup.current) canGroup.current.visible = false
      return
    }

    elapsed.current += delta
    spawnAcc.current += delta

    if (canGroup.current) {
      const appear = Math.min(1, elapsed.current / 0.22)
      const pourTilt = THREE.MathUtils.lerp(0.08, 0.38, Math.min(1, elapsed.current / 0.45))
      canGroup.current.visible = true
      canGroup.current.scale.setScalar(THREE.MathUtils.lerp(0.01, 1, appear))
      canGroup.current.rotation.set(
        baseCanRot.current.x + pourTilt,
        baseCanRot.current.y,
        baseCanRot.current.z + Math.sin(elapsed.current * 2.2) * 0.015,
      )
    }

    if (elapsed.current < WATER_DURATION && spawnAcc.current >= SPAWN_INTERVAL) {
      spawnAcc.current = 0
      const hole = Math.floor(Math.random() * ROSE_HOLES.length)
      spawnDrip(hole)
      if (Math.random() > 0.35) spawnDrip((hole + 1) % ROSE_HOLES.length)
    }

    drips.current.forEach((drip) => {
      if (!drip.active) return

      drip.vel.y -= GRAVITY * delta
      drip.pos.addScaledVector(drip.vel, delta)
      drip.mesh.position.copy(drip.pos)

      const speed = drip.vel.length()
      drip.mesh.rotation.z = Math.atan2(drip.vel.x, -drip.vel.y)
      drip.mesh.scale.y = THREE.MathUtils.lerp(drip.mesh.scale.y, 1.05 + speed * 0.45, delta * 10)

      if (drip.pos.y <= SOIL_Y) {
        spawnSplash(drip.pos.x, drip.pos.z)
        drip.active = false
        drip.mesh.visible = false
      }
    })

    const activeDrips = drips.current.filter((d) => d.active).length

    splashes.current.forEach((splash) => {
      if (splash.life <= 0) return
      splash.life -= delta
      const t = splash.life / splash.maxLife
      splash.mesh.scale.setScalar(0.35 + (1 - t) * 1.1)
      const mat = splash.mesh.material as THREE.MeshBasicMaterial
      mat.opacity = t * 0.42
      if (splash.life <= 0) splash.mesh.visible = false
    })

    if (elapsed.current >= WATER_DURATION + 0.2 && activeDrips === 0 && !finished.current) {
      finished.current = true
      if (canGroup.current) canGroup.current.visible = false
      onCompleteRef.current()
    }
  })

  if (!active) return null

  return (
    <group ref={root}>
      <group ref={canGroup} position={[-0.08, 0.56, 0.18]} rotation={baseCanRot.current}>
        {/* body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.065, 0.072, 0.11, 14]} />
          <meshStandardMaterial color={CAN_BODY} roughness={0.45} metalness={0.08} flatShading />
        </mesh>
        <mesh position={[0, 0.052, 0]}>
          <cylinderGeometry args={[0.072, 0.065, 0.018, 14]} />
          <meshStandardMaterial color={CAN_DARK} roughness={0.5} flatShading />
        </mesh>

        {/* handle */}
        <mesh position={[0.055, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.042, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color={CAN_TRIM} roughness={0.55} flatShading />
        </mesh>

        {/* moncong — satu grup, ujung = rose */}
        <group position={[-0.042, -0.03, 0.032]} rotation={[1.62, 0.22, -0.08]}>
          <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.0065, 0.0065, 0.07, 8]} />
            <meshStandardMaterial color={CAN_DARK} roughness={0.35} metalness={0.2} flatShading />
          </mesh>

          {/* rose / kepala shower */}
          <mesh position={[0, 0, 0.078]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.012, 0.022, 12]} />
            <meshStandardMaterial color={CAN_DARK} roughness={0.38} metalness={0.18} flatShading />
          </mesh>

          {/* ujung rose — tetesan keluar dari lubang di sini */}
          <group ref={spoutTip} position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
            {ROSE_HOLES.map(([x, y], i) => (
              <mesh key={i} position={[x, y, 0]}>
                <circleGeometry args={[0.0022, 8]} />
                <meshBasicMaterial color={WATER_HIGHLIGHT} toneMapped={false} />
              </mesh>
            ))}
          </group>
        </group>

        <mesh position={[-0.028, 0.01, 0.048]} rotation={[0, -0.4, 0]}>
          <boxGeometry args={[0.008, 0.055, 0.003]} />
          <meshStandardMaterial
            color={WATER_HIGHLIGHT}
            transparent
            opacity={0.3}
            roughness={0.2}
            flatShading
          />
        </mesh>
      </group>
    </group>
  )
}
