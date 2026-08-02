import Section from './Section.jsx'
import Reveal from './Reveal.jsx'
import { education, profile, skillGroups } from '../data/profile.js'
import styles from './About.module.css'

export default function About() {
  return (
    <Section id="summary" index="01" label="Summary" title="What I build, and how I got here.">
      <Reveal as="p" className={styles.lead}>
        {profile.summary}
      </Reveal>

      <Reveal as="div" className={styles.education} delay={0.05}>
        <div className={styles.educationHead}>
          <span className="label">Education</span>
          <span className={`mono ${styles.educationPeriod}`}>{education.period}</span>
        </div>
        <h3 className={`serif ${styles.institution}`}>{education.institution}</h3>
        <p className={styles.degree}>
          {education.degree}
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          {education.location}
        </p>
        <p className={`mono ${styles.gpa}`}>
          GPA <strong>{education.gpa}</strong>
        </p>
      </Reveal>

      <div className={styles.stack}>
        <Reveal as="p" className={`label ${styles.stackLabel}`}>
          Technical stack
        </Reveal>
        <dl className={styles.stackList}>
          {skillGroups.map((group, i) => (
            <Reveal
              as="div"
              key={group.label}
              className={styles.stackRow}
              delay={Math.min(i * 0.04, 0.16)}
            >
              <dt className={styles.stackTerm}>{group.label}</dt>
              <dd className={styles.stackItems}>
                {group.items.map((item) => (
                  <span key={item} className={styles.chip}>
                    {item}
                  </span>
                ))}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  )
}
