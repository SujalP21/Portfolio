import { useCallback, useEffect, useState } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'

import CommandPalette from './components/CommandPalette.jsx'
import Nav from './components/Nav.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Achievements from './components/Achievements.jsx'
import Certifications from './components/Certifications.jsx'
import Competitive from './components/Competitive.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { useTheme } from './hooks/useTheme.js'
import { useHashLanding } from './hooks/useHashLanding.js'

export default function App() {
  const { theme, toggle } = useTheme()
  useHashLanding()

  const [paletteOpen, setPaletteOpen] = useState(false)
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  // Cmd/Ctrl+K anywhere on the page, the convention engineers already know.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    // `strict` forbids the heavyweight `motion.*` components, so only the
    // ~5kb `domAnimation` feature bundle ever reaches the client.
    <LazyMotion features={domAnimation} strict>
      <div className="grain" aria-hidden="true" />

      <a className="skipLink" href="#summary">
        Skip to content
      </a>

      <Nav theme={theme} onToggleTheme={toggle} onOpenPalette={() => setPaletteOpen(true)} />
      <ScrollProgress />

      <CommandPalette
        open={paletteOpen}
        onClose={closePalette}
        theme={theme}
        onToggleTheme={toggle}
      />

      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Achievements />
        <Certifications />
        <Competitive />
        <Contact />
      </main>

      <Footer />
    </LazyMotion>
  )
}
