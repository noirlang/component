import { cx } from './internal/util'

export const Spinner = ({ size = 16, className, label }: { size?: number; className?: string; label?: string }) => (
  <span className={cx('nc-spinner', className)} style={{ width: size, height: size }} role={label ? 'status' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />
)
