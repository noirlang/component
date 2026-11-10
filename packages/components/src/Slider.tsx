import type { InputHTMLAttributes } from 'react'
import { cx, vars } from './internal/util'

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label: string
}

/** Native range input (keyboard and screen readers for free) with a pill thumb that swells into glass while dragged. */
export function Slider({ value, onChange, min = 0, max = 100, step = 1, label, className, style, ...rest }: SliderProps) {
  const p = max > min ? ((value - min) / (max - min)) * 100 : 0
  return (
    <input
      type="range"
      aria-label={label}
      className={cx('nc-slider', className)}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ ...vars({ '--nc-p': `${p}%` }), ...style }}
      {...rest}
    />
  )
}
