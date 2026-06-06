import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/profile'
import './WorkHistory.scss'

gsap.registerPlugin(ScrollTrigger)

export function WorkHistory() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.work__item', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        x: -24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" className="work" ref={sectionRef}>
      <div className="work__inner">
        <div className="work__header">
          <p className="section-label">Experience</p>
          <h2 className="section-title">Journey so far</h2>
        </div>
        <ol className="work__list">
          {profile.experience.map((item) => (
            <li key={`${item.company}-${item.period}`} className="work__item">
              <span className="work__period">{item.period}</span>
              <div className="work__body">
                <h3>{item.role}</h3>
                <p className="work__company">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ''}
                </p>
                <p className="work__summary">{item.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
