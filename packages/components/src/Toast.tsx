import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from './Button'
import { useRefraction } from './glass/refraction'
import { IconAlert, IconCheck, IconInfo, IconX } from './icons'
import { isBrowser, vars } from './internal/util'
import { spring } from './motion'

export type ToastTone = 'success' | 'error' | 'info'
export type ToastInput = { title: ReactNode; body?: ReactNode; tone?: ToastTone; action?: { label: string; onClick: () => void }; duration?: number }
type Item = ToastInput & { id: number; tone: ToastTone }

let items: Item[] = []
let seq = 0
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())

/** Show a toast from anywhere. Needs one <Toaster /> mounted. Returns the toast id. */
export function toast(t: ToastInput | string): number {
  const item: Item = typeof t === 'string' ? { id: ++seq, title: t, tone: 'success' } : { tone: 'info', ...t, id: ++seq }
  items = [...items.slice(-3), item]
  emit()
  return item.id
}
toast.error = (title: ReactNode, body?: ReactNode) => toast({ title, body, tone: 'error' })
toast.dismiss = (id: number) => {
  items = items.filter((x) => x.id !== id)
  emit()
}

const icons = { success: IconCheck, error: IconAlert, info: IconInfo }
const colors = { success: 'var(--nc-green)', error: 'var(--nc-red)', info: 'var(--nc-cyan)' }

function ToastCard({ t, closeLabel }: { t: Item; closeLabel: string }) {
  const ref = useRef<HTMLLIElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useRefraction(ref, { blur: 10, strength: 16, bezel: 16 })
  const ms = t.duration ?? (t.tone === 'error' ? 6000 : 4000)
  const start = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => toast.dismiss(t.id), ms)
  }
  useEffect(() => {
    start()
    return () => clearTimeout(timer.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const Icon = icons[t.tone]
  return (
    <motion.li
      ref={ref}
      layout
      className="nc-glass-strong nc-toast"
      role={t.tone === 'error' ? 'alert' : 'status'}
      style={vars({ '--nc-tone': colors[t.tone] })}
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.16 } }}
      transition={spring.smooth}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.2, right: 0.9 }}
      onDragEnd={(_, i) => {
        if (i.offset.x > 90 || i.velocity.x > 500) toast.dismiss(t.id)
      }}
      onPointerEnter={() => clearTimeout(timer.current)}
      onPointerLeave={start}
    >
      <span className="nc-toast-icon">
        <Icon size={15} />
      </span>
      <div className="nc-grow">
        <p className="nc-toast-title">{t.title}</p>
        {t.body && <p className="nc-toast-body">{t.body}</p>}
      </div>
      {t.action && (
        <button
          type="button"
          className="nc-toast-action"
          onClick={() => {
            t.action!.onClick()
            toast.dismiss(t.id)
          }}
        >
          {t.action.label}
        </button>
      )}
      <IconButton label={closeLabel} size="sm" onClick={() => toast.dismiss(t.id)}>
        <IconX size={14} />
      </IconButton>
    </motion.li>
  )
}

/** Toast stack. Swipe right to dismiss; hovering pauses the timer. */
export function Toaster({ position = 'bottom-right', closeLabel = 'Dismiss' }: { position?: 'bottom-right' | 'bottom' | 'top'; closeLabel?: string }) {
  const list = useSyncExternalStore(
    (f) => (subs.add(f), () => subs.delete(f)),
    () => items,
    () => items,
  )
  if (!isBrowser) return null
  return createPortal(
    <ol className="nc-toaster" data-position={position} aria-live="polite">
      <AnimatePresence initial={false}>
        {list.map((t) => (
          <ToastCard key={t.id} t={t} closeLabel={closeLabel} />
        ))}
      </AnimatePresence>
    </ol>,
    document.body,
  )
}
