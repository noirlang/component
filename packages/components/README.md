# noir-components

iOS 27 liquid glass'tan esinlenen React componentleri. Düz CSS, açık ve koyu tema, tek bağımlılık: [Motion](https://motion.dev).

```sh
bun add @noirlang/components
```

```tsx
import '@noirlang/components/styles.css'
import { NoirProvider, Toaster, Button, toast } from '@noirlang/components'

export function Root() {
  return (
    <NoirProvider storageKey="theme">
      <Button tone="primary" onClick={() => toast('Kaydedildi')}>Kaydet</Button>
      <Toaster />
    </NoirProvider>
  )
}
```

`NoirProvider` zorunlu değil. `<html>` üzerine `data-theme` yazar, `system` seçiliyse işletim sistemini izler ve Motion'a kullanıcının hareket azaltma tercihine uymasını söyler. Provider yoksa componentler koyu temayla çalışır.

## Componentler

| Grup | |
|---|---|
| Cam | `Glass`, `useRefraction`, `Ambient` |
| Temel | `Button`, `IconButton`, `Input`, `Textarea`, `Field`, `Checkbox`, `Switch`, `Slider`, `Segmented`, `Pill`, `Kbd`, `Avatar`, `AvatarStack`, `Spinner` |
| Katmanlar | `Dialog`, `Confirm`, `Sheet`, `Popover`, `Menu`, `Tooltip`, `Toaster` + `toast()` |
| Navigasyon | `TabBar`, `Toolbar`, `Tabs`, `CommandPalette` |
| İçerik | `Card`, `List`, `Row`, `Empty`, `Skeleton`, `SkeletonText`, `Progress`, `ProgressRing` |

Canlı örnekler ve kodları demo sitesinde: `apps/site`. Tüm API, tarifler ve tasarım kuralları: [SKILL.md](./SKILL.md) (pakete dahil; AI ajanları `node_modules/@noirlang/components/SKILL.md` üzerinden okuyabilir).

## Cam

Cam yalnızca içeriğin üstünde yüzen katmanlar içindir: çubuklar, menüler, sayfalar, bildirimler. Cam üstüne cam konmaz; kartlar ve listeler opak kalır.

İki katman var:

1. **CSS cam** her tarayıcıda: `blur + saturate`, parlak üst kenar, koyu alt kenar, sol üstte parıltı.
2. **Kırılma** yalnızca Chromium'da: elemanın boyutuna ve köşe yarıçapına göre bir displacement haritası çizilir, `backdrop-filter: url(#…)` olarak uygulanır. Kenarlar mercek gibi bükülür. Diğer tarayıcılar 1. katmanda kalır.

`prefers-reduced-transparency: reduce` açıkken cam opak yüzeye döner, kırılma kapanır.

```tsx
<Glass interactive>…</Glass>
<Glass variant="clear" refract={{ strength: 30, bezel: 24 }}>…</Glass>

// Kendi elemanınıza
const ref = useRef<HTMLDivElement>(null)
useRefraction(ref, { blur: 6, strength: 22, bezel: 18 })
```

## Tema

Palet megaron'dan: koyu tarafta Tokyo Night, açık tarafta Flexoki kağıt tonları. Her şey `--nc-*` değişkeni:

```css
:root { --nc-accent: var(--nc-cyan); }          /* vurgu rengi */
[data-theme='light'] { --nc-bg: #fff; }           /* tek bir token */
```

`data-theme` herhangi bir elemana konabilir; o alt ağaç o temayla çizilir.

## Stil katmanı

Tüm kurallar `@layer noir` içinde, bu yüzden uygulamanızın katmansız CSS'i her zaman kazanır. Tailwind v4 ile sırayı bir kez bildirin, böylece preflight componentleri sıfırlamaz ve utility sınıfları ezebilir:

```css
@layer theme, base, noir, components, utilities;
@import 'tailwindcss';
@import '@noirlang/components/styles.css';
```

## Erişilebilirlik

- Dialog, Sheet ve CommandPalette odağı içeride tutar, Escape ile kapanır, kapanınca odağı geri verir. İç içe açıldıklarında yalnızca en üstteki tepki verir.
- Menu, Segmented ve Tabs ok tuşlarıyla gezilir; Slider yerel `range` girdisidir.
- Sabit metinler (`Close`, `Cancel`, `Dismiss`) prop ile değiştirilir: `closeLabel`, `cancelLabel`.
- Hareketler `prefers-reduced-motion`'a uyar.

## Next.js

Paket `'use client'` ile işaretli; Server Component'lerden doğrudan import edilebilir.
