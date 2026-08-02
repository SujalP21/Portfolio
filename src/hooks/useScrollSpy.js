import { useEffect, useState } from 'react'

/**
 * Highlights the section occupying the middle band of the viewport.
 * IntersectionObserver only — no scroll listener, so this costs nothing per frame.
 */
export function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(null)
  const key = ids.join('|')

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!elements.length) return

    const visible = new Map()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
          else visible.delete(entry.target.id)
        }
        if (!visible.size) return
        // Document order wins ties so the spy never flickers between neighbours.
        const best = ids.filter((id) => visible.has(id))[0]
        setActiveId(best ?? null)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return activeId
}
