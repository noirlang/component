import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

// Open modals, innermost last. Only the top one reacts to Escape and Tab.
const stack: symbol[] = []
let locks = 0
let prevOverflow = ''

function lockScroll() {
  if (locks++ === 0) {
    prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
  }
}
function unlockScroll() {
  if (--locks === 0) document.documentElement.style.overflow = prevOverflow
}

/** Focus trap, Escape to close, scroll lock and focus return for dialogs, sheets and palettes. */
export function useModal<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const panel = useRef<T>(null)
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    if (!open) return
    const me = Symbol()
    stack.push(me)
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== me) return
      if (e.key === 'Escape') {
        e.stopPropagation()
        close.current()
      }
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (!f.length) return e.preventDefault()
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey, true)
    lockScroll()
    const raf = requestAnimationFrame(() => {
      const p = panel.current
      if (!p || p.contains(document.activeElement)) return
      ;(p.querySelector<HTMLElement>('[autofocus],[data-autofocus],input,textarea') ?? p.querySelector<HTMLElement>(FOCUSABLE) ?? p).focus()
    })
    return () => {
      cancelAnimationFrame(raf)
      stack.splice(stack.indexOf(me), 1)
      document.removeEventListener('keydown', onKey, true)
      unlockScroll()
      prev?.focus?.()
    }
  }, [open])

  return panel
}
