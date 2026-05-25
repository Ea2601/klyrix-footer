'use client'

import { useEffect, useRef, useState } from 'react'
import { Twitter, Linkedin, Github, Send } from 'lucide-react'
import { useLocale } from '@/hooks/use-locale'
import { BRANDS, BRAND_ORDER, SOCIAL_LINKS, MENTOFORCE } from './brands'

/**
 * KlyrixFooter — paylaşımlı footer component'i.
 *
 * Özellikler:
 *  - i18n: marketing.footer_* key'lerini useLocale ile çözümler.
 *  - Tema: --primary, --card, --border CSS variable'larını kullanır;
 *    brand-specific accent (italic /xxx, glow, status pill) brands.js'ten gelir.
 *  - Status: prop ile override edilmezse /api/health'i 60sn'de bir poll'lar.
 *  - Genişlik: içerik max-w-6xl ile site standart genişliğine sabitlenir;
 *    background ve atmosfer glow ekran genişliğinde uzanır.
 *  - Hover: tüm marka kartları (aktif + diğerleri) hover'da o kartın brand
 *    rengiyle parlar (background + border).
 */

const DEGRADED_DB_MS = 1500

const BRAND_LOCKUP = (slug) => `/brand/${slug}/horizontal-light.svg`
const BRAND_LOCKUP_COMPACT = (slug) => `/brand/${slug}/horizontal-compact-light.svg`

