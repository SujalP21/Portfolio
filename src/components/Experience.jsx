import Section from './Section.jsx'
import Reveal from './Reveal.jsx'
import { ArrowUpRight, Document } from './Icons.jsx'
import { experience, volunteer } from '../data/experience.js'
import styles from './Experience.module.css'

export default function Experience() {
  return (
    <Section id="experience" index="02" label="Experience" title="Where I’ve shipped.">
      <ol className={styles.list}>
        {experience.map((role, i) => (
          <Reveal as="li" key={role.id} className={styles.item} delay={Math.min(i * 0.06, 0.12)}>
            <div className={styles.meta}>
              <span className={`mono ${styles.period}`}>{role.period}</span>
              <span className={`label ${styles.location}`}>{role.location}</span>
            </div>

            <div className={styles.detail}>
              <div className={styles.companyRow}>
                <h3 className={`serif ${styles.company}`}>{role.company}</h3>
                {role.proof && (
                  <a
                    className={styles.proofLink}
                    href={role.proof.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Document size="0.9em" />
                    <span>{role.proof.label}</span>
                    <ArrowUpRight size="0.75em" className={styles.proofArrow} />
                  </a>
                )}
              </div>
              <p className={styles.role}>{role.role}</p>

              <ul className={styles.bullets}>
                {role.bullets.map((bullet) => (
                  <li key={bullet} className={styles.bullet}>
                    {bullet}
                  </li>
                ))}
              </ul>

              <ul className={styles.stack} aria-label={`${role.company} stack`}>
                {role.stack.map((tech) => (
                  <li key={tech} className={styles.tech}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal as="div" className={styles.volunteer} delay={0.08}>
        <span className={`label ${styles.volunteerLabel}`}>Volunteer</span>
        <p className={styles.volunteerBody}>
          <strong className={styles.volunteerOrg}>{volunteer.organisation}</strong>
          <span className={`mono ${styles.volunteerPeriod}`}>{volunteer.period}</span>
          <span className={styles.volunteerDetail}>{volunteer.detail}</span>
        </p>
      </Reveal>
    </Section>
  )
}
