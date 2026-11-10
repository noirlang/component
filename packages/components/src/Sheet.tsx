import { AnimatePresence, motion, useDragControls } from 'motion/react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from './Button'
import { useRefraction } from './glass/refraction'
import { IconX } from './icons'
import { useModal } from './internal/modal'
import { isBrowser } from './internal/util'
import { fade, spring } from './motion'

export type SheetProps = {
  open: boolean
  onClose: () => void
  /** Accessible name. Shown as the heading when `title` is not given. */
  label: string
  title?: ReactNode
  children: ReactNode
  /** `bottom` slides up and can be dragged down to dismiss; `right` is a side panel. */
  side?: 'bottom' | 'right'
  closeLabel?: string
}

export function Sheet({ open, onClose, label, title, children, side = 'bottom', closeLabel = 'Close' }: SheetProps) {
  const panel = useModal<HTMLDivElement>(open, onClose)
  useRefraction(panel, { enabled: open, blur: 14, strength: 24, bezel: 22 })
  const drag = useDragControls()
  const bottom = side === 'bottom'
  if (!isBrowser) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="nc-overlay" data-place={side}>
          <motion.div className="nc-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade} onClick={onClose} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal
            aria-label={label}
            tabIndex={-1}
            className="nc-glass-strong nc-sheet"
            data-side={side}
            initial={bottom ? { y: '100%' } : { x: '100%' }}
            animate={{ x: 0, y: 0 }}
            exit={bottom ? { y: '100%', transition: { duration: 0.22, ease: 'easeIn' } } : { x: '100%', transition: { duration: 0.2, ease: 'easeIn' } }}
            transition={spring.soft}
            drag={bottom ? 'y' : false}
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.04, bottom: 1 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose()
            }}
          >
            <header className="nc-sheet-head" onPointerDown={bottom ? (e) => drag.start(e) : undefined}>
              {bottom && <span className="nc-sheet-grabber" aria-hidden />}
              <h2 className="nc-sheet-title">{title ?? label}</h2>
              <IconButton label={closeLabel} size="sm" onClick={onClose} onPointerDown={(e) => e.stopPropagation()}>
                <IconX />
              </IconButton>
            </header>
            <div className="nc-sheet-body">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
