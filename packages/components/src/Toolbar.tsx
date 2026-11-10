import type { HTMLAttributes, ReactNode } from 'react'
import { Glass } from './Glass'
import { cx } from './internal/util'

export type ToolbarProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & { leading?: ReactNode; title?: ReactNode; trailing?: ReactNode; sticky?: boolean }

/** Floating glass bar: leading slot, title, trailing actions. `sticky` pins it to the top while content scrolls under it. */
export function Toolbar({ leading, title, trailing, sticky, className, ...rest }: ToolbarProps) {
  return (
    <Glass as="header" className={cx('nc-toolbar', className)} data-sticky={sticky || undefined} refract={{ blur: 4, strength: 18, bezel: 18 }} {...rest}>
      {leading && <div className="nc-toolbar-side">{leading}</div>}
      {title && <div className="nc-toolbar-title">{title}</div>}
      {trailing && <div className="nc-toolbar-side nc-toolbar-trailing">{trailing}</div>}
    </Glass>
  )
}
