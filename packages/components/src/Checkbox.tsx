import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Visible label. Without it, pass `label` for screen readers. */
  children?: ReactNode
  label?: string
  disabled?: boolean
}

/** Round check; the tick draws itself in. */
export function Checkbox({ checked, onChange, children, label, disabled }: CheckboxProps) {
  const box = (
    <button type="button" role="checkbox" aria-checked={checked} aria-label={children ? undefined : label} disabled={disabled} onClick={() => onChange(!checked)} className="nc-check">
      <svg viewBox="0 0 16 16" aria-hidden>
        <motion.path d="M3.5 8.5 6.5 11.5 12.5 4.5" initial={false} animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }} transition={{ duration: 0.22, ease: 'easeOut' }} />
      </svg>
    </button>
  )
  if (!children) return box
  return (
    <label className="nc-check-row" data-disabled={disabled || undefined}>
      {box}
      <span>{children}</span>
    </label>
  )
}
