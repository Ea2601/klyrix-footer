# Klyrix Footer

Shared footer component for the Klyrix product suite — **Klyrix HR**, **Klyrix Platform** (VDS Farm), **Klyrix Ledger**, **Klyrix Support**. Drop it into any Next.js app, pass one prop (`currentApp`), and the whole brand identity (lockup, theme color, CURRENT badge, hover accents, status pill) wires itself up.

> **Kanonik sürüm**: v1.0 (`main` branch — always latest)  
> **Live reference**: https://klyrix-hr.com  
> **Lisans**: All rights reserved — see [LICENSE](LICENSE)

---

## Ne kurulur?

- Dark-tema, tema-aware footer component (`KlyrixFooter`)
- 4 ürünlü Suite şeridi (Platform / HR / Ledger / Support) — bulunulan app `CURRENT/MEVCUT` badge'li
- Brand-renkli kart hover'ları, lokasyon-bazlı i18n, `/api/health` canlı status pill
- Mentoforce holding imza şeridi — hover'da harf harf "soft overlap" reveal animasyonu
- Site genelinde tutarlı `max-w-6xl` container, brand-color theme accent

## Bağımlılıklar

| Şart | Versiyon | Not |
|---|---|---|
| Next.js | 14+ (App Router) | `'use client'` directive kullanır |
| React | 18+ | `useState`, `useEffect`, `useRef` |
| Tailwind CSS | 3+ veya 4 | Tema CSS var'ları gerekir (aşağıda) |
| `lucide-react` | ≥0.300 | Sosyal ikonlar için |

CSS tema değişkenleri (genelde shadcn ile gelir): `--card`, `--card-foreground`, `--foreground`, `--muted-foreground`, `--border`, `--primary`. Yoksa `globals.css`'e ekle.

---

## Adım 1 — Component klasörünü oluştur

`src/components/klyrix-footer/` altına 3 dosya. Direkt curl ile çek:

```bash
mkdir -p src/components/klyrix-footer
BASE="https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/src/klyrix-footer"
for f in KlyrixFooter.jsx brands.js index.js; do
  curl -sSL "$BASE/$f" -o "src/components/klyrix-footer/$f"
done
```

---

## Adım 2 — Brand assets'i indir

4 markanın 9'ar lockup/sembol SVG'sini (36 dosya):

```bash
mkdir -p public/brand/{hr,platform,ledger,support}
BASE="https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/public/brand"
for slug in hr platform ledger support; do
  for asset in \
    horizontal-light.svg horizontal-dark.svg \
    horizontal-compact-light.svg horizontal-compact-dark.svg \
    vertical-light.svg vertical-dark.svg \
    wordmark-light.svg wordmark-dark.svg \
    symbol.svg; do
    curl -sSL "$BASE/$slug/$asset" -o "public/brand/$slug/$asset"
  done
done
```

> **Convention**: `*-light.svg` = beyaz wordmark → **koyu zemin için**. `*-dark.svg` = koyu wordmark → açık zemin için. Footer her zaman `-light` kullanır.

---

## Adım 3 — Health endpoint (status pill için)

Repo'da `/api/health` yoksa `src/app/api/health/route.js`'a şu basit sürümü ekle:

```bash
mkdir -p src/app/api/health
curl -sSL https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/examples/api-health.route.js \
  -o src/app/api/health/route.js
```

Bu template Supabase'e DB ping atar; Supabase kullanmıyorsan dosyayı aç ve şu basit sürümle değiştir:

```js
import { NextResponse } from 'next/server'
export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export async function GET() {
  return NextResponse.json(
    { ok: true, ts: new Date().toISOString(), checks: { db: { ok: true, ms: 0 } } },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
```

Status pill'i tamamen statik istersen `<KlyrixFooter status="operational" />` ile prop pass et, polling devre dışı kalır.

---

## Adım 4 — globals.css'e wordmark animasyon kuralları

Mentoforce wordmark hover'da harf harf "soft overlap" reveal animasyonu kullanır — keyframe + per-letter delay zinciri `globals.css`'in sonuna eklenir:

```bash
curl -sSL https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/styles/mentoforce-reveal.css \
  >> src/app/globals.css
```

> Atlanırsa animasyon çalışmaz ama wordmark yine görünür (graceful degrade).

---

## Adım 5 — i18n key'lerini ekle

`src/locales/tr.json` ve `en.json`'da `marketing` namespace'ine merge et — TR ve EN patch'leri:

