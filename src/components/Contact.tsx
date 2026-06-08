import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/profile'
import './Contact.scss'

gsap.registerPlugin(ScrollTrigger)

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact__cta-text', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })

      gsap.from('.contact__email', {
        scrollTrigger: { trigger: '.contact__actions', start: 'top 85%' },
        y: 20,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })

      gsap.from('.contact__link', {
        scrollTrigger: { trigger: '.contact__links', start: 'top 85%' },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" className="contact" ref={sectionRef}>
      <div className="contact__inner">
        <p className="section-label">Contact</p>
        <h2 className="contact__cta-text section-title">
          Let&apos;s collaborate
          <br />
          <span>and build something great.</span>
        </h2>

        <p className="contact__desc">
          Open to Senior / Staff Engineer and Technical Lead opportunities across APAC.
          SaaS, enterprise, mining, healthcare, or mission-critical products — let&apos;s talk.
        </p>

        <div className="contact__actions">
          <a href={`mailto:${profile.email}`} className="contact__email">
            {profile.email}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="contact__phone">
            {profile.phone}
          </a>
        </div>

        <div className="contact__links">
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__link"
            >
              <span className="contact__link-label">{social.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          ))}
        </div>

        <footer className="contact__footer">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>
            Built with React + Three.js ·{' '}
            <a
              href="https://cursor.com/referral?code=Y19PCLX43QLI"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try Cursor
            </a>
          </span>
        </footer>
      </div>
    </section>
  )
}
