import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'

import { sections } from '../data/sections.js'
import { projects } from '../data/projects.js'
import { certifications } from '../data/achievements.js'
import { links } from '../data/profile.js'
import { ArrowUpRight, Close, Document, GitHub, LinkedIn, Mail, Moon, Sun } from './Icons.jsx'
import styles from './CommandPalette.module.css'

/** True when every character of `query` appears in `text`, in order. */
function isSubsequence(text, query) {
  let i = 0
  for (const char of text) {
    if (char === query[i]) i += 1
    if (i === query.length) return true
  }
  return false
}

/**
 * Scores a command against the query. Higher is better, 0 means no match.
 *
 * A bare subsequence test alone matches far too much ("dtr" hits half the
 * list), so exact substrings and label hits are ranked above scattered
 * character matches, and the hint is only ever a weak signal.
 */
function score(item, rawQuery) {
  const query = rawQuery.toLowerCase().replace(/\s+/g, '')
  if (!query) return 1

  const label = item.label.toLowerCase()
  const hint = (item.hint ?? '').toLowerCase()
  const group = item.group.toLowerCase()

  if (label.startsWith(query)) return 100
  if (label.replace(/\s+/g, '').includes(query)) return 80
  if (hint.includes(query) || group.startsWith(query)) return 60
  if (isSubsequence(label.replace(/[^a-z0-9]/g, ''), query)) return 40
  if (isSubsequence(`${label} ${hint}`.replace(/[^a-z0-9]/g, ''), query)) return 20
  return 0
}

