import type { Transition } from 'motion/react'

/**
 * Three springs cover every movement in the kit:
 * snappy for presses and small indicators, smooth for menus and selections,
 * soft for large surfaces (sheets, dialogs).
 */
export const spring = {
  snappy: { type: 'spring', stiffness: 520, damping: 34 },
  smooth: { type: 'spring', stiffness: 380, damping: 30 },
  soft: { type: 'spring', stiffness: 320, damping: 34 },
} satisfies Record<string, Transition>

export const fade = { duration: 0.15, ease: 'easeOut' } satisfies Transition
