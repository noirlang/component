import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cx } from './internal/util'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cx('nc-input', className)} {...rest} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, rows = 3, ...rest }, ref) {
  return <textarea ref={ref} rows={rows} className={cx('nc-input', 'nc-textarea', className)} {...rest} />
})

/** Label + control + hint/error. The control is wrapped in a <label>, so no ids are needed. */
export function Field({ label, hint, error, children, className }: { label: ReactNode; hint?: ReactNode; error?: ReactNode; children: ReactNode; className?: string }) {
  const id = useId()
  return (
    <div className={cx('nc-field', className)} data-invalid={error ? '' : undefined}>
      <label className="nc-field-control">
        <span className="nc-field-label">{label}</span>
        {children}
      </label>
      {(error || hint) && (
        <p id={id} className="nc-field-note" role={error ? 'alert' : undefined}>
          {error || hint}
        </p>
      )}
    </div>
  )
}
