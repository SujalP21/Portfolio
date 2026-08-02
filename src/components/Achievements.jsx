import { useCallback, useState } from 'react'

import Section from './Section.jsx'
import Reveal from './Reveal.jsx'
import Lightbox from './Lightbox.jsx'
import ProofSlider from './ProofSlider.jsx'
import { ArrowUpRight, Document } from './Icons.jsx'
import { achievements } from '../data/achievements.js'
import styles from './Achievements.module.css'

export default function Achievements() {
  // One viewer for the whole section; it holds the gallery it was opened with.
  const [viewer, setViewer] = useState({ gallery: null, index: null, title: '' })

  const openViewer = useCallback((item, index) => {
    setViewer({ gallery: item.gallery, index, title: item.title })
  }, [])

  const closeViewer = useCallback(() => {
    setViewer((v) => ({ ...v, index: null }))
  }, [])

  const navigate = useCallback((index) => {
    setViewer((v) => ({ ...v, index }))
  }, [])

  return (
    <Section id="recognition" index="04" label="Recognition" title="Competitions and hackathons.">
      <ol className={styles.list}>
        {achievements.map((item, i) => {
          const gallery = item.gallery ?? []

          return (
            <Reveal
              as="li"
              key={item.id}
              className={styles.item}
              delay={Math.min(i * 0.05, 0.1)}
            >
              <div className={styles.meta}>
                <span className={`mono ${styles.result}`}>{item.result}</span>
                <span className={`label ${styles.date}`}>{item.date}</span>
              </div>

              <div className={styles.body}>
                <h3 className={`serif ${styles.title}`}>{item.title}</h3>
                <p className={`mono ${styles.org}`}>{item.organisation}</p>
                <p className={styles.detail}>{item.detail}</p>

                {gallery.length > 0 && (
                  <div className={styles.plates}>
                    <ProofSlider
                      gallery={gallery}
                      figureNumber={String(i + 1).padStart(2, '0')}
                      title={item.title}
                      onOpen={(shotIndex) => openViewer(item, shotIndex)}
                    />
                  </div>
                )}

                {item.document && (
                  <a
                    className={styles.documentLink}
                    href={item.document.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Document size="0.95em" />
                    {item.document.label}
                    <ArrowUpRight size="0.75em" />
                  </a>
                )}
              </div>
            </Reveal>
          )
        })}
      </ol>

      <Lightbox
        items={viewer.gallery}
        index={viewer.index}
        title={viewer.title}
        onClose={closeViewer}
        onNavigate={navigate}
      />
    </Section>
  )
}
