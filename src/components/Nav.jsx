import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'

import { sections, sectionIds } from '../data/sections.js'
import { links, profile } from '../data/profile.js'
import { useScrollSpy } from '../hooks/useScrollSpy.js'
import { Close, Document, Menu, Moon, Sun } from './Icons.jsx'
import styles from './Nav.module.css'

/** Label the shortcut with the modifier the visitor's keyboard actually has. */
function shortcutLabel() {
  if (typeof navigator === 'undefined') return 'Ctrl K'
  const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
  return isApple ? '⌘K' : 'Ctrl K'
}

export default function Nav({ theme, onToggleTheme, onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useScrollSpy(sectionIds)
  const reduceMotion = useReducedMotion()

  // Passive listener + a boolean state means at most one re-render per crossing.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={`shell ${styles.inner}`}>
          <a href="#top" className={styles.mark} onClick={closeMenu}>
            <span className={styles.markDot} aria-hidden="true" />
            <span className={styles.markName}>{profile.fullName}</span>
          </a>

          <nav className={styles.links} aria-label="Sections">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`${styles.link} ${activeId === section.id ? styles.linkActive : ''}`}
                aria-current={activeId === section.id ? 'true' : undefined}
              >
                <span className={styles.linkIndex}>{section.index}</span>
                {section.nav}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.commandButton}
              onClick={onOpenPalette}
              aria-label="Open command palette"
              title="Command palette"
            >
              <span className={styles.commandHint}>{shortcutLabel()}</span>
            </button>

            <button
              type="button"
              className={styles.iconButton}
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'day' : 'night'} edition`}
              title={`Switch to ${theme === 'dark' ? 'day' : 'night'} edition`}
            >
              {theme === 'dark' ? <Sun size="1.05em" /> : <Moon size="1.05em" />}
            </button>

            <a
              className={styles.resume}
              href={links.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Document size="1em" />
              <span>Résumé</span>
            </a>

            <button
              type="button"
              className={`${styles.iconButton} ${styles.menuButton}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close index' : 'Open index'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <Close size="1.15em" /> : <Menu size="1.15em" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            className={styles.overlay}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <nav className={`shell ${styles.overlayInner}`} aria-label="Section index">
              <p className={`label ${styles.overlayLabel}`}>Index</p>
              <ul className={styles.overlayList}>
                {sections.map((section, i) => (
                  <m.li
                    key={section.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: reduceMotion ? 0 : 0.04 * i,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                  >
                    <a href={`#${section.id}`} className={styles.overlayLink} onClick={closeMenu}>
                      <span className={styles.overlayIndex}>{section.index}</span>
                      <span className="serif">{section.label}</span>
                    </a>
                  </m.li>
                ))}
              </ul>

              <div className={styles.overlayFoot}>
                <a href={links.emailHref} className={styles.overlayFootLink}>
                  {links.email}
                </a>
                <div className={styles.overlayFootRow}>
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.overlayFootLink}
                  >
                    GitHub
                  </a>
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.overlayFootLink}
                  >
                    LinkedIn
                  </a>
                  <a
                    href={links.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.overlayFootLink}
                  >
                    Résumé
                  </a>
                </div>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