- TR: https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/locales/footer-tr.json
- EN: https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/locales/footer-en.json

Her iki dosya `_comment` field'ı dışında `marketing` altındaki 20 footer key'ini içerir. Mevcut `marketing` namespace'inin altına merge et.

### `useLocale` yoksa
Repo'da i18n hook yoksa, `KlyrixFooter.jsx`'in başındaki `import { useLocale } from '@/hooks/use-locale'` satırını çıkar ve component'in başına stub ekle:

```js
function useLocale() {
  return { t: (k) => k.split('.').pop().replace(/_/g, ' ') }
}
```

Bu durumda label'lar ham key'lerin son parçası gibi görünür ("suite title", "operational" vb.) — geçici sade çözüm.

---

## Adım 6 — Render et

App'in landing page'inde veya root layout'unda:

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

Detaylı entegrasyon örneği: [`examples/integration.jsx`](examples/integration.jsx) — marketing landing için custom nav sections dahil.

### Hangi app için `currentApp` ne olacak?

| App / Repo | `currentApp` | URL |
|---|---|---|
| Klyrix HR | `"hr"` | klyrix-hr.com |
| Klyrix Platform (VDS Farm) | `"platform"` | klyrix.com |
| Klyrix Ledger | `"ledger"` | klyrix-ledger.com |
| Klyrix Support | `"support"` | klyrix-support.com |

### `currentApp` neyi otomatik değiştirir?

**Tek prop, beş görsel kimlik bir arada.** `currentApp="platform"` dersen şunlar otomatik olarak Platform'a kayar:

| Eleman | Bağlama |
|---|---|
| Brand bloğundaki büyük yatay lockup | `/brand/platform/horizontal-light.svg` (Cyan Klyrix/platform — h-[52px]) |
| Tema rengi (atmosfer glow, üst aksent, pill bg, badge bg) | `#0891B2` (brands.js → `platform.colors.primary`) |
| Status pill nokta + text rengi | Cyan + light Cyan |
| Suite şeridindeki ActiveCard ve CURRENT badge konumu | Platform kartı |
| Diğer 3 kartın hover rengi | Kendi brand renkleri (HR=mavi, Ledger=slate, Support=gold) |

Repo'da **4 brand'ın da SVG paketi mevcut olmalı** (Adım 2 onları zaten birden indiriyor): kendi markası brand bloğu için, diğer üçü suite kartları + hover preview'ları için.

---

## Tüm Props

| Prop | Tip | Default | Açıklama |
|---|---|---|---|
| `currentApp` | `'platform' \| 'hr' \| 'ledger' \| 'support'` | `'hr'` | Hangi app'in CURRENT badge'ini alacağı. Tema rengini de belirler |
| `status` | `'operational' \| 'degraded' \| 'down'` | _undefined → poll_ | Set edersen polling devre dışı, sabit status gösterir |
| `healthUrl` | `string` | `'/api/health'` | Poll endpoint URL'i |
| `navSections` | `NavSection[]` | _3 sütun generic_ | Sol blok altındaki 3 menü sütunu |
| `socials` | `Partial<SOCIAL_LINKS>` | Klyrix kanonik sosyalleri | Sosyal medya link override |

### `NavLink` formatı

```ts
{
  label: string,           // ekranda görünür (logo yoksa)
  href: string,
  brand?: 'hr' | 'platform' | 'ledger' | 'support',  // set ise text yerine h-[22px] lockup
  badge?: { text: string, tone?: 'accent' | 'neutral' }  // "NEW", "12" gibi etiket
}
```

---

## Brand renk paleti referansı

