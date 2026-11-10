import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from './internal/util'
import { spring } from './motion'

export type TabItem<T extends string = string> = { value: T; label: ReactNode; content: ReactNode }

/** Text tabs with a sliding underline. Controlled (`value` + `onChange`) or not (`defaultValue`). */
export function Tabs<T extends string>({ items, value, defaultValue, onChange, label, className }: { items: TabItem<T>[]; value?: T; defaultValue?: T; onChange?: (v: T) => void; label?: string; className?: string }) {
  const [own, setOwn] = useState<T>(defaultValue ?? items[0]?.value)
  const current = value ?? own
  const id = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const select = (v: T) => {
    setOwn(v)
    onChange?.(v)
  }
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : null
    if (n === null) return
    e.preventDefault()
    const k = (n + items.length) % items.length
    select(items[k].value)
    refs.current[k]?.focus()
  }
  const active = items.find((t) => t.value === current)
  return (
    <div className={cx('nc-tabs', className)}>
      <div role="tablist" aria-label={label} className="nc-tablist">
        {items.map((t, i) => {
          const on = t.value === current
          return (
            <button
              key={t.value}
              ref={(n) => {
                refs.current[i] = n
              }}
              type="button"
              role="tab"
              id={`${id}-t-${t.value}`}
              aria-selected={on}
              aria-controls={`${id}-p`}
              tabIndex={on ? 0 : -1}
              className="nc-tab"
              onClick={() => select(t.value)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {t.label}
              {on && <motion.span layoutId={id} className="nc-tab-line" transition={spring.smooth} />}
            </button>
          )
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          id={`${id}-p`}
          role="tabpanel"
          aria-labelledby={`${id}-t-${current}`}
          tabIndex={0}
          className="nc-tabpanel"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}
          transition={spring.smooth}
        >
          {active?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
