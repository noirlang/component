import { useLayoutEffect, useSyncExternalStore, type RefObject } from 'react'
import { isBrowser } from '../internal/util'

/*
 * Real lens refraction for glass surfaces.
 *
 * A displacement map is drawn for the element's exact size and corner radius:
 * neutral in the middle, bending inward along a curved bezel at the edges, like the
 * rim of a thick glass slab. It feeds an SVG filter used as `backdrop-filter: url(#id)`.
 *
 * Only Chromium renders SVG filters as backdrop filters; everywhere else the element
 * keeps the CSS glass (blur + saturation) from glass.css, so nothing breaks.
 */

const NS = 'http://www.w3.org/2000/svg'

type Brand = { brand: string }
export const refractionSupported: boolean =
  isBrowser &&
  (((navigator as Navigator & { userAgentData?: { brands?: Brand[] } }).userAgentData?.brands ?? []).some((b) => b.brand === 'Chromium') ||
    (/Chrome\/\d+/.test(navigator.userAgent) && !/Firefox|FxiOS|CriOS|EdgiOS/.test(navigator.userAgent)))

let host: SVGSVGElement | null = null
let seq = 0

function svgHost() {
  if (host?.isConnected) return host
  host = document.createElementNS(NS, 'svg')
  host.setAttribute('aria-hidden', 'true')
  host.setAttribute('width', '0')
  host.setAttribute('height', '0')
  host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
  document.body.appendChild(host)
  return host
}

const el = (name: string, attrs: Record<string, string | number>) => {
  const n = document.createElementNS(NS, name)
  for (const k in attrs) n.setAttribute(k, String(attrs[k]))
  return n
}

/** Displacement map for a w×h rounded rect, as a PNG data URL. R = x shift, G = y shift, 128 = none. */
export function displacementMap(w: number, h: number, radius: number, bezel: number): string {
  const k = Math.min(1, 320 / Math.max(w, h)) // maps are stretched back up; keep big panes cheap
  const W = Math.max(2, Math.round(w * k))
  const H = Math.max(2, Math.round(h * k))
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  const img = ctx.createImageData(W, H)
  const d = img.data
  const hw = w / 2
  const hh = h / 2
  const r = Math.min(radius, hw, hh)
  const b = Math.max(1, Math.min(bezel, hw, hh))
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = (x + 0.5) / k - hw
      const py = (y + 0.5) / k - hh
      const qx = Math.abs(px) - (hw - r)
      const qy = Math.abs(py) - (hh - r)
      let nx = 0
      let ny = 0
      let dist: number // distance from the outline, positive inside
      if (qx > 0 && qy > 0) {
        const l = Math.hypot(qx, qy) || 1
        dist = r - l
        nx = (qx / l) * Math.sign(px)
        ny = (qy / l) * Math.sign(py)
      } else if (qx > qy) {
        dist = r - qx
        nx = Math.sign(px)
      } else {
        dist = r - qy
        ny = Math.sign(py)
      }
      let m = 0
      if (dist >= 0 && dist < b) {
        const t = 1 - dist / b // 1 at the rim, 0 where the bezel meets the flat face
        m = 1 - Math.sqrt(1 - t * t) // circular bezel profile: steep at the rim
      }
      const i = (y * W + x) * 4
      // Sample inward (towards the centre) so the rim magnifies what is just inside it.
      d[i] = 128 - nx * m * 127
      d[i + 1] = 128 - ny * m * 127
      d[i + 2] = 128
      d[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

const RT = '(prefers-reduced-transparency: reduce)'
const subscribeRT = (cb: () => void) => {
  const mq = matchMedia(RT)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
/** Live `prefers-reduced-transparency`, so glass turns solid the moment the setting changes. */
export const useReducedTransparency = () =>
  useSyncExternalStore(
    subscribeRT,
    () => matchMedia(RT).matches,
    () => false,
  )

export type RefractionOptions = {
  /** Turn the effect on/off. Overlays pass their `open` state here. */
  enabled?: boolean
  /** Width of the curved rim in px. */
  bezel?: number
  /** Maximum shift at the rim in px. */
  strength?: number
  /** Backdrop blur in px (applied before refraction). */
  blur?: number
  /** Backdrop saturation multiplier. */
  saturate?: number
}

/**
 * Applies refraction to the element in `ref`. Safe to call everywhere:
 * it does nothing on the server, outside Chromium, or with reduced transparency.
 */
export function useRefraction(ref: RefObject<HTMLElement | null>, { enabled = true, bezel = 18, strength = 22, blur = 6, saturate = 1.7 }: RefractionOptions = {}) {
  const reduced = useReducedTransparency()
  useLayoutEffect(() => {
    const node = ref.current
    if (!node || !enabled || !refractionSupported || reduced) return

    const id = `nc-refract-${++seq}`
    const filter = el('filter', { id, x: 0, y: 0, width: '100%', height: '100%', 'color-interpolation-filters': 'sRGB' })
    const image = el('feImage', { x: 0, y: 0, preserveAspectRatio: 'none', result: 'map' })
    filter.append(
      el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: blur, result: 'soft' }),
      image,
      el('feDisplacementMap', { in: 'soft', in2: 'map', scale: strength * 2, xChannelSelector: 'R', yChannelSelector: 'G', result: 'bent' }),
      el('feColorMatrix', { in: 'bent', type: 'saturate', values: saturate }),
    )
    svgHost().appendChild(filter)

    let last = ''
    let raf = 0
    const update = () => {
      const w = node.offsetWidth
      const h = node.offsetHeight
      if (!w || !h) return
      const r = parseFloat(getComputedStyle(node).borderTopLeftRadius) || 0
      const key = `${w}x${h}:${r}`
      if (key === last) return
      last = key
      image.setAttribute('width', String(w))
      image.setAttribute('height', String(h))
      image.setAttribute('href', displacementMap(w, h, r, bezel))
      node.style.setProperty('backdrop-filter', `url(#${id})`)
      node.style.setProperty('-webkit-backdrop-filter', `url(#${id})`)
      node.dataset.refract = ''
    }
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    })
    ro.observe(node)
    update()

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      filter.remove()
      node.style.removeProperty('backdrop-filter')
      node.style.removeProperty('-webkit-backdrop-filter')
      delete node.dataset.refract
    }
  }, [ref, enabled, reduced, bezel, strength, blur, saturate])
}
