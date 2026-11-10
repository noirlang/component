import { forwardRef, useRef, type ButtonHTMLAttributes } from 'react'
import { trackSheen } from './Glass'
import { useRefraction } from './glass/refraction'
import { Spinner } from './Spinner'
import { cx, mergeRefs } from './internal/util'

export type ButtonTone = 'primary' | 'secondary' | 'quiet' | 'danger' | 'glass'
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ButtonTone; size?: 'sm' | 'md' | 'lg'; busy?: boolean }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ tone = 'secondary', size = 'md', busy, className, children, disabled, type = 'button', onPointerMove, ...rest }, fwd) {
  const ref = useRef<HTMLButtonElement>(null)
  const glass = tone === 'glass'
  useRefraction(ref, { enabled: glass, bezel: 12, strength: 14, blur: 4 })
  return (
    <button
      ref={mergeRefs(ref, fwd)}
      type={type}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      data-tone={tone}
      data-size={size}
      data-interactive={glass || undefined}
      className={cx('nc-btn', glass && 'nc-glass', className)}
      onPointerMove={(e) => {
        if (glass) trackSheen(e)
        onPointerMove?.(e)
      }}
      {...rest}
    >
      {busy && <Spinner size={14} />}
      {children}
    </button>
  )
})

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: 'quiet' | 'secondary' | 'glass'; size?: 'sm' | 'md' | 'lg' }

/** Square button with only an icon. `label` becomes its accessible name and tooltip. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ label, tone = 'quiet', size = 'md', className, type = 'button', onPointerMove, ...rest }, fwd) {
  const ref = useRef<HTMLButtonElement>(null)
  const glass = tone === 'glass'
  useRefraction(ref, { enabled: glass, bezel: 10, strength: 10, blur: 4 })
  return (
    <button
      ref={mergeRefs(ref, fwd)}
      type={type}
      aria-label={label}
      title={label}
      data-tone={tone}
      data-size={size}
      data-interactive={glass || undefined}
      className={cx('nc-icon-btn', glass && 'nc-glass', className)}
      onPointerMove={(e) => {
        if (glass) trackSheen(e)
        onPointerMove?.(e)
      }}
      {...rest}
    />
  )
})
