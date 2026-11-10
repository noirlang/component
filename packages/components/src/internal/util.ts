import type { CSSProperties, Ref, RefCallback } from 'react'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    for (const r of refs) {
      if (typeof r === 'function') r(node)
      else if (r) (r as { current: T | null }).current = node
    }
  }
}

/** Typed helper for inline CSS custom properties. */
export const vars = (v: Record<string, string | number>) => v as CSSProperties

export const isBrowser = typeof window !== 'undefined'
