import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getYearsExperienceLabel, profile } from '../data/profile'
import './About.scss'

gsap.registerPlugin(ScrollTrigger)

export function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about__text', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })

      gsap.from('.about__stat', {
        scrollTrigger: { trigger: '.about__stats', start: 'top 82%' },
        y: 24,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })

      gsap.from('.about__highlight', {
        scrollTrigger: { trigger: '.about__highlights', start: 'top 85%' },
        x: -16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })

      gsap.from('.about__skill', {
        scrollTrigger: { trigger: '.about__skills', start: 'top 80%' },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about__inner">
        <div className="about__header">
          <p className="section-label">About</p>
          <h2 className="section-title">Who I am</h2>
        </div>

        <div className="about__grid">
          <p className="about__text">{profile.bio}</p>

          <div className="about__meta">
            <div className="about__meta-item">
              <span className="about__meta-label">Location</span>
              <span>{profile.location}</span>
            </div>
            <div className="about__meta-item">
              <span className="about__meta-label">Focus</span>
              <span>{profile.focus}</span>
            </div>
            <div className="about__meta-item">
              <span className="about__meta-label">Availability</span>
              <span>{profile.availability}</span>
            </div>
            <div className="about__meta-item">
              <span className="about__meta-label">Languages</span>
              <span>
                {profile.languages.map((lang) => `${lang.name} (${lang.level})`).join(' · ')}
              </span>
            </div>
            {profile.education.map((edu) => (
              <div key={edu.school} className="about__meta-item">
                <span className="about__meta-label">Education</span>
                <span>
                  {edu.degree}
                  {edu.field ? ` — ${edu.field}` : ''}, {edu.school}
                </span>
              </div>
            ))}
          </div>
        </div>

        <ul className="about__stats">
          {profile.stats.map((stat) => (
            <li key={stat.label} className="about__stat">
              <strong>
                {stat.label === 'Years experience' ? getYearsExperienceLabel() : stat.value}
              </strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>

        <ul className="about__highlights">
          {profile.highlights.map((item) => (
            <li key={item} className="about__highlight">
              {item}
            </li>
          ))}
        </ul>

        <ul className="about__skills">
          {profile.skills.map((skill) => (
            <li key={skill} className="about__skill">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
