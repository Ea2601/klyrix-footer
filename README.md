# Klyrix Footer

Shared footer component for the Klyrix product suite — **Klyrix HR**, **Klyrix Platform** (VDS Farm), **Klyrix Ledger**, **Klyrix Support**.

**v2 — framework-agnostic & theme-aware.** Drop into any React app (Next.js App/Pages Router, Vite, CRA, Astro, Remix). **No Tailwind dependency. No i18n hook required. No `@/` path alias.** Footer renders identically whether the host project uses shadcn or MUI or styled-components — it carries its own internal theme palette.

> **Canonical**: v2.1 (`main` branch — always latest) — **2026-07-12: brand asset'ler SVG'den PNG HD set v4.3'e geçti; suffix convention'ı TERSİNE DÖNDÜ** (`-dark` artık koyu zemin İÇİN demek). Eski SVG'ler `legacy-svg/` altında.  
> **Legacy**: v1.0 ([git tag](https://github.com/Ea2601/klyrix-footer/releases/tag/v1.0)) — Tailwind + useLocale required  
> **Live ref**: https://klyrix-hr.com  
> **License**: All rights reserved — see [LICENSE](LICENSE)

---

## Ne kurulur?

- Tema-aware footer (`dark` + `light` zemin desteği)
- 4 ürünlü Suite şeridi — bulunulan app `CURRENT/MEVCUT` badge'li, brand-renkli hover
- Layout/konum tüm app'lerde birebir aynı; sadece **arka plan** ve **yönlendirme linkleri** appe özel
- `max-w-6xl` (1152px) içerik container, atmosphere glow full-width
- Status pill: `/api/health` poll (opsiyonel) veya statik prop
- Mentoforce signature — per-letter reveal animation (CSS append snippet)

## Bağımlılıklar

| Şart | Versiyon |
|---|---|
| React | 18+ |
| Brand assets | `public/brand/{slug}/horizontal-{dark,light}.png` (PNG HD set v4.3; compact varyant yok) |

**Yok**: Tailwind, shadcn, lucide-react, useLocale hook, `@/` alias.

---

## ⚡ Hızlı kurulum (Bash + curl)

Hedef projenin **kök dizininden** (package.json'ın olduğu yer):

```bash
bash <(curl -sSL https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/scripts/install.sh)
```

Bu komut otomatik olarak:
- `src/components/klyrix-footer/` → component dosyaları
- `public/brand/{hr,platform,ledger,support}/` → 8 PNG asset
- `src/app/api/health/route.js` → endpoint (yoksa)
- `src/app/globals.css` → Mentoforce reveal CSS append (idempotent)

Sonrasında manuel: `<KlyrixFooter />` çağrısını layout'a ekle + (opsiyonel) `labels` prop ile i18n bağla.

---

## Adım 1 — Component dosyaları

`src/components/klyrix-footer/` altına 2 dosya:

```bash
mkdir -p src/components/klyrix-footer
BASE="https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/src/klyrix-footer"
for f in KlyrixFooter.jsx brands.js index.js; do
  curl -sSL "$BASE/$f" -o "src/components/klyrix-footer/$f"
done
```

> v2'de `useLocale`/`@/` alias importları **yok**, dosyalar self-contained. Hedef projenin folder layout'una bağımlı değil.

---

## Adım 2 — Brand assets

4 markanın 2'şer horizontal lockup PNG'sini (8 dosya, ~2900×512 @8x):

```bash
mkdir -p public/brand/{hr,platform,ledger,support}
BASE="https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/public/brand"
for slug in hr platform ledger support; do
  for asset in horizontal-dark.png horizontal-light.png; do
    curl -sSL "$BASE/$slug/$asset" -o "public/brand/$slug/$asset"
  done
done
```

**Convention (v2.1, PNG HD set v4.3 — eski SVG setinin TERSİ!)**: suffix = **hedef zemin**. `*-dark.png` = KOYU zemin İÇİN (beyaz wordmark). `*-light.png` = AÇIK zemin İÇİN (koyu wordmark). Component `theme` prop'una göre otomatik doğru variant'ı seçer. PNG'yi asla büyütme — küçültmek serbest.

> Eski 36 SVG'lik set `legacy-svg/brand/` altında arşivlendi (eski convention: suffix = yazı rengi). Yeni kurulumlarda kullanılmamalı.

`brandAssetsPath` prop ile farklı host edebilirsin (örn. CDN).

---

## Adım 3 — `globals.css`'e Mentoforce reveal CSS

Yalnızca Mentoforce wordmark'ı **hover animasyonlu** istiyorsan. Atlanırsa wordmark statik render olur — graceful degrade.

```bash
curl -sSL https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/styles/mentoforce-reveal.css \
  >> src/app/globals.css   # veya app'in herhangi bir global stylesheet'i
```

CSS framework-agnostic (Tailwind/shadcn'a bağımlı değil) — Vite/CRA'da da `src/index.css` veya `src/App.css` sonuna append edilebilir.

---

## Adım 4 — (Opsiyonel) Health endpoint

Status pill canlı poll'lansın istiyorsan, hedef projede `/api/health` olmalı. Yoksa **basit template**:

```bash
mkdir -p src/app/api/health
curl -sSL https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/examples/api-health.route.js \
  -o src/app/api/health/route.js
```

Tamamen istemiyorsan: `<KlyrixFooter status="operational" />` ile statik bağla, polling devre dışı kalır.

---

## Adım 5 — Render et

### En basit kullanım (default İngilizce labels, dark theme)

```jsx
import { KlyrixFooter } from '@/components/klyrix-footer'

export default function Page() {
  return (
    <>
      {/* ... sayfa içeriği ... */}
      <KlyrixFooter currentApp="platform" />
    </>
  )
}
```

### Tam kontrol (i18n + dynamic status + custom nav)

```jsx
import { KlyrixFooter } from '@/components/klyrix-footer'
import { useLocale } from '@/your-i18n-hook'  // hedef projenin kendi hook'u

export default function Page() {
  const { t } = useLocale()
  return (
    <KlyrixFooter
      currentApp="platform"        // 'hr' | 'platform' | 'ledger' | 'support'
      theme="dark"                 // 'dark' | 'light' — zemin tonuna göre
      healthUrl="/api/health"      // canlı status poll için; yoksa prop'la statik bağla
      brandAssetsPath="/brand"     // default '/brand'; CDN için override
      socials={{
        x: 'https://x.com/myapp',
        linkedin: 'https://linkedin.com/company/myapp',
        github: 'https://github.com/myapp',
        telegram: 'https://t.me/myapp',
      }}
      labels={{
        suite: {
          title: t('footer.suite_title'),
          subtitle: t('footer.suite_subtitle'),
        },
        current: t('footer.current_badge'),
        status: {
          operational: t('footer.status_operational'),
          degraded: t('footer.status_degraded'),
          down: t('footer.status_down'),
        },
        columns: [
          {
            title: t('footer.product'),
            links: [
              { label: t('footer.features'), href: '#features' },
              { label: t('footer.pricing'),  href: '#pricing' },
              { label: t('footer.changelog'), href: '/changelog', badge: { text: 'NEW', tone: 'accent' } },
            ],
          },
          {
            title: t('footer.family'),
            links: [
              { brand: 'hr',       label: 'Klyrix HR',       href: 'https://klyrix-hr.com' },
              { brand: 'platform', label: 'Klyrix Platform', href: 'https://klyrix.com' },
              { brand: 'ledger',   label: 'Klyrix Ledger',   href: 'https://klyrix-ledger.com' },
              { brand: 'support',  label: 'Klyrix Support',  href: 'https://klyrix-support.com' },
            ],
          },
          {
            title: t('footer.legal'),
            links: [
              { label: t('footer.terms'),   href: '/terms' },
              { label: t('footer.privacy'), href: '/privacy' },
            ],
          },
        ],
      }}
    />
  )
}
```

Detaylı entegrasyon: [`examples/integration.jsx`](examples/integration.jsx).

---

## `currentApp` haritası

| App / Repo | `currentApp` | URL |
|---|---|---|
| Klyrix HR | `"hr"` | klyrix-hr.com |
| Klyrix Platform (VDS Farm) | `"platform"` | klyrix.com |
| Klyrix Ledger | `"ledger"` | klyrix-ledger.com |
| Klyrix Support | `"support"` | klyrix-support.com |

`currentApp` prop'u **tek seçici**. Brand bloğundaki büyük lockup + tema accent rengi + glow + CURRENT badge konumu + suite hover'ları hepsi otomatik o markaya kayar.

---

## `theme` propu

| Değer | Davranış |
|---|---|
| `"dark"` (default) | İç tema palette koyu (beyaz text, transparan koyu bg). Brand lockup'lar `horizontal-dark.png` variant (beyaz wordmark — koyu zemin İÇİN). |
| `"light"` | İç tema palette açık (koyu text, transparan açık bg). Brand lockup'lar `horizontal-light.png` variant (koyu wordmark — açık zemin İÇİN). |

Footer'ın kendi `background`'ı her zaman **transparent** — hedef sayfanın arka planı görünür. `theme` sadece footer içindeki text/border/card kontrastını belirler. Bu nedenle layout/konum 100% sabit kalır; renkler hedef sayfanın bg tonuyla uyumlu olur.

---

## Tüm Props

| Prop | Tip | Default | Açıklama |
|---|---|---|---|
| `currentApp` | `'platform' \| 'hr' \| 'ledger' \| 'support'` | `'hr'` | CURRENT badge ve tema accent kaynağı |
| `theme` | `'dark' \| 'light'` | `'dark'` | İç tema palette + brand lockup variant |
| `status` | `'operational' \| 'degraded' \| 'down'` | `'operational'` veya `healthUrl` polling | Statik veya dinamik status |
| `healthUrl` | `string` | _undefined_ | Set edilirse 60sn'de bir poll'lar |
| `brandAssetsPath` | `string` | `'/brand'` | Brand PNG'lerinin root path'i |
| `socials` | `{ x, linkedin, github, telegram }` | Klyrix canonical | Sosyal medya link override |
| `labels` | `LabelsShape` | İngilizce defaults | Tüm metinler — i18n için |
| `className` | `string` | `''` | Root `<footer>` element class |
| `style` | `React.CSSProperties` | `{}` | Root `<footer>` element style override |

### `LabelsShape`

```ts
{
  suite?: { title: string, subtitle: string },
  current?: string,                                  // "CURRENT" badge
  status?: { operational, degraded, down: string },
  columns?: Array<{
    title: string,
    links: Array<{
      label?: string,                                 // text link
      href: string,
      brand?: 'hr' | 'platform' | 'ledger' | 'support',  // varsa text yerine lockup
      badge?: { text: string, tone?: 'accent' | 'neutral' },
    }>
  }>,
}
```

Verilmeyen alanlar built-in İngilizce defaults'a düşer.

---

## Brand renk paleti referansı

`brands.js`'ten gelen canonical palet (brand-cards koyu zemin doğrulanmış):

| Brand | `primary` (italic /xxx) | `light` (pill/badge) | Etiket |
|---|---|---|---|
| platform | `#0891B2` (Cyan 600) | `#22D3EE` | Tech DNA |
| hr | `#3B82F6` (Blue 500) | `#60A5FA` | People |
| ledger | `#64748B` (Slate 500) | `#94A3B8` | Finance |
| support | `#FBBF24` (Gold) | `#FDE047` | Premium |

---

## Framework uyumluluğu

### Next.js App Router (15+)
- `'use client'` directive var
- `/api/health/route.js` template doğru
- `<img>` etiket Image optimization'a tabi değil, isteğe bağlı `next/image` ile sarılabilir

### Next.js Pages Router
- `'use client'` directive ignore edilir (no-op)
- `/api/health` için `pages/api/health.js` formatına çevir (örnek dışında)

### Vite / CRA
- `'use client'` ignore edilir
- `brandAssetsPath="/brand"` Vite/CRA'nın `public/` serve mantığına uyumlu
- `useEffect`/`fetch` standart

### Astro / Remix
- Component dosyasını React island olarak işaretle (Astro: `client:load`)
- API endpoint'i Astro endpoints veya Remix loaders ile değiştir

---

## Troubleshooting

| Belirti | Çözüm |
|---|---|
| Brand logoları gözükmüyor (broken image) | `public/brand/` paketi eksik veya yanlış path'te — Adım 2'yi tekrar çalıştır veya `brandAssetsPath` prop'unu doğrula |
| Renkler düz gözüküyor, hover çalışmıyor | Component inline style kullanır — Tailwind purge tarafından silinmez. Eğer hâlâ sorun varsa React versiyonu < 18 olabilir |
| Status pill her zaman "Service disruption" | `healthUrl` set edilmiş ama endpoint 200 dönmüyor — `status="operational"` ile statik bağla veya endpoint'i düzelt |
| Mentoforce hover animasyonu yok | `globals.css`'e Adım 3'teki snippet append edilmemiş — kontrol et |
| Light theme'de footer çok sönük | Hedef sayfa background'ı çok açık ise `theme="light"` + atmosphere glow zayıf görünebilir; `currentApp` brand'ın `primary` rengi az kontrastlı (Slate gibi) ise bu beklenen davranış |
| Custom font kullanmak istiyorum | `style={{ fontFamily: '...' }}` prop'u root `<footer>`'a düşer; içerideki Mentoforce wordmark `inherit` font kullanır |

---

## Repo yapısı

```
klyrix-footer/
├── README.md                            ← bu dosya
├── LICENSE                              ← All rights reserved
├── src/klyrix-footer/
│   ├── KlyrixFooter.jsx                 ← ~470 satır, v2
│   ├── brands.js                        ← 4 brand config
│   └── index.js                         ← re-exports
├── public/brand/                        ← 4 brand × 2 PNG (horizontal-{dark,light})
├── legacy-svg/brand/                    ← eski 36 SVG set (deprecated, eski convention)
├── styles/
│   └── mentoforce-reveal.css            ← globals.css append snippet
├── examples/
│   ├── api-health.route.js              ← Next.js App Router health template
│   └── integration.jsx                  ← v2 prop kullanımı örnekleri
├── scripts/
│   └── install.sh                       ← one-line installer
└── locales/                             ← (legacy v1, opsiyonel referans)
    ├── footer-tr.json
    └── footer-en.json
```

---

## AI agent için tek-satır talimat

Diğer Klyrix repolarındaki Claude/Cursor/Copilot agent'a:

> "Bu kılavuza göre KlyrixFooter v2'yi kur: https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/README.md  
> `currentApp` değeri **`platform`** (veya `ledger` / `support` / `hr`).  
> `theme` değeri **`dark`** (veya `light`)."

> WebFetch raw markdown'ı özetliyorsa, Bash + curl ile direkt indir:  
> `curl -sSL https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/README.md`

---

## v1 → v2 Migration (Klyrix HR için)

Eski sürüm `navSections` prop alıyordu. v2'de bu `labels.columns` olarak yeniden yapılandırıldı.

```jsx
// v1
<KlyrixFooter
  currentApp="hr"
  navSections={[
    { title: 'PRODUCT', links: [...] },
    ...
  ]}
/>

// v2
<KlyrixFooter
  currentApp="hr"
  theme="dark"
  labels={{
    suite: { title: '...', subtitle: '...' },
    current: 'CURRENT',
    status: { operational: '...', degraded: '...', down: '...' },
    columns: [
      { title: 'PRODUCT', links: [...] },
      ...
    ],
  }}
/>
```

v1 ile geri uyumluluk yok — v2 hedeflenen "drop-in" ve "framework-agnostic" davranışı için bilinçli bir breaking change.
