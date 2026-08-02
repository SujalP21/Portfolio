import Section from './Section.jsx'
import Reveal from './Reveal.jsx'
import { ArrowUpRight, Document } from './Icons.jsx'
import { certifications } from '../data/achievements.js'
import styles from './Certifications.module.css'

/**
 * Certificates open as PDFs in a new tab rather than in the lightbox: the
 * browser's native viewer already gives zoom, print, download and text
 * selection, and shipping a PDF renderer to every visitor for four documents
 * would cost more than the whole rest of the bundle.
 */
export default function Certifications() {
  return (
    <Section
      id="certifications"
      index="05"
      label="Certifications"
      title="Verified credentials."
    >
      <ul className={styles.grid}>
        {certifications.map((cert, i) => {
          const hasProof = Boolean(cert.href && cert.thumb)
          const Wrapper = hasProof ? 'a' : 'div'
          const wrapperProps = hasProof
            ? {
                href: cert.href,
                target: '_blank',
                rel: 'noopener noreferrer',
                'aria-label': `${cert.name} — open certificate PDF`,
              }
            : {}

          return (
            <Reveal as="li" key={cert.id} className={styles.cell} delay={Math.min(i * 0.05, 0.15)}>
              <Wrapper className={styles.link} {...wrapperProps}>
                <span className={styles.frame}>
                  {hasProof ? (
                    <img
                      className={styles.image}
                      src={cert.thumb}
                      width={1200}
                      height={850}
                      alt={`${cert.name} certificate issued by ${cert.issuer}`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className={styles.placeholder}>
                      <span className={`serif ${styles.placeholderName}`}>{cert.name}</span>
                      <span className={`label ${styles.placeholderIssuer}`}>{cert.issuer}</span>
                    </span>
                  )}
                </span>

                <span className={styles.text}>
                  <span className={`label ${styles.issuer}`}>{cert.issuer}</span>
                  <span className={`serif ${styles.name}`}>{cert.name}</span>
                  <span className={styles.footRow}>
                    <span className={`mono ${styles.date}`}>{cert.date}</span>
                    {hasProof && (
                      <span className={styles.view}>
                        <Document size="0.9em" />
                        View certificate
                        <ArrowUpRight size="0.75em" className={styles.viewArrow} />
                      </span>
                    )}
                  </span>
                </span>
              </Wrapper>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
