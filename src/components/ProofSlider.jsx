import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'

import { ArrowUpRight } from './Icons.jsx'
import styles from './ProofSlider.module.css'

const EASE = [0.22, 0.61, 0.36, 1]
const SWIPE_THRESHOLD = 44

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0 }),
}

/**
 * A single framed plate that slides between the images in a gallery.
 *
 * Swipe is wired from raw pointer events rather than Framer's `drag`, which
 * lives in the `domMax` feature bundle — pulling that in would roughly double
 * the motion chunk for one gesture.
 */
export default function ProofSlider({ gallery, figureNumber, title, onOpen }) {
  const [[index, direction], setPage] = useState([0, 0])
  const reduceMotion = useReducedMotion()
  const pointerRef = useRef({ x: 0, y: 0, dragged: false })

  const count = gallery.length
  const current = gallery[index]

  const paginate = useCallback(
    (step) => {
      if (count < 2) return
      setPage(([prev]) => [(prev + step + count) % count, step])
    },
    [count],
  )

  // Warm the remaining frames once the browser is idle so the first swipe
  // doesn't land on an empty box.
  useEffect(() => {
    if (count < 2) return
    const warm = () => {
      gallery.slice(1).forEach((shot) => {
        const img = new Image()
        img.src = shot.thumb
      })
    }
    const id = window.requestIdleCallback?.(warm, { timeout: 2500 }) ?? setTimeout(warm, 1200)
    return () => {
      window.cancelIdleCallback?.(id)
      clearTimeout(id)
    }
  }, [gallery, count])

  const onPointerDown = (e) => {
    pointerRef.current = { x: e.clientX, y: e.clientY, dragged: false }
  }

  const onPointerUp = (e) => {
    const dx = e.clientX - pointerRef.current.x
    const dy = e.clientY - pointerRef.current.y
    // Horizontal intent only, so vertical page scrolling still works on touch.
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      pointerRef.current.dragged = true
      paginate(dx < 0 ? 1 : -1)
    }
  }

  const onFrameClick = () => {
    if (pointerRef.current.dragged) {
      pointerRef.current.dragged = false
      return
    }
    onOpen(index)
  }

  const onFrameKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      paginate(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      paginate(-1)
    }
  }

  return (
    <div className={styles.slider}>
      <button
        type="button"
        className={styles.frame}
        onClick={onFrameClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onKeyDown={onFrameKeyDown}
        aria-label={`${title} — enlarge proof ${index + 1} of ${count}`}
      >
        <AnimatePresence initial={false} custom={direction}>
          <m.img
            key={current.src}
            className={styles.slide}
            src={current.thumb}
            width={current.width}
            height={current.height}
            alt={current.caption}
            loading={index === 0 ? 'lazy' : 'eager'}
            decoding="async"
            draggable={false}
            custom={direction}
            variants={reduceMotion ? undefined : slideVariants}
            initial={reduceMotion ? false : 'enter'}
            animate={reduceMotion ? undefined : 'center'}
            exit={reduceMotion ? undefined : 'exit'}
            transition={{
              x: { duration: 0.5, ease: EASE },
              opacity: { duration: 0.3, ease: EASE },
            }}
          />
        </AnimatePresence>

        <span className={styles.zoomHint} aria-hidden="true">
          <ArrowUpRight size="0.85em" />
        </span>
      </button>

      <div className={styles.captionRow}>
        <p className={styles.caption}>
          <span className={styles.figNo}>Fig. {figureNumber}</span>
          <span className={styles.figText}>{current.caption}</span>
        </p>

        {count > 1 && (
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => paginate(-1)}
              aria-label="Previous proof"
            >
              ←
            </button>
            <span className={`mono ${styles.counter}`} aria-live="polite">
              {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => paginate(1)}
              aria-label="Next proof"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
