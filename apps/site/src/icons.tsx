import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
const I =
  (d: string) =>
  ({ size = 18, ...rest }: P) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...rest}>
      <path d={d} />
    </svg>
  )

export const Drop = I('M12 3.5c3.6 4.2 6 7.6 6 10.6a6 6 0 0 1-12 0c0-3 2.4-6.4 6-10.6Z')
export const Square = I('M5 5h14v14H5zM5 12h14M12 5v14')
export const Layers = I('m12 4 8 4.5-8 4.5-8-4.5L12 4ZM4 13l8 4.5 8-4.5')
export const Compass = I('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15.5 8.5l-2 5-5 2 2-5 5-2Z')
export const Rows = I('M4 6h16M4 12h16M4 18h10')
export const Sun = I('M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4')
export const Moon = I('M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z')
export const Copy = I('M9 9h10v10H9zM5 15V5h10')
export const Search = I('M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-3.5-3.5')
export const Plus = I('M12 5v14M5 12h14')
export const Trash = I('M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3')
export const Pencil = I('M4 20h4L19 9l-4-4L4 16v4Z')
export const Share = I('M12 15V3M7 8l5-5 5 5M5 13v7h14v-7')
export const Bell = I('M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2ZM10 21h4')
export const Wifi = I('M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01')
export const Lock = I('M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3')
export const Home = I('M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z')
export const User = I('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0')
export const Inbox = I('M4 13h4l2 3h4l2-3h4M4 13l3-8h10l3 8v6H4v-6Z')
export const Folder = I('M3 7h7l2 2h9v10H3V7Z')
export const Back = I('m15 6-6 6 6 6')
