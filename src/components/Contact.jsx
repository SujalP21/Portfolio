import Section from './Section.jsx'
import Reveal from './Reveal.jsx'
import { ArrowUpRight } from './Icons.jsx'
import { links, profile } from '../data/profile.js'
import styles from './Contact.module.css'

const channels = [
  { term: 'Email', value: links.email, href: links.emailHref, external: false },
  { term: 'GitHub', value: 'github.com/SujalP21', href: links.github, external: true },
  { term: 'LinkedIn', value: 'linkedin.com/in/pareeksujal', href: links.linkedin, external: true },
  { term: 'Résumé', value: 'resume.pdf', href: links.resume, external: true },
]

export default function Contact() {
  return (
    <Section id="contact" index="07" label="Contact" title="Let’s talk.">
      <Reveal as="p" className={styles.lead}>
        {profile.availability}. The fastest way to reach me is email — I reply to everything.
      </Reveal>

      <Reveal as="div" className={styles.emailWrap} delay={0.05}>
        <a className={styles.email} href={links.emailHref}>
          <span className={styles.emailText}>{links.email}</span>
          <ArrowUpRight size="0.5em" className={styles.emailArrow} />
        </a>
      </Reveal>

      <dl className={styles.ledger}>
        {channels.map((channel, i) => (
          <Reveal
            as="div"
            key={channel.term}
            className={styles.row}
            delay={Math.min(i * 0.04, 0.16)}
          >
            <dt className={styles.term}>{channel.term}</dt>
            <dd className={styles.value}>
              <a
                className={styles.valueLink}
                href={channel.href}
                {...(channel.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {channel.value}
                <ArrowUpRight size="0.8em" className={styles.rowArrow} />
              </a>
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