export default function CommandPalette({ open, onClose, theme, onToggleTheme }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const restoreFocusRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const items = useMemo(() => {
    const go = (id) => () => {
      const el = document.getElementById(id)
      if (!el) return
      history.replaceState(null, '', `#${id}`)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    const openUrl = (href) => () => window.open(href, '_blank', 'noopener,noreferrer')

    return [
      ...sections.map((s) => ({
        id: `section-${s.id}`,
        group: 'Navigate',
        label: s.label,
        hint: s.index,
        run: go(s.id),
      })),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        group: 'Selected work',
        label: p.name,
        hint: p.domain,
        icon: <GitHub size="0.95em" />,
        external: true,
        run: openUrl(p.repo),
      })),
      ...projects
        .filter((p) => p.live)
        .map((p) => ({
          id: `live-${p.id}`,
          group: 'Live demos',
          label: p.name,
          hint: 'deployed',
          external: true,
          run: openUrl(p.live),
        })),
      ...certifications
        .filter((c) => c.href)
        .map((c) => ({
          id: `cert-${c.id}`,
          group: 'Credentials',
          label: c.name,
          hint: c.issuer,
          icon: <Document size="0.95em" />,
          external: true,
          run: openUrl(c.href),
        })),
      {
        id: 'link-resume',
        group: 'Elsewhere',
        label: 'Résumé (PDF)',
        icon: <Document size="0.95em" />,
        external: true,
        run: openUrl(links.resume),
      },
      {
        id: 'link-github',
        group: 'Elsewhere',
        label: 'GitHub',
        hint: 'SujalP21',
        icon: <GitHub size="0.95em" />,
        external: true,
        run: openUrl(links.github),
      },
      {
        id: 'link-linkedin',
        group: 'Elsewhere',
        label: 'LinkedIn',
        hint: 'pareeksujal',
        icon: <LinkedIn size="0.9em" />,
        external: true,
        run: openUrl(links.linkedin),
      },
      {
        id: 'link-leetcode',
        group: 'Elsewhere',
        label: 'LeetCode',
        hint: 'SujalP21',
        external: true,
        run: openUrl(links.leetcode),
      },
      {
        id: 'link-hackerrank',
        group: 'Elsewhere',
        label: 'HackerRank',
        hint: 'Sujalpareek21',
        external: true,
        run: openUrl(links.hackerrank),
      },
      {
        id: 'link-email',
        group: 'Elsewhere',
        label: 'Email Sujal',
        hint: links.email,
        icon: <Mail size="0.95em" />,
        run: () => {
          window.location.href = links.emailHref
        },
      },
      {
        id: 'theme',
        group: 'Appearance',
        label: theme === 'dark' ? 'Switch to day edition' : 'Switch to night edition',
        icon: theme === 'dark' ? <Sun size="0.95em" /> : <Moon size="0.95em" />,
        run: () => onToggleTheme(),
      },
    ]
  }, [theme, onToggleTheme])

  const filtered = useMemo(() => {
    const scored = items
      .map((item, i) => ({ item, rank: score(item, query), i }))
      .filter((entry) => entry.rank > 0)
    // Sort by rank, falling back to the authored order so results never jitter.
    scored.sort((a, b) => b.rank - a.rank || a.i - b.i)
    return scored.map((entry) => entry.item)
  }, [items, query])

  // Group while preserving the filtered order.
  const grouped = useMemo(() => {
    const map = new Map()
    filtered.forEach((item, i) => {
      if (!map.has(item.group)) map.set(item.group, [])
      map.get(item.group).push({ ...item, flatIndex: i })
    })
    return [...map.entries()]
  }, [filtered])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    if (!open) return
    restoreFocusRef.current = document.activeElement
    setQuery('')
    setActive(0)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Focus after paint so the browser doesn't scroll the page to the input.
    const raf = requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = previousOverflow
      const target = restoreFocusRef.current
      if (target && typeof target.focus === 'function') target.focus()
    }
  }, [open])

  // Keep the highlighted row inside the scroll viewport.
  useEffect(() => {
    if (!open) return
    const node = listRef.current?.querySelector(`[data-index="${active}"]`)
    node?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const runItem = useCallback(
    (item) => {
      if (!item) return
      onClose()
      // Let the overlay unmount before scrolling or opening a tab.
      setTimeout(() => item.run(), 0)
    },
    [onClose],
  )

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      runItem(filtered[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className={styles.backdrop}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
          onMouseDown={onClose}
        >
          <m.div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.inputRow}>
              <span className={`mono ${styles.prompt}`} aria-hidden="true">
                &gt;
              </span>
              <input
                ref={inputRef}
                className={styles.input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a section, project, or credential…"
                aria-label="Search commands"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close command palette"
              >
                <Close size="1em" />
              </button>
            </div>

            <div className={styles.list} ref={listRef} role="listbox" aria-label="Commands">
              {grouped.length === 0 && (
                <p className={styles.empty}>No matches for “{query}”.</p>
              )}

              {grouped.map(([group, groupItems]) => (
                <div key={group} className={styles.group}>
                  <p className={`label ${styles.groupLabel}`}>{group}</p>
                  {groupItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={item.flatIndex === active}
                      data-index={item.flatIndex}
                      className={`${styles.row} ${
                        item.flatIndex === active ? styles.rowActive : ''
                      }`}
                      onMouseMove={() => setActive(item.flatIndex)}
                      onClick={() => runItem(item)}
                    >
                      <span className={styles.rowIcon}>{item.icon ?? null}</span>
                      <span className={styles.rowLabel}>{item.label}</span>
                      {item.hint && <span className={`mono ${styles.rowHint}`}>{item.hint}</span>}
                      {item.external && (
                        <ArrowUpRight size="0.75em" className={styles.rowArrow} />
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className={styles.foot}>
              <span className={styles.footHint}>
                <kbd className={styles.kbd}>↑</kbd>
                <kbd className={styles.kbd}>↓</kbd> navigate
              </span>
              <span className={styles.footHint}>
                <kbd className={styles.kbd}>↵</kbd> open
              </span>
              <span className={styles.footHint}>
                <kbd className={styles.kbd}>esc</kbd> close
              </span>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
