import Reveal, { RevealRule } from './Reveal.jsx'
import SplitWords from './SplitWords.jsx'
import styles from './Section.module.css'

/**
 * The layout spine every section shares: a sticky numbered marker in the left
 * gutter and the content in the wide right column. On mobile the marker
 * collapses into a single inline rule above the content.
 */
export default function Section({ id, index, label, title, children }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
      <div className="shell">
        <RevealRule className={styles.topRule} />

        <div className={`spine ${styles.body}`}>
          <div className={styles.marker}>
            <div className={styles.markerInner}>
              <Reveal as="p" className={styles.markerIndex} y={8}>
                {index}
              </Reveal>
              <Reveal as="p" className={`label ${styles.markerLabel}`} y={8} delay={0.05}>
                {label}
              </Reveal>
            </div>
          </div>

          <div className={styles.content}>
            <h2 id={`${id}-heading`} className={`serif ${styles.title}`}>
              <SplitWords text={title} />
            </h2>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
