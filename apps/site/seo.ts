import type { Plugin } from 'vite'
import { docMeta, groupMeta } from './src/meta'

export const SITE_URL = 'https://component.noirlang.tr'
const REPO = 'https://github.com/noirlang/component'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Static copy of the page for crawlers and link previews. React replaces it on mount. */
function prerender() {
  const sections = groupMeta
    .map((g) => {
      const items = docMeta
        .filter((d) => d.group === g.id)
        .map((d) => `<article id="${d.id}"><h3>${esc(d.name)}</h3><p>${esc(d.desc)}</p></article>`)
        .join('')
      return `<section><h2>${esc(g.label)}</h2>${items}</section>`
    })
    .join('')
  const nav = docMeta.map((d) => `<a href="#${d.id}">${esc(d.name)}</a>`).join(' ')
  return `<div class="prerender">
<header><h1>noirLang Components</h1>
<p>iOS 27 liquid glass’tan esinlenen React componentleri. Düz CSS, açık ve koyu tema, tek bağımlılık: Motion. Cam yalnızca yüzen katmanlarda; içerik opak ve sakin kalır.</p>
<pre><code>bun add @noirlang/components</code></pre></header>
<nav aria-label="Componentler">${nav}</nav>
<main>${sections}</main>
</div>`
}

function jsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE_URL}/#site`, url: `${SITE_URL}/`, name: 'noirLang Components', inLanguage: 'tr', publisher: { '@id': 'https://noirlang.tr/#org' } },
      { '@type': 'Organization', '@id': 'https://noirlang.tr/#org', name: 'noirLang', url: 'https://noirlang.tr' },
      {
        '@type': 'SoftwareSourceCode',
        name: '@noirlang/components',
        description: 'iOS 27 liquid glass’tan esinlenen, sade ve hareketli React componentleri.',
        url: `${SITE_URL}/`,
        codeRepository: REPO,
        programmingLanguage: ['TypeScript', 'CSS'],
        runtimePlatform: 'React',
        license: 'https://opensource.org/licenses/MIT',
        author: { '@id': 'https://noirlang.tr/#org' },
        hasPart: docMeta.map((d) => ({ '@type': 'SoftwareSourceCode', name: d.name, description: d.desc, url: `${SITE_URL}/#${d.id}` })),
      },
    ],
  }
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

export function seo(): Plugin {
  return {
    name: 'noir-seo',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL).replace('<!--seo-jsonld-->', jsonLd()).replace('<!--seo-prerender-->', prerender()),
  }
}
