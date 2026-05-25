'use client'

/**
 * KlyrixFooter — entegrasyon örneği (marketing landing page için).
 *
 * Bu dosyayı `src/components/klyrix-footer/` kurulduktan sonra
 * landing/layout sayfanın altına kopyala. `currentApp` prop'unu app'in
 * marka slug'ı ile değiştir:
 *   - "hr"        — Klyrix HR
 *   - "platform"  — Klyrix Platform (VDS Farm)
 *   - "ledger"    — Klyrix Ledger
 *   - "support"   — Klyrix Support
 *
 * Tek seçici. brand bloğundaki lockup + tema rengi + CURRENT badge
 * + hover renkleri hepsi bundan türetilir.
 */

import { KlyrixFooter } from '@/components/klyrix-footer'
import { useLocale } from '@/hooks/use-locale'

export function FooterExample() {
  const { t } = useLocale()

  return (
    <KlyrixFooter
      currentApp="platform" /* ← değiştir */
      navSections={[
        {
          title: t('marketing.footer_product'),
          links: [
            { label: t('marketing.footer_link_features'), href: '#features' },
            { label: t('marketing.footer_link_pricing'),  href: '#pricing' },
            { label: t('marketing.footer_link_faq'),      href: '#faq' },
          ],
        },
        {
          /* Family sütununu LOGO render et — link.brand set ile h-[22px] lockup */
          title: t('marketing.footer_family'),
          links: [
            { brand: 'hr',       label: 'Klyrix HR',      href: 'https://klyrix-hr.com' },
            { brand: 'platform', label: 'Klyrix VDS',     href: 'https://klyrix.com' },
            { brand: 'support',  label: 'Klyrix Support', href: 'https://klyrix-support.com' },
            { brand: 'ledger',   label: 'Klyrix Ledger',  href: 'https://klyrix-ledger.com' },
          ],
        },
        {
          title: t('marketing.footer_legal'),
          links: [
            { label: t('marketing.footer_link_terms'),    href: '/terms' },
            { label: t('marketing.footer_link_privacy'),  href: '/privacy' },
            { label: t('marketing.footer_link_kvkk'),     href: '/kvkk' },
            { label: t('marketing.footer_link_security'), href: '/security' },
          ],
        },
      ]}
    />
  )
}

/* Minimum kullanım (default nav ile) */
export function FooterMinimal() {
  return <KlyrixFooter currentApp="platform" />
}
