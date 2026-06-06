import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../data/profile'
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
  const [menuOpen, setMenuOpen] = useState(false)

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

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', menuOpen)
    return () => document.body.classList.remove('nav-menu-open')
  }, [menuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`nav${menuOpen ? ' nav--open' : ''}`} ref={navRef}>
      <a href="#home" className="nav__logo" onClick={closeMenu}>
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
        <button
          type="button"
          className="nav__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className="nav__mobile-menu" aria-hidden={!menuOpen}>
        <p className="nav__mobile-eyebrow">Navigation</p>
        <ul className="nav__mobile-links">
          {links.map((link, i) => (
            <li key={link.href}>
              <a href={link.href} onClick={closeMenu}>
                <span className="nav__mobile-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="nav__mobile-label">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__mobile-footer">
          <a href="#contact" className="nav__mobile-cta" onClick={closeMenu}>
            Hire me
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>

          <div className="nav__mobile-socials">
            {profile.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="nav__overlay"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}
    </nav>
  )
}
