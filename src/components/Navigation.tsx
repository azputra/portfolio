import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTheme } from '../context/ThemeContext'
import './Navigation.scss'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
] as const

export function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -16,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <nav className="nav" ref={navRef}>
      <a href="#home" className="nav__logo">
        AZP
      </a>
      <ul className="nav__links">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav__actions">
        <button
          type="button"
          className={`nav__switch${isDark ? ' is-on' : ''}`}
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          <span className="nav__switch-plate" aria-hidden="true" />
          <span className="nav__switch-lever" aria-hidden="true" />
        </button>
        <a href="#contact" className="nav__cta">
          Hire me
        </a>
      </div>
    </nav>
  )
}
