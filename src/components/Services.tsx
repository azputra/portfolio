import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/profile'
import './Services.scss'

gsap.registerPlugin(ScrollTrigger)

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services__card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        y: 36,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" className="services" ref={sectionRef}>
      <div className="services__inner">
        <div className="services__header">
          <p className="section-label">What I do</p>
          <h2 className="section-title">Services & focus areas</h2>
        </div>
        <div className="services__grid">
          {profile.services.map((service, i) => (
            <article key={service.title} className="services__card">
              <span className="services__index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
