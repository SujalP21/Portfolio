import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'sp-theme'

function readInitialTheme() {
  if (typeof document === 'undefined') return 'light'
  // index.html already resolved this before first paint; trust the attribute.
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

/** Light ("day edition") / dark ("night edition") with a persisted preference. */
export function useTheme() {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* private browsing — preference simply won't persist */
    }
  }, [theme])

  // Follow the OS only while the visitor hasn't expressed a preference.
  useEffect(() => {
    let stored = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    if (stored) return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => setTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /**
   * Accepts the originating event so the new edition can wipe in as a circle
   * expanding from the control that was pressed. Browsers without the View
   * Transition API (and anyone who asked for reduced motion) just get the
   * instant swap — the state change is identical either way.
   */
  const toggle = useCallback((event) => {
    const swap = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )?.matches

    if (!document.startViewTransition || prefersReducedMotion) {
      swap()
      return
    }

    // Fall back to the viewport centre for keyboard activation, which has no
    // pointer coordinates.
    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    // flushSync so the DOM is fully updated before the transition snapshots it.
    const transition = document.startViewTransition(() => flushSync(swap))

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 480,
            easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
      .catch(() => {
        /* transition was skipped; the theme already changed */
      })
  }, [])

  return { theme, toggle }
}