Brand kart paketinden (koyu zemin) doğrulanmış canonical palet (`brands.js`'te tek kaynak):

| Brand | `primary` (italic /xxx) | `light` (pill/badge) | Etiket |
|---|---|---|---|
| platform | `#0891B2` (Cyan 600) | `#22D3EE` | Tech DNA |
| hr | `#3B82F6` (Blue 500) | `#60A5FA` | People |
| ledger | `#64748B` (Slate 500) | `#94A3B8` | Finance |
| support | `#FBBF24` (Gold) | `#FDE047` | Premium |

`primary` = wordmark italic text + atmosfer glow türevi. `light` = status pill + CURRENT badge text. `gradientStart→End` = sembol kutusunun lineer gradient'ı. `shine` = kutunun üst yarısının highlight overlay'i (gold için `#FEF9C3`, diğerleri beyaz).

---

## Sık sorulan

**S: Footer her sayfada mı görünmeli?**  
H: Senin tercihin. Marketing landing + auth sayfalarına (login, register, invite) iyi oturur. Dashboard / platform shell gibi `h-dvh + overflow-clip` yapısı kullanan sayfalarda zaten görünmez, oraya koymak güvenli ama gereksiz.

**S: Max-width farklı kullanıyorum (max-w-7xl gibi).**  
H: `KlyrixFooter.jsx` içinde 2 yerde `max-w-6xl` geçer (body + signature wrapper). Repo container'ınla aynı değere çevir.

**S: Status pill'de "All systems operational" yerine başka şey istiyorum.**  
H: `marketing.footer_status_operational` (vb.) i18n key'lerini değiştir.

**S: 4 markadan biri henüz canlıda değil, kartını gizlemek istiyorum.**  
H: `brands.js`'te `BRAND_ORDER`'dan o slug'ı çıkar. Grid otomatik 3 kart olur — `KlyrixFooter.jsx`'teki `grid-cols-2 md:grid-cols-4` ihtiyaca göre düşür.

**S: Component update'i nasıl alacağım?**  
H: Bu repo `main` branch canonical kaynak. Yenileme için `KlyrixFooter.jsx` + `brands.js`'i `curl` ile tekrar çek (Adım 1). Brand assets nadiren değişir.

---

## Troubleshooting

| Belirti | Sebep / Çözüm |
|---|---|
| Sosyal ikon render yok | `npm i lucide-react` |
| Status pill her zaman "Service disruption" | `/api/health` 200 dönmüyor — endpoint kur (Adım 3) veya `status="operational"` prop pass et |
| Brand logoları gözükmüyor (alt text görünüyor) | `public/brand/` paketi eksik — Adım 2'yi tekrar çalıştır |
| Logo sol kenardan içeride | Compact lockup'lar `viewBox="24 0 ..."` ile kırpılı olmalı; Adım 2'de çekilen son sürüm doğru |
| Tema rengi yerine siyah/beyaz | `--card`, `--foreground`, `--muted-foreground`, `--border` CSS var'ları tanımlı değil — shadcn theme import et veya manuel ekle |
| Footer ekran genişliğinde stretch oluyor | `max-w-6xl mx-auto` wrapper'lar component içinde, container'ın doğru çalıştığından emin ol |
| Mentoforce hover'da animasyon olmuyor | Adım 4'teki `globals.css` snippet'i eksik — `.kf-mentoforce` + `@keyframes kf-soft-overlap` ekle |

---

## Sıkıştırılmış kurulum checklist

```
[ ] src/components/klyrix-footer/ — 3 dosya (Adım 1)
[ ] public/brand/ — 4 klasör × 9 SVG (Adım 2)
[ ] src/app/api/health/route.js — varsa atla (Adım 3)
[ ] globals.css — Mentoforce reveal animasyon snippet'i (Adım 4)
[ ] locales/{tr,en}.json — marketing.footer_* key'leri (Adım 5)
[ ] npm i lucide-react
[ ] <KlyrixFooter currentApp="..." /> — landing/layout'a ekle (Adım 6)
[ ] (opsiyonel) navSections override ile family sütununa brand lockup
```

Toplam transfer süresi: ~5-10 dakika per repo.

---

## Repo yapısı

```
klyrix-footer/
├── README.md                            ← bu dosya (kurulum kılavuzu)
├── LICENSE                              ← All rights reserved
├── src/klyrix-footer/
│   ├── KlyrixFooter.jsx                 ← ana component (~400 satır)
│   ├── brands.js                        ← 4 brand config tek kaynak
│   └── index.js                         ← re-exports
├── public/brand/                        ← 4 brand × 9 SVG
│   ├── hr/
│   ├── platform/
│   ├── ledger/
│   └── support/
├── styles/
│   └── mentoforce-reveal.css            ← globals.css append snippet
├── examples/
│   ├── api-health.route.js              ← health endpoint template
│   └── integration.jsx                  ← <KlyrixFooter ... /> örneği
└── locales/
    ├── footer-tr.json                   ← TR i18n patch
    └── footer-en.json                   ← EN i18n patch
```

---

## AI agent için tek-satır talimat

Diğer Klyrix repolarındaki Claude/Cursor/Copilot agent'a:

> "Bu kılavuza göre KlyrixFooter v1.0'ı kur: https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/README.md  
> `currentApp` değeri **`platform`** (veya `ledger` / `support` / `hr`)."
