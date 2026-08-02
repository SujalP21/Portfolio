import { Fragment } from 'react'
import { m, useReducedMotion } from 'framer-motion'

import styles from './SplitWords.module.css'

const EASE = [0.22, 0.61, 0.36, 1]

/**
 * Word-by-word rise-into-view, using the same masked-line motif as the hero
 * nameplate. Transform-only, so it composites without layout or paint work.
 *
 * Real space characters sit between the masks rather than being faked with
 * margins: the heading's textContent has to stay a readable sentence for
 * crawlers and for copy-paste, not "WhatIbuild,andhowIgothere."
 */
export default function SplitWords({ text, className, delay = 0, stagger = 0.055 }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <span className={className}>{text}</span>

  const words = text.split(' ')

  return (
    <span className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className={styles.mask}>
            <m.span
              className={styles.word}
              initial={{ y: '112%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 0.72, delay: delay + i * stagger, ease: EASE }}
            >
              {word}
            </m.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}
