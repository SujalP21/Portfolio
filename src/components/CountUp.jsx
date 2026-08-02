import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts a figure up once, the first time it scrolls into view.
 *
 * The tween writes straight to the DOM node's textContent instead of going
 * through state — a per-frame setState here would re-render the section ~85
 * times during the count. Digits are tabular so the box never reflows.
 */
export default function CountUp({ value, suffix = '', duration = 1.5 }) {
  const numberRef = useRef(null)
  const wrapRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(wrapRef, { once: true, margin: '0px 0px -15% 0px' })

  useEffect(() => {
    if (!inView || reduceMotion) return

    const node = numberRef.current
    if (!node) return

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 0.84, 0.44, 1],
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest))
      },
    })

    return () => controls.stop()
  }, [inView, value, duration, reduceMotion])

  return (
    <span ref={wrapRef}>
      <span ref={numberRef}>{reduceMotion ? value : 0}</span>
      {suffix}
    </span>
  )
}
