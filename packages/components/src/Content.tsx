import { motion } from 'motion/react'
import type { HTMLAttributes, ReactNode } from 'react'
import { IconChevron } from './icons'
import { cx, vars } from './internal/util'
import { spring } from './motion'
import type { Tone } from './Badges'

/** Opaque surface for content. Glass stays on the chrome above it. */
export function Card({ title, description, actions, interactive, className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { title?: ReactNode; description?: ReactNode; actions?: ReactNode; interactive?: boolean }) {
  return (
    <div className={cx('nc-card', className)} data-interactive={interactive || undefined} {...rest}>
      {(title || actions) && (
        <div className="nc-card-head">
          <div>
            {title && <h3 className="nc-card-title">{title}</h3>}
            {description && <p className="nc-card-desc">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}

/** Grouped list, iOS settings style. Fill it with <Row>. */
export function List({ header, footer, children, className }: { header?: ReactNode; footer?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cx('nc-list-wrap', className)}>
      {header && <p className="nc-list-note">{header}</p>}
      <ul className="nc-list">{children}</ul>
      {footer && <p className="nc-list-note">{footer}</p>}
    </div>
  )
}

export function Row({ icon, tone = 'accent', title, subtitle, trailing, onClick, href, chevron }: { icon?: ReactNode; tone?: Tone; title: ReactNode; subtitle?: ReactNode; trailing?: ReactNode; onClick?: () => void; href?: string; chevron?: boolean }) {
  const inner = (
    <>
      {icon && (
        <span className="nc-row-icon" style={vars({ '--nc-tone': `var(--nc-${tone})` })}>
          {icon}
        </span>
      )}
      <span className="nc-row-text">
        <span className="nc-row-title">{title}</span>
        {subtitle && <span className="nc-row-sub">{subtitle}</span>}
      </span>
      {trailing && <span className="nc-row-trailing">{trailing}</span>}
      {(chevron ?? Boolean(onClick || href)) && <IconChevron size={16} className="nc-row-chevron" />}
    </>
  )
  return (
    <li>
      {href ? (
        <a className="nc-row" data-action href={href}>
          {inner}
        </a>
      ) : onClick ? (
        <button type="button" className="nc-row" data-action onClick={onClick}>
          {inner}
        </button>
      ) : (
        <div className="nc-row">{inner}</div>
      )}
    </li>
  )
}

export function Empty({ icon, title, children, action }: { icon?: ReactNode; title: ReactNode; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="nc-empty">
      {icon && <div className="nc-empty-icon">{icon}</div>}
      <p className="nc-empty-title">{title}</p>
      {children && <div className="nc-empty-body">{children}</div>}
      {action}
    </div>
  )
}

export function Skeleton({ width, height = 14, radius, circle, className }: { width?: number | string; height?: number | string; radius?: number | string; circle?: boolean; className?: string }) {
  return <span aria-hidden className={cx('nc-skeleton', className)} style={{ width: circle ? height : width, height, borderRadius: circle ? '50%' : radius }} />
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <span className="nc-skeleton-text" aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </span>
  )
}

/** Linear progress. `value` is 0–1; leave it out for an indeterminate bar. */
export function Progress({ value, label, className }: { value?: number; label: string; className?: string }) {
  const v = value === undefined ? undefined : Math.max(0, Math.min(1, value))
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v === undefined ? undefined : Math.round(v * 100)} className={cx('nc-progress', className)} data-indeterminate={v === undefined || undefined}>
      {v === undefined ? <span className="nc-progress-bar" /> : <motion.span className="nc-progress-bar" initial={false} animate={{ scaleX: v }} transition={spring.soft} />}
    </div>
  )
}

export function ProgressRing({ value, size = 40, stroke = 4, label }: { value: number; size?: number; stroke?: number; label: string }) {
  const r = (size - stroke) / 2
  const v = Math.max(0, Math.min(1, value))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="nc-ring" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="nc-ring-track" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="nc-ring-bar" initial={false} animate={{ pathLength: v }} transition={spring.soft} />
    </svg>
  )
}
