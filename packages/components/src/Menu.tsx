import { cloneElement, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactElement, type ReactNode } from 'react'
import { Popover } from './Popover'

export type MenuItem =
  | { label: ReactNode; onSelect?: () => void; icon?: ReactNode; hint?: ReactNode; danger?: boolean; disabled?: boolean }
  | 'separator'

type TriggerProps = { ref?: unknown; onClick?: (e: MouseEvent) => void }

/** Button that opens a glass menu. Arrow keys move, Enter picks, Escape closes. */
export function Menu({ trigger, items, align = 'start', label }: { trigger: ReactElement<TriggerProps>; items: MenuItem[]; align?: 'start' | 'end'; label?: string }) {
  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLElement>(null)
  const list = useRef<HTMLDivElement>(null)

  const entries = () => [...(list.current?.querySelectorAll<HTMLElement>('[role=menuitem]:not([disabled])') ?? [])]

  useEffect(() => {
    if (!open) return
    const raf = requestAnimationFrame(() => entries()[0]?.focus())
    return () => cancelAnimationFrame(raf)
  }, [open])

  const onKey = (e: KeyboardEvent) => {
    const all = entries()
    const i = all.indexOf(document.activeElement as HTMLElement)
    const go = (n: number) => {
      e.preventDefault()
      all[(n + all.length) % all.length]?.focus()
    }
    if (e.key === 'ArrowDown') go(i + 1)
    else if (e.key === 'ArrowUp') go(i - 1)
    else if (e.key === 'Home') go(0)
    else if (e.key === 'End') go(all.length - 1)
    else if (e.key === 'Tab') setOpen(false)
  }

  const btn = cloneElement(trigger, {
    ref: anchor,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    onClick: (e: MouseEvent) => {
      trigger.props.onClick?.(e)
      setOpen((o) => !o)
    },
  } as TriggerProps)

  return (
    <>
      {btn}
      <Popover open={open} onClose={() => setOpen(false)} anchor={anchor} align={align}>
        <div ref={list} role="menu" aria-label={label} className="nc-menu" onKeyDown={onKey}>
          {items.map((it, i) =>
            it === 'separator' ? (
              <div key={i} role="separator" className="nc-menu-sep" />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={it.disabled}
                data-danger={it.danger || undefined}
                className="nc-menu-item"
                onClick={() => {
                  setOpen(false)
                  anchor.current?.focus()
                  it.onSelect?.()
                }}
              >
                {it.icon && <span className="nc-menu-icon">{it.icon}</span>}
                <span className="nc-grow">{it.label}</span>
                {it.hint && <span className="nc-menu-hint">{it.hint}</span>}
              </button>
            ),
          )}
        </div>
      </Popover>
    </>
  )
}
