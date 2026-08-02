import { useLayoutEffect } from 'react'

/**
 * In a client-rendered app the browser resolves `location.hash` while the DOM
 * is still an empty <div id="root">, so deep links like `/#work` silently land
 * at the top of the page. Re-run the jump once React has committed the tree.
 *
 * useLayoutEffect (not rAF) so the scroll happens before the first paint —
 * no visible jump, and it still works when rAF is throttled in a background tab.
 */
export function useHashLanding() {
  useLayoutEffect(() => {
    const { hash } = window.location
    if (!hash || hash.length < 2) return

    let id
    try {
      id = decodeURIComponent(hash.slice(1))
    } catch {
      return
    }

    const scrollToTarget = () => {
      const target = document.getElementById(id)
      if (!target) return
      target.scrollIntoView({ behavior: 'auto', block: 'start' })
    }

    scrollToTarget()

    // Web fonts land after the first commit and change block heights, so the
    // offset captured above drifts. Re-anchor once fonts are ready.
    let cancelled = false
    document.fonts?.ready
      .then(() => {
        if (!cancelled) scrollToTarget()
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])
}
