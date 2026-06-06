import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useTheme } from '../context/ThemeContext'
import { LoadingScene } from './three/LoadingScene'
import './LoadingScreen.scss'

const STATUS = [
  'Warming up the dance floor...',
  'Loading 3D character...',
  'Setting up workspace...',
  'Almost ready...',
]

const LOAD_DURATION = 2000

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

type LoadingScreenProps = {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { theme } = useTheme()
  const overlayRef = useRef<HTMLDivElement>(null)
  const leftCurtainRef = useRef<HTMLDivElement>(null)
  const rightCurtainRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)
  const [progress, setProgress] = useState(0)
  const [barWidth, setBarWidth] = useState(0)
  const [status, setStatus] = useState(STATUS[0])
  const [visible, setVisible] = useState(true)

  const displayRef = useRef(0)
  const assetProgressRef = useRef(0)
  const dancerReadyRef = useRef(false)
  const assetsDoneRef = useRef(false)
  const finishedRef = useRef(false)

  onCompleteRef.current = onComplete

  const handleAssetProgress = useCallback((value: number) => {
    assetProgressRef.current = value
    if (value >= 99.5) assetsDoneRef.current = true
  }, [])

  const handleDancerReady = useCallback(() => {
    dancerReadyRef.current = true
    assetProgressRef.current = Math.max(assetProgressRef.current, 92)
    window.setTimeout(() => {
      assetsDoneRef.current = true
      assetProgressRef.current = 100
    }, 200)
  }, [])

  const runExit = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false)
        onCompleteRef.current()
      },
    })

    tl.to('.loading__hud', { opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' })
      .to(leftCurtainRef.current, { xPercent: 0, duration: 0.2, ease: 'power2.in' }, 0.05)
      .to(rightCurtainRef.current, { xPercent: 0, duration: 0.2, ease: 'power2.in' }, 0.05)
      .to(leftCurtainRef.current, { xPercent: -100, duration: 0.45, ease: 'power3.inOut' }, 0.3)
      .to(rightCurtainRef.current, { xPercent: 100, duration: 0.45, ease: 'power3.inOut' }, 0.3)
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, 0.65)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark'
    document.documentElement.classList.add('is-loading')
    document.body.classList.add('is-loading')

    return () => {
      document.documentElement.classList.remove('is-loading')
      document.body.classList.remove('is-loading')
      document.documentElement.dataset.theme = theme
    }
  }, [theme])

  useEffect(() => {
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const timeRatio = Math.min(1, elapsed / LOAD_DURATION)
      const timeTarget = easeOutQuart(timeRatio) * 100

      let target = timeTarget

      if (!dancerReadyRef.current) {
        target = Math.min(timeTarget, 88)
      } else if (!assetsDoneRef.current) {
        target = Math.min(timeTarget, 96)
      } else if (timeRatio >= 0.88) {
        target = 100
      }

      displayRef.current += (target - displayRef.current) * 0.07
      const shown = Math.min(100, Math.round(displayRef.current))

      setProgress(shown)
      setBarWidth(displayRef.current)

      const ratio = shown / 100
      const statusIdx = Math.min(STATUS.length - 1, Math.floor(ratio * STATUS.length))
      setStatus(STATUS[statusIdx])

      const canFinish =
        shown >= 100 &&
        dancerReadyRef.current &&
        assetsDoneRef.current &&
        timeRatio >= 1

      if (canFinish) {
        window.setTimeout(runExit, 120)
        return
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [runExit])

  if (!visible) return null

  return (
    <div className="loading" ref={overlayRef}>
      <LoadingScene
        onAssetProgress={handleAssetProgress}
        onDancerReady={handleDancerReady}
      />

      <div className="loading__hud">
        <p className="loading__eyebrow">Portfolio · {new Date().getFullYear()}</p>
        <span className="loading__percent">{progress}</span>
        <p className="loading__status">{status}</p>
        <div className="loading__bar">
          <div className="loading__bar-fill" style={{ width: `${barWidth}%` }} />
        </div>
      </div>

      <div className="loading__curtain loading__curtain--left" ref={leftCurtainRef} />
      <div className="loading__curtain loading__curtain--right" ref={rightCurtainRef} />
    </div>
  )
}
