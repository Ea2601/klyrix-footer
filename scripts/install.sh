#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# KlyrixFooter — automatic file installer
#
# Usage (from target repo root):
#   bash <(curl -sSL https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/scripts/install.sh)
#
# What it does (idempotent, safe to re-run):
#   1. Creates folders: src/components/klyrix-footer, public/brand/{4 dirs},
#      src/app/api/health
#   2. Downloads component files (3), brand assets (36 SVG), health endpoint
#   3. Appends Mentoforce reveal CSS to src/app/globals.css (if not already)
#   4. Prints next-steps checklist (manual: i18n merge, JSX integration)
#
# What it does NOT do (you do these manually):
#   - JSON locale merge (don't want to clobber your existing tr.json/en.json)
#   - JSX integration (where in your layout the <KlyrixFooter /> goes)
# NOT: İkon bağımlılığı YOKTUR — sosyal ikonlar bileşen içinde inline SVG
# (lucide-react vb. kurmayın; lucide 1.x marka ikonlarını zaten kaldırdı).
# ═══════════════════════════════════════════════════════════════════════

set -euo pipefail

BASE="https://raw.githubusercontent.com/Ea2601/klyrix-footer/main"
TARGET="${TARGET_DIR:-$(pwd)}"

echo "▶ KlyrixFooter installer"
echo "  target: $TARGET"
echo

# ─── 1. Folders ──────────────────────────────────────────────────────────
mkdir -p \
  "$TARGET/src/components/klyrix-footer" \
  "$TARGET/public/brand/hr" \
  "$TARGET/public/brand/platform" \
  "$TARGET/public/brand/ledger" \
  "$TARGET/public/brand/support" \
  "$TARGET/src/app/api/health"

# ─── 2. Component files ──────────────────────────────────────────────────
echo "▶ Component dosyaları indiriliyor (3)…"
for f in KlyrixFooter.jsx brands.js index.js; do
  curl -sSL "$BASE/src/klyrix-footer/$f" -o "$TARGET/src/components/klyrix-footer/$f"
  echo "  ✓ src/components/klyrix-footer/$f"
done

# ─── 3. Brand assets (4 brand × 9 SVG = 36 files) ────────────────────────
echo "▶ Brand assets indiriliyor (36 SVG)…"
ASSETS=(
  horizontal-light.svg horizontal-dark.svg
  horizontal-compact-light.svg horizontal-compact-dark.svg
  vertical-light.svg vertical-dark.svg
  wordmark-light.svg wordmark-dark.svg
  symbol.svg
)
for slug in hr platform ledger support; do
  for asset in "${ASSETS[@]}"; do
    curl -sSL "$BASE/public/brand/$slug/$asset" -o "$TARGET/public/brand/$slug/$asset"
  done
  echo "  ✓ public/brand/$slug/ (9 SVG)"
done

# ─── 4. Health endpoint (only if missing — won't overwrite yours) ────────
HEALTH="$TARGET/src/app/api/health/route.js"
if [[ -f "$HEALTH" ]]; then
  echo "▶ /api/health zaten var — atlanıyor ($HEALTH)"
else
  curl -sSL "$BASE/examples/api-health.route.js" -o "$HEALTH"
  echo "  ✓ src/app/api/health/route.js"
fi

# ─── 5. globals.css — append Mentoforce reveal CSS (idempotent) ──────────
GLOBALS="$TARGET/src/app/globals.css"
SENTINEL="KlyrixFooter — Mentoforce wordmark per-letter reveal"
if [[ -f "$GLOBALS" ]] && grep -q "$SENTINEL" "$GLOBALS"; then
  echo "▶ globals.css'te Mentoforce reveal CSS zaten mevcut — atlanıyor"
elif [[ -f "$GLOBALS" ]]; then
  echo "" >> "$GLOBALS"
  curl -sSL "$BASE/styles/mentoforce-reveal.css" >> "$GLOBALS"
  echo "  ✓ src/app/globals.css'e Mentoforce reveal animasyonu eklendi"
else
  echo "⚠ src/app/globals.css bulunamadı — Mentoforce reveal CSS ATLANDI"
  echo "  Manuel: $BASE/styles/mentoforce-reveal.css içeriğini global stylesheet'inize ekleyin"
fi

# ─── Next steps ──────────────────────────────────────────────────────────
cat <<'EOF'

═══════════════════════════════════════════════════════════════════════
✅ Otomatik kurulum bitti. Geri kalan manuel adımlar:

[1] İkon bağımlılığı YOK — sosyal ikonlar bileşende inline SVG olarak gömülü.
    (lucide-react KURMAYIN; lucide 1.x marka ikonlarını kaldırdı, gerek de yok.)

[2] i18n key'lerini merge et — locales/footer-tr.json ve footer-en.json:
    curl -sSL https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/locales/footer-tr.json
    curl -sSL https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/locales/footer-en.json
    İçerideki "marketing" namespace'ini kendi tr.json/en.json'ınıza merge edin.
    (Kendi i18n hook'unuz yoksa: KlyrixFooter.jsx'te useLocale stub yapın — README.md'ye bakın.)

[3] Layout/landing sayfanıza ekleyin:
    import { KlyrixFooter } from '@/components/klyrix-footer'
    <KlyrixFooter currentApp="platform" />   // veya "hr"/"ledger"/"support"

[4] Detaylı entegrasyon örneği:
    curl -sSL https://raw.githubusercontent.com/Ea2601/klyrix-footer/main/examples/integration.jsx
═══════════════════════════════════════════════════════════════════════
EOF
