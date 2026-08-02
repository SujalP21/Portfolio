import { ArrowUpRight } from './Icons.jsx'
import { links, profile } from '../data/profile.js'
import styles from './Footer.module.css'

const social = [
  { label: 'GitHub', href: links.github },
  { label: 'LinkedIn', href: links.linkedin },
  { label: 'LeetCode', href: links.leetcode },
  { label: 'HackerRank', href: links.hackerrank },
  { label: 'Résumé', href: links.resume },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.rule} />

        <div className={styles.top}>
          <a href="#top" className={styles.backToTop}>
            <span className={`serif ${styles.backName}`}>{profile.fullName}</span>
            <span className={`label ${styles.backLabel}`}>Back to top</span>
          </a>

          <nav className={styles.social} aria-label="Elsewhere">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {item.label}
                <ArrowUpRight size="0.75em" />
              </a>
            ))}
          </nav>
        </div>

        <div className={styles.colophon}>
          <p className={styles.colophonItem}>
            <span className={`label ${styles.colophonTerm}`}>©</span>
            {year} {profile.fullName}
          </p>
          <p className={styles.colophonItem}>
            <span className={`label ${styles.colophonTerm}`}>{profile.location}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
