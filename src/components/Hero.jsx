import { m, useReducedMotion } from 'framer-motion'

import { links, mastheadFacts, profile } from '../data/profile.js'
import { ArrowDown, ArrowUpRight, Document } from './Icons.jsx'
import styles from './Hero.module.css'

const EASE = [0.22, 0.61, 0.36, 1]

export default function Hero() {
  const reduceMotion = useReducedMotion()

  // One shared orchestration object; when motion is reduced every child simply
  // starts in its resting state and nothing animates.
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.07, delayChildren: 0.05 } },
  }

  const rise = reduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }

  const wordRise = reduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: { y: '108%' },
        show: { y: '0%', transition: { duration: 0.85, ease: EASE } },
      }

  const ruleGrow = reduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: { scaleX: 0 },
        show: { scaleX: 1, transition: { duration: 1, ease: EASE } },
      }

  return (
    <m.section
      id="top"
      className={styles.hero}
      variants={container}
      initial="hidden"
      animate="show"
      aria-label="Introduction"
    >
      <div className="shell">
        {/* --- Masthead: thick rule, metadata line, thin rule ---------------- */}
        <m.div className={styles.mastheadRuleThick} variants={ruleGrow} />

        <m.div className={styles.masthead} variants={rise}>
          <span className="label">Portfolio</span>
          <span className={`label ${styles.mastheadCenter}`}>Software Engineering</span>
          <span className="label">{profile.location}</span>
        </m.div>

        <m.div className={styles.mastheadRuleThin} variants={ruleGrow} />

        {/* --- Nameplate ---------------------------------------------------- */}
        <div className={styles.nameplate}>
          <h1 className={styles.name}>
            <span className={styles.nameLine}>
              <m.span className={styles.nameWord} variants={wordRise}>
                {profile.firstName}
              </m.span>
            </span>
            <span className={`${styles.nameLine} ${styles.nameLineTwo}`}>
              <m.span className={`${styles.nameWord} ${styles.nameItalic}`} variants={wordRise}>
                {profile.lastName}
              </m.span>
            </span>
          </h1>

          {/* Specimen block — a print-style key/value table with dot leaders. */}
          <m.dl className={styles.specimen} variants={rise}>
            {mastheadFacts.map((fact) => (
              <div key={fact.term} className={styles.specimenRow}>
                <dt className={styles.specimenTerm}>{fact.term}</dt>
                <dd className={styles.specimenDetail}>
                  <span className={styles.specimenValue}>{fact.detail}</span>
                  <span className={styles.specimenMeta}>{fact.meta}</span>
                </dd>
              </div>
            ))}
          </m.dl>
        </div>

        {/* --- Positioning + calls to action -------------------------------- */}
        <div className={styles.lower}>
          <m.p className={styles.positioning} variants={rise}>
            {profile.positioning}
          </m.p>

          <m.div className={styles.ctaRow} variants={rise}>
            <a
              className={styles.ctaPrimary}
              href={links.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Document size="1.05em" />
              <span>Read the résumé</span>
              <ArrowUpRight size="0.95em" className={styles.ctaArrow} />
            </a>

            <div className={styles.ctaSecondaryGroup}>
              <a
                className={styles.ctaSecondary}
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
                <ArrowUpRight size="0.8em" />
              </a>
              <a
                className={styles.ctaSecondary}
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <ArrowUpRight size="0.8em" />
              </a>
              <a className={styles.ctaSecondary} href={links.emailHref}>
                Email
                <ArrowUpRight size="0.8em" />
              </a>
            </div>
          </m.div>
        </div>

        <m.div className={styles.footRule} variants={ruleGrow} />

        <m.div className={styles.scrollCue} variants={rise}>
          <a href="#summary" className={styles.scrollLink}>
            <ArrowDown size="0.9em" />
            <span className="label">Summary</span>
          </a>
          <span className={`label ${styles.availability}`}>{profile.availability}</span>
        </m.div>
      </div>
    </m.section>
  )
}