function withAlpha(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function buildDefaultNav(t) {
  return [
    {
      title: t('marketing.footer_product'),
      links: [
        { label: t('marketing.footer_link_features'), href: '#features' },
        { label: t('marketing.footer_link_pricing'), href: '#pricing' },
        { label: t('marketing.footer_link_faq'), href: '#faq' },
      ],
    },
    {
      title: t('marketing.footer_family'),
      links: [
        { label: t('marketing.footer_link_klyrix_hr'), href: 'https://klyrix-hr.com' },
        { label: t('marketing.footer_link_klyrix_vds'), href: 'https://klyrix.com' },
        { label: t('marketing.footer_link_klyrix_support'), href: 'https://klyrix-support.com' },
        { label: t('marketing.footer_link_klyrix_ledger'), href: 'https://klyrix-ledger.com' },
      ],
    },
    {
      title: t('marketing.footer_legal'),
      links: [
        { label: t('marketing.footer_link_terms'), href: '/terms' },
        { label: t('marketing.footer_link_privacy'), href: '/privacy' },
        { label: t('marketing.footer_link_kvkk'), href: '/kvkk' },
        { label: t('marketing.footer_link_security'), href: '/security' },
      ],
    },
  ]
}

export function KlyrixFooter({
  currentApp = 'hr',
  status: statusProp,
  healthUrl = '/api/health',
  navSections,
  socials = SOCIAL_LINKS,
}) {
  const { t } = useLocale()
  const brand = BRANDS[currentApp]
  const c = brand.colors

  // Status: prop override edilirse onu kullan; aksi halde /api/health'den poll'la.
  const [liveStatus, setLiveStatus] = useState(statusProp ?? 'operational')
  useEffect(() => {
    if (statusProp) return
    let cancelled = false
    const probe = async () => {
      try {
        const res = await fetch(healthUrl, { cache: 'no-store' })
        const data = await res.json().catch(() => ({}))
        if (cancelled) return
        if (!res.ok || data.ok === false) setLiveStatus('down')
        else if ((data.checks?.db?.ms ?? 0) >= DEGRADED_DB_MS) setLiveStatus('degraded')
        else setLiveStatus('operational')
      } catch {
        if (!cancelled) setLiveStatus('down')
      }
    }
    probe()
    const id = setInterval(probe, 60_000)
    return () => { cancelled = true; clearInterval(id) }
  }, [statusProp, healthUrl])

  const status = statusProp ?? liveStatus
  const statusLabel = t(`marketing.footer_status_${status}`)
  const sections = navSections ?? buildDefaultNav(t)

  const themeVars = {
    '--kf-primary': c.primary,
    '--kf-light': c.light,
    '--kf-glow-strong': withAlpha(c.primary, 0.18),
    '--kf-glow-soft': withAlpha(c.primary, 0.1),
    '--kf-glow-bottom': withAlpha(c.primary, 0.05),
    '--kf-top-line': withAlpha(c.primary, 0.6),
    '--kf-pill-bg': withAlpha(c.primary, 0.08),
    '--kf-pill-border': withAlpha(c.primary, 0.25),
    '--kf-badge-bg': withAlpha(c.primary, 0.12),
  }

  const statusColors = {
    operational: c.primary,
    degraded: '#FBBF24',
    down: '#EF4444',
  }
  const statusColor = statusColors[status]

  return (
    <footer
      style={themeVars}
      className="relative overflow-hidden bg-card text-card-foreground border-t border-border"
    >
      {/* Atmosfer glow — ekran genişliğinde */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 0%, var(--kf-glow-strong) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, var(--kf-glow-soft) 0%, transparent 50%)',
        }}
      />
      {/* Üst aksent çizgisi — ekran genişliğinde */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--kf-top-line) 50%, transparent 100%)' }}
      />

      {/* Body: site standart max-w-6xl içeriği */}
      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-9">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr] mb-11 pb-11 border-b border-border">
          {/* Brand bloğu */}
          <div>
            <div className="mb-5">
              <img
                src={BRAND_LOCKUP(brand.slug)}
                alt={`Klyrix${brand.label}`}
                className="h-[52px] w-auto"
                draggable={false}
              />
            </div>

            <p className="text-sm leading-7 text-muted-foreground mb-5 max-w-xs">{brand.description}</p>

            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border mb-5"
              style={{ background: 'var(--kf-pill-bg)', borderColor: 'var(--kf-pill-border)' }}
            >
              <span className="relative inline-flex w-1.5 h-1.5">
                <span
                  className="absolute inset-0 rounded-full opacity-60 animate-ping"
                  style={{ background: statusColor }}
                />
                <span
                  className="relative w-1.5 h-1.5 rounded-full"
                  style={{ background: statusColor }}
                />
              </span>
              <span
                className="text-[11px] font-medium tracking-wide"
                style={{ color: c.light }}
              >
                {statusLabel}
              </span>
            </div>

            <div className="flex gap-1.5">
              <SocialIcon href={socials.x ?? SOCIAL_LINKS.x} label="X" Icon={Twitter} />
              <SocialIcon href={socials.linkedin ?? SOCIAL_LINKS.linkedin} label="LinkedIn" Icon={Linkedin} />
              <SocialIcon href={socials.github ?? SOCIAL_LINKS.github} label="GitHub" Icon={Github} />
              <SocialIcon href={socials.telegram ?? SOCIAL_LINKS.telegram} label="Telegram" Icon={Send} />
            </div>
          </div>

          {/* 3 navigasyon sütunu */}
          {sections.map((section) => (
            <NavColumn
              key={section.title}
              section={section}
              accent={c.light}
              accentBg={withAlpha(c.primary, 0.1)}
            />
          ))}
        </div>

        {/* === SUITE ŞERİDİ === */}
        <div>
          <div className="mb-5">
            <p className="text-[11px] font-semibold text-foreground tracking-[2px] mb-1 opacity-95">
              {t('marketing.footer_suite_title')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('marketing.footer_suite_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {BRAND_ORDER.map((slug) => {
              const b = BRANDS[slug]
              const isActive = slug === currentApp
              return isActive ? (
                <ActiveCard key={slug} brand={b} currentLabel={t('marketing.footer_current_badge')} />
              ) : (
                <SuiteCard key={slug} brand={b} />
              )
            })}
          </div>
        </div>
      </div>

      {/* === İMZA ŞERİDİ — Mentoforce (brand identity, locale-değişmez) === */}
      <div
        className="relative border-t border-border"
        style={{ background: 'linear-gradient(180deg, transparent 0%, var(--kf-glow-bottom) 100%)' }}
      >
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-7 flex flex-col items-center gap-5">
          <MentoforceWordmark />


          <div className="inline-flex items-center gap-5">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <p className="m-0 text-[15px] italic font-serif text-foreground/90 tracking-wide">
              {MENTOFORCE.motto}
            </p>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>

          <p className="m-0 text-[10px] font-mono tracking-[2.5px] text-muted-foreground">
            {MENTOFORCE.location}
          </p>

          <div className="mt-2 pt-5 border-t border-border w-full flex flex-wrap justify-center items-center gap-3">
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground/70">
              {MENTOFORCE.copyright}
            </span>
            <span className="text-[10px] text-border">·</span>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground/70">
              {MENTOFORCE.trn}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * MentoforceWordmark — per-letter soft-overlap reveal on hover.
 * Initial render statik. Mouse enter'da `.animating` class refresh edilir
 * (önce kaldır → force reflow → tekrar ekle); böylece her hover animasyonu
 * baştan tetikler. Keyframe ve nth-child delay zinciri globals.css'te.
 */
