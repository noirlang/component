---
name: noir-components
description: >-
  @noirlang/components (noir-components) React UI kütüphanesiyle arayüz kurma rehberi (iOS 27 liquid glass, düz CSS, Motion).
  Use when a project depends on `@noirlang/components`, or the user asks for noir / noirLang components,
  liquid glass UI, glass toolbar/tab bar/sheet/dialog, or wants to build screens (settings, lists,
  forms, app shell, command palette, toasts) with this kit. Covers install, theming, Tailwind setup,
  the full component API, design rules (when glass vs opaque), recipes and common mistakes.
---

# noir-components

iOS 27 liquid glass'tan esinlenen React componentleri. Düz CSS (`@layer noir`), açık/koyu tema, tek runtime bağımlılığı `motion`. React 18+.

## 1. Kurulum

```sh
bun add @noirlang/components        # npm i / pnpm add da olur
```

Stil dosyasını **bir kez**, uygulamanın girişinde import et:

```tsx
import '@noirlang/components/styles.css'
import { NoirProvider, Toaster } from '@noirlang/components'

createRoot(root).render(
  <NoirProvider storageKey="theme" defaultTheme="system">
    <App />
    <Toaster />
  </NoirProvider>,
)
```

- `NoirProvider` isteğe bağlı: `<html data-theme>` yazar, `system` iken işletim sistemini izler, Motion'a reduced-motion'a uymasını söyler. Yoksa her şey koyu temada çalışır.
- Tema yanıp sönmesin diye `index.html`'e, React yüklenmeden önce çalışan küçük bir betik koy:

```html
<script>
  try {
    var t = localStorage.getItem('theme') || 'system'
    if (t === 'system') t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    document.documentElement.dataset.theme = t
  } catch (e) {}
</script>
```

- **Tailwind v4** projelerinde sırayı bir kez bildir, yoksa preflight butonları sıfırlar:

```css
@layer theme, base, noir, components, utilities;
@import 'tailwindcss';
@import '@noirlang/components/styles.css';
```

  Bu sırayla Tailwind utility'leri (`className="rounded-none"` gibi) noir stillerini ezebilir.
- **Next.js**: paket `'use client'` ile işaretli, doğrudan import edilir. `NoirProvider`'ı bir client layout'a koy.

## 2. Tasarım kuralları

Bu kuralları bozan bir arayüz kurma; kütüphane bunlara göre tasarlandı.

1. **Cam yalnızca yüzen katmanlarda.** Toolbar, TabBar, Dialog, Sheet, Menu, Tooltip, Toast, CommandPalette camdır. Card, List, Input, sayfa arka planı opaktır. Kendi yüzen elemanın için `<Glass>` kullan, içerik kutusu için `<Card>`.
2. **Cam üstüne cam koyma.** Glass içine `<Glass>` ya da `tone="glass"` buton koyma; içerde normal (`quiet`, `secondary`) kontroller kullan.
3. **Camın bükecek bir şeyi olsun.** Düz tek renkli zeminde cam görünmez. Sayfaya `<Ambient />` (yavaş renk alanı) ekle ya da camı görsellerin/içeriğin üstünde gezdir.
4. **Tek vurgu rengi.** Varsayılan `--nc-accent` yeşil. Değiştirmek için `:root { --nc-accent: var(--nc-cyan) }`. Pill/Row tonları durum anlatmak için, süs için değil.
5. **Hareketi çoğaltma.** Componentlerin kendi animasyonları yeter. Ekleyeceksen `spring.snappy | smooth | soft` kullan ve yalnızca durum değişimlerini canlandır.
6. Sabit metinleri yerelleştir: `closeLabel`, `cancelLabel`, `confirmLabel`, `placeholder`, `empty` prop'ları (varsayılanlar İngilizce).

## 3. API

Tüm `onChange` callback'leri **değeri** verir, event'i değil: `onChange={setOn}` doğrudan çalışır.

### Cam ve tema

