import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type PortfolioScroll = {
  hero: number
  about: number
}

export function usePortfolioScroll(ready = true) {
  const scroll = useRef<PortfolioScroll>({ hero: 0, about: 0 })

  useEffect(() => {
    if (!ready) return

    const heroTrigger = ScrollTrigger.create({
      trigger: '#home',
      scroller: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2.4,
      onUpdate: (self) => {
        scroll.current.hero = self.progress
      },
    })

    const aboutTrigger = ScrollTrigger.create({
      trigger: '#about',
      scroller: document.documentElement,
      start: 'top 95%',
      end: 'top 22%',
      scrub: 2.4,
      onUpdate: (self) => {
        scroll.current.about = self.progress
      },
    })

    const refresh = () => ScrollTrigger.refresh()
    const t1 = window.setTimeout(refresh, 300)
    const t2 = window.setTimeout(refresh, 1200)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      heroTrigger.kill()
      aboutTrigger.kill()
    }
  }, [ready])

  return scroll
}
