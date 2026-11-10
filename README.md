# noir-components

iOS 27 liquid glass'tan esinlenen React component paketi ve demo sitesi.

```
packages/components   kütüphane (npm: @noirlang/components) — ayrıntılar onun README'sinde
apps/site             componentleri gösteren tek sayfalık demo
```

Bu depoda çalışma kuralları ve tasarım mimarisi: [CLAUDE.md](./CLAUDE.md). Paketi kullanma rehberi: [SKILL.md](./SKILL.md).

```sh
bun install
bun run dev         # demo sitesi: http://localhost:5180 (kütüphanenin kaynağını doğrudan kullanır)
bun run build       # kütüphane (dist/) + site
bun run typecheck
```

Yayınlamak için: `cd packages/components && bun run build && bun publish`.
