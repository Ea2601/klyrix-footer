'use client'

/**
 * KlyrixFooter v2 — framework-agnostic, theme-aware footer component.
 *
 * Drop-in for ANY React app (Next.js App Router or Pages Router, Vite, CRA,
 * Astro, Remix, …). Zero peer dependencies beyond React. No Tailwind required.
 * No i18n hook required. No CSS framework varsayımı.
 *
 * Required:
 *  - public/brand/{hr,platform,ledger,support}/horizontal-{light,dark}.svg
 *  - public/brand/{hr,platform,ledger,support}/horizontal-compact-{light,dark}.svg
 *  - mentoforce-reveal.css (yalnızca Mentoforce wordmark hover animasyonu için;
 *    yoksa wordmark statik render olur — graceful degrade)
 *
 * Props:
 *  - currentApp:       'hr' | 'platform' | 'ledger' | 'support'  (default 'hr')
 *  - theme:            'dark' | 'light'                         (default 'dark')
 *  - status:           'operational' | 'degraded' | 'down'      (default 'operational')
 *  - healthUrl:        string — set edilirse 60sn'de bir poll'lar; yoksa polling yok
 *  - brandAssetsPath:  string                                   (default '/brand')
 *  - socials:          { x, linkedin, github, telegram }        (default Klyrix canonical)
 *  - labels:           bkz. DEFAULT_LABELS — appe özel metinler için override
 *  - className/style:  root <footer> element passthrough
 */

import { useEffect, useRef, useState } from 'react'
import { BRANDS, BRAND_ORDER, SOCIAL_LINKS, MENTOFORCE } from './brands'

const DEGRADED_DB_MS = 1500

/* ─── Tema paletleri ─────────────────────────────────────────────────────
 * Her şey internal — hedef projenin Tailwind/shadcn/MUI/styled-components
 * konfigürasyonuna bağlı değil. `background: transparent` ile hedef sayfanın
 * arka planı gözükür; footer içeriği kontrast koruyacak şekilde renklenir.
 */
const THEMES = {
  dark: {
    fg: '#ffffff',
    fgSoft: 'rgba(255,255,255,0.85)',
    fgMuted: 'rgba(255,255,255,0.55)',
    fgDim: 'rgba(255,255,255,0.38)',
    fgFaint: 'rgba(255,255,255,0.25)',
    border: 'rgba(255,255,255,0.08)',
    borderSoft: 'rgba(255,255,255,0.04)',
    cardIdleBg: 'rgba(255,255,255,0.015)',
    cardIdleBorder: 'rgba(255,255,255,0.08)',
    socialBg: 'rgba(255,255,255,0.02)',
    socialBgHover: 'rgba(255,255,255,0.05)',
    socialFg: 'rgba(255,255,255,0.55)',
    socialFgHover: '#ffffff',
  },
  light: {
    fg: '#0a0a0a',
    fgSoft: 'rgba(10,10,10,0.85)',
    fgMuted: 'rgba(10,10,10,0.55)',
    fgDim: 'rgba(10,10,10,0.45)',
    fgFaint: 'rgba(10,10,10,0.30)',
    border: 'rgba(10,10,10,0.10)',
    borderSoft: 'rgba(10,10,10,0.06)',
    cardIdleBg: 'rgba(10,10,10,0.02)',
    cardIdleBorder: 'rgba(10,10,10,0.10)',
    socialBg: 'rgba(10,10,10,0.03)',
    socialBgHover: 'rgba(10,10,10,0.06)',
    socialFg: 'rgba(10,10,10,0.55)',
    socialFgHover: '#0a0a0a',
  },
}

/* ─── Built-in default labels (English) ──────────────────────────────────
 * `labels` prop verilmezse bunlar kullanılır. Hedef projenin i18n'i varsa
 * `labels={{...}}` ile her şey override edilebilir.
 */
const DEFAULT_LABELS = {
  suite: {
    title: 'THE KLYRIX SUITE',
    subtitle: 'Four products. One operating system for your business.',
  },
  current: 'CURRENT',
  status: {
    operational: 'All systems operational',
    degraded: 'Degraded performance',
    down: 'Service disruption',
  },
  columns: [
    {
      title: 'PRODUCT',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
      ],
    },
    {
      title: 'KLYRIX FAMILY',
      links: [
        { brand: 'hr',       label: 'Klyrix HR',       href: 'https://klyrix-hr.com' },
        { brand: 'platform', label: 'Klyrix Platform', href: 'https://klyrix.com' },
        { brand: 'ledger',   label: 'Klyrix Ledger',   href: 'https://klyrix-ledger.com' },
        { brand: 'support',  label: 'Klyrix Support',  href: 'https://klyrix-support.com' },
      ],
    },
    {
      title: 'LEGAL',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Security', href: '/security' },
      ],
    },
  ],
}

