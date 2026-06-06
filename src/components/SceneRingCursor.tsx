import { useEffect, useRef, useState } from 'react'
import { useSceneHover } from '../context/SceneHoverContext'
import './SceneRingCursor.scss'

function SceneHoverCanvasClass() {
  const { isHoveringClickable } = useSceneHover()

  useEffect(() => {
    const layer = document.querySelector('.scene-layer')
    layer?.classList.toggle('scene-layer--hoverable', isHoveringClickable)
    return () => layer?.classList.remove('scene-layer--hoverable')
  }, [isHoveringClickable])

  return null
}

export function SceneRingCursor() {
  const { isHoveringClickable } = useSceneHover()
  const ringRef = useRef<HTMLDivElement>(null)
  const [inScene, setInScene] = useState(false)
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const layer = document.querySelector('.scene-layer')

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`
        ringRef.current.style.top = `${e.clientY}px`
      }
    }

    const onEnter = () => setInScene(true)
    const onLeave = () => setInScene(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    layer?.addEventListener('mouseenter', onEnter)
    layer?.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      layer?.removeEventListener('mouseenter', onEnter)
      layer?.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const visible = inScene && isHoveringClickable

  return (
    <>
      <SceneHoverCanvasClass />
      <div
        ref={ringRef}
        className={`scene-ring-cursor${visible ? ' scene-ring-cursor--active' : ''}`}
        aria-hidden="true"
      />
    </>
  )
}
