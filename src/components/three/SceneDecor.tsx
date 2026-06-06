import { FlowerVase } from './FlowerVase'
import { LightSwitch } from './LightSwitch'
import { TechStackAcrylic } from './TechStackAcrylic'
import { WallClock } from './WallClock'

export function SceneDecor() {
  return (
    <group>
      <LightSwitch />
      <TechStackAcrylic />
      <WallClock />
      <FlowerVase />
    </group>
  )
}

export { KaabaBox } from './KaabaBox'
