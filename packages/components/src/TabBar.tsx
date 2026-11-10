import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef, type ReactNode } from 'react'
import { trackSheen } from './Glass'
import { useRefraction } from './glass/refraction'
import { cx } from './internal/util'
import { spring } from './motion'

export type TabBarItem<T extends string = string> = { value: T; label: string; icon: ReactNode }

/**
 * Floating glass tab bar. The selection bubble slides between tabs.
 * Set `compact` (e.g. while the page scrolls down) to fold labels away.
 */
export function TabBar<T extends string>({ items, value, onChange, compact, label = 'Tabs', className }: { items: TabBarItem<T>[]; value: T; onChange: (v: T) => void; compact?: boolean; label?: string; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  const lid = useId()
  useRefraction(ref, { blur: 5, strength: 20, bezel: 20 })
  return (
    <motion.nav ref={ref} layout transition={spring.smooth} aria-label={label} className={cx('nc-glass nc-tabbar', className)} data-compact={compact || undefined} data-interactive onPointerMove={trackSheen}>
      {items.map((it) => {
        const on = it.value === value
        return (
          <motion.button key={it.value} layout="position" type="button" aria-current={on ? 'page' : undefined} aria-label={compact ? it.label : undefined} className="nc-tabbar-item" onClick={() => onChange(it.value)} whileTap={{ scale: 0.92 }} transition={spring.snappy}>
            {on && <motion.span layoutId={lid} className="nc-tabbar-pill" transition={spring.smooth} />}
            <span className="nc-tabbar-icon">{it.icon}</span>
            <AnimatePresence initial={false}>
              {!compact && (
                <motion.span className="nc-tabbar-label" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={spring.smooth}>
                  {it.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </motion.nav>
  )
}
