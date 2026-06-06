import { useEffect, useState } from 'react'
import './MobileDock.scss'

const items = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const

export function MobileDock() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = items
      .map((item) => {
        const el = document.querySelector(item.href)
        return el ? { id: item.id, el } : null
      })
      .filter(Boolean) as { id: string; el: Element }[]

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    )

    sections.forEach(({ el }) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="mobile-dock" aria-label="Quick navigation">
      <div className="mobile-dock__pill">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`mobile-dock__item${active === item.id ? ' is-active' : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
          >
            <span className="mobile-dock__label">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
