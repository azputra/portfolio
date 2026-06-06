import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export const CHARACTER_X = 2.1

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uTexture, vUv);

    // Chroma key — hapus background hijau studio
    float greenKey = tex.g - max(tex.r, tex.b);
    float greenDist = distance(tex.rgb, vec3(0.32, 0.82, 0.28));
    float alpha = smoothstep(0.1, 0.32, 1.0 - greenKey);
    alpha *= smoothstep(0.18, 0.42, greenDist);

    vec3 color = tex.rgb;
    color = mix(color, color * vec3(0.75, 1.1, 1.05), 0.35);

    float scan = sin(vUv.y * 420.0 + uTime * 4.0) * 0.035;
    color += scan;

    float flicker = 0.94 + 0.06 * sin(uTime * 8.0);
    color *= flicker;

    float rim = smoothstep(0.02, 0.0, alpha) * 0.4;
    color += vec3(0.37, 0.92, 0.83) * rim;

    gl_FragColor = vec4(color, alpha);
  }
`

type HologramPortraitProps = {
  mouse: React.MutableRefObject<{ x: number; y: number }>
}

export function HologramPortrait({ mouse }: HologramPortraitProps) {
  const group = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const texture = useTexture('/images/avatar.png')

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
    }),
    [texture],
  )

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }

    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.current.x * 0.35,
      delta * 3,
    )
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouse.current.y * 0.08,
      delta * 3,
    )
  })

  const img = texture.image as HTMLImageElement | undefined
  const aspect = img?.width && img?.height ? img.width / img.height : 0.75
  const height = 2.05
  const width = height * aspect

  return (
    <group ref={group} position={[CHARACTER_X, height * 0.5 + 0.02, 0]}>
      {/* Glow di belakang */}
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[width * 1.08, height * 1.05]} />
        <meshBasicMaterial
          color="#5eead4"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Foto hologram */}
      <mesh>
        <planeGeometry args={[width, height, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Frame ring */}
      <mesh position={[0, -height * 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.72, 64]} />
        <meshBasicMaterial
          color="#5eead4"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Pillar cahaya */}
      <mesh position={[0, -height * 0.42, -0.15]}>
        <cylinderGeometry args={[0.01, 0.28, height * 0.55, 32, 1, true]} />
        <meshBasicMaterial
          color="#5eead4"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

useTexture.preload('/images/avatar.png')
