import { useState, type ReactNode } from 'react'
import { cx, vars } from './internal/util'

export type Tone = 'green' | 'cyan' | 'magenta' | 'orange' | 'yellow' | 'red' | 'dim' | 'accent'

export function Pill({ tone = 'dim', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cx('nc-pill', className)} style={vars({ '--nc-tone': `var(--nc-${tone})` })}>
      {children}
    </span>
  )
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return <kbd className={cx('nc-kbd', className)}>{children}</kbd>
}

const hues: Tone[] = ['green', 'cyan', 'magenta', 'orange', 'yellow', 'red']
const hueOf = (s: string) => hues[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length]
const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toLocaleUpperCase('tr')

export type Person = { name: string; src?: string }

export function Avatar({ name, src, size = 32, className }: Person & { size?: number; className?: string }) {
  const [broken, setBroken] = useState(false)
  return (
    <span className={cx('nc-avatar', className)} title={name} style={{ width: size, height: size, fontSize: size * 0.38, ...vars({ '--nc-tone': `var(--nc-${hueOf(name)})` }) }}>
      {src && !broken ? <img src={src} alt={name} loading="lazy" onError={() => setBroken(true)} /> : <span aria-label={name}>{initials(name)}</span>}
    </span>
  )
}

export function AvatarStack({ people, max = 4, size = 28 }: { people: Person[]; max?: number; size?: number }) {
  const extra = people.length - max
  return (
    <span className="nc-avatar-stack">
      {people.slice(0, max).map((p, i) => (
        <Avatar key={p.name + i} {...p} size={size} />
      ))}
      {extra > 0 && (
        <span className="nc-avatar nc-avatar-more" style={{ width: size, height: size, fontSize: size * 0.36 }}>
          +{extra}
        </span>
      )}
    </span>
  )
}