/* ─── Inline social icon SVG'leri — zero peer dependency ─────────────────
 * 24x24 viewBox, tek path. Brand icon path'leri.
 */
const SOCIAL_ICONS = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  telegram: 'M22.46 5.49L19.49 19.5c-.22 1.07-.86 1.34-1.74.84l-4.81-3.55-2.32 2.24c-.26.26-.48.48-.97.48l.34-4.85L19.06 6.84c.38-.34-.08-.53-.59-.19L7.34 13.69 2.55 12.2c-1.04-.33-1.06-1.04.22-1.54L21.12 4.41c.87-.32 1.63.21 1.34 1.08z',
}

/* ─── Yardımcılar ────────────────────────────────────────────────────────*/
function withAlpha(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Lockup variant selector. Theme'e göre doğru SVG path'i döner.
 *   dark theme  → `*-light.svg` (beyaz wordmark, koyu zemin için)
 *   light theme → `*-dark.svg`  (koyu wordmark, açık zemin için)
 */
function lockup(slug, theme, basePath, compact = false) {
  const variant = theme === 'light' ? 'dark' : 'light'
  const suffix = compact ? `horizontal-compact-${variant}` : `horizontal-${variant}`
  return `${basePath}/${slug}/${suffix}.svg`
}

/* ─── Ana component ──────────────────────────────────────────────────────*/
export function KlyrixFooter({
  currentApp = 'hr',
  theme = 'dark',
  status: statusProp,
  healthUrl,
  brandAssetsPath = '/brand',
  socials = SOCIAL_LINKS,
  labels = DEFAULT_LABELS,
  className = '',
  style: styleProp,
}) {
  const palette = THEMES[theme] ?? THEMES.dark
  const brand = BRANDS[currentApp]
  const c = brand.colors

  // Status: prop > healthUrl polling > 'operational' fallback
  const [liveStatus, setLiveStatus] = useState(statusProp ?? 'operational')
  useEffect(() => {
    if (statusProp || !healthUrl) return
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
  const statusLabel = labels.status?.[status] ?? DEFAULT_LABELS.status[status]
  const sections = labels.columns ?? DEFAULT_LABELS.columns

  const statusColors = {
    operational: c.primary,
    degraded: '#FBBF24',
    down: '#EF4444',
  }
  const statusColor = statusColors[status]

  return (
    <footer
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
        color: palette.fg,
        borderTop: `1px solid ${palette.border}`,
        fontFamily: 'inherit',
        ...styleProp,
      }}
    >
      {/* Atmosfer glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 80% 50% at 20% 0%, ${withAlpha(c.primary, 0.18)} 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, ${withAlpha(c.primary, 0.10)} 0%, transparent 50%)`,
        }}
      />
      {/* Üst aksent çizgisi */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1, pointerEvents: 'none',
          background: `linear-gradient(90deg, transparent 0%, ${withAlpha(c.primary, 0.6)} 50%, transparent 100%)`,
        }}
      />

      {/* Body */}
      <div
        style={{
          position: 'relative',
          maxWidth: 1152,
          margin: '0 auto',
          padding: '56px 24px 36px',
        }}
      >
        {/* Top grid: brand + 3 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.6fr) repeat(3, minmax(0, 1fr))',
            gap: 48,
            marginBottom: 44,
            paddingBottom: 44,
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          {/* Brand block */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <img
                src={lockup(brand.slug, theme, brandAssetsPath)}
                alt={`Klyrix${brand.label}`}
                style={{ height: 52, width: 'auto', display: 'block' }}
                draggable={false}
              />
            </div>

            <p style={{
              fontSize: 14, lineHeight: 1.75, color: palette.fgMuted,
              margin: '0 0 20px', maxWidth: 320,
            }}>
              {brand.description}
            </p>

            <StatusPill brand={c} color={statusColor} label={statusLabel} />

            <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
              <SocialIcon palette={palette} href={socials.x ?? SOCIAL_LINKS.x} label="X" pathD={SOCIAL_ICONS.x} />
              <SocialIcon palette={palette} href={socials.linkedin ?? SOCIAL_LINKS.linkedin} label="LinkedIn" pathD={SOCIAL_ICONS.linkedin} />
              <SocialIcon palette={palette} href={socials.github ?? SOCIAL_LINKS.github} label="GitHub" pathD={SOCIAL_ICONS.github} />
              <SocialIcon palette={palette} href={socials.telegram ?? SOCIAL_LINKS.telegram} label="Telegram" pathD={SOCIAL_ICONS.telegram} />
            </div>
          </div>

          {/* 3 nav columns */}
          {sections.map((section, i) => (
            <NavColumn
              key={(section.title ?? '') + i}
              section={section}
              palette={palette}
              brand={c}
              theme={theme}
              brandAssetsPath={brandAssetsPath}
            />
          ))}
        </div>

        {/* Suite strip — 4 brand cards */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <p style={{
              fontSize: 11, fontWeight: 600, color: palette.fg,
              letterSpacing: 2, opacity: 0.95, margin: '0 0 4px',
            }}>
              {labels.suite?.title ?? DEFAULT_LABELS.suite.title}
            </p>
            <p style={{ fontSize: 12, color: palette.fgMuted, margin: 0 }}>
              {labels.suite?.subtitle ?? DEFAULT_LABELS.suite.subtitle}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 10,
          }}>
            {BRAND_ORDER.map((slug) => {
              const b = BRANDS[slug]
              const isActive = slug === currentApp
              return (
                <BrandCard
                  key={slug}
                  brand={b}
                  theme={theme}
                  palette={palette}
                  brandAssetsPath={brandAssetsPath}
                  active={isActive}
                  currentLabel={labels.current ?? DEFAULT_LABELS.current}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Mentoforce signature strip */}
      <div
        style={{
          position: 'relative',
          borderTop: `1px solid ${palette.border}`,
          background: `linear-gradient(180deg, transparent 0%, ${withAlpha(c.primary, 0.05)} 100%)`,
        }}
      >
        <div style={{
          maxWidth: 1152, margin: '0 auto',
          padding: '48px 24px 28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        }}>
          <MentoforceWordmark palette={palette} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20 }}>
            <span aria-hidden style={{
              height: 1, width: 64,
              background: `linear-gradient(90deg, transparent, ${palette.border})`,
            }} />
            <p style={{
              fontSize: 15, fontStyle: 'italic', color: palette.fgSoft,
              margin: 0, letterSpacing: 0.5,
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}>
              {MENTOFORCE.motto}
            </p>
            <span aria-hidden style={{
              height: 1, width: 64,
              background: `linear-gradient(90deg, ${palette.border}, transparent)`,
            }} />
          </div>

          <p style={{
            fontSize: 10, fontFamily: 'ui-monospace, Menlo, monospace',
            letterSpacing: 2.5, color: palette.fgMuted, margin: 0,
          }}>
            {MENTOFORCE.location}
          </p>

          <div style={{
            marginTop: 8, paddingTop: 20,
            borderTop: `1px solid ${palette.borderSoft}`, width: '100%',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            alignItems: 'center', gap: 12,
          }}>
            <span style={{
              fontSize: 10, fontFamily: 'ui-monospace, Menlo, monospace',
              letterSpacing: 0.5, color: palette.fgDim,
            }}>
              {MENTOFORCE.copyright}
            </span>
            <span style={{ fontSize: 10, color: palette.fgFaint }}>·</span>
            <span style={{
              fontSize: 10, fontFamily: 'ui-monospace, Menlo, monospace',
              letterSpacing: 0.5, color: palette.fgDim,
            }}>
              {MENTOFORCE.trn}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Status pill ────────────────────────────────────────────────────────*/
function StatusPill({ brand, color, label }) {
  return (
    <>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '8px 14px',
        background: withAlpha(brand.primary, 0.08),
        border: `1px solid ${withAlpha(brand.primary, 0.25)}`,
        borderRadius: 999,
      }}>
        <span style={{ position: 'relative', display: 'inline-flex', width: 6, height: 6 }}>
          <span style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            opacity: 0.6, background: color,
            animation: 'kf-pulse 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
          }} />
          <span style={{
            position: 'relative', width: 6, height: 6, borderRadius: '50%', background: color,
          }} />
        </span>
        <span style={{
          fontSize: 11, fontWeight: 500, letterSpacing: 0.5,
          color: brand.light,
        }}>
          {label}
        </span>
      </div>
      <style>{`@keyframes kf-pulse { 75%, 100% { transform: scale(2); opacity: 0; } }`}</style>
    </>
  )
}

/* ─── Social icon (inline SVG) ───────────────────────────────────────────*/
function SocialIcon({ palette, href, label, pathD }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={href} aria-label={label}
      target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 32, height: 32, borderRadius: 8,
        border: `1px solid ${palette.border}`,
        background: hover ? palette.socialBgHover : palette.socialBg,
        color: hover ? palette.socialFgHover : palette.socialFg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', transition: 'all 0.2s ease',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={pathD} />
      </svg>
    </a>
  )
}

/* ─── Nav column ─────────────────────────────────────────────────────────*/
function NavColumn({ section, palette, brand, theme, brandAssetsPath }) {
  return (
    <div>
      <p style={{
        fontSize: 11, fontWeight: 600, color: palette.fg,
        letterSpacing: 2, opacity: 0.95, margin: '0 0 16px',
      }}>
        {section.title}
      </p>
      <ul style={{
        listStyle: 'none', padding: 0, margin: 0,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {section.links.map((link, i) => (
          <li key={(link.label ?? link.brand) + i}>
            {link.brand ? (
              <BrandLockupLink link={link} theme={theme} brandAssetsPath={brandAssetsPath} />
            ) : (
              <TextLink link={link} palette={palette} brand={brand} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function BrandLockupLink({ link, theme, brandAssetsPath }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={link.href} aria-label={link.label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center',
        textDecoration: 'none',
        opacity: hover ? 1 : 0.7,
        transition: 'opacity 0.2s ease',
      }}
    >
      <img
        src={lockup(link.brand, theme, brandAssetsPath, true)}
        alt={link.label}
        style={{ height: 22, width: 'auto', display: 'block' }}
        draggable={false}
      />
    </a>
  )
}

function TextLink({ link, palette, brand }) {
  const [hover, setHover] = useState(false)
  return (
    <a
      href={link.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: 13, textDecoration: 'none',
        color: hover ? palette.fg : palette.fgMuted,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'color 0.2s ease',
      }}
    >
      {link.label}
      {link.badge && (
        <span style={{
          fontSize: 9, fontWeight: 600, letterSpacing: 0.5,
          padding: '2px 6px', borderRadius: 4,
          color: link.badge.tone === 'accent' ? brand.light : palette.fgMuted,
          background: link.badge.tone === 'accent'
            ? withAlpha(brand.primary, 0.10)
            : palette.cardIdleBg,
        }}>
          {link.badge.text}
        </span>
      )}
    </a>
  )
}

/* ─── Brand card — pasif + active aynı yapı, sadece CURRENT badge fark ───*/
function BrandCard({ brand, theme, palette, brandAssetsPath, active, currentLabel }) {
  const [hover, setHover] = useState(false)
  const c = brand.colors

  const Wrapper = active ? 'div' : 'a'
  const wrapperProps = active ? {} : { href: brand.url }

  return (
    <Wrapper
      {...wrapperProps}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', position: 'relative', overflow: 'hidden',
        borderRadius: 14, padding: 18,
        border: `1px solid ${hover ? withAlpha(c.primary, 0.45) : palette.cardIdleBorder}`,
        background: hover ? withAlpha(c.primary, 0.08) : palette.cardIdleBg,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'background-color 250ms ease, border-color 250ms ease, transform 250ms ease',
        textDecoration: 'none',
        cursor: active ? 'default' : 'pointer',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 12, marginBottom: 12,
      }}>
        <img
          src={lockup(brand.slug, theme, brandAssetsPath, true)}
          alt={`Klyrix${brand.label}`}
          style={{ height: 34, width: 'auto', display: 'block' }}
          draggable={false}
        />
        {active && (
          <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: 1,
            padding: '3px 8px', borderRadius: 999,
            fontFamily: 'ui-monospace, Menlo, monospace',
            color: c.light, background: withAlpha(c.primary, 0.12),
            flexShrink: 0,
          }}>
            {currentLabel}
          </span>
        )}
      </div>
      <p style={{
        fontSize: 11, color: palette.fgMuted, margin: 0, lineHeight: 1.4,
      }}>
        {brand.tagline}
      </p>
    </Wrapper>
  )
}

/* ─── Mentoforce wordmark — per-letter reveal on hover ───────────────────
 * Animasyon CSS'i mentoforce-reveal.css'te yaşar. Bu dosya hedef projenin
 * global stylesheet'ine append edilmeli. Eksikse wordmark statik gösterilir
 * (graceful degrade).
 */
function MentoforceWordmark({ palette }) {
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
      target="_blank" rel="noopener noreferrer"
      onMouseEnter={replay}
      style={{ textDecoration: 'none', userSelect: 'none' }}
      aria-label={MENTOFORCE.wordmark}
    >
      <h3
        ref={ref}
        className="kf-mentoforce"
        style={{
          margin: 0, fontSize: 32, fontWeight: 200,
          color: palette.fg, textTransform: 'uppercase',
          letterSpacing: 12, lineHeight: 1,
        }}
      >
        {MENTOFORCE.wordmark.split('').map((ch, i) => (
          <span key={i} className="kf-ch" style={{ display: 'inline-block' }}>{ch}</span>
        ))}
      </h3>
    </a>
  )
}
