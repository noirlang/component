import { motion, useReducedMotion } from 'motion/react'
import { cx } from './internal/util'

const blobs = [
  { c: 'green', x: '8%', y: '12%', s: 520, d: [0, 60, -30, 0] },
  { c: 'cyan', x: '70%', y: '4%', s: 460, d: [0, -50, 40, 0] },
  { c: 'magenta', x: '82%', y: '62%', s: 540, d: [0, 40, -60, 0] },
  { c: 'orange', x: '18%', y: '78%', s: 420, d: [0, -40, 30, 0] },
]

/**
 * Slow colour field behind the page so glass has something to bend.
 * Fixed to the viewport by default; `contained` fills the nearest positioned parent instead.
 */
export function Ambient({ contained, className }: { contained?: boolean; className?: string }) {
  const still = useReducedMotion()
  return (
    <div aria-hidden className={cx('nc-ambient', className)} data-contained={contained || undefined}>
      {blobs.map((b, i) => (
        <motion.div
          key={b.c}
          className="nc-ambient-blob"
          style={{ left: b.x, top: b.y, width: b.s, height: b.s, background: `radial-gradient(circle, var(--nc-${b.c}) 0%, transparent 65%)` }}
          animate={still ? undefined : { x: b.d, y: b.d.map((v) => -v * 0.7) }}
          transition={{ duration: 34 + i * 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
