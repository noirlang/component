import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useRefraction } from './glass/refraction'
import { IconSearch } from './icons'
import { useModal } from './internal/modal'
import { isBrowser } from './internal/util'
import { fade, spring } from './motion'

export type Command = { id: string; label: string; group?: string; hint?: ReactNode; icon?: ReactNode; keywords?: string; onSelect: () => void }

const norm = (s: string) => s.toLocaleLowerCase('tr').normalize('NFKD').replace(/\p{M}/gu, '')

/** 3 = prefix, 2 = substring, 1 = letters in order, 0 = no match. */
function score(c: Command, q: string) {
  const hay = norm(`${c.label} ${c.keywords ?? ''} ${c.group ?? ''}`)
  if (hay.startsWith(q)) return 3
  if (hay.includes(q)) return 2
  let i = 0
  for (const ch of hay) if (ch === q[i]) i++
  return i === q.length ? 1 : 0
}

export function CommandPalette({ open, onClose, commands, placeholder = 'Search…', empty = 'No results' }: { open: boolean; onClose: () => void; commands: Command[]; placeholder?: string; empty?: ReactNode }) {
  const panel = useModal<HTMLDivElement>(open, onClose)
  useRefraction(panel, { enabled: open, blur: 14, strength: 22, bezel: 20 })
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const list = useRef<HTMLUListElement>(null)
  const id = useId()

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
    }
  }, [open])

  const results = useMemo(() => {
    const n = norm(q.trim())
    if (!n) return commands
    return commands
      .map((c, i) => ({ c, s: score(c, n), i }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .map((x) => x.c)
  }, [commands, q])

  useEffect(() => {
    list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (c?: Command) => {
    if (!c) return
    onClose()
    c.onSelect()
  }

  if (!isBrowser) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="nc-overlay" data-place="top">
          <motion.div className="nc-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade} onClick={onClose} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal
            aria-label={placeholder}
            className="nc-glass-strong nc-palette"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: fade }}
            transition={spring.smooth}
          >
            <div className="nc-palette-search">
              <IconSearch size={17} />
              <input
                autoFocus
                role="combobox"
                aria-expanded
                aria-controls={`${id}-l`}
                aria-activedescendant={results[active] ? `${id}-${results[active].id}` : undefined}
                aria-autocomplete="list"
                placeholder={placeholder}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setActive(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    const d = e.key === 'ArrowDown' ? 1 : -1
                    setActive((a) => (results.length ? (a + d + results.length) % results.length : 0))
                  } else if (e.key === 'Enter') {
                    e.preventDefault()
                    run(results[active])
                  }
                }}
              />
            </div>
            <ul ref={list} id={`${id}-l`} role="listbox" className="nc-palette-list">
              {results.length === 0 && <li className="nc-palette-empty">{empty}</li>}
              {results.map((c, i) => {
                const head = !q && c.group && c.group !== results[i - 1]?.group
                return (
                  <li key={c.id} role="presentation">
                    {head && <p className="nc-palette-group">{c.group}</p>}
                    <div id={`${id}-${c.id}`} role="option" aria-selected={i === active} data-i={i} className="nc-palette-item" onPointerMove={() => setActive(i)} onClick={() => run(c)}>
                      {i === active && <motion.span layoutId={`${id}-hl`} className="nc-palette-hl" transition={spring.snappy} />}
                      {c.icon && <span className="nc-palette-icon">{c.icon}</span>}
                      <span className="nc-grow">{c.label}</span>
                      {c.hint && <span className="nc-menu-hint">{c.hint}</span>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
