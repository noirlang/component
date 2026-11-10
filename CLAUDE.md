# noir-components

iOS 27 liquid glass'tan esinlenen React component paketi (`packages/components`, npm: `@noirlang/components`) ve onu gösteren tek sayfalık demo (`apps/site`). Bun workspace.

Paketi **başka bir projede kullanmak** için: `SKILL.md`. Bu dosya **bu depoda çalışmak** içindir.

## Komutlar

```sh
bun install
bun run dev          # site, http://localhost:5180 — kütüphanenin kaynağını alias ile kullanır, build gerekmez
bun run typecheck    # paket + site
bun run build        # paket: dist/index.js + dist/styles.css + .d.ts; ardından site
```

Değişiklik "bitti" sayılmadan önce: `bun run typecheck` ve `bun run build` temiz geçmeli, değişen component sitede koyu ve açık temada, 390px ve masaüstü genişlikte açılıp bakılmalı.

## Yapı

```
packages/components/src/
  styles/tokens.css      renk, cam, yarıçap, easing tokenları (--nc-*)
  styles/base.css        box-sizing, buton sıfırlama, focus halkası, reduced-motion
  styles/glass.css       .nc-glass / .nc-glass-strong, Ambient
  styles/controls.css    Temel grubun stilleri
  styles/overlays.css    Katmanlar grubunun stilleri
  styles/navigation.css  Navigasyon grubunun stilleri
  styles/content.css     İçerik grubunun stilleri
  glass/refraction.ts    useRefraction: displacement haritası + SVG backdrop filtresi
  internal/modal.ts      useModal: odak tuzağı, Escape, scroll kilidi, odak iadesi, modal yığını
  internal/util.ts       cx, mergeRefs, vars, isBrowser
  motion.ts              spring.snappy / smooth / soft, fade
  icons.tsx              paketin kendi kullandığı birkaç satır içi ikon
  <Component>.tsx        componentler (küçük akrabalar aynı dosyada: Button+IconButton, Dialog+Confirm…)
  index.ts               public API — yalnızca buradan export edilen şeyler pakettir
  entry.ts               yalnızca build girişi: CSS'i dist/styles.css'e çeker (index.ts CSS import ETMEZ)
apps/site/src/
  meta.ts                component kayıtları (id, group, name, desc) — JSX'siz, vite.config de okur
  docs.tsx               her kayıt için canlı demo ve kod örneği
  App.tsx                kabuk: Toolbar, kenar menü, TabBar, CommandPalette, Toaster
  ui.tsx                 Stage (demo alanı + zeminler), Code (kopyalanabilir blok)
  site.css               yalnızca site stilleri
apps/site/seo.ts         vite eklentisi: canonical/OG adresleri, JSON-LD, tarayıcı-dışı botlar için statik içerik
apps/site/public/        favicon.svg (Camiro "N"), apple-touch-icon.png, og.png, robots.txt, sitemap.xml
```

Site `https://component.noirlang.tr` adresinde yayınlanır; adres `seo.ts`'teki `SITE_URL`'de, `robots.txt` ve `sitemap.xml`'de geçer.

## Tasarım mimarisi

Üç katman, her biri yalnızca altındakine dayanır:

```
1. Tokenlar     tokens.css          --nc-bg, --nc-accent, --nc-glass-*, --nc-r-*, --nc-ease-*
2. Malzemeler   glass.css + yüzey    cam (yüzen katmanlar)  |  opak yüzey (--nc-surface, --nc-sunk)
3. Componentler *.tsx + grup CSS'i   malzemeyi seçer, davranışı ekler
```

### Malzeme kuralı: cam mı, opak mı?

- **Cam** yalnızca içeriğin *üstünde yüzen* şeylere: Toolbar, TabBar, Dialog, Sheet, Popover/Menu, Tooltip, Toast, CommandPalette, `tone="glass"` butonlar.
- **Opak** içeriğin kendisine: Card, List/Row, Input, Segmented, Empty, kod blokları.
- **Cam üstüne cam yok.** Cam bir panelin içindeki kontroller opak ya da yarı saydam dolgu kullanır (`color-mix(in oklab, var(--nc-bright) 10%, transparent)` gibi), asla ikinci bir `.nc-glass` kullanmaz.
- `strong` (yoğun tint) çok metin taşıyan camlar içindir: Dialog, Sheet, menü, palet, toast. Çubuklar normal camdır.

### Cam iki katmanlıdır

1. **CSS cam** (`glass.css`), her tarayıcıda: `blur(22px) saturate(180%)`, `inset 0 1px 0` parlak üst kenar, alt kenarda iç gölge, `::before` ile sol üst parıltı. `data-interactive` olunca parıltı imleci izler (`--nc-mx/--nc-my`, `trackSheen`).
2. **Kırılma** (`useRefraction`), yalnızca Chromium: elemanın gerçek boyutu ve köşe yarıçapıyla bir displacement haritası çizilir, `feImage → feDisplacementMap` filtresi `backdrop-filter: url(#id)` olarak **inline** yazılır. ResizeObserver ile yeniden çizilir. Destek yoksa ya da `prefers-reduced-transparency` açıksa hiçbir şey yapmaz, 1. katman kalır.

