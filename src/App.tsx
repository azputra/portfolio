import { useState } from 'react'
import { RoomAudioAutoplay } from './components/RoomAudioAutoplay'
import { SceneRingCursor } from './components/SceneRingCursor'
import { RoomAudioProvider } from './context/RoomAudioContext'
import { DeskInteractionProvider } from './context/DeskInteractionContext'
import { SceneHoverProvider } from './context/SceneHoverContext'
import { ThemeProvider } from './context/ThemeContext'
import { useLenis } from './hooks/useLenis'
import { usePortfolioScroll } from './hooks/usePortfolioScroll'
import { LoadingScreen } from './components/LoadingScreen'
import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { About } from './components/About'
import { Services } from './components/Services'
import { WorkHistory } from './components/WorkHistory'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { MobileDock } from './components/MobileDock'
import { Experience, useSceneMouse } from './components/three/Experience'

function App() {
  const [loaded, setLoaded] = useState(false)
  useLenis(loaded)
  const scroll = usePortfolioScroll(loaded)
  const mouse = useSceneMouse()

  return (
    <ThemeProvider>
      <SceneHoverProvider>
      <DeskInteractionProvider>
      <RoomAudioProvider>
      <RoomAudioAutoplay ready={loaded} />
      <SceneRingCursor />
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <div className="grain" aria-hidden="true" />
      <div className={`scene-layer${loaded ? ' scene-layer--ready' : ''}`} aria-hidden="true">
        <Experience mouse={mouse} introReady={loaded} scroll={scroll} />
      </div>
      <Navigation />
      <MobileDock />
      <main className="site-main">
        <Hero scroll={scroll} />
        <Marquee />
        <About />
        <Services />
        <WorkHistory />
        <Projects />
        <Contact />
      </main>
      </RoomAudioProvider>
      </DeskInteractionProvider>
      </SceneHoverProvider>
    </ThemeProvider>
  )
}

export default App
