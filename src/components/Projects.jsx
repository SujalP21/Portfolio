import Section from './Section.jsx'
import Reveal from './Reveal.jsx'
import { ArrowUpRight, GitHub } from './Icons.jsx'
import { projects } from '../data/projects.js'
import styles from './Projects.module.css'

const primary = projects.filter((p) => p.primary)
const additional = projects.filter((p) => !p.primary)

function ProjectRow({ project, number, delay }) {
  return (
    <Reveal as="li" className={styles.item} delay={delay}>
      {/* One stretched anchor covers the whole row: a single, clearly-labelled
          link per project rather than several overlapping hit targets. */}
      <a
        className={styles.hit}
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.name} — view source on GitHub`}
      />

      <div className={styles.index}>
        <span className={`mono ${styles.number}`}>{number}</span>
        <span className={`label ${styles.domain}`}>{project.domain}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.headRow}>
          <h3 className={`serif ${styles.name}`}>{project.name}</h3>

          <div className={styles.actions}>
            {/* A real second link, layered above the row's stretched anchor so
                it stays clickable. It is a sibling of that anchor, not nested,
                so the markup stays valid. */}
            {project.live && (
              <a
                className={styles.liveLink}
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} — open live demo`}
              >
                <span className={styles.liveDot} aria-hidden="true" />
                Live demo
                <ArrowUpRight size="0.8em" className={styles.liveArrow} />
              </a>
            )}

            <span className={styles.view}>
              <GitHub size="0.9em" />
              <span className={styles.viewText}>View code</span>
              <ArrowUpRight size="0.85em" className={styles.viewArrow} />
            </span>
          </div>
        </div>

        <p className={styles.tagline}>{project.tagline}</p>

        <ul className={styles.bullets}>
          {project.bullets.map((bullet) => (
            <li key={bullet} className={styles.bullet}>
              {bullet}
            </li>
          ))}
        </ul>

        <ul className={styles.stack} aria-label={`${project.name} stack`}>
          {project.stack.map((tech) => (
            <li key={tech} className={styles.tech}>
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <Section id="work" index="03" label="Selected Work" title="Six things I designed and shipped.">
      <ol className={styles.list}>
        {primary.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            number={String(i + 1).padStart(2, '0')}
            delay={Math.min(i * 0.05, 0.1)}
          />
        ))}
      </ol>

      <Reveal as="div" className={styles.divider} delay={0.05}>
        <span className="label">Additional work</span>
        <span className={styles.dividerRule} aria-hidden="true" />
      </Reveal>

      <ol className={styles.list}>
        {additional.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            number={String(primary.length + i + 1).padStart(2, '0')}
            delay={Math.min(i * 0.05, 0.1)}
          />
        ))}
      </ol>

      <Reveal as="p" className={styles.repoNote} delay={0.05}>
        Every project links to its own repository.{' '}
        <a
          className="inkLink"
          href="https://github.com/SujalP21"
          target="_blank"
          rel="noopener noreferrer"
        >
          Browse the rest on GitHub
        </a>
        .
      </Reveal>
    </Section>
  )
}