Kırılma ayarı componente göre: çubuklar `blur 3–5`, paneller `blur 10–14`; `strength` ve `bezel` eleman büyüdükçe artar. Overlay'ler `enabled: open` geçirir (panel yalnızca açıkken DOM'da).

### Hareket kuralları

- Yalnızca üç spring (`motion.ts`): `snappy` basma ve küçük göstergeler, `smooth` menü/seçim/kayan göstergeler, `soft` büyük yüzeyler. Yeni süre/eğri uydurma.
- Her animasyon bir durum değişimini anlatır: açılma, seçim, basma, ilerleme. Süs animasyonu, sürekli dönen/titreşen şey, konfeti yok.
- Seçim göstergeleri `layoutId={useId()}` ile kayar (Segmented, Tabs, TabBar, palet vurgusu).
- Basma geri bildirimi CSS ile: normal kontroller `:active` → `scale(.92–.97)`; cam kontroller tersine büyür (`1.04–1.08`), Switch topuzu uzar ve cama döner.
- CSS geçişlerinde `--nc-ease-spring` / `--nc-ease-out` kullan.
- `prefers-reduced-motion`: CSS tarafı `base.css`'te kapatılır; Motion tarafını `NoirProvider` içindeki `MotionConfig reducedMotion="user"` halleder.

### CSS kuralları

- Her kural `@layer noir { … }` içinde. Katmansız uygulama CSS'i her zaman kazanmalı.
- Sınıf öneki `nc-`, değişken öneki `--nc-`. Varyantlar sınıfla değil **data attribute** ile: `data-tone`, `data-size`, `data-variant`, `data-side`, `data-compact`. Durum için ARIA kullan (`[aria-checked='true']`, `[aria-current='page']`, `[aria-selected='true']`).
- Renkler yalnızca token. Ton gereken yerde componente `--nc-tone` ver (`vars({ '--nc-tone': 'var(--nc-cyan)' })`), CSS `var(--nc-tone)` okur.
- Yeni token eklersen **iki tema bloğuna da** ekle. `--nc-accent` gibi başka tokena bakan tokenlar da her tema bloğunda tanımlanır, yoksa iç içe `data-theme` yanlış rengi miras alır.
- Tailwind, CSS-in-JS, harici UI kütüphanesi yok. Paketin tek runtime bağımlılığı `motion`.

### Component kuralları

- Kontrollü API: `value` + `onChange(value)` (onChange event değil **değer** verir). Tabs gibi gerekirse `defaultValue` ile kontrolsüz de çalışır.
- Görünür etiket yoksa `label` prop'u zorunlu ve `aria-label` olur (IconButton, Slider, Segmented, Progress).
- Sabit metinler İngilizce varsayılanla prop olur: `closeLabel`, `cancelLabel`, `confirmLabel`, `placeholder`, `empty`.
- Overlay'ler `createPortal(…, document.body)` ve `isBrowser` kontrolü ile; modal olanlar `useModal` kullanır.
- DOM elemanı saran componentler `forwardRef` kullanır ve kalan prop'ları elemana yayar.
- Native davranış varsa onu kullan (Slider = `input[type=range]`, Checkbox/Switch = `button role=checkbox|switch`).

## Yeni component eklemek

1. `packages/components/src/<Ad>.tsx` — yukarıdaki kurallarla; spring'leri `motion.ts`'ten al.
2. Stili ilgili grup CSS dosyasına, `@layer noir` içine yaz.
3. `index.ts`'ten export et (tipleriyle).
4. `apps/site/src/meta.ts`'e kayıt ekle (`id`, `group`, `name`, Türkçe tek cümle `desc`), `docs.tsx`'te aynı `id` ile `demos` içine `Demo` + kısa `code` yaz. Kenar menü, TabBar, ⌘K araması, SEO için statik HTML ve JSON-LD bu kayıttan otomatik oluşur.
5. `packages/components/SKILL.md`'deki API tablosuna ekle (kökteki `SKILL.md` ona symlink; pakete o dosya girer). Prop adlarını ve varsayılanları koddan kopyala, tahmin etme.
6. Typecheck, build, sitede iki tema × iki genişlik, klavye ile dene.

## Site

- Site metinleri Türkçe, sade: başlık, tek cümle açıklama, canlı örnek, kod. Pazarlama bölümü, gradyan başlık, emoji, sahte istatistik yok.
- Cam demoları `Stage backdrop="lines" | "color" | "type"` ile renkli zemin üstünde gösterilir ki kırılma görünsün; diğerleri düz ızgara zeminde.
- Sol üstteki marka: Camiro fontuyla (`src/assets/noirlang-font.ttf`) yeşil `NOIRLANG` + soluk `components`.
- Demo verisinde gerçek kişi bilgisi kullanma; uydurma isimler (Ada Lovelace, Deniz Kaya…) kullan.

## Bilinen sınırlar

- Kırılma yalnızca Chromium'da; Safari test edilmedi. Headless Firefox `backdrop-filter`'ı tutarsız çiziyor, gerçek Firefox'ta gözle bakılmalı.
- `Popover` açıkken içinde olduğu modal da Escape'i yakalar (modal capture aşamasında dinler); iç içe popover+modal'da Escape ikisini birden kapatabilir.
