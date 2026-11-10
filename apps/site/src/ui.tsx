import { forwardRef, type ReactNode } from 'react'
import { IconButton, toast } from '@noirlang/components'
import { Copy } from './icons'

export type Backdrop = 'plain' | 'lines' | 'color' | 'type'

const words = 'cam ışık kırılma kenar yüzey derinlik hareket sessiz noir '.repeat(14)

/** Demo area. Non-plain backdrops give glass something to bend. */
export const Stage = forwardRef<HTMLDivElement, { children: ReactNode; backdrop?: Backdrop; tall?: boolean; center?: boolean }>(function Stage({ children, backdrop = 'plain', tall, center = true }, ref) {
  return (
    <div ref={ref} className="stage" data-backdrop={backdrop} data-tall={tall || undefined} data-center={center || undefined}>
      {backdrop === 'type' && (
        <p className="stage-type" aria-hidden>
          {words}
        </p>
      )}
      <div className="stage-content">{children}</div>
    </div>
  )
})

export async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast('Kopyalandı')
  } catch {
    toast.error('Kopyalanamadı', 'Tarayıcı panoya erişime izin vermedi.')
  }
}

export function Code({ children }: { children: string }) {
  return (
    <div className="code">
      <pre>
        <code>{children}</code>
      </pre>
      <IconButton label="Kodu kopyala" size="sm" className="code-copy" onClick={() => copy(children)}>
        <Copy size={15} />
      </IconButton>
    </div>
  )
}
