import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Lightweight uptime health check.
 *
 * GET /api/health — public, no auth (GET-only, non-mutating so CSRF-exempt).
 * Performs a fast DB ping (HEAD count on `tenants`) with a 3s timeout and
 * reports per-check latency. Returns 503 if the DB ping fails or times out
 * so uptime monitors can flag the deployment.
 *
 * Response shape:
 *   { ok: bool, ts: <iso>, checks: { db: { ok, ms, error? } }, version }
 *
 * Vercel commit SHA is exposed (short) so monitors can correlate incidents
 * with deploys. Cache-Control: no-store to prevent any CDN caching.
 */
const TIMEOUT_MS = 3000

async function checkDb() {
  const start = Date.now()
  try {
    const supabase = createServerClient()
    const ping = supabase.from('tenants').select('id', { count: 'exact', head: true }).limit(1)
    await Promise.race([
      ping,
      new Promise((_, reject) => setTimeout(() => reject(new Error('db_timeout')), TIMEOUT_MS)),
    ])
    return { ok: true, ms: Date.now() - start }
  } catch (e) {
    return { ok: false, ms: Date.now() - start, error: e?.message || 'unknown' }
  }
}

export async function GET() {
  const db = await checkDb()
  const allOk = db.ok
  return NextResponse.json(
    {
      ok: allOk,
      ts: new Date().toISOString(),
      checks: { db },
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
    },
    { status: allOk ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  )
}
