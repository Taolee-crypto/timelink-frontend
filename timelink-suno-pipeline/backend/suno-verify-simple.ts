/**
 * TimeLink — Suno 인증 저장 API (API 키 불필요)
 * OCR은 프론트엔드(Tesseract.js)에서 처리
 * 백엔드는 결과 저장 + 상태 조회만 담당
 *
 * src/routes/suno-verify.ts 교체용
 */

import { Hono } from 'hono'

type Env = {
  DB:         D1Database
  JWT_SECRET: string
}

const sunoVerify = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

sunoVerify.use('*', async (c, next) => {
  const auth = c.req.header('Authorization') ?? ''
  if (!auth.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const { verifyJWT } = await import('../auth')
    const payload = await verifyJWT(auth.slice(7), c.env.JWT_SECRET)
    c.set('userId', payload.sub as string)
    await next()
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

// ──────────────────────────────────────────────────────────
// POST /v1/suno/save-verification
// 프론트엔드 OCR 결과를 D1에 저장
// ──────────────────────────────────────────────────────────
sunoVerify.post('/save-verification', async (c) => {
  const userId = c.get('userId')
  const { plan, endDate, credits } = await c.req.json<{
    plan: string
    endDate: string
    credits: string
  }>()

  // D1 저장
  await c.env.DB.prepare(`
    INSERT INTO suno_verifications (user_id, plan, end_date, credits, verified_at, expires_at)
    VALUES (?, ?, ?, ?, datetime('now'), ?)
    ON CONFLICT(user_id) DO UPDATE SET
      plan = excluded.plan,
      end_date = excluded.end_date,
      credits = excluded.credits,
      verified_at = excluded.verified_at,
      expires_at = excluded.expires_at
  `).bind(userId, plan, endDate, credits, endDate).run()

  // 배지 부여
  await c.env.DB.prepare(`
    INSERT OR IGNORE INTO user_badges (user_id, badge, granted_at)
    VALUES (?, 'suno_verified', datetime('now'))
  `).bind(userId).run()

  // TL 보상 (+100)
  await c.env.DB.prepare(`
    UPDATE users SET tl_balance = tl_balance + 100 WHERE id = ?
  `).bind(userId).run()

  return c.json({ ok: true })
})

// ──────────────────────────────────────────────────────────
// GET /v1/suno/verification-status
// ──────────────────────────────────────────────────────────
sunoVerify.get('/verification-status', async (c) => {
  const userId = c.get('userId')

  const row = await c.env.DB.prepare(`
    SELECT plan, end_date, credits, verified_at, expires_at
    FROM suno_verifications WHERE user_id = ?
  `).bind(userId).first<{
    plan: string; end_date: string; credits: string
    verified_at: string; expires_at: string
  }>()

  if (!row) return c.json({ verified: false })

  const expired = row.expires_at && new Date(row.expires_at) <= new Date()
  return c.json({
    verified:   !expired,
    plan:       row.plan,
    endDate:    row.end_date,
    credits:    row.credits,
    verifiedAt: row.verified_at,
  })
})

export default sunoVerify
