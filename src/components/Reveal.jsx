import { m, useReducedMotion } from 'framer-motion'

/**
 * Scroll-triggered reveal. Deliberately restrained: a short fade plus an 14px
 * rise, once per element. Under `prefers-reduced-motion` the element renders
 * plainly with no transform and no observer attached.
 */
export default function Reveal({
  as = 'div',
  children,
  delay = 0,
  y = 14,
  duration = 0.55,
  className,
  ...rest
}) {
  const reduceMotion = useReducedMotion()
  const Tag = m[as] ?? m.div

  if (reduceMotion) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** A hairline that draws itself in from the left. */
export function RevealRule({ delay = 0, className }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <div className={className ? `hr ${className}` : 'hr'} />

  return (
    <m.div
      className={className ? `hr ${className}` : 'hr'}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -5% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 0.61, 0.36, 1] }}
    />
  )
}