| Export | Kullanım |
|---|---|
| `Glass` | `as?` (eleman, varsayılan `div`), `strong?` (yoğun tint), `variant?: 'regular' \| 'clear'`, `refract?: boolean \| RefractionOptions` (varsayılan açık), `interactive?` (parıltı imleci izler) + tüm HTML attribute'ları. Boyut, radius ve padding'i sen verirsin. |
| `useRefraction(ref, opts?)` | Kendi elemanına kırılma ekler. `opts`: `enabled`, `bezel` (18), `strength` (22), `blur` (6), `saturate` (1.7). Elemanın `nc-glass` sınıfı ve bir `border-radius`'u olmalı. |
| `refractionSupported` | Tarayıcı kırılmayı çizebiliyor mu (Chromium). |
| `useReducedTransparency()` | Kullanıcı saydamlığı azalttıysa `true`. |
| `NoirProvider` | `defaultTheme?: 'dark' \| 'light' \| 'system'`, `storageKey?`. |
| `useTheme()` | `{ theme, resolved, setTheme }`. |
| `Ambient` | Sabit renk alanı. `contained` ile en yakın `position: relative` ebeveyni doldurur. |
| `spring`, `cx` | Hareket sabitleri ve sınıf birleştirici. |
| `IconX`, `IconCheck`, `IconAlert`, `IconInfo`, `IconSearch`, `IconChevron` | Paketin kendi küçük ikonları (`size`). Geri kalanı için kendi ikon setini kullan. |

### Temel

| Component | Props |
|---|---|
| `Button` | `tone?: 'primary' \| 'secondary' \| 'quiet' \| 'danger' \| 'glass'` (varsayılan `secondary`), `size?: 'sm' \| 'md' \| 'lg'`, `busy?` (spinner + disabled). `type` varsayılanı `button`. Ref iletir. |
| `IconButton` | `label` **zorunlu** (aria-label + title), `tone?: 'quiet' \| 'secondary' \| 'glass'`, `size?`. Çocuk olarak tek ikon. |
| `Input`, `Textarea` | Native attribute'lar; ref iletir. `Textarea` `rows` varsayılanı 3. |
| `Field` | `label`, `hint?`, `error?` (kırmızı çerçeve + `role="alert"`), `children` (kontrol). Kontrolü label sarar, `id` gerekmez. |
| `Checkbox` | `checked`, `onChange(bool)`, görünür etiket için `children` ya da yalnızca `label`, `disabled?`. |
| `Switch` | `Checkbox` ile aynı. Etiket solda, anahtar sağda durur. |
| `Slider` | `value`, `onChange(number)`, `label` **zorunlu**, `min` (0), `max` (100), `step` (1). |
| `Segmented` | `options: { value, label, title? }[]`, `value`, `onChange`, `label` **zorunlu**, `size?: 'sm' \| 'md'`. 2–5 seçenek için. |
| `Pill` | `tone?: Tone` (`green \| cyan \| magenta \| orange \| yellow \| red \| dim \| accent`, varsayılan `dim`). |
| `Kbd` | `<Kbd>⌘</Kbd><Kbd>K</Kbd>` |
| `Avatar` | `name`, `src?`, `size?` (32). Görsel yoksa baş harfler, renk addan türetilir. |
| `AvatarStack` | `people: { name, src? }[]`, `max?` (4), `size?` (28). |
| `Spinner` | `size?` (16), `label?` (verilirse `role="status"`). Rengi metinden alır. |

### Katmanlar

| Component | Props |
|---|---|
| `Dialog` | `open`, `onClose`, `title`, `description?`, `children?`, `footer?` (sağa hizalı butonlar), `size?: 'sm' \| 'md' \| 'lg'`, `closeLabel?`. Odak tuzağı, Escape, scroll kilidi, odak iadesi hazır. İlk input'a ya da `data-autofocus` taşıyan elemana odaklanır. |
| `Confirm` | `open`, `onClose`, `onConfirm`, `title`, `children` (açıklama), `confirmLabel?`, `cancelLabel?`, `danger?`, `busy?`. |
| `Sheet` | `open`, `onClose`, `label` (zorunlu, başlık da olur), `title?`, `children`, `side?: 'bottom' \| 'right'` (varsayılan `bottom`; tutamaktan aşağı çekince kapanır), `closeLabel?`. |
| `Popover` | `open`, `onClose`, `anchor` (ref), `align?: 'start' \| 'end'`, `children`. Portal içinde açılır, aşağıda yer yoksa yukarı açılır; dışarı tıklama ve Escape kapatır. |
| `Menu` | `trigger` (tek bir React elemanı, **ref iletmeli**), `items: (MenuItem \| 'separator')[]`, `align?`, `label?`. `MenuItem`: `label`, `onSelect?`, `icon?`, `hint?`, `danger?`, `disabled?`. Açık/kapalı durumunu kendisi tutar. |
| `Tooltip` | `content`, `children` (tek, odaklanabilir eleman), `delay?` (350ms). Klavye odağında hemen açılır. |
| `Toaster` | Bir kez mount et. `position?: 'bottom-right' \| 'bottom' \| 'top'`, `closeLabel?`. |
| `toast()` | `toast('Kaydedildi')` (başarılı), `toast.error(title, body?)`, `toast({ title, body?, tone?: 'success' \| 'error' \| 'info', action?: { label, onClick }, duration? })` → id; `toast.dismiss(id)`. En fazla 4 toast; kaydırınca kapanır, üzerine gelince süre durur. |

