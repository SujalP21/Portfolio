import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'

import { ArrowUpRight, Close } from './Icons.jsx'
import styles from './Lightbox.module.css'

/**
 * Full-screen proof viewer. Images only — PDFs open in a native tab instead,
 * where the browser's own viewer handles zoom, print and download for free.
 *
 * Handles Escape/arrow keys, click-outside, body scroll lock, and returns
 * focus to whatever opened it.
 */
export default function Lightbox({ items, index, onClose, onNavigate, title }) {
  const reduceMotion = useReducedMotion()
  const panelRef = useRef(null)
  const restoreFocusRef = useRef(null)

  const open = index !== null && index >= 0
  const count = items?.length ?? 0
  const item = open ? items[index] : null

  const goPrev = useCallback(() => {
    if (count > 1) onNavigate((index - 1 + count) % count)
  }, [count, index, onNavigate])

  const goNext = useCallback(() => {
    if (count > 1) onNavigate((index + 1) % count)
  }, [count, index, onNavigate])

  // Remember the trigger so focus can go back where it came from.
  useEffect(() => {
    if (open) restoreFocusRef.current = document.activeElement
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft') {
        goPrev()
      } else if (e.key === 'ArrowRight') {
        goNext()
      } else if (e.key === 'Tab') {
        // Minimal focus trap: only the panel's controls are reachable.
        const focusables = panelRef.current?.querySelectorAll('button, a[href]')
        if (!focusables?.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      const target = restoreFocusRef.current
      if (target && typeof target.focus === 'function') target.focus()
    }
  }, [open, onClose, goPrev, goNext])

  return (
    <AnimatePresence>
      {open && item && (
        <m.div
          className={styles.backdrop}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title ? `${title} — proof` : 'Proof'}
        >
          <div
            className={styles.panel}
            ref={panelRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.bar}>
              <p className={`label ${styles.barTitle}`}>
                {title}
                {count > 1 && (
                  <span className={styles.counter}>
                    {index + 1} / {count}
                  </span>
                )}
              </p>
              <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
                <Close size="1.1em" />
              </button>
            </div>

            <m.figure
              className={styles.figure}
              key={item.src}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <img
                className={styles.image}
                src={item.src}
                width={item.width}
                height={item.height}
                alt={item.caption}
              />
              <figcaption className={styles.caption}>{item.caption}</figcaption>
            </m.figure>

            <div className={styles.controls}>
              {count > 1 ? (
                <div className={styles.nav}>
                  <button type="button" className={styles.navButton} onClick={goPrev}>
                    ← Prev
                  </button>
                  <button type="button" className={styles.navButton} onClick={goNext}>
                    Next →
                  </button>
                </div>
              ) : (
                <span />
              )}

              <a
                className={styles.openRaw}
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open full size
                <ArrowUpRight size="0.8em" />
              </a>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
