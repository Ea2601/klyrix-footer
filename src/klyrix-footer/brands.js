/**
 * Klyrix Suite — Brand Configuration
 *
 * Tüm Klyrix ürünlerinin tek kaynaktan tema/metadata yönetimi.
 * Renkler brand-cards/*.svg paketinden gelir (koyu zemin için
 * dokümante edilmiş paletler).
 */

export const BRANDS = {
  platform: {
    slug: 'platform',
    label: '/platform',
    tagline: 'Fleet orchestration',
    description: 'Fleet orchestration & VDI management for the distributed workforce.',
    url: 'https://klyrix.com',
    colors: {
      // Brand kart koyu zemin: Cyan 600 wordmark + Cyan 400→700 kutu
      primary: '#0891B2',
      light: '#22D3EE',
      gradientStart: '#22D3EE',
      gradientEnd: '#0E7490',
      shine: '#FFFFFF',
    },
  },
  hr: {
    slug: 'hr',
    label: '/hr',
    tagline: 'Workforce management',
    description: 'Workforce automation, payroll, and onboarding for modern teams.',
    url: 'https://klyrix-hr.com',
    colors: {
      // Brand kart koyu zemin paleti: Blue 500 wordmark + Blue 400→600 kutu
      primary: '#3B82F6',
      light: '#60A5FA',
      gradientStart: '#60A5FA',
      gradientEnd: '#2563EB',
      shine: '#FFFFFF',
    },
  },
  ledger: {
    slug: 'ledger',
    label: '/ledger',
    tagline: 'Finance & reconciliation',
    description: 'Financial operations, reconciliation, and reporting for global businesses.',
    url: 'https://klyrix-ledger.com',
    colors: {
      // Brand kart koyu zemin: Slate 500 wordmark + Slate 400→600 kutu
      primary: '#64748B',
      light: '#94A3B8',
      gradientStart: '#94A3B8',
      gradientEnd: '#475569',
      shine: '#FFFFFF',
    },
  },
  support: {
    slug: 'support',
    label: '/support',
    tagline: 'Customer operations',
    description: 'Omnichannel customer operations. Premium support, premium experience.',
    url: 'https://klyrix-support.com',
    colors: {
      primary: '#FBBF24',
      light: '#FDE047',
      gradientStart: '#FDE047',
      gradientEnd: '#CA8A04',
      shine: '#FEF9C3',
    },
  },
}

/** Suite şeridindeki sıra */
export const BRAND_ORDER = ['platform', 'hr', 'ledger', 'support']

/** Sosyal medya linkleri — tüm app'ler için ortak */
export const SOCIAL_LINKS = {
  x: 'https://x.com/klyrix',
  linkedin: 'https://linkedin.com/company/klyrix',
  github: 'https://github.com/klyrix',
  telegram: 'https://t.me/klyrix',
}

/** Mentoforce holding bilgileri (footer signature) */
export const MENTOFORCE = {
  wordmark: 'MENTOFORCE',
  motto: 'Automating the world.',
  location: 'DUBAI · EST. 2025',
  copyright: '© 2026 Mentoforce Information Technology L.L.C',
  trn: 'TRN 105431653200001',
  url: 'https://mentoforce.com',
}
