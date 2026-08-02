import Section from './Section.jsx'
import Reveal from './Reveal.jsx'
import CountUp from './CountUp.jsx'
import { ArrowUpRight } from './Icons.jsx'
import { competitive } from '../data/achievements.js'
import styles from './Competitive.module.css'

export default function Competitive() {
  return (
    <Section
      id="programming"
      index="06"
      label="Competitive Programming"
      title="Daily practice, kept public."
    >
      <ul className={styles.grid}>
        {competitive.map((entry, i) => (
          <Reveal as="li" key={entry.id} className={styles.cell} delay={Math.min(i * 0.06, 0.12)}>
            <a
              className={styles.link}
              href={entry.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${entry.platform} profile — ${entry.handle}`}
            >
              <div className={styles.head}>
                <span className={`label ${styles.platform}`}>{entry.platform}</span>
                <ArrowUpRight size="1em" className={styles.arrow} />
              </div>

              <p className={`mono ${styles.figure}`}>
                <CountUp value={entry.figureValue} suffix={entry.figureSuffix} />
              </p>
              <p className={`label ${styles.figureLabel}`}>{entry.figureLabel}</p>

              {entry.badge && (
                /* Decorative here, not a link: the whole cell already links to
                   the profile, and nesting anchors would break keyboard order. */
                <div className={styles.badge}>
                  <span className={styles.badgeFrame}>
                    <img
                      className={styles.badgeImage}
                      src={entry.badge.src}
                      width={entry.badge.width}
                      height={entry.badge.height}
                      alt={entry.badge.caption}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className={styles.badgeCaption}>{entry.badge.caption}</span>
                </div>
              )}

              <div className={styles.foot}>
                <span className={`mono ${styles.handle}`}>@{entry.handle}</span>
                <span className={styles.note}>{entry.note}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
