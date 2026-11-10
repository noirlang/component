import { useEffect, useMemo, useState } from 'react'
import { Ambient, CommandPalette, IconButton, Kbd, Pill, TabBar, Toaster, Toolbar, Tooltip, useTheme, type Command } from '@noirlang/components'
import { docs, groups, type Group } from './docs'
import { Copy, Moon, Search, Sun } from './icons'
import { Code, copy } from './ui'

const install = 'bun add @noirlang/components'
const usage = `import '@noirlang/components/styles.css'
import { NoirProvider, Toaster, Button } from '@noirlang/components'

<NoirProvider storageKey="theme">
  <App />
  <Toaster />
</NoirProvider>`

const jump = (id: string) => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

/** Section currently under the reading line, for the sidebar and tab bar. */
function useActiveSection() {
  const [active, setActive] = useState(docs[0].id)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-30% 0px -65% 0px' },
    )
    docs.forEach((d) => {
      const el = document.getElementById(d.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return active
}

/** True while the page scrolls down, so the tab bar can fold its labels. */
function useScrollingDown() {
  const [down, setDown] = useState(false)
  useEffect(() => {
    let last = scrollY
    const on = () => {
      const y = scrollY
      if (Math.abs(y - last) < 12) return
      setDown(y > last && y > 240)
      last = y
    }
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return down
}

export function App() {
  const { resolved, setTheme } = useTheme()
  const active = useActiveSection()
  const compact = useScrollingDown()
  const [palette, setPalette] = useState(false)
  const activeGroup = docs.find((d) => d.id === active)?.group ?? 'glass'

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((o) => !o)
      }
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [])

  const toggleTheme = () => setTheme(resolved === 'dark' ? 'light' : 'dark')

  const commands = useMemo<Command[]>(
    () => [
      ...docs.map((d) => ({ id: d.id, label: d.name, group: groups.find((g) => g.id === d.group)!.label, keywords: d.desc, onSelect: () => jump(d.id) })),
      { id: 'theme', label: 'Temayı değiştir', group: 'Sayfa', icon: <Sun size={16} />, onSelect: toggleTheme },
      { id: 'install', label: 'Kurulum komutunu kopyala', group: 'Sayfa', onSelect: () => copy(install) },
    ],
    [resolved], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <>
      <Ambient />
      <Toolbar
          sticky
          className="topbar"
          leading={
            <a href="#" className="brand" aria-label="noirLang components" onClick={(e) => (e.preventDefault(), scrollTo({ top: 0, behavior: 'smooth' }))}>
              <span className="brand-logo">NOIRLANG</span>
              <span className="brand-sep" aria-hidden />
              <span className="brand-name">components</span>
            </a>
          }
          trailing={
            <>
              <Pill className="hide-sm">v0.1</Pill>
              <button type="button" className="search-btn" onClick={() => setPalette(true)}>
                <Search size={15} />
                <span className="hide-sm">Ara</span>
                <span className="hide-sm search-keys">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </span>
              </button>
              <Tooltip content={resolved === 'dark' ? 'Açık tema' : 'Koyu tema'}>
                <IconButton label="Temayı değiştir" onClick={toggleTheme}>
                  {resolved === 'dark' ? <Sun /> : <Moon />}
                </IconButton>
              </Tooltip>
            </>
          }
        />

      <div className="layout">
        <nav className="sidebar" aria-label="Componentler">
          {groups.map((g) => (
            <div key={g.id} className="side-group">
              <p className="side-label">{g.label}</p>
              {docs
                .filter((d) => d.group === g.id)
                .map((d) => (
                  <a
                    key={d.id}
                    href={`#${d.id}`}
                    className="side-link"
                    aria-current={active === d.id ? 'location' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      jump(d.id)
                    }}
                  >
                    {d.name}
                  </a>
                ))}
            </div>
          ))}
        </nav>

        <main className="main">
          <header className="intro">
            <h1>noirLang Components</h1>
            <p className="lede">iOS 27 liquid glass’tan esinlenen React componentleri. Düz CSS, açık ve koyu tema, tek bağımlılık: Motion. Cam yalnızca yüzen katmanlarda; içerik opak ve sakin kalır.</p>
            <div className="install">
              <code>{install}</code>
              <IconButton label="Komutu kopyala" size="sm" onClick={() => copy(install)}>
                <Copy size={15} />
              </IconButton>
            </div>
            <Code>{usage}</Code>
          </header>

          {groups.map((g) => (
            <section key={g.id} className="group" aria-labelledby={`g-${g.id}`}>
              <h2 id={`g-${g.id}`} className="group-title">
                {g.label}
              </h2>
              {docs
                .filter((d) => d.group === g.id)
                .map((d) => (
                  <article key={d.id} id={d.id} className="doc">
                    <h3>
                      <a href={`#${d.id}`}>{d.name}</a>
                    </h3>
                    <p className="doc-desc">{d.desc}</p>
                    <div className="doc-demo">
                      <d.Demo />
                    </div>
                    <Code>{d.code}</Code>
                  </article>
                ))}
            </section>
          ))}

          <footer className="foot">
            <p>
              MIT. Cam yaklaşımı megaron’dan, palet Tokyo Night ve Flexoki’den. Kırılma Chromium’da çalışır, diğer tarayıcılar bulanık cama düşer.
            </p>
          </footer>
        </main>
      </div>

      <div className="dock">
        <TabBar<Group>
          label="Bölümler"
          value={activeGroup}
          compact={compact}
          onChange={(g) => jump(docs.find((d) => d.group === g)!.id)}
          items={groups.map((g) => ({ value: g.id, label: g.label, icon: <g.icon size={20} /> }))}
        />
      </div>

      <CommandPalette open={palette} onClose={() => setPalette(false)} commands={commands} placeholder="Component ara…" empty="Sonuç yok" />
      <Toaster closeLabel="Kapat" />
    </>
  )
}