### Navigasyon

| Component | Props |
|---|---|
| `TabBar` | `items: { value, label, icon }[]` (en fazla 5), `value`, `onChange`, `compact?` (etiketleri katlar), `label?`. **Kendini konumlamaz**: sabit alt çubuk için bir sarmalayıcıya koy (bkz. tarif 4.1). |
| `Toolbar` | `leading?`, `title?`, `trailing?`, `sticky?` (üstte yüzer, içerik altından kayar) + `header` attribute'ları (`className`, `style`…). |
| `Tabs` | `items: { value, label, content }[]`, kontrollü (`value` + `onChange`) ya da `defaultValue`, `label?`. |
| `CommandPalette` | `open`, `onClose`, `commands: Command[]`, `placeholder?`, `empty?`. `Command`: `id`, `label`, `onSelect`, `group?`, `hint?`, `icon?`, `keywords?` (aramaya eklenir). ⌘K kısayolunu sen bağlarsın. Arama aksan duyarsız, Türkçe uyumlu. |

### İçerik

| Component | Props |
|---|---|
| `Card` | `title?`, `description?`, `actions?` (sağ üst), `interactive?` (hover'da kalkar) + div attribute'ları. |
| `List` | `header?`, `footer?`, `children` (`Row`'lar). |
| `Row` | `title`, `subtitle?`, `icon?`, `tone?` (ikon zemini, varsayılan `accent`), `trailing?` (metin, Switch, Pill…), `onClick?` ya da `href?` (ok işareti otomatik), `chevron?`. |
| `Empty` | `title`, `children?` (açıklama), `icon?`, `action?` (buton). |
| `Skeleton` | `width?`, `height?` (14), `radius?`, `circle?`. `SkeletonText`: `lines?` (3). |
| `Progress` | `value?` (0–1; verilmezse belirsiz), `label` **zorunlu**. |
| `ProgressRing` | `value` (0–1), `label`, `size?` (40), `stroke?` (4). |

## 4. Tarifler

### 4.1 Uygulama kabuğu (üstte cam toolbar, altta cam tab bar)

```tsx
<>
  <Ambient />
  <Toolbar
    sticky
    style={{ margin: '10px auto 0', width: 'calc(100% - 24px)', maxWidth: 1100 }}
    leading={<IconButton label="Geri" onClick={back}><BackIcon /></IconButton>}
    title="Projeler"
    trailing={<Button tone="primary" size="sm">Yeni</Button>}
  />
  <main>…</main>
  <div style={{ position: 'fixed', left: '50%', bottom: 'calc(14px + env(safe-area-inset-bottom))', transform: 'translateX(-50%)', zIndex: 60 }}>
    <TabBar value={tab} onChange={setTab} compact={scrollingDown} items={[
      { value: 'home', label: 'Ana sayfa', icon: <HomeIcon /> },
      { value: 'inbox', label: 'Gelen', icon: <InboxIcon /> },
    ]} />
  </div>
</>
```

Alt çubuk varken mobilde içeriğe ~100px alt boşluk bırak ve Toaster'ı yukarı al: `.nc-toaster { bottom: 96px }`.

### 4.2 Ayarlar sayfası

```tsx
<List header="Hesap" footer="Bildirimler cihazlar arasında eşitlenir.">
  <Row icon={<UserIcon size={16} />} tone="cyan" title="Profil" subtitle="deniz@ornek.com" onClick={openProfile} />
  <Row icon={<BellIcon size={16} />} tone="red" title="Bildirimler" trailing={<Switch checked={n} onChange={setN} label="Bildirimler" />} />
</List>
```

### 4.3 Form diyaloğu

```tsx
<Dialog open={open} onClose={close} title="Yeni proje" closeLabel="Kapat"
  footer={<><Button tone="quiet" onClick={close}>Vazgeç</Button><Button tone="primary" busy={saving} onClick={save}>Oluştur</Button></>}>
  <Field label="Ad" error={err}><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
</Dialog>
```

### 4.4 Silme onayı + geri al

```tsx
<Confirm open={open} onClose={close} danger busy={busy} title="Proje silinsin mi?" confirmLabel="Sil" cancelLabel="Vazgeç"
  onConfirm={async () => { await remove(); close(); toast({ title: 'Silindi', action: { label: 'Geri al', onClick: undo } }) }}>
  Tüm görevler kalıcı olarak silinir.
</Confirm>
```

### 4.5 ⌘K komut paleti

```tsx
const [open, setOpen] = useState(false)
useEffect(() => {
  const on = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o) }
  }
  addEventListener('keydown', on)
  return () => removeEventListener('keydown', on)
}, [])

<CommandPalette open={open} onClose={() => setOpen(false)} placeholder="Ara…" empty="Sonuç yok"
  commands={[{ id: 'new', label: 'Yeni görev', group: 'Oluştur', hint: 'N', onSelect: create }]} />
```

### 4.6 Satır menüsü

```tsx
<Menu align="end" label="Görev işlemleri"
  trigger={<IconButton label="Daha fazla"><DotsIcon /></IconButton>}
  items={[{ label: 'Düzenle', onSelect: edit }, 'separator', { label: 'Sil', danger: true, onSelect: askDelete }]} />
```

### 4.7 Kendi cam yüzeyin

```tsx
<Glass strong interactive style={{ borderRadius: 28, padding: 20, width: 320 }}>…</Glass>
```

Yarıçapı mutlaka ver: kırılma haritası `border-radius`'a göre çizilir.

## 5. Tema ve özelleştirme

- Token'lar `--nc-` önekli: `bg`, `sunk`, `raised`, `surface`, `fg`, `bright`, `dim`, `muted`, `line`, `green`, `cyan`, `red`, `magenta`, `orange`, `yellow`, `accent`, `on-accent`, `focus`, `scrim`, `glass-bg`, `glass-strong`, `glass-clear`, `glass-border`, `glass-hi`, `glass-edge`, `glass-shadow`, `r-sm…r-2xl`, `ease-out`, `ease-spring`.
- Katmansız CSS ile ezilir: `:root { --nc-accent: #7aa2f7 }`. Temaya özel ezmek için `[data-theme='light'] { … }`.
- `data-theme="light"` herhangi bir elemana konabilir; o alt ağaç açık temayla çizilir.
- Tek bir componenti değiştirmek için `className` ver ve `.nc-*` sınıflarını kendi CSS'inde hedefle. Katman sırası sayesinde senin kuralın kazanır.
- Kendi bileşenlerinde de aynı token'ları kullan ki uygulama tutarlı kalsın: `background: var(--nc-surface); border: 1px solid var(--nc-line); border-radius: var(--nc-r-lg)`.

## 6. Sık yapılan hatalar

- `styles.css`'i import etmemek ya da iki kez import etmek.
- `onChange={(e) => setX(e.target.checked)}` yazmak; Checkbox/Switch/Slider/Segmented değeri doğrudan verir.
- `Menu` `trigger`'ına ref iletmeyen bir component vermek; menü konumlanamaz. Kendi butonunu `forwardRef` ile yaz ya da `Button`/`IconButton` kullan.
- `Tooltip` içine birden fazla eleman ya da odaklanamayan bir `span` koymak.
- `<Toaster />`'ı birden fazla yerde mount etmek ya da hiç mount etmeden `toast()` çağırmak.
- `TabBar`'ın kendini sabitlemesini beklemek; konumu sarmalayıcı verir.
- Card'ı ya da sayfa zeminini `Glass` ile yapmak; cam yalnızca yüzen katmanlar için.
- Tailwind projesinde katman sırasını bildirmemek; butonlar şeffaf görünür.
- `IconButton`, `Slider`, `Segmented` ve `Progress`'e `label` vermemek; erişilebilir adı olmaz.
- Kırılmanın her tarayıcıda olacağını varsaymak; Chromium dışında cam bulanık yedek görünüme döner, tasarım buna göre de okunaklı olmalı.
