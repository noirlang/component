import { motion } from 'motion/react'
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { spring } from './motion'
import { cx } from './internal/util'

export type SegmentedOption<T extends string> = { value: T; label: ReactNode; title?: string }

/** iOS segmented control. The selection slides between segments; arrow keys move it. */
export function Segmented<T extends string>({ options, value, onChange, label, size = 'md', className }: { options: SegmentedOption<T>[]; value: T; onChange: (v: T) => void; label: string; size?: 'sm' | 'md'; className?: string }) {
  const lid = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const n = (i + step + options.length) % options.length
    onChange(options[n].value)
    refs.current[n]?.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} className={cx('nc-segmented', className)} data-size={size}>
      {options.map((o, i) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            ref={(n) => {
              refs.current[i] = n
            }}
            type="button"
            role="radio"
            aria-checked={on}
            title={o.title}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className="nc-segment"
          >
            {on && <motion.span layoutId={lid} className="nc-segment-pill" transition={spring.smooth} />}
            <span className="nc-segment-label">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
