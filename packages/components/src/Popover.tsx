import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useRefraction } from './glass/refraction'
import { cx, isBrowser, mergeRefs } from './internal/util'
import { spring } from './motion'

export type PopoverProps = {
  open: boolean
  onClose: () => void
  /** Element the popover hangs from. */
  anchor: RefObject<HTMLElement | null>
  align?: 'start' | 'end'
  children: ReactNode
  className?: string
  panelRef?: RefObject<HTMLDivElement | null>
}

/**
 * Floating glass panel anchored to an element. Rendered in a portal so no
 * `overflow: hidden` parent can clip it; opens upward when there is no room below.
 */
export function Popover({ open, onClose, anchor, align = 'start', children, className, panelRef }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ style: CSSProperties; up: boolean } | null>(null)
  const close = useRef(onClose)
  close.current = onClose
  useRefraction(ref, { enabled: open, blur: 10, strength: 16, bezel: 14 })

  useLayoutEffect(() => {
    if (!open) return setPos(null)
    const place = () => {
      const a = anchor.current
      if (!a) return
      const r = a.getBoundingClientRect()
      const pw = ref.current?.offsetWidth ?? 220
      const ph = ref.current?.offsetHeight ?? 240
      const left = Math.max(8, Math.min(align === 'end' ? r.right - pw : r.left, innerWidth - pw - 8))
      const up = r.bottom + ph + 8 > innerHeight && r.top > ph + 8
      setPos({ up, style: up ? { left, bottom: innerHeight - r.top + 6 } : { left, top: r.bottom + 6 } })
    }
    place()
    addEventListener('scroll', place, true)
    addEventListener('resize', place)
    return () => {
      removeEventListener('scroll', place, true)
      removeEventListener('resize', place)
    }
  }, [open, align, anchor])

  useEffect(() => {
    if (!open) return
    const out = (e: PointerEvent) => {
      const t = e.target as Node
      if (!ref.current?.contains(t) && !anchor.current?.contains(t)) close.current()
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      close.current()
      anchor.current?.focus()
    }
    document.addEventListener('pointerdown', out)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', out)
      document.removeEventListener('keydown', esc)
    }
  }, [open, anchor])

  if (!isBrowser) return null
  const origin = `${pos?.up ? 'bottom' : 'top'} ${align === 'end' ? 'right' : 'left'}`
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={mergeRefs(ref, panelRef)}
          className={cx('nc-glass-strong nc-popover', className)}
          style={{ ...(pos?.style ?? { left: -9999, top: 0 }), transformOrigin: origin }}
          initial={{ opacity: 0, scale: 0.94, y: pos?.up ? 6 : -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
          transition={spring.smooth}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
