import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { profile } from '../data/profile'
import type { PortfolioScroll } from '../hooks/usePortfolioScroll'
import './Hero.scss'

type HeroProps = {
  scroll: React.MutableRefObject<PortfolioScroll>
}

export function Hero({ scroll }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero__content > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.4,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })
      gsap.from('.hero__scroll', {
        opacity: 0,
        duration: 0.6,
        delay: 1,
        clearProps: 'opacity',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let raf = 0

    const tick = () => {
      const h = scroll.current.hero

      if (contentRef.current) {
        const opacity = h < 0.12 ? 1 : Math.max(0, 1 - (h - 0.12) / 0.14)
        contentRef.current.style.opacity = String(opacity)
        contentRef.current.style.pointerEvents = opacity > 0.3 ? 'none' : 'none'
      }

      if (aboutRef.current) {
        const opacity = h < 0.38 ? 0 : Math.min(1, (h - 0.38) / 0.16)
        aboutRef.current.style.opacity = String(opacity)
        aboutRef.current.style.transform = `translateY(${(1 - opacity) * 24}px)`
      }

      if (scrollHintRef.current) {
        const opacity = h < 0.1 ? 1 : Math.max(0, 1 - (h - 0.1) / 0.1)
        scrollHintRef.current.style.opacity = String(opacity)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scroll])

  return (
    <section id="home" className="hero" ref={sectionRef}>
      <div className="hero__stage">
        <div className="hero__content" ref={contentRef}>
          <p className="hero__eyebrow">Portfolio · {new Date().getFullYear()}</p>
          <h1 className="hero__name">{profile.name}</h1>
          <div className="hero__role-badge">
            <span>{profile.role}</span>
          </div>
          <p className="hero__role-detail">{profile.roleDetail}</p>
          <p className="hero__tagline">{profile.tagline}</p>
        </div>

        <div className="hero__about-reveal" ref={aboutRef}>
          <p className="section-label">About</p>
          <h2 className="section-title">About me</h2>
          <p className="hero__about-text">{profile.bio.split('\n')[0].trim()}</p>
        </div>

        <div className="hero__scroll" ref={scrollHintRef} aria-hidden="true">
          <div className="hero__mouse">
            <div className="hero__mouse-wheel" />
          </div>
          <span>Scroll</span>
        </div>
      </div>
    </section>
  )
}
