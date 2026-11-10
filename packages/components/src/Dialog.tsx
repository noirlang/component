import { AnimatePresence, motion } from 'motion/react'
import { useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button, IconButton } from './Button'
import { useRefraction } from './glass/refraction'
import { IconX } from './icons'
import { useModal } from './internal/modal'
import { isBrowser } from './internal/util'
import { fade, spring } from './motion'

export type DialogProps = {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeLabel?: string
}

export function Dialog({ open, onClose, title, description, children, footer, size = 'md', closeLabel = 'Close' }: DialogProps) {
  const panel = useModal<HTMLDivElement>(open, onClose)
  useRefraction(panel, { enabled: open, blur: 14, strength: 26, bezel: 22 })
  const id = useId()
  if (!isBrowser) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="nc-overlay" data-place="center">
          <motion.div className="nc-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade} onClick={onClose} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal
            aria-labelledby={`${id}-t`}
            aria-describedby={description ? `${id}-d` : undefined}
            tabIndex={-1}
            className="nc-glass-strong nc-dialog"
            data-size={size}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97, transition: fade }}
            transition={spring.soft}
          >
            <header className="nc-dialog-head">
              <div>
                <h2 id={`${id}-t`} className="nc-dialog-title">
                  {title}
                </h2>
                {description && (
                  <p id={`${id}-d`} className="nc-dialog-desc">
                    {description}
                  </p>
                )}
              </div>
              <IconButton label={closeLabel} size="sm" onClick={onClose}>
                <IconX />
              </IconButton>
            </header>
            {children && <div className="nc-dialog-body">{children}</div>}
            {footer && <footer className="nc-dialog-foot">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function Confirm({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger,
  busy,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: ReactNode
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  busy?: boolean
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button tone="quiet" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button tone={danger ? 'danger' : 'primary'} onClick={onConfirm} busy={busy} data-autofocus>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Dialog>
  )
}
