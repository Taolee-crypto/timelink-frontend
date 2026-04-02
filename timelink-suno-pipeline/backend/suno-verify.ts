/**
 * TimeLink — Suno 플랜 자동 인증 API
 * src/routes/suno-verify.ts
 *
 * 메인 라우터에 추가:
 *   import sunoVerify from './routes/suno-verify'
 *   app.route('/v1/suno', sunoVerify)
 */

import { Hono } from 'hono'

type Env = {
  DB:             D1Database
  AUDIO_BUCKET:   R2Bucket
  JWT_SECRET:     string
  ANTHROPIC_API_KEY: string  // Claude Vision 호출용
}

const ALLOWED_PLANS = ['pro plan', 'premier plan']

const sunoVerify = new Hono<{ Bindings: Env; Variables: { userId: string } }>()

// JWT 미들웨어
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
// POST /v1/suno/verify-plan
// 스크린샷 업로드 → Claude Vision으로 플랜 자동 검증
// ──────────────────────────────────────────────────────────
sunoVerify.post('/verify-plan', async (c) => {
  const userId = c.get('userId')
  const form   = await c.req.formData()
  const file   = form.get('screenshot') as File | null

  if (!file) return c.json({ ok: false, reason: '이미지 파일이 없습니다.' }, 400)
  if (!file.type.startsWith('image/')) return c.json({ ok: false, reason: '이미지 파일만 업로드 가능합니다.' }, 400)
  if (file.size > 10 * 1024 * 1024) return c.json({ ok: false, reason: '파일 크기는 10MB 이하로 해주세요.' }, 400)

  // 이미지 → base64
  const arrayBuffer = await file.arrayBuffer()
  const base64      = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
  const mediaType   = file.type as 'image/png' | 'image/jpeg' | 'image/webp'

  // ── Claude Vision 호출 ────────────────────────────────
  let visionResult: {
    plan: string
    endDate: string
    credits: string
    isValid: boolean
    reason: string
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': c.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: `이것은 Suno AI 계정 화면 스크린샷입니다.
다음 정보를 JSON으로만 추출해 주세요. 다른 텍스트는 절대 포함하지 마세요.

{
  "plan": "Current Plan 값 (예: Pro Plan, Premier Plan, Free 등)",
  "endDate": "Plan End Date 값 (예: Mar 11, 2026) — 없으면 null",
  "credits": "Credits Remaining 숫자 — 없으면 null",
  "isSunoPage": true/false (Suno 계정 화면이 맞는지)
}

Suno 화면이 아니거나 정보를 읽을 수 없으면 isSunoPage: false로 반환하세요.`,
            },
          ],
        }],
      }),
    })

    const claudeData = await response.json() as { content: Array<{ type: string; text: string }> }
    const text = claudeData.content?.find(b => b.type === 'text')?.text ?? '{}'

    // JSON 파싱
    const parsed = JSON.parse(text.trim()) as {
      plan: string
      endDate: string | null
      credits: string | null
      isSunoPage: boolean
    }

    if (!parsed.isSunoPage) {
      visionResult = {
        plan: '', endDate: '', credits: '',
        isValid: false,
        reason: 'Suno 계정 화면이 아닙니다. Suno 플랜 관리 화면을 캡처해 주세요.',
      }
    } else {
      const planLower = (parsed.plan ?? '').toLowerCase()
      const isAllowed = ALLOWED_PLANS.some(p => planLower.includes(p))
      const isNotExpired = parsed.endDate
        ? new Date(parsed.endDate) > new Date()
        : false

      if (!isAllowed) {
        visionResult = {
          plan: parsed.plan, endDate: parsed.endDate ?? '', credits: parsed.credits ?? '',
          isValid: false,
          reason: `현재 플랜(${parsed.plan})으로는 업로드할 수 없습니다. Pro 또는 Premier 플랜이 필요합니다.`,
        }
      } else if (!isNotExpired) {
        visionResult = {
          plan: parsed.plan, endDate: parsed.endDate ?? '', credits: parsed.credits ?? '',
          isValid: false,
          reason: `플랜이 만료되었습니다 (${parsed.endDate}). Suno 플랜을 갱신해 주세요.`,
        }
      } else {
        visionResult = {
          plan: parsed.plan, endDate: parsed.endDate ?? '', credits: parsed.credits ?? '',
          isValid: true,
          reason: '인증 완료',
        }
      }
    }
  } catch (e) {
    return c.json({ ok: false, reason: 'AI 분석 오류: ' + String(e) }, 500)
  }

  // ── D1에 인증 결과 저장 ───────────────────────────────
  if (visionResult.isValid) {
    await c.env.DB.prepare(`
      INSERT INTO suno_verifications
        (user_id, plan, end_date, credits, verified_at, expires_at)
      VALUES (?, ?, ?, ?, datetime('now'), ?)
      ON CONFLICT(user_id) DO UPDATE SET
        plan = excluded.plan,
        end_date = excluded.end_date,
        credits = excluded.credits,
        verified_at = excluded.verified_at,
        expires_at = excluded.expires_at
    `).bind(
      userId,
      visionResult.plan,
      visionResult.endDate,
      visionResult.credits,
      visionResult.endDate, // Plan End Date를 만료 기준으로
    ).run()

    // 크리에이터 배지 부여
    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO user_badges (user_id, badge, granted_at)
      VALUES (?, 'suno_verified', datetime('now'))
    `).bind(userId).run()
  }

  return c.json({
    ok:      visionResult.isValid,
    plan:    visionResult.plan,
    endDate: visionResult.endDate,
    credits: visionResult.credits,
    reason:  visionResult.reason,
  })
})

// ──────────────────────────────────────────────────────────
// GET /v1/suno/verification-status
// 현재 사용자 인증 상태 확인
// ──────────────────────────────────────────────────────────
sunoVerify.get('/verification-status', async (c) => {
  const userId = c.get('userId')

  const row = await c.env.DB.prepare(`
    SELECT plan, end_date, credits, verified_at, expires_at
    FROM suno_verifications
    WHERE user_id = ?
  `).bind(userId).first<{
    plan: string
    end_date: string
    credits: string
    verified_at: string
    expires_at: string
  }>()

  if (!row) return c.json({ verified: false })

  const isExpired = new Date(row.expires_at) <= new Date()

  return c.json({
    verified:   !isExpired,
    plan:       row.plan,
    endDate:    row.end_date,
    credits:    row.credits,
    verifiedAt: row.verified_at,
  })
})

export default sunoVerify
