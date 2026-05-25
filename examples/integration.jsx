/**
 * KlyrixFooter v2 — entegrasyon örnekleri
 *
 * 1. Minimal kullanım (default İngilizce labels, dark theme)
 * 2. i18n bağlama (hedef projenin kendi hook'uyla)
 * 3. Light theme (açık zemin)
 * 4. Statik status (polling yok)
 */

import { KlyrixFooter } from '@/components/klyrix-footer'
// import { useLocale } from '@/your-i18n-hook'   // varsa kullan

/* ─── 1) Minimal ────────────────────────────────────────────────────────
 * Hedef app: Klyrix Platform. Default İngilizce labels, dark theme,
 * status pill statik 'operational'. Footer tema rengi otomatik Cyan.
 */
export function MinimalFooter() {
  return <KlyrixFooter currentApp="platform" />
}

/* ─── 2) Full i18n + dynamic status + custom nav ─────────────────────────
 * Hedef projenin `useLocale` hook'u t() döner. Her metin t() ile beslenir.
 * /api/health endpoint'i 60sn'de bir poll'lanır.
 */
export function FullFooter() {
  // const { t } = useLocale()
  const t = (k) => k // örnek için stub — gerçekte hedef hook
  return (
    <KlyrixFooter
      currentApp="platform"
      theme="dark"
      healthUrl="/api/health"
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
              { label: t('footer.changelog'), href: '/changelog',
                badge: { text: 'NEW', tone: 'accent' } },
            ],
          },
          {
            // Family sütunu — text yerine compact brand lockup'lar
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

/* ─── 3) Light theme ─────────────────────────────────────────────────────
 * Hedef sayfa açık zemin (örn. marketing landing'in light variantı).
 * Footer içindeki text/border koyulaşır, brand lockup'lar `*-dark.svg`
 * (koyu wordmark) variant'ına otomatik geçer.
 */
export function LightFooter() {
  return <KlyrixFooter currentApp="ledger" theme="light" />
}

/* ─── 4) Statik status — polling yok ─────────────────────────────────────
 * Status badge'i sabit kalır; /api/health endpoint kurmaya gerek yok.
 */
export function StaticStatusFooter() {
  return (
    <KlyrixFooter
      currentApp="support"
      status="operational"   // sabit; healthUrl verilmedi → polling devre dışı
    />
  )
}

/* ─── 5) Custom CDN / brand asset path ───────────────────────────────────
 * Brand SVG'leri farklı yerden serve ediyorsan (CDN, blob storage):
 */
export function CdnFooter() {
  return (
    <KlyrixFooter
      currentApp="platform"
      brandAssetsPath="https://cdn.klyrix.com/brand"
    />
  )
}
