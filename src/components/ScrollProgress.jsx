import { m, useReducedMotion, useScroll, useSpring } from 'framer-motion'

import styles from './ScrollProgress.module.css'

/**
 * A hairline reading progress rule pinned under the masthead.
 *
 * Driven by a spring on a single `scaleX` — one compositor-only property on one
 * element, so it costs nothing per frame and never triggers layout or paint.
 */
export default function ScrollProgress() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  })

  if (reduceMotion) return null

  return <m.div className={styles.bar} style={{ scaleX }} aria-hidden="true" />
}
