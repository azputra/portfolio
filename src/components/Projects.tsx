import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import './Projects.scss'

gsap.registerPlugin(ScrollTrigger)

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const [active, setActive] = useState(0)

  const goTo = useCallback((index: number) => {
    const next = (index + projects.length) % projects.length
    if (next === active || !panelRef.current) return

    gsap.to(panelRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setActive(next)
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
        )
      },
    })
  }, [active])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.projects__sidebar', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })
      gsap.from('.projects__panel', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        x: 30,
        opacity: 0,
        duration: 0.7,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const project = projects[active]

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX ?? 0
    const diff = endX - touchStartX.current
    if (Math.abs(diff) < 48) return
    goTo(active + (diff < 0 ? 1 : -1))
  }

  return (
    <section id="work" className="projects" ref={sectionRef}>
      <div className="projects__inner">
        <div className="projects__header">
          <p className="section-label">Selected</p>
          <h2 className="section-title">Projects</h2>
        </div>

        <div className="projects__carousel">
          <nav className="projects__sidebar" aria-label="Project list">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`projects__nav-item${i === active ? ' is-active' : ''}`}
                onClick={() => goTo(i)}
              >
                <span className="projects__nav-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="projects__nav-text">
                  <strong>{p.title}</strong>
                  <small>{p.subtitle}</small>
                </span>
              </button>
            ))}
          </nav>

          <div
            className="projects__panel"
            ref={panelRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="projects__panel-top">
              <span className="projects__year">{project.year}</span>
              <div className="projects__arrows">
                <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous project">
                  ←
                </button>
                <button type="button" onClick={() => goTo(active + 1)} aria-label="Next project">
                  →
                </button>
              </div>
            </div>

            <h3 className="projects__panel-title">{project.title}</h3>
            <p className="projects__panel-subtitle">{project.subtitle}</p>
            <p className="projects__panel-desc">{project.description}</p>

            <ul className="projects__tags">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="projects__cta"
              >
                View on GitHub
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            )}

            <div className="projects__dots" aria-hidden="true">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={`projects__dot${i === active ? ' is-active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${p.title}`}
                />
              ))}
            </div>

            <p className="projects__swipe-hint">Swipe to browse</p>

            <div className="projects__progress">
              <div
                className="projects__progress-fill"
                style={{ width: `${((active + 1) / projects.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
