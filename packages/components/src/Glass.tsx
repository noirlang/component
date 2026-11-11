import { forwardRef, useRef, type AllHTMLAttributes, type ElementType, type PointerEvent } from 'react'
import { useRefraction, type RefractionOptions } from './glass/refraction'
import { cx, mergeRefs } from './internal/util'

/** Any HTML attribute is accepted, so `as="a"` can take href/target/rel, `as="button"` type, and so on. */
export type GlassProps = Omit<AllHTMLAttributes<HTMLElement>, 'as'> & {
  as?: ElementType
  /** Denser tint for surfaces that carry a lot of text (menus, dialogs). */
  strong?: boolean
  /** `regular` reads well over anything; `clear` lets more of the backdrop through. */
  variant?: 'regular' | 'clear'
  /** Lens refraction at the rim (Chromium). Pass options to tune it, `false` to turn it off. */
  refract?: boolean | RefractionOptions
  /** Sheen follows the pointer. For glass the user touches: buttons, bars. */
  interactive?: boolean
}

export function trackSheen(e: PointerEvent<HTMLElement>) {
  const t = e.currentTarget
  const r = t.getBoundingClientRect()
  t.style.setProperty('--nc-mx', `${e.clientX - r.left}px`)
  t.style.setProperty('--nc-my', `${e.clientY - r.top}px`)
}

/** A pane of liquid glass. Use it for chrome that floats over content, never glass on glass. */
export const Glass = forwardRef<HTMLElement, GlassProps>(function Glass({ as: Tag = 'div', strong, variant = 'regular', refract = true, interactive, className, onPointerMove, ...rest }, fwd) {
  const ref = useRef<HTMLElement>(null)
  const opts = typeof refract === 'object' ? refract : { enabled: refract }
  useRefraction(ref, { blur: variant === 'clear' ? 1.5 : strong ? 10 : 6, ...opts })
  return (
    <Tag
      ref={mergeRefs(ref, fwd)}
      className={cx(strong ? 'nc-glass-strong' : 'nc-glass', className)}
      data-variant={variant}
      data-interactive={interactive || undefined}
      onPointerMove={
        interactive
          ? (e: PointerEvent<HTMLElement>) => {
              trackSheen(e)
              onPointerMove?.(e)
            }
          : onPointerMove
      }
      {...rest}
    />
  )
})
