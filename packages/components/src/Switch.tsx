import type { ReactNode } from 'react'

export type SwitchProps = { checked: boolean; onChange: (checked: boolean) => void; children?: ReactNode; label?: string; disabled?: boolean }

/** Thumb stretches while pressed and turns to glass, then springs across. */
export function Switch({ checked, onChange, children, label, disabled }: SwitchProps) {
  const sw = (
    <button type="button" role="switch" aria-checked={checked} aria-label={children ? undefined : label} disabled={disabled} onClick={() => onChange(!checked)} className="nc-switch">
      <span className="nc-switch-thumb" />
    </button>
  )
  if (!children) return sw
  return (
    <label className="nc-check-row" data-disabled={disabled || undefined}>
      <span className="nc-grow">{children}</span>
      {sw}
    </label>
  )
}
