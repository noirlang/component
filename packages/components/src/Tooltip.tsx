import { AnimatePresence, motion } from 'motion/react'
import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { isBrowser } from './internal/util'
import { spring } from './motion'

/** Short label on hover or keyboard focus. Wraps a single focusable element. */
export function Tooltip({ content, children, delay = 350 }: { content: ReactNode; children: ReactElement<{ 'aria-describedby'?: string }>; delay?: number }) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({ left: -9999, top: 0 })
  const [below, setBelow] = useState(false)
  const anchor = useRef<HTMLSpanElement>(null)
  const tip = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const id = useId()

  const show = (wait: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), wait)
  }
  const hide = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  useLayoutEffect(() => {
    if (!open || !anchor.current || !tip.current) return
    const a = anchor.current.getBoundingClientRect()
    const t = tip.current.getBoundingClientRect()
    const flip = a.top - t.height - 8 < 0
    setBelow(flip)
    setStyle({ left: Math.max(8, Math.min(a.left + a.width / 2 - t.width / 2, innerWidth - t.width - 8)), top: flip ? a.bottom + 8 : a.top - t.height - 8 })
  }, [open])

  return (
    <>
      <span ref={anchor} className="nc-tooltip-anchor" onPointerEnter={() => show(delay)} onPointerLeave={hide} onFocus={() => show(0)} onBlur={hide} onKeyDown={(e) => e.key === 'Escape' && hide()}>
        {cloneElement(children, { 'aria-describedby': open ? id : undefined })}
      </span>
      {isBrowser &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={tip}
                id={id}
                role="tooltip"
                className="nc-glass-strong nc-tooltip"
                style={style}
                initial={{ opacity: 0, scale: 0.92, y: below ? -4 : 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.1 } }}
                transition={spring.snappy}
              >
                {content}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