function MentoforceWordmark() {
  const ref = useRef(null)
  const replay = () => {
    const el = ref.current
    if (!el) return
    el.classList.remove('animating')
    void el.offsetWidth // force reflow → animation restart
    el.classList.add('animating')
  }
  return (
    <a
      href={MENTOFORCE.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={replay}
      className="no-underline select-none"
      aria-label={MENTOFORCE.wordmark}
    >
      <h3
        ref={ref}
        className="kf-mentoforce m-0 text-[32px] sm:text-[36px] font-extralight text-foreground uppercase tracking-[10px] sm:tracking-[14px] leading-none"
      >
        {MENTOFORCE.wordmark.split('').map((ch, i) => (
          <span key={i} className="kf-ch">{ch}</span>
        ))}
      </h3>
    </a>
  )
}

function SocialIcon({ href, label, Icon }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-lg border border-border bg-muted/20 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
    >
      <Icon size={14} aria-hidden="true" />
    </a>
  )
}

function NavColumn({ section, accent, accentBg }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-foreground tracking-[2px] mb-4 opacity-95">
        {section.title}
      </p>
      <ul className="list-none p-0 m-0 flex flex-col gap-3">
        {section.links.map((link) => (
          <li key={link.label}>
            {link.brand ? (
              <a
                href={link.href}
                aria-label={link.label}
                className="inline-flex items-center opacity-70 hover:opacity-100 transition-opacity"
              >
                <img
                  src={BRAND_LOCKUP_COMPACT(link.brand)}
                  alt={link.label}
                  className="h-[22px] w-auto"
                  draggable={false}
                />
              </a>
            ) : (
              <a
                href={link.href}
                className="text-[13px] text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
              >
                {link.label}
                {link.badge && (
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded tracking-wider"
                    style={{
                      color: link.badge.tone === 'accent' ? accent : 'var(--muted-foreground)',
                      background:
                        link.badge.tone === 'accent' ? accentBg : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {link.badge.text}
                  </span>
                )}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * SuiteCard — pasif marka kartı.
 * Hover'da kartın brand rengiyle parlar (background + border + hafif lift).
 */
function SuiteCard({ brand }) {
  const [hover, setHover] = useState(false)
  const c = brand.colors
  return (
    <a
      href={brand.url}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="block rounded-2xl border p-[18px] relative overflow-hidden no-underline"
      style={{
        transition: 'background-color 250ms ease, border-color 250ms ease, transform 250ms ease',
        borderColor: hover ? withAlpha(c.primary, 0.45) : 'rgba(255,255,255,0.08)',
        backgroundColor: hover ? withAlpha(c.primary, 0.08) : 'rgba(255,255,255,0.015)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <img
        src={BRAND_LOCKUP_COMPACT(brand.slug)}
        alt={`Klyrix${brand.label}`}
        className="h-[34px] w-auto mb-3"
        draggable={false}
      />
      <p className="text-[11px] text-muted-foreground m-0 leading-snug">{brand.tagline}</p>
    </a>
  )
}

/**
 * ActiveCard — bulunulan ürünün kartı.
 * Statik durumda pasif SuiteCard ile birebir aynı nötr görünüm; "mevcut
 * sayfa" göstergesi sadece sağ üstteki CURRENT/MEVCUT badge. Hover'da ise
 * SuiteCard ile aynı brand-renkli vurgu (bg + border + 2px lift).
 */
function ActiveCard({ brand, currentLabel }) {
  const [hover, setHover] = useState(false)
  const c = brand.colors
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="rounded-2xl p-[18px] relative overflow-hidden border"
      style={{
        transition: 'background-color 250ms ease, border-color 250ms ease, transform 250ms ease',
        borderColor: hover ? withAlpha(c.primary, 0.45) : 'rgba(255,255,255,0.08)',
        backgroundColor: hover ? withAlpha(c.primary, 0.08) : 'rgba(255,255,255,0.015)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <img
          src={BRAND_LOCKUP_COMPACT(brand.slug)}
          alt={`Klyrix${brand.label}`}
          className="h-[34px] w-auto"
          draggable={false}
        />
        <span
          className="text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-[1px] font-mono shrink-0"
          style={{ color: c.light, background: withAlpha(c.primary, 0.12) }}
        >
          {currentLabel}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground m-0 leading-snug">{brand.tagline}</p>
    </div>
  )
}
